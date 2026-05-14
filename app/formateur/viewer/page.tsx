'use client'
import { useState, useRef } from 'react'

type FileEntry = { name: string; path: string; url: string; type: string }

export default function ViewerPage() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [files, setFiles] = useState<FileEntry[]>([])
  const [launchUrl, setLaunchUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [showFiles, setShowFiles] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const processFile = async (file: File) => {
    setLoading(true); setError(''); setFiles([]); setLaunchUrl(null); setFileName(file.name)
    setProgress(5); setProgressMsg('Chargement du fichier...')

    const ext = file.name.split('.').pop()?.toLowerCase()

    // Direct display: PDF, HTML, video
    if (ext === 'pdf') {
      const url = URL.createObjectURL(file)
      setLaunchUrl(url); setProgress(100); setProgressMsg('PDF prêt')
      setLoading(false); return
    }
    if (['mp4','mov','webm','avi'].includes(ext||'')) {
      const url = URL.createObjectURL(file)
      setLaunchUrl(`__video__${url}`); setProgress(100); setProgressMsg('Vidéo prête')
      setLoading(false); return
    }
    if (['html','htm'].includes(ext||'')) {
      const text = await file.text()
      const blob = new Blob([text], { type: 'text/html' })
      setLaunchUrl(URL.createObjectURL(blob))
      setProgress(100); setProgressMsg('HTML prêt')
      setLoading(false); return
    }

    // ZIP/SCORM/H5P extraction
    if (!['zip','h5p'].includes(ext||'')) {
      setError('Format non supporté. Utilisez .zip (SCORM), .h5p, .pdf, .html, .mp4')
      setLoading(false); return
    }

    try {
      setProgress(15); setProgressMsg('Extraction du package...')

      // Load JSZip dynamically
      const JSZip = (await import('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js' as any).catch(() => null))?.default
        || (window as any).JSZip

      if (!JSZip) {
        // Fallback: load via script tag
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Impossible de charger JSZip'))
          document.head.appendChild(s)
        })
      }

      const JSZipLib = (window as any).JSZip
      const zip = await JSZipLib.loadAsync(file)

      setProgress(40); setProgressMsg('Analyse du contenu...')

      // Extract all files and create blob URLs
      const extracted: FileEntry[] = []
      const fileMap: Record<string, string> = {}
      const fileNames = Object.keys(zip.files)

      let done = 0
      for (const name of fileNames) {
        const entry = zip.files[name]
        if (entry.dir) continue

        const ext2 = name.split('.').pop()?.toLowerCase() || ''
        const mimeTypes: Record<string, string> = {
          html: 'text/html', htm: 'text/html', css: 'text/css',
          js: 'application/javascript', json: 'application/json',
          png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
          gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
          mp4: 'video/mp4', mp3: 'audio/mp3', ogg: 'audio/ogg',
          woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf',
          xml: 'application/xml', swf: 'application/x-shockwave-flash',
        }
        const mime = mimeTypes[ext2] || 'application/octet-stream'
        const isText = ['html','htm','css','js','json','xml','txt','svg'].includes(ext2)

        let blob: Blob
        if (isText) {
          const text = await entry.async('string')
          blob = new Blob([text], { type: mime })
        } else {
          const arr = await entry.async('arraybuffer')
          blob = new Blob([arr], { type: mime })
        }

        const url = URL.createObjectURL(blob)
        fileMap[name] = url
        extracted.push({ name: name.split('/').pop() || name, path: name, url, type: ext2 })

        done++
        setProgress(40 + Math.floor((done / fileNames.length) * 40))
      }

      setFiles(extracted)
      setProgress(80); setProgressMsg('Recherche du point de lancement...')

      // Find launch file: check imsmanifest.xml first
      let launchFile: string | null = null

      const manifestEntry = zip.files['imsmanifest.xml'] || zip.files[Object.keys(zip.files).find(n => n.endsWith('imsmanifest.xml')) || '']
      if (manifestEntry) {
        const manifestText = await manifestEntry.async('string')
        // Parse launch from manifest
        const launchMatch = manifestText.match(/(?:href|identifierref)="([^"]+\.html?)"/i)
          || manifestText.match(/<resource[^>]+href="([^"]+)"/)
        if (launchMatch) {
          const launchPath = launchMatch[1]
          // Find matching file
          const matchKey = Object.keys(fileMap).find(k => k.endsWith(launchPath) || k === launchPath || k.includes(launchPath))
          if (matchKey) launchFile = fileMap[matchKey]
        }
      }

      // Fallback: find index.html or first HTML file
      if (!launchFile) {
        const htmlFiles = extracted.filter(f => ['html','htm'].includes(f.type))
        const indexFile = htmlFiles.find(f => f.name === 'index.html' || f.name === 'index.htm' || f.name === 'story.html' || f.name === 'scormcontent.html')
        launchFile = indexFile?.url || htmlFiles[0]?.url || null
      }

      if (!launchFile) {
        setError('Aucun fichier de lancement trouvé dans le package. Vérifiez que c\'est bien un SCORM valide.')
        setLoading(false); return
      }

      // Rewrite HTML to fix relative paths
      setProgress(90); setProgressMsg('Reconstruction des liens...')
      const launchEntry = extracted.find(f => f.url === launchFile)
      if (launchEntry) {
        const htmlText = await fetch(launchFile).then(r => r.text())
        let rewritten = htmlText
        // Replace relative URLs with blob URLs
        for (const f of extracted) {
          const shortName = f.name
          const fullPath = f.path
          rewritten = rewritten
            .replace(new RegExp(`(src|href)="${shortName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`, 'g'), `$1="${f.url}"`)
            .replace(new RegExp(`(src|href)="${fullPath.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`, 'g'), `$1="${f.url}"`)
        }
        const newBlob = new Blob([rewritten], { type: 'text/html' })
        launchFile = URL.createObjectURL(newBlob)
      }

      setProgress(100); setProgressMsg('Prêt !')
      setLaunchUrl(launchFile)
    } catch (e: any) {
      setError(`Erreur d'extraction: ${e.message}`)
    }
    setLoading(false)
  }

  const isVideo = launchUrl?.startsWith('__video__')
  const videoUrl = isVideo ? launchUrl?.replace('__video__','') : null
  const isPDF = launchUrl && !isVideo && fileName.endsWith('.pdf')

  return (
    <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem', padding: '1rem 1.5rem', background: 'linear-gradient(135deg,rgba(123,92,245,0.12),rgba(224,64,160,0.06))', border: '1px solid rgba(123,92,245,0.25)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg,#F0EEFF,#A78BF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            👁 Visualiseur de cours
          </h1>
          <p style={{ color: '#8B7BAE', fontSize: '12px', marginTop: '2px' }}>SCORM · H5P · HTML · PDF · Vidéo — lecture directe dans le navigateur</p>
        </div>

        {/* Upload button */}
        <button onClick={() => inputRef.current?.click()} style={{ background: 'linear-gradient(135deg,#7B5CF5,#E040A0)', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
          {launchUrl ? '📁 Ouvrir un autre fichier' : '📁 Ouvrir un fichier'}
        </button>
        <input ref={inputRef} type="file" style={{ display: 'none' }} accept=".zip,.h5p,.pdf,.html,.htm,.mp4,.mov,.webm" onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]) }} />

        {launchUrl && files.length > 0 && (
          <button onClick={() => setShowFiles(!showFiles)} style={{ background: 'rgba(123,92,245,0.1)', border: '1px solid rgba(123,92,245,0.2)', borderRadius: '10px', padding: '10px 14px', color: '#A78BF8', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
            {showFiles ? 'Masquer' : `📦 ${files.length} fichiers`}
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ marginBottom: '1rem', background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '1px solid rgba(123,92,245,0.2)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: '#A78BF8', fontWeight: '600' }}>{progressMsg}</span>
            <span style={{ color: '#A78BF8', fontWeight: '700' }}>{progress}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(123,92,245,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7B5CF5,#E040A0)', borderRadius: '3px', transition: 'width .3s' }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginBottom: '1rem', background: 'rgba(240,90,90,0.08)', border: '1px solid rgba(240,90,90,0.25)', borderRadius: '14px', padding: '1rem', fontSize: '13px', color: '#F08080' }}>
          ⚠️ {error}
        </div>
      )}

      {/* File list */}
      {showFiles && files.length > 0 && (
        <div style={{ marginBottom: '1rem', background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '1px solid rgba(123,92,245,0.12)', borderRadius: '14px', padding: '1rem', maxHeight: '160px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', color: '#4A3D6A', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fichiers du package ({files.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {files.map(f => (
              <a key={f.path} href={f.url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(123,92,245,0.08)', border: '1px solid rgba(123,92,245,0.15)', color: '#8B7BAE', textDecoration: 'none' }}>
                {f.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Viewer */}
      {!loading && !launchUrl && !error && (
        <div onClick={() => inputRef.current?.click()} style={{ flex: 1, background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '2px dashed rgba(123,92,245,0.2)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,92,245,0.4)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,92,245,0.2)'}>
          <div style={{ fontSize: '64px', marginBottom: '1.5rem' }}>📦</div>
          <div style={{ fontWeight: '700', fontSize: '18px', color: '#F0EEFF', marginBottom: '8px' }}>Ouvrir un contenu e-learning</div>
          <div style={{ color: '#8B7BAE', fontSize: '13px', marginBottom: '1.5rem', textAlign: 'center' }}>
            Glissez ou cliquez pour charger votre fichier SCORM, H5P, HTML, PDF ou vidéo
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['📦 SCORM .zip','🎮 H5P .h5p','💻 HTML .html','📄 PDF .pdf','🎬 Vidéo .mp4'].map(f => (
              <span key={f} style={{ background: 'rgba(123,92,245,0.08)', border: '1px solid rgba(123,92,245,0.15)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: '#8B7BAE', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      )}

      {isVideo && videoUrl && (
        <div style={{ flex: 1, background: '#000', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video src={videoUrl} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px' }} />
        </div>
      )}

      {launchUrl && !isVideo && isPDF && (
        <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(123,92,245,0.15)' }}>
          <iframe src={launchUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Viewer" />
        </div>
      )}

      {launchUrl && !isVideo && !isPDF && (
        <div style={{ flex: 1, background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(123,92,245,0.15)', position: 'relative' }}>
          {/* Toolbar */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, display: 'flex', gap: '6px' }}>
            <button onClick={() => iframeRef.current?.contentWindow?.location.reload()} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>↺ Recharger</button>
            <a href={launchUrl} target="_blank" rel="noreferrer" style={{ background: 'rgba(123,92,245,0.8)', border: 'none', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '12px', fontWeight: '600', backdropFilter: 'blur(4px)' }}>⤢ Plein écran</a>
          </div>
          <iframe ref={iframeRef} src={launchUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="SCORM/Course Viewer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals" />
        </div>
      )}
    </div>
  )
}

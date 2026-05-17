'use client'
import { useState, useRef } from 'react'

export default function ViewerPage() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [msg, setMsg] = useState('')
  const [launchUrl, setLaunchUrl] = useState<string|null>(null)
  const [fileType, setFileType] = useState('')
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [fileCount, setFileCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const process = async (file: File) => {
    setLoading(true); setError(''); setLaunchUrl(null); setFileCount(0)
    setFileName(file.name)
    const ext = file.name.split('.').pop()?.toLowerCase() || ''

    // Direct types
    if (ext === 'pdf') {
      setFileType('pdf'); setLaunchUrl(URL.createObjectURL(file))
      setProgress(100); setLoading(false); return
    }
    if (['mp4','mov','webm','avi'].includes(ext)) {
      setFileType('video'); setLaunchUrl(URL.createObjectURL(file))
      setProgress(100); setLoading(false); return
    }
    if (['html','htm'].includes(ext)) {
      const txt = await file.text()
      setFileType('html'); setLaunchUrl(URL.createObjectURL(new Blob([txt],{type:'text/html'})))
      setProgress(100); setLoading(false); return
    }

    // ZIP / H5P / SCORM
    if (!['zip','h5p'].includes(ext)) {
      setError('Format non supporté. Utilisez .zip .h5p .pdf .html .mp4')
      setLoading(false); return
    }

    try {
      setProgress(10); setMsg('Chargement de JSZip...')
      const JSZip = (await import('jszip')).default

      setProgress(20); setMsg('Extraction du package...')
      const zip = await JSZip.loadAsync(file)

      const names = Object.keys(zip.files).filter(n => !zip.files[n].dir)
      setFileCount(names.length)
      setProgress(30); setMsg(`${names.length} fichiers trouvés...`)

      // Extract all to blob URLs
      const map: Record<string,string> = {}
      let done = 0
      for (const name of names) {
        const entry = zip.files[name]
        const ext2 = name.split('.').pop()?.toLowerCase() || ''
        const mimes: Record<string,string> = {
          html:'text/html', htm:'text/html', css:'text/css',
          js:'application/javascript', json:'application/json',
          png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg',
          gif:'image/gif', svg:'image/svg+xml', webp:'image/webp',
          mp4:'video/mp4', mp3:'audio/mpeg', ogg:'audio/ogg',
          woff:'font/woff', woff2:'font/woff2', ttf:'font/ttf',
          xml:'application/xml', txt:'text/plain',
        }
        const mime = mimes[ext2] || 'application/octet-stream'
        const isText = ['html','htm','css','js','json','xml','txt','svg'].includes(ext2)
        let blob: Blob
        if (isText) {
          blob = new Blob([await entry.async('string')], {type: mime})
        } else {
          blob = new Blob([await entry.async('arraybuffer')], {type: mime})
        }
        map[name] = URL.createObjectURL(blob)
        // Also map just filename
        const shortName = name.includes('/') ? name.split('/').pop()! : name
        if (!map[shortName]) map[shortName] = map[name]
        done++
        setProgress(30 + Math.floor((done/names.length)*50))
      }

      setMsg('Recherche du fichier de lancement...')
      let launchPath: string|null = null

      // Check imsmanifest.xml
      const manifestKey = names.find(n => n.endsWith('imsmanifest.xml'))
      if (manifestKey) {
        const xml = await zip.files[manifestKey].async('string')
        const m = xml.match(/<resource[^>]+href="([^"]+\.html?)"/i)
          || xml.match(/href="([^"]+\.html?)"/i)
          || xml.match(/identifier[^=]*="([^"]+\.html?)"/i)
        if (m) {
          const candidate = m[1].replace(/\\/g,'/')
          launchPath = names.find(n => n.endsWith(candidate) || n === candidate) || null
        }
      }

      // Fallback: find index/story/launch html
      if (!launchPath) {
        const htmlFiles = names.filter(n => /\.(html|htm)$/i.test(n))
        launchPath = htmlFiles.find(n => /index|story|launch|scorm|index_lms/i.test(n.split('/').pop()!))
          || htmlFiles[0] || null
      }

      if (!launchPath) {
        setError('Aucun fichier HTML de lancement trouvé. Le package est peut-être incomplet ou non standard.')
        setLoading(false); return
      }

      setProgress(85); setMsg('Reconstruction des liens relatifs...')

      // Rewrite HTML with blob URLs
      const rawHtml = await zip.files[launchPath].async('string')
      let html = rawHtml

      // Replace all relative references with blob URLs
      for (const [name, blobUrl] of Object.entries(map)) {
        const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const shortName = name.includes('/') ? name.split('/').pop()! : name
        const safeShort = shortName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        html = html
          .replace(new RegExp(`(src|href|data)=["']${safeName}["']`, 'gi'), `$1="${blobUrl}"`)
          .replace(new RegExp(`(src|href|data)=["']${safeShort}["']`, 'gi'), `$1="${blobUrl}"`)
          .replace(new RegExp(`url\\(['"]?${safeName}['"]?\\)`, 'gi'), `url("${blobUrl}")`)
          .replace(new RegExp(`url\\(['"]?${safeShort}['"]?\\)`, 'gi'), `url("${blobUrl}")`)
      }

      const finalBlob = new Blob([html], {type: 'text/html'})
      setFileType('scorm')
      setLaunchUrl(URL.createObjectURL(finalBlob))
      setProgress(100); setMsg('Prêt !')
    } catch (e: any) {
      setError(`Erreur d'extraction: ${e.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{height:'calc(100vh - 3rem)',display:'flex',flexDirection:'column'}}>
      {/* Header */}
      <div style={{marginBottom:'1rem',padding:'1rem 1.5rem',background:'linear-gradient(135deg,rgba(28,25,23,0.07),rgba(224,64,160,0.06))',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'16px',display:'flex',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:'200px'}}>
          <h1 style={{fontSize:'18px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            👁 Visualiseur e-learning
          </h1>
          <p style={{color:'#A8A29E',fontSize:'11px',marginTop:'2px'}}>SCORM · H5P · HTML · PDF · Vidéo — lecture directe dans le navigateur</p>
        </div>
        {launchUrl && fileName && (
          <div style={{fontSize:'12px',color:'#E8651A',background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'8px',padding:'5px 12px',maxWidth:'300px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
            📦 {fileName} {fileCount>0&&`· ${fileCount} fichiers`}
          </div>
        )}
        <div style={{display:'flex',gap:'8px'}}>
          {launchUrl && (
            <a href={launchUrl} target="_blank" rel="noreferrer" style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'8px',padding:'7px 14px',color:'#E8651A',fontSize:'12px',fontWeight:'600'}}>⤢ Plein écran</a>
          )}
          <button onClick={()=>inputRef.current?.click()} style={{background:'linear-gradient(135deg,#FF5722,#FFB300)',border:'none',borderRadius:'8px',padding:'8px 16px',color:'#fff',fontWeight:'700',fontSize:'13px',cursor:'pointer'}}>
            {launchUrl?'📁 Autre fichier':'📁 Ouvrir un fichier'}
          </button>
        </div>
        <input ref={inputRef} type="file" style={{display:'none'}} accept=".zip,.h5p,.pdf,.html,.htm,.mp4,.mov,.webm" onChange={e=>{if(e.target.files?.[0])process(e.target.files[0])}} />
      </div>

      {loading&&(
        <div style={{marginBottom:'1rem',background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'12px',padding:'1.25rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'13px'}}>
            <span style={{color:'#E8651A',fontWeight:'600'}}>{msg}</span>
            <span style={{color:'#E8651A',fontWeight:'700'}}>{progress}%</span>
          </div>
          <div style={{height:'6px',background:'rgba(28,25,23,0.06)',borderRadius:'3px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#FF5722,#FFB300)',borderRadius:'3px',transition:'width .2s'}} />
          </div>
        </div>
      )}

      {error&&<div style={{marginBottom:'1rem',background:'rgba(240,90,90,0.08)',border:'1px solid rgba(240,90,90,0.25)',borderRadius:'12px',padding:'1rem',fontSize:'13px',color:'#F08080'}}>⚠️ {error}</div>}

      {!loading&&!launchUrl&&!error&&(
        <div onClick={()=>inputRef.current?.click()} style={{flex:1,background:'#FFFFFF',border:'2px dashed rgba(28,25,23,0.09)',borderRadius:'16px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .2s'}}
          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(123,92,245,0.5)'}
          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(28,25,23,0.09)'}>
          <div style={{fontSize:'56px',marginBottom:'1.5rem'}}>📦</div>
          <div style={{fontWeight:'700',fontSize:'18px',color:'#1C1917',marginBottom:'8px'}}>Ouvrir un contenu e-learning</div>
          <div style={{color:'#A8A29E',fontSize:'13px',marginBottom:'1.5rem',textAlign:'center',maxWidth:'400px'}}>
            SCORM .zip · H5P .h5p · HTML · PDF · Vidéo MP4
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center'}}>
            {['📦 SCORM .zip','🎮 H5P .h5p','💻 .html','📄 .pdf','🎬 .mp4'].map(f=>(
              <span key={f} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'20px',padding:'4px 12px',fontSize:'12px',color:'#A8A29E',fontWeight:'600'}}>{f}</span>
            ))}
          </div>
        </div>
      )}

      {launchUrl&&fileType==='video'&&(
        <div style={{flex:1,background:'#000',borderRadius:'16px',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <video src={launchUrl} controls autoPlay style={{maxWidth:'100%',maxHeight:'100%'}} />
        </div>
      )}

      {launchUrl&&fileType!=='video'&&(
        <div style={{flex:1,borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(28,25,23,0.08)',background:'#fff',position:'relative'}}>
          <iframe ref={iframeRef} src={launchUrl} style={{width:'100%',height:'100%',border:'none'}} title="Viewer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads" />
        </div>
      )}
    </div>
  )
}

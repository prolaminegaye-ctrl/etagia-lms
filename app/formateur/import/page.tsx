'use client'
import { useState, useRef } from 'react'

type FileInfo = { name: string; size: string; type: string; url: string }

const formatSize = (bytes: number) => bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} KB` : `${(bytes/1024/1024).toFixed(1)} MB`

const getType = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['zip','scorm'].includes(ext||'')) return 'SCORM'
  if (ext === 'h5p') return 'H5P'
  if (ext === 'pdf') return 'PDF'
  if (['mp4','mov','avi','webm'].includes(ext||'')) return 'Vidéo'
  return 'Fichier'
}

const typeColors: Record<string,string> = { SCORM:'#5B8DEF', H5P:'#8B5CF6', PDF:'#F05A5A', Vidéo:'#22D4A8', Fichier:'#F0B429' }

export default function ImportPage() {
  const [drag, setDrag] = useState(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [progress, setProgress] = useState<Record<string,number>>({})
  const [done, setDone] = useState<Record<string,boolean>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    const info: FileInfo = {
      name: file.name,
      size: formatSize(file.size),
      type: getType(file.name),
      url: URL.createObjectURL(file)
    }
    setFiles(prev => [...prev, info])
    // Simulate processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 60))
      setProgress(prev => ({ ...prev, [file.name]: i }))
    }
    setDone(prev => ({ ...prev, [file.name]: true }))
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    Array.from(fileList).forEach(processFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name))
    setProgress(prev => { const n = {...prev}; delete n[name]; return n })
    setDone(prev => { const n = {...prev}; delete n[name]; return n })
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', padding: '1.75rem', borderRadius: '20px', background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(91,141,239,0.06))', border: '1px solid rgba(139,92,246,0.25)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', background: 'linear-gradient(135deg,#F0F4FF,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Importer un contenu</h1>
        <p style={{ color: '#7A90B0', fontSize: '14px' }}>SCORM 1.2 · SCORM 2004 · H5P · PDF · Vidéo MP4/MOV</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${drag ? '#5B8DEF' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center',
          background: drag ? 'rgba(91,141,239,0.06)' : 'linear-gradient(145deg,#111827,#0D1425)',
          cursor: 'pointer', marginBottom: '1.5rem', transition: 'all .2s'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>☁️</div>
        <div style={{ fontWeight: '700', fontSize: '18px', color: '#F0F4FF', marginBottom: '8px' }}>Glissez vos fichiers ici</div>
        <div style={{ color: '#7A90B0', fontSize: '13px', marginBottom: '16px' }}>ou cliquez pour parcourir · Max 500 MB par fichier</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['SCORM .zip','H5P .h5p','PDF .pdf','Vidéo .mp4'].map(f => (
            <span key={f} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#7A90B0', fontWeight: '600' }}>{f}</span>
          ))}
        </div>
        <input ref={inputRef} type="file" style={{ display: 'none' }} multiple accept=".zip,.h5p,.pdf,.mp4,.mov,.avi,.webm" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {files.map(f => (
            <div key={f.name} style={{ background: 'linear-gradient(145deg,#111827,#0D1425)', border: `1px solid ${done[f.name] ? 'rgba(34,212,168,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: done[f.name] ? '0' : '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: typeColors[f.type] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: typeColors[f.type], flexShrink: 0 }}>
                  {f.type === 'PDF' ? '📄' : f.type === 'Vidéo' ? '🎬' : f.type === 'H5P' ? '🎮' : '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#F0F4FF', marginBottom: '2px' }}>{f.name}</div>
                  <div style={{ fontSize: '12px', color: '#7A90B0' }}>{f.size} · <span style={{ color: typeColors[f.type], fontWeight: '700' }}>{f.type}</span></div>
                </div>
                {done[f.name] ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#22D4A8', fontWeight: '700', fontSize: '13px' }}>✓ Importé</span>
                    {f.type === 'PDF' && (
                      <a href={f.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(91,141,239,0.15)', border: '1px solid rgba(91,141,239,0.3)', borderRadius: '8px', padding: '5px 12px', color: '#5B8DEF', fontSize: '12px', fontWeight: '700' }}>👁 Voir</a>
                    )}
                    {f.type === 'Vidéo' && (
                      <a href={f.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(34,212,168,0.15)', border: '1px solid rgba(34,212,168,0.3)', borderRadius: '8px', padding: '5px 12px', color: '#22D4A8', fontSize: '12px', fontWeight: '700' }}>▶ Lire</a>
                    )}
                    <button onClick={() => removeFile(f.name)} style={{ background: 'rgba(240,90,90,0.1)', border: 'none', borderRadius: '8px', padding: '5px 10px', color: '#F05A5A', fontSize: '12px', fontWeight: '600' }}>✕</button>
                  </div>
                ) : (
                  <span style={{ color: '#5B8DEF', fontSize: '13px', fontWeight: '600' }}>{progress[f.name] || 0}%</span>
                )}
              </div>
              {!done[f.name] && (
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress[f.name] || 0}%`, background: 'linear-gradient(90deg,#5B8DEF,#22D4A8)', borderRadius: '2px', transition: 'width .1s' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {files.some(f => done[f.name]) && (
        <div style={{ background: 'rgba(34,212,168,0.08)', border: '1px solid rgba(34,212,168,0.25)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>✅</span>
          <div>
            <div style={{ fontWeight: '700', color: '#22D4A8', marginBottom: '3px' }}>{Object.values(done).filter(Boolean).length} fichier(s) importé(s) avec succès</div>
            <div style={{ fontSize: '13px', color: '#7A90B0' }}>Vos contenus sont prêts à être publiés dans vos cours</div>
          </div>
          <a href="/formateur/cours" style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#5B8DEF,#22D4A8)', borderRadius: '10px', padding: '8px 18px', color: '#fff', fontSize: '13px', fontWeight: '700' }}>Gérer mes cours →</a>
        </div>
      )}

      {/* Formats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '2rem' }}>
        {[
          { fmt: 'SCORM 1.2/2004', desc: 'Standard e-learning universel', icon: '📦', color: '#5B8DEF' },
          { fmt: 'H5P', desc: 'Contenus interactifs HTML5', icon: '🎮', color: '#8B5CF6' },
          { fmt: 'PDF', desc: 'Documents formatés', icon: '📄', color: '#F05A5A' },
          { fmt: 'Vidéo MP4', desc: 'Cours vidéo jusqu\'à 500MB', icon: '🎬', color: '#22D4A8' },
        ].map(f => (
          <div key={f.fmt} style={{ background: 'linear-gradient(145deg,#111827,#0D1425)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: f.color }} />
            <div style={{ fontSize: '28px', marginBottom: '8px', marginTop: '6px' }}>{f.icon}</div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: f.color, marginBottom: '4px' }}>{f.fmt}</div>
            <div style={{ fontSize: '11px', color: '#7A90B0' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

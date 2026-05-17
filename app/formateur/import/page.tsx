'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type FileInfo = { name: string; size: string; type: string; url: string; id: string; file: File }
const formatSize = (b: number) => b < 1024*1024 ? `${(b/1024).toFixed(0)} KB` : `${(b/1024/1024).toFixed(1)} MB`
const getType = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'zip') return 'SCORM'
  if (ext === 'h5p') return 'H5P'
  if (ext === 'pdf') return 'PDF'
  if (['mp4','mov','avi','webm'].includes(ext||'')) return 'Vidéo'
  if (['html','htm'].includes(ext||'')) return 'HTML'
  return 'Fichier'
}
const typeColors: Record<string,string> = { SCORM:'#FF5722', H5P:'#FFB300', PDF:'#F05A5A', Vidéo:'#00BFA5', HTML:'#FFB300', Fichier:'#A8A29E' }
const typeIcons: Record<string,string> = { SCORM:'📦', H5P:'🎮', PDF:'📄', Vidéo:'🎬', HTML:'💻', Fichier:'📁' }

export default function ImportPage() {
  const router = useRouter()
  const [drag, setDrag] = useState(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [progress, setProgress] = useState<Record<string,number>>({})
  const [done, setDone] = useState<Record<string,boolean>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    const id = Math.random().toString(36).slice(2)
    const info: FileInfo = { id, name: file.name, size: formatSize(file.size), type: getType(file.name), url: URL.createObjectURL(file), file }
    setFiles(prev => [...prev, info])
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 50))
      setProgress(prev => ({ ...prev, [id]: i }))
    }
    setDone(prev => ({ ...prev, [id]: true }))
  }

  const handleFiles = (list: FileList|null) => { if (list) Array.from(list).forEach(processFile) }
  const remove = (id: string) => {
    setFiles(p => p.filter(f => f.id !== id))
    setProgress(p => { const n = {...p}; delete n[id]; return n })
    setDone(p => { const n = {...p}; delete n[id]; return n })
  }

  const viewInBrowser = (f: FileInfo) => {
    // Store file reference for viewer
    sessionStorage.setItem('viewer_file_name', f.name)
    sessionStorage.setItem('viewer_file_url', f.url)
    sessionStorage.setItem('viewer_file_type', f.type)
    router.push('/formateur/viewer')
  }

  const formats = [
    { f:'SCORM 1.2/2004', d:'Standard e-learning universel', i:'📦', c:'#FF5722', ext:'.zip' },
    { f:'H5P', d:'Contenus interactifs HTML5', i:'🎮', c:'#FFB300', ext:'.h5p' },
    { f:'HTML/ZIP', d:'Pages web et micro-modules', i:'💻', c:'#FFB300', ext:'.html' },
    { f:'PDF', d:'Documents et supports', i:'📄', c:'#F05A5A', ext:'.pdf' },
    { f:'Vidéo MP4', d:'Cours vidéo HD', i:'🎬', c:'#00BFA5', ext:'.mp4' },
    { f:'xAPI/Tin Can', d:'Expériences avancées', i:'🔗', c:'#A8A29E', ext:'.zip' },
  ]

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,rgba(28,25,23,0.07),rgba(224,64,160,0.06))',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>↑ Importer un contenu</h1>
          <p style={{color:'#A8A29E',fontSize:'14px',marginTop:'2px'}}>SCORM · H5P · HTML · PDF · Vidéo · xAPI</p>
        </div>
        <button onClick={()=>router.push('/formateur/viewer')} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'10px',padding:'9px 18px',color:'#E8651A',fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>
          👁 Ouvrir le visualiseur
        </button>
      </div>

      <div onClick={()=>inputRef.current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files)}}
        style={{border:`2px dashed ${drag?'#FF5722':'rgba(28,25,23,0.09)'}`,borderRadius:'20px',padding:'3rem 2rem',textAlign:'center',background:drag?'rgba(123,92,245,0.06)':'#FFFFFF',cursor:'pointer',marginBottom:'1.5rem',transition:'all .2s'}}>
        <div style={{fontSize:'48px',marginBottom:'1rem'}}>☁️</div>
        <div style={{fontWeight:'700',fontSize:'18px',color:'#1C1917',marginBottom:'8px'}}>Glissez vos fichiers ici</div>
        <div style={{color:'#A8A29E',fontSize:'13px',marginBottom:'16px'}}>ou cliquez pour parcourir · Max 500 MB par fichier</div>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',flexWrap:'wrap'}}>
          {['.zip (SCORM)','.h5p','.html','.pdf','.mp4'].map(f=>(
            <span key={f} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'20px',padding:'4px 12px',fontSize:'12px',color:'#A8A29E',fontWeight:'600'}}>{f}</span>
          ))}
        </div>
        <input ref={inputRef} type="file" style={{display:'none'}} multiple accept=".zip,.h5p,.pdf,.mp4,.mov,.avi,.webm,.html,.htm" onChange={e=>handleFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginBottom:'1.5rem'}}>
          {files.map(f=>(
            <div key={f.id} style={{background:'#FFFFFF',border:`1px solid ${done[f.id]?'rgba(34,212,168,0.3)':'rgba(28,25,23,0.08)'}`,borderRadius:'14px',padding:'1rem 1.25rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:done[f.id]?'0':'10px'}}>
                <div style={{width:'42px',height:'42px',borderRadius:'10px',background:typeColors[f.type]+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>{typeIcons[f.type]}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:'600',fontSize:'14px',color:'#1C1917',marginBottom:'2px'}}>{f.name}</div>
                  <div style={{fontSize:'12px',color:'#A8A29E'}}>{f.size} · <span style={{color:typeColors[f.type],fontWeight:'700'}}>{f.type}</span></div>
                </div>
                {done[f.id] ? (
                  <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                    <span style={{color:'#00BFA5',fontWeight:'700',fontSize:'12px'}}>✓ Importé</span>
                    <button onClick={()=>viewInBrowser(f)} style={{background:'linear-gradient(135deg,#FF5722,#FFB300)',border:'none',borderRadius:'8px',padding:'6px 14px',color:'#fff',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>
                      👁 Visualiser
                    </button>
                    {f.type==='PDF'&&<a href={f.url} target="_blank" rel="noreferrer" style={{background:'rgba(240,90,90,0.1)',border:'1px solid rgba(240,90,90,0.2)',borderRadius:'8px',padding:'5px 12px',color:'#F08080',fontSize:'12px',fontWeight:'600'}}>📄 Ouvrir</a>}
                    <button onClick={()=>remove(f.id)} style={{background:'rgba(240,90,90,0.08)',border:'none',borderRadius:'8px',padding:'5px 9px',color:'#F05A5A',fontSize:'12px',cursor:'pointer'}}>✕</button>
                  </div>
                ) : <span style={{color:'#E8651A',fontSize:'13px',fontWeight:'600'}}>{progress[f.id]||0}%</span>}
              </div>
              {!done[f.id]&&(
                <div style={{height:'4px',background:'rgba(28,25,23,0.06)',borderRadius:'2px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${progress[f.id]||0}%`,background:'linear-gradient(90deg,#FF5722,#FFB300)',borderRadius:'2px',transition:'width .1s'}} />
                </div>
              )}
            </div>
          ))}
          {files.some(f=>done[f.id])&&(
            <div style={{background:'rgba(34,212,168,0.06)',border:'1px solid rgba(34,212,168,0.2)',borderRadius:'14px',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'12px'}}>
              <span style={{fontSize:'28px'}}>✅</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:'700',color:'#00BFA5',marginBottom:'3px'}}>{Object.values(done).filter(Boolean).length} fichier(s) importé(s)</div>
                <div style={{fontSize:'13px',color:'#A8A29E'}}>Cliquez "Visualiser" pour lire le contenu directement dans le navigateur</div>
              </div>
            </div>
          )}
        </div>
      )}

      <h2 style={{fontSize:'15px',fontWeight:'700',marginBottom:'1rem',color:'#1C1917'}}>Formats supportés</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
        {formats.map(f=>(
          <div key={f.f} style={{background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.06)',borderRadius:'14px',padding:'1rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:f.c}} />
            <div style={{fontSize:'26px',marginBottom:'8px',marginTop:'4px'}}>{f.i}</div>
            <div style={{fontWeight:'700',fontSize:'13px',color:f.c,marginBottom:'3px'}}>{f.f}</div>
            <div style={{fontSize:'12px',color:'#A8A29E',marginBottom:'5px'}}>{f.d}</div>
            <div style={{fontSize:'10px',color:'#57534E',fontFamily:'monospace'}}>{f.ext}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
import { useState, useRef, useEffect } from 'react'

// ─── SCORM 1.2 + 2004 API shim injected into the iframe ───────────────────────
const SCORM_SHIM = `
<script>
(function(){
  var data={};var suspended=false;
  window.API={
    LMSInitialize:function(){data={};return'true'},
    LMSFinish:function(){return'true'},
    LMSGetValue:function(k){return data[k]||''},
    LMSSetValue:function(k,v){data[k]=v;
      if(k==='cmi.core.lesson_status'||k==='cmi.core.score.raw'||k==='cmi.completion_status'||k==='cmi.success_status'||k==='cmi.score.scaled')
        window.parent.postMessage({type:'scorm',key:k,value:v},'*');
      return'true'},
    LMSCommit:function(){window.parent.postMessage({type:'scorm_commit',data:JSON.stringify(data)},'*');return'true'},
    LMSGetLastError:function(){return'0'},
    LMSGetErrorString:function(){return''},
    LMSGetDiagnostic:function(){return''},
  };
  window.API_1484_11={
    Initialize:function(){data={};return'true'},
    Terminate:function(){return'true'},
    GetValue:function(k){return data[k]||''},
    SetValue:function(k,v){data[k]=v;
      if(k.includes('completion')||k.includes('score')||k.includes('success'))
        window.parent.postMessage({type:'scorm',key:k,value:v},'*');
      return'true'},
    Commit:function(){window.parent.postMessage({type:'scorm_commit',data:JSON.stringify(data)},'*');return'true'},
    GetLastError:function(){return'0'},
    GetErrorString:function(){return''},
    GetDiagnostic:function(){return''},
  };
  console.log('[ETAGIA] SCORM API 1.2 + 2004 prêts');
})();
<\/script>`

function parseYouTubeId(url:string):string|null{
  const patterns=[
    /(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^[A-Za-z0-9_-]{11}$/
  ]
  for(const p of patterns){const m=url.match(p);if(m)return m[1]}
  return null
}
function parsePlaylistId(url:string):string|null{
  const m=url.match(/[?&]list=([A-Za-z0-9_-]+)/)
  return m?m[1]:null
}

type ScormStat={status?:string,score?:string,completion?:string}

export default function ViewerPage(){
  const [loading,setLoading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [msg,setMsg]=useState('')
  const [launchUrl,setLaunchUrl]=useState<string|null>(null)
  const [youtubeId,setYoutubeId]=useState<string|null>(null)
  const [playlistId,setPlaylistId]=useState<string|null>(null)
  const [fileType,setFileType]=useState('')
  const [fileName,setFileName]=useState('')
  const [error,setError]=useState('')
  const [fileCount,setFileCount]=useState(0)
  const [scormStats,setScormStats]=useState<ScormStat>({})
  const [ytInput,setYtInput]=useState('')
  const [showYtInput,setShowYtInput]=useState(false)
  const [fullscreen,setFullscreen]=useState(false)
  const inputRef=useRef<HTMLInputElement>(null)
  const iframeRef=useRef<HTMLIFrameElement>(null)

  // Listen for SCORM messages
  useEffect(()=>{
    const handler=(e:MessageEvent)=>{
      if(e.data?.type==='scorm'){
        const {key,value}=e.data
        setScormStats(prev=>{
          const next={...prev}
          if(key.includes('lesson_status')||key.includes('completion'))next.status=value
          if(key.includes('score'))next.score=value
          if(key.includes('success'))next.completion=value
          return next
        })
      }
    }
    window.addEventListener('message',handler)
    return()=>window.removeEventListener('message',handler)
  },[])

  const loadYoutube=()=>{
    const id=parseYouTubeId(ytInput.trim())
    const pl=parsePlaylistId(ytInput.trim())
    if(!id&&!pl){setError('URL YouTube invalide');return}
    setError('')
    setYoutubeId(id)
    setPlaylistId(pl)
    setFileType('youtube')
    setFileName(ytInput.trim())
    setLaunchUrl(null)
    setShowYtInput(false)
    setYtInput('')
  }

  const process=async(file:File)=>{
    setLoading(true);setError('');setLaunchUrl(null);setFileCount(0)
    setYoutubeId(null);setPlaylistId(null)
    setFileName(file.name)
    const ext=file.name.split('.').pop()?.toLowerCase()||''

    if(ext==='pdf'){setFileType('pdf');setLaunchUrl(URL.createObjectURL(file));setProgress(100);setLoading(false);return}
    if(['mp4','mov','webm','avi'].includes(ext)){setFileType('video');setLaunchUrl(URL.createObjectURL(file));setProgress(100);setLoading(false);return}
    if(['html','htm'].includes(ext)){
      const txt=await file.text()
      // Inject SCORM API into HTML files too
      const enhanced=txt.replace(/<head>/i,`<head>${SCORM_SHIM}`)
      setFileType('html');setLaunchUrl(URL.createObjectURL(new Blob([enhanced],{type:'text/html'})));setProgress(100);setLoading(false);return
    }
    if(!['zip','h5p'].includes(ext)){setError('Format non supporté. Utilisez .zip .h5p .pdf .html .mp4');setLoading(false);return}

    try{
      setProgress(10);setMsg('Chargement de JSZip...')
      const JSZip=(await import('jszip')).default
      setProgress(20);setMsg('Extraction du package...')
      const zip=await JSZip.loadAsync(file)
      const names=Object.keys(zip.files).filter(n=>!zip.files[n].dir)
      setFileCount(names.length)
      setProgress(30);setMsg(`${names.length} fichiers trouvés...`)

      const map:Record<string,string>={}
      let done=0
      for(const name of names){
        const entry=zip.files[name]
        const ext2=name.split('.').pop()?.toLowerCase()||''
        const mimes:Record<string,string>={html:'text/html',htm:'text/html',css:'text/css',js:'application/javascript',json:'application/json',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',svg:'image/svg+xml',webp:'image/webp',mp4:'video/mp4',mp3:'audio/mpeg',ogg:'audio/ogg',woff:'font/woff',woff2:'font/woff2',ttf:'font/ttf',xml:'application/xml',txt:'text/plain'}
        const mime=mimes[ext2]||'application/octet-stream'
        const isText=['html','htm','css','js','json','xml','txt','svg'].includes(ext2)
        const blob=isText?new Blob([await entry.async('string')],{type:mime}):new Blob([await entry.async('arraybuffer')],{type:mime})
        map[name]=URL.createObjectURL(blob)
        const short=name.includes('/')?name.split('/').pop()!:name
        if(!map[short])map[short]=map[name]
        done++
        setProgress(30+Math.floor((done/names.length)*50))
      }

      setMsg('Recherche du fichier de lancement...')
      let launchPath:string|null=null
      const manifestKey=names.find(n=>n.endsWith('imsmanifest.xml'))
      if(manifestKey){
        const xml=await zip.files[manifestKey].async('string')
        const m=xml.match(/<resource[^>]+href="([^"]+\.html?)"/i)||xml.match(/href="([^"]+\.html?)"/i)
        if(m){const c=m[1].replace(/\\/g,'/');launchPath=names.find(n=>n.endsWith(c)||n===c)||null}
      }
      if(!launchPath){
        const htmlFiles=names.filter(n=>/\.(html|htm)$/i.test(n))
        launchPath=htmlFiles.find(n=>/index|story|launch|scorm|index_lms/i.test(n.split('/').pop()!))||htmlFiles[0]||null
      }
      if(!launchPath){setError('Aucun fichier HTML de lancement trouvé.');setLoading(false);return}

      setProgress(85);setMsg('Injection API SCORM + reconstruction...')
      let html=await zip.files[launchPath].async('string')

      // Inject SCORM API at top of <head>
      if(/<head>/i.test(html))html=html.replace(/<head>/i,`<head>${SCORM_SHIM}`)
      else html=SCORM_SHIM+html

      // Replace asset references with blob URLs
      for(const[name,blobUrl]of Object.entries(map)){
        const safe=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')
        const short=name.includes('/')?name.split('/').pop()!:name
        const safeShort=short.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')
        html=html.replace(new RegExp(`(src|href|data)=["']${safe}["']`,'gi'),`$1="${blobUrl}"`)
                 .replace(new RegExp(`(src|href|data)=["']${safeShort}["']`,'gi'),`$1="${blobUrl}"`)
                 .replace(new RegExp(`url\\(['"]?${safe}['"]?\\)`,'gi'),`url("${blobUrl}")`)
                 .replace(new RegExp(`url\\(['"]?${safeShort}['"]?\\)`,'gi'),`url("${blobUrl}")`)
      }

      setFileType(ext==='h5p'?'h5p':'scorm')
      setLaunchUrl(URL.createObjectURL(new Blob([html],{type:'text/html'})))
      setProgress(100);setMsg('Prêt !')
    }catch(e:any){setError(`Erreur d'extraction: ${e.message}`)}
    setLoading(false)
  }

  const ytSrc=youtubeId
    ?(playlistId
      ?`https://www.youtube-nocookie.com/embed/${youtubeId}?list=${playlistId}&autoplay=0&rel=0&modestbranding=1`
      :`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&cc_load_policy=1`)
    :(playlistId?`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`:null)

  const S={
    card:{background:'#fff',border:'1.5px solid rgba(28,25,23,0.08)',borderRadius:'16px'} as React.CSSProperties,
    btn:{background:'linear-gradient(135deg,#E8651A,#D4A017)',border:'none',borderRadius:'9px',padding:'8px 18px',color:'#fff',fontWeight:'700',fontSize:'13px',cursor:'pointer'} as React.CSSProperties,
    tag:{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'20px',padding:'4px 12px',fontSize:'11px',color:'#A8A29E',fontWeight:'600'} as React.CSSProperties,
  }

  return(
    <div style={{height:fullscreen?'100vh':'calc(100vh - 3rem)',display:'flex',flexDirection:'column',position:fullscreen?'fixed':'relative',inset:fullscreen?0:'auto',zIndex:fullscreen?9999:'auto',background:'#FAF9F7',padding:fullscreen?'1rem':'0'}}>
      {/* Header */}
      <div style={{marginBottom:'1rem',padding:'0.875rem 1.25rem',...S.card,display:'flex',alignItems:'center',gap:'1rem',flexWrap:'wrap',flexShrink:0}}>
        <div style={{flex:1,minWidth:'180px'}}>
          <h1 style={{fontSize:'16px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>▶ Visualiseur e-learning</h1>
          <p style={{color:'#A8A29E',fontSize:'10px',marginTop:'1px'}}>SCORM 1.2/2004 · H5P · HTML/ZIP · YouTube · PDF · Vidéo</p>
        </div>

        {/* SCORM Stats */}
        {Object.keys(scormStats).length>0&&(
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {scormStats.status&&<span style={{...S.tag,color:'#00BFA5',background:'rgba(0,191,165,0.10)',border:'1px solid rgba(0,191,165,0.20)'}}>✓ {scormStats.status}</span>}
            {scormStats.score&&<span style={{...S.tag,color:'#FFB300',background:'rgba(255,179,0,0.10)',border:'1px solid rgba(255,179,0,0.20)'}}>Score: {scormStats.score}</span>}
          </div>
        )}
        {fileName&&<div style={{...S.tag,maxWidth:'220px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>📦 {fileName} {fileCount>0&&`· ${fileCount} fichiers`}</div>}

        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
          {/* YouTube button */}
          {showYtInput?(
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
              <input value={ytInput} onChange={e=>setYtInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loadYoutube()}
                placeholder="URL YouTube..." autoFocus
                style={{background:'rgba(28,25,23,0.06)',border:'1.5px solid rgba(232,101,26,0.4)',borderRadius:'8px',padding:'6px 12px',fontSize:'12px',color:'#1C1917',outline:'none',width:'200px'}}/>
              <button onClick={loadYoutube} style={{...S.btn,padding:'7px 14px',fontSize:'12px',background:'#FF0000'}}>▶ Charger</button>
              <button onClick={()=>{setShowYtInput(false);setYtInput('')}} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'8px',padding:'7px 10px',cursor:'pointer',fontSize:'12px',color:'#A8A29E'}}>✕</button>
            </div>
          ):(
            <button onClick={()=>setShowYtInput(true)} style={{background:'rgba(255,0,0,0.08)',border:'1px solid rgba(255,0,0,0.20)',borderRadius:'8px',padding:'7px 14px',color:'#FF0000',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>
              ▶ YouTube
            </button>
          )}
          {(launchUrl||ytSrc)&&<button onClick={()=>setFullscreen(f=>!f)} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'8px',padding:'7px 12px',color:'#E8651A',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>{fullscreen?'⤡ Quitter':'⤢ Plein écran'}</button>}
          <button onClick={()=>inputRef.current?.click()} style={S.btn}>{(launchUrl||ytSrc)?'📁 Autre':'📁 Ouvrir'}</button>
        </div>
        <input ref={inputRef} type="file" style={{display:'none'}} accept=".zip,.h5p,.pdf,.html,.htm,.mp4,.mov,.webm" onChange={e=>{if(e.target.files?.[0])process(e.target.files[0])}}/>
      </div>

      {/* Progress */}
      {loading&&<div style={{marginBottom:'0.875rem',...S.card,padding:'1rem',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'12px'}}>
          <span style={{color:'#E8651A',fontWeight:'600'}}>{msg}</span>
          <span style={{color:'#E8651A',fontWeight:'700'}}>{progress}%</span>
        </div>
        <div style={{height:'6px',background:'rgba(28,25,23,0.06)',borderRadius:'3px',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#E8651A,#FFB300)',borderRadius:'3px',transition:'width .2s'}}/>
        </div>
      </div>}

      {error&&<div style={{marginBottom:'0.875rem',...S.card,padding:'1rem',fontSize:'13px',color:'#F08080',background:'rgba(240,90,90,0.06)',flexShrink:0}}>⚠️ {error}</div>}

      {/* Empty state */}
      {!loading&&!launchUrl&&!ytSrc&&!error&&(
        <div onClick={()=>inputRef.current?.click()} style={{flex:1,...S.card,border:'2px dashed rgba(28,25,23,0.09)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .2s'}}
          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(232,101,26,0.4)'}
          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(28,25,23,0.09)'}>
          <div style={{fontSize:'52px',marginBottom:'1.25rem'}}>📦</div>
          <div style={{fontWeight:'700',fontSize:'17px',color:'#1C1917',marginBottom:'8px'}}>Ouvrir un contenu e-learning</div>
          <div style={{color:'#A8A29E',fontSize:'13px',marginBottom:'1.5rem',textAlign:'center',maxWidth:'380px'}}>SCORM .zip · H5P .h5p · HTML · PDF · Vidéo · YouTube</div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center',marginBottom:'1rem'}}>
            {['📦 SCORM .zip','🎮 H5P .h5p','💻 .html','📄 .pdf','🎬 .mp4','▶ YouTube URL'].map(f=>(
              <span key={f} style={S.tag}>{f}</span>
            ))}
          </div>
          <div style={{fontSize:'12px',color:'#E8651A',fontWeight:'600'}}>ou utilisez le bouton ▶ YouTube en haut à droite</div>
        </div>
      )}

      {/* YouTube Player */}
      {ytSrc&&fileType==='youtube'&&(
        <div style={{flex:1,borderRadius:'16px',overflow:'hidden',border:'1.5px solid rgba(28,25,23,0.08)',background:'#000',display:'flex',flexDirection:'column'}}>
          <iframe src={ytSrc} style={{flex:1,border:'none',width:'100%'}} title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
        </div>
      )}

      {/* Video Player */}
      {launchUrl&&fileType==='video'&&(
        <div style={{flex:1,background:'#000',borderRadius:'16px',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <video src={launchUrl} controls autoPlay style={{maxWidth:'100%',maxHeight:'100%'}}/>
        </div>
      )}

      {/* SCORM / H5P / HTML / PDF */}
      {launchUrl&&fileType!=='video'&&(
        <div style={{flex:1,borderRadius:'16px',overflow:'hidden',border:'1.5px solid rgba(28,25,23,0.08)',background:'#fff',position:'relative'}}>
          {fileType==='h5p'&&<div style={{position:'absolute',top:'8px',left:'8px',zIndex:10,background:'rgba(255,179,0,0.15)',border:'1px solid rgba(255,179,0,0.3)',borderRadius:'8px',padding:'3px 10px',fontSize:'10px',fontWeight:'800',color:'#CC8800'}}>🎮 H5P</div>}
          {fileType==='scorm'&&<div style={{position:'absolute',top:'8px',left:'8px',zIndex:10,background:'rgba(232,101,26,0.12)',border:'1px solid rgba(232,101,26,0.3)',borderRadius:'8px',padding:'3px 10px',fontSize:'10px',fontWeight:'800',color:'#E8651A'}}>📦 SCORM · API Active</div>}
          <iframe ref={iframeRef} src={launchUrl} style={{width:'100%',height:'100%',border:'none'}} title="Viewer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-top-navigation-by-user-activation"/>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useRef, useEffect } from 'react'
import JSZip from 'jszip'

// ─── SCORM 1.2 + 2004 full API shim ──────────────────────────────────────────
const SCORM_SHIM = `<script>
(function(){
  var cmiData={};var initialized=false;
  function post(k,v){try{window.parent.postMessage({type:'scorm',key:k,value:v},'*')}catch(e){}}
  window.API={
    LMSInitialize:function(s){initialized=true;cmiData={};console.log('[SCORM1.2] Init');return'true'},
    LMSFinish:function(s){post('finish','true');return'true'},
    LMSGetValue:function(k){return cmiData[k]!==undefined?cmiData[k]:''},
    LMSSetValue:function(k,v){cmiData[k]=v;
      if(k==='cmi.core.lesson_status'||k==='cmi.core.score.raw'||k==='cmi.core.lesson_location')post(k,v);
      return'true'},
    LMSCommit:function(s){post('commit',JSON.stringify(cmiData));return'true'},
    LMSGetLastError:function(){return'0'},
    LMSGetErrorString:function(c){return'No error'},
    LMSGetDiagnostic:function(c){return''},
  };
  window.API_1484_11={
    Initialize:function(s){initialized=true;cmiData={};console.log('[SCORM2004] Init');return'true'},
    Terminate:function(s){post('finish','true');return'true'},
    GetValue:function(k){return cmiData[k]!==undefined?String(cmiData[k]):''},
    SetValue:function(k,v){cmiData[k]=v;
      if(k.includes('completion_status')||k.includes('score')||k.includes('success_status')||k.includes('progress_measure'))post(k,v);
      return'true'},
    Commit:function(s){post('commit',JSON.stringify(cmiData));return'true'},
    GetLastError:function(){return'0'},
    GetErrorString:function(c){return'No error'},
    GetDiagnostic:function(c){return''},
  };
  // Also expose on window for non-standard lookups
  window.scormAPI=window.API;
  console.log('[ETAGIA] SCORM 1.2 + 2004 APIs ready');
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

const MIME_MAP:Record<string,string>={
  html:'text/html',htm:'text/html',css:'text/css',js:'application/javascript',
  json:'application/json',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',
  gif:'image/gif',svg:'image/svg+xml',webp:'image/webp',mp4:'video/mp4',
  mp3:'audio/mpeg',ogg:'audio/ogg',wav:'audio/wav',woff:'font/woff',
  woff2:'font/woff2',ttf:'font/ttf',eot:'application/vnd.ms-fontobject',
  xml:'application/xml',txt:'text/plain',swf:'application/x-shockwave-flash'
}
const TEXT_EXTS=new Set(['html','htm','css','js','json','xml','txt','svg','xsd','xsl'])

type ScormStat={status?:string;score?:string;completion?:string;location?:string}

export default function ViewerPage(){
  const [loading,setLoading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [msg,setMsg]=useState('')
  const [launchUrl,setLaunchUrl]=useState<string|null>(null)
  const [srcdocContent,setSrcdocContent]=useState<string|null>(null)
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
  const [pdfPage,setPdfPage]=useState(1)
  const inputRef=useRef<HTMLInputElement>(null)
  const iframeRef=useRef<HTMLIFrameElement>(null)
  const blobUrls=useRef<string[]>([])

  useEffect(()=>{
    const handler=(e:MessageEvent)=>{
      if(!e.data?.type) return
      const {type,key,value}=e.data
      if(type==='scorm'){
        setScormStats(prev=>{
          const next={...prev}
          if(key?.includes('lesson_status')||key?.includes('completion_status'))next.status=value
          if(key?.includes('score'))next.score=value
          if(key?.includes('success_status'))next.completion=value
          if(key?.includes('lesson_location'))next.location=value
          return next
        })
      }
    }
    window.addEventListener('message',handler)
    return()=>{
      window.removeEventListener('message',handler)
      // revoke old blob urls
      blobUrls.current.forEach(u=>URL.revokeObjectURL(u))
    }
  },[])

  const trackBlob=(url:string)=>{blobUrls.current.push(url);return url}

  const reset=()=>{
    blobUrls.current.forEach(u=>URL.revokeObjectURL(u))
    blobUrls.current=[]
    setLaunchUrl(null);setSrcdocContent(null)
    setYoutubeId(null);setPlaylistId(null)
    setFileType('');setFileName('');setError('')
    setFileCount(0);setScormStats({});setProgress(0);setMsg('')
  }

  const loadYoutube=()=>{
    const url=ytInput.trim()
    const id=parseYouTubeId(url)
    const pl=parsePlaylistId(url)
    if(!id&&!pl){setError('URL YouTube invalide — essayez youtu.be/ID ou ?v=ID');return}
    reset()
    setYoutubeId(id);setPlaylistId(pl)
    setFileType('youtube');setFileName(url)
    setShowYtInput(false);setYtInput('')
  }

  const injectScormAndFixPaths=(html:string, map:Record<string,string>, basePath:string):string=>{
    // 1) Inject SCORM shim right after <head> or at top
    let out=html
    if(/<head[^>]*>/i.test(out)) out=out.replace(/<head([^>]*)>/i,`<head$1>\n${SCORM_SHIM}`)
    else out=`<html><head>${SCORM_SHIM}</head><body>${out}</body></html>`

    // 2) Replace relative asset references with blob URLs
    // Build a flat name→url map
    const flat:Record<string,string>={}
    for(const [path,url] of Object.entries(map)){
      flat[path]=url
      // also map basename
      const base=path.split('/').pop()!
      if(!flat[base]) flat[base]=url
      // also map relative from same dir
      const dir=basePath.includes('/')?basePath.substring(0,basePath.lastIndexOf('/')+1):''
      if(dir&&path.startsWith(dir)) flat[path.slice(dir.length)]=url
    }

    // Replace src="..." href="..." url(...) references
    out=out.replace(/(src|href|data-src)=["']([^"'#?]+)["']/gi,(match,attr,val)=>{
      const decoded=val.replace(/\.\//g,'')
      if(val.startsWith('http')||val.startsWith('data:')||val.startsWith('blob:')) return match
      const found=flat[val]||flat[decoded]||flat[val.split('/').pop()!]
      return found?`${attr}="${found}"`:match
    })
    out=out.replace(/url\(["']?([^"')#?]+)["']?\)/gi,(match,val)=>{
      if(val.startsWith('http')||val.startsWith('data:')||val.startsWith('blob:')) return match
      const decoded=val.replace(/\.\//g,'')
      const found=flat[val]||flat[decoded]||flat[val.split('/').pop()!]
      return found?`url("${found}")`:match
    })
    return out
  }

  const process=async(file:File)=>{
    reset()
    setLoading(true);setError('')
    setFileName(file.name)
    const ext=(file.name.split('.').pop()||'').toLowerCase()

    try{
      // ── PDF ──────────────────────────────────────────────────────────────
      if(ext==='pdf'){
        setFileType('pdf')
        setLaunchUrl(trackBlob(URL.createObjectURL(file)))
        setProgress(100);setLoading(false);return
      }
      // ── Vidéo ─────────────────────────────────────────────────────────────
      if(['mp4','mov','webm','avi','mkv'].includes(ext)){
        setFileType('video')
        setLaunchUrl(trackBlob(URL.createObjectURL(file)))
        setProgress(100);setLoading(false);return
      }
      // ── HTML / HTM ────────────────────────────────────────────────────────
      if(['html','htm'].includes(ext)){
        setMsg('Lecture du fichier HTML…')
        setProgress(40)
        const txt=await file.text()
        const enhanced=injectScormAndFixPaths(txt,{},'index.html')
        setSrcdocContent(enhanced)
        setFileType('html')
        setProgress(100);setLoading(false);return
      }
      // ── ZIP / H5P / SCORM ─────────────────────────────────────────────────
      if(['zip','h5p'].includes(ext)){
        setMsg('Lecture de l\'archive…');setProgress(5)
        const zip=await JSZip.loadAsync(file)
        const names=Object.keys(zip.files).filter(n=>!zip.files[n].dir)
        setFileCount(names.length)
        setMsg(`${names.length} fichiers détectés — extraction…`);setProgress(15)

        // Extract all files → blob URLs
        const map:Record<string,string>={}
        let done=0
        for(const name of names){
          const entry=zip.files[name]
          const ext2=(name.split('.').pop()||'').toLowerCase()
          const mime=MIME_MAP[ext2]||'application/octet-stream'
          const isText=TEXT_EXTS.has(ext2)
          const content=isText?await entry.async('string'):await entry.async('arraybuffer')
          const blob=new Blob([content],{type:mime})
          map[name]=trackBlob(URL.createObjectURL(blob))
          done++
          setProgress(15+Math.floor((done/names.length)*55))
        }
        setMsg('Recherche du point de lancement…');setProgress(72)

        // ── Detect launch file ──────────────────────────────────────────────
        let launchPath:string|null=null
        // 1) Parse imsmanifest.xml
        const manifestKey=names.find(n=>n.toLowerCase().endsWith('imsmanifest.xml'))
        if(manifestKey){
          const xml=await zip.files[manifestKey].async('string')
          // Try various attributes
          const refs=[
            ...([...(xml.matchAll(/href="([^"]+\.html?)"/gi))].map(m=>m[1])),
            ...([...(xml.matchAll(/href='([^']+\.html?)'/gi))].map(m=>m[1])),
          ]
          for(const ref of refs){
            const norm=ref.replace(/\\/g,'/')
            const found=names.find(n=>n===norm||n.endsWith('/'+norm)||n.endsWith(norm))
            if(found){launchPath=found;break}
          }
        }
        // 2) contentv1/content.xml for H5P
        if(!launchPath){
          const h5pJson=names.find(n=>n.toLowerCase()==='h5p.json'||n.toLowerCase()==='content/content.json')
          if(h5pJson){
            const indexHtml=names.find(n=>n.toLowerCase()==='index.html'||n.toLowerCase()==='content/index.html')
            launchPath=indexHtml||null
          }
        }
        // 3) Heuristic: find index.html or story.html
        if(!launchPath){
          const htmlFiles=names.filter(n=>/\.(html|htm)$/i.test(n))
          const priority=['index.html','index_lms.html','index_lms_html5.html','story.html','launch.html','scormcontent/index.html','scormdriver/indexAPI.html']
          for(const p of priority){
            const found=htmlFiles.find(n=>n.toLowerCase().endsWith(p.toLowerCase()))
            if(found){launchPath=found;break}
          }
          if(!launchPath) launchPath=htmlFiles[0]||null
        }

        if(!launchPath){
          setError('Impossible de trouver le fichier de lancement. Vérifiez que votre SCORM contient un imsmanifest.xml valide.')
          setLoading(false);return
        }

        setMsg(`Lancement : ${launchPath} — injection API…`);setProgress(82)
        const rawHtml=await zip.files[launchPath].async('string')
        const finalHtml=injectScormAndFixPaths(rawHtml, map, launchPath)

        setMsg('Prêt !');setProgress(100)
        setSrcdocContent(finalHtml)
        setFileType(ext==='h5p'?'h5p':'scorm')
        setLoading(false);return
      }
      setError(`Format non supporté : .${ext}. Formats acceptés : .zip .h5p .html .pdf .mp4`)
    }catch(e:any){
      setError(`Erreur de traitement : ${e?.message||String(e)}`)
    }
    setLoading(false)
  }

  const ytSrc=youtubeId
    ?`https://www.youtube-nocookie.com/embed/${youtubeId}${playlistId?`?list=${playlistId}&`:'?'}autoplay=0&rel=0&modestbranding=1&cc_load_policy=1`
    :playlistId?`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`:null

  const S={
    card:{background:'#fff',border:'1.5px solid rgba(28,25,23,0.08)',borderRadius:'16px'} as React.CSSProperties,
    btn:{background:'linear-gradient(135deg,#E8651A,#D4A017)',border:'none',borderRadius:'9px',padding:'8px 18px',color:'#fff',fontWeight:'700',fontSize:'13px',cursor:'pointer'} as React.CSSProperties,
    tag:{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'20px',padding:'4px 12px',fontSize:'11px',color:'#A8A29E',fontWeight:'600'} as React.CSSProperties,
  }

  const hasContent=launchUrl||srcdocContent||ytSrc

  return(
    <div style={{height:fullscreen?'100vh':'calc(100vh - 3rem)',display:'flex',flexDirection:'column',position:fullscreen?'fixed':'relative',inset:fullscreen?'0':'auto',zIndex:fullscreen?9999:'auto',background:'#FAF9F7',padding:fullscreen?'0.75rem':'0',gap:'0.75rem'}}>

      {/* ── Header ── */}
      <div style={{padding:'0.75rem 1.25rem',...S.card,display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap',flexShrink:0}}>
        <div style={{flex:'1 1 180px'}}>
          <h1 style={{fontSize:'15px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:0}}>▶ Visualiseur e-learning</h1>
          <p style={{color:'#A8A29E',fontSize:'10px',margin:'1px 0 0'}}>SCORM 1.2/2004 · H5P · HTML/ZIP · YouTube · PDF · Vidéo</p>
        </div>

        {/* SCORM live stats */}
        {Object.keys(scormStats).length>0&&(
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
            {scormStats.status&&<span style={{...S.tag,color:'#00BFA5',background:'rgba(0,191,165,0.08)',border:'1px solid rgba(0,191,165,0.2)'}}>✓ {scormStats.status}</span>}
            {scormStats.score!=null&&<span style={{...S.tag,color:'#FFB300',background:'rgba(255,179,0,0.08)',border:'1px solid rgba(255,179,0,0.2)'}}>Score : {scormStats.score}</span>}
            {scormStats.location&&<span style={{...S.tag,fontSize:'10px'}}>📍 {scormStats.location}</span>}
          </div>
        )}

        {fileName&&(
          <div style={{...S.tag,maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={fileName}>
            {fileType==='scorm'?'📦':fileType==='h5p'?'🎮':fileType==='pdf'?'📄':fileType==='video'?'🎬':fileType==='html'?'💻':'▶'} {fileName}
            {fileCount>0&&<span style={{color:'#BBB'}}> · {fileCount}f</span>}
          </div>
        )}

        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
          {/* YouTube input */}
          {showYtInput?(
            <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
              <input value={ytInput} onChange={e=>setYtInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loadYoutube()}
                placeholder="URL YouTube…" autoFocus
                style={{background:'rgba(28,25,23,0.05)',border:'1.5px solid rgba(255,0,0,0.35)',borderRadius:'8px',padding:'6px 11px',fontSize:'12px',color:'#1C1917',outline:'none',width:'190px',fontFamily:'inherit'}}/>
              <button onClick={loadYoutube} style={{...S.btn,padding:'6px 12px',fontSize:'12px',background:'#c00'}}>▶</button>
              <button onClick={()=>{setShowYtInput(false);setYtInput('')}} style={{background:'rgba(28,25,23,0.05)',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'13px',color:'#A8A29E'}}>✕</button>
            </div>
          ):(
            <button onClick={()=>setShowYtInput(true)} style={{background:'rgba(255,0,0,0.07)',border:'1px solid rgba(255,0,0,0.18)',borderRadius:'8px',padding:'6px 13px',color:'#c00',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>▶ YouTube</button>
          )}
          {hasContent&&<button onClick={()=>setFullscreen(f=>!f)} style={{background:'rgba(28,25,23,0.05)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'8px',padding:'6px 11px',color:'#E8651A',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>{fullscreen?'⤡':'⤢'}</button>}
          {hasContent&&<button onClick={reset} style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'8px',padding:'6px 11px',color:'#F87171',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>✕ Fermer</button>}
          <button onClick={()=>inputRef.current?.click()} style={S.btn}>{hasContent?'📁 Autre fichier':'📁 Ouvrir'}</button>
        </div>
        <input ref={inputRef} type="file" style={{display:'none'}} accept=".zip,.h5p,.pdf,.html,.htm,.mp4,.mov,.webm,.avi"
          onChange={e=>{if(e.target.files?.[0]){process(e.target.files[0]);e.target.value=''}}}/>
      </div>

      {/* ── Progress bar ── */}
      {loading&&(
        <div style={{...S.card,padding:'0.875rem 1.25rem',flexShrink:0}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'12px'}}>
            <span style={{color:'#E8651A',fontWeight:'600'}}>{msg}</span>
            <span style={{color:'#E8651A',fontWeight:'700'}}>{progress}%</span>
          </div>
          <div style={{height:'6px',background:'rgba(28,25,23,0.06)',borderRadius:'3px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#E8651A,#FFB300)',borderRadius:'3px',transition:'width 0.3s ease'}}/>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error&&(
        <div style={{...S.card,padding:'0.875rem 1.25rem',flexShrink:0,background:'rgba(239,68,68,0.04)',border:'1px solid rgba(239,68,68,0.15)'}}>
          <div style={{fontSize:'13px',color:'#F87171',fontWeight:'600',marginBottom:'4px'}}>⚠️ {error}</div>
          <div style={{fontSize:'11px',color:'#A8A29E'}}>Formats supportés : SCORM .zip · H5P .h5p · .html · .pdf · .mp4 · .webm</div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading&&!hasContent&&!error&&(
        <div onClick={()=>inputRef.current?.click()}
          style={{flex:1,...S.card,border:'2px dashed rgba(28,25,23,0.09)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'border-color .2s,background .2s'}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(232,101,26,0.4)';(e.currentTarget as HTMLElement).style.background='rgba(232,101,26,0.02)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(28,25,23,0.09)';(e.currentTarget as HTMLElement).style.background='#fff'}}>
          <div style={{fontSize:'52px',marginBottom:'1rem'}}>📦</div>
          <div style={{fontWeight:'800',fontSize:'18px',color:'#1C1917',marginBottom:'6px'}}>Ouvrir un contenu e-learning</div>
          <div style={{color:'#A8A29E',fontSize:'13px',marginBottom:'1.5rem',textAlign:'center',lineHeight:'1.5'}}>
            Cliquez ici ou glissez-déposez votre fichier<br/>
            <span style={{fontSize:'11px'}}>SCORM .zip · H5P .h5p · HTML · PDF · Vidéo · YouTube</span>
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center'}}>
            {[['📦','SCORM .zip'],['🎮','H5P .h5p'],['💻','.html'],['📄','.pdf'],['🎬','.mp4'],['▶','YouTube']].map(([icon,label])=>(
              <span key={label} style={S.tag}>{icon} {label}</span>
            ))}
          </div>
          <div style={{marginTop:'1.25rem',fontSize:'12px',color:'#E8651A',fontWeight:'600'}}>ou utilisez le bouton ▶ YouTube en haut</div>
        </div>
      )}

      {/* ── YouTube ── */}
      {ytSrc&&fileType==='youtube'&&(
        <div style={{flex:1,borderRadius:'16px',overflow:'hidden',border:'1.5px solid rgba(28,25,23,0.08)',background:'#000'}}>
          <iframe src={ytSrc} style={{width:'100%',height:'100%',border:'none'}} title="YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
        </div>
      )}

      {/* ── Video native ── */}
      {launchUrl&&fileType==='video'&&(
        <div style={{flex:1,background:'#000',borderRadius:'16px',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <video src={launchUrl} controls style={{maxWidth:'100%',maxHeight:'100%',display:'block'}}/>
        </div>
      )}

      {/* ── PDF ── */}
      {launchUrl&&fileType==='pdf'&&(
        <div style={{flex:1,borderRadius:'16px',overflow:'hidden',border:'1.5px solid rgba(28,25,23,0.08)'}}>
          <iframe src={launchUrl} style={{width:'100%',height:'100%',border:'none'}} title="PDF"/>
        </div>
      )}

      {/* ── SCORM / H5P / HTML (via srcdoc) ── */}
      {srcdocContent&&['scorm','h5p','html'].includes(fileType)&&(
        <div style={{flex:1,borderRadius:'16px',overflow:'hidden',border:'1.5px solid rgba(28,25,23,0.08)',background:'#fff',position:'relative',minHeight:0}}>
          {fileType==='scorm'&&(
            <div style={{position:'absolute',top:'10px',left:'10px',zIndex:20,display:'flex',gap:'6px',pointerEvents:'none'}}>
              <span style={{background:'rgba(232,101,26,0.9)',color:'#fff',borderRadius:'6px',padding:'3px 9px',fontSize:'10px',fontWeight:'800'}}>📦 SCORM</span>
              <span style={{background:'rgba(0,191,165,0.9)',color:'#fff',borderRadius:'6px',padding:'3px 9px',fontSize:'10px',fontWeight:'800'}}>🔌 API Active</span>
            </div>
          )}
          {fileType==='h5p'&&(
            <div style={{position:'absolute',top:'10px',left:'10px',zIndex:20,pointerEvents:'none'}}>
              <span style={{background:'rgba(255,179,0,0.9)',color:'#fff',borderRadius:'6px',padding:'3px 9px',fontSize:'10px',fontWeight:'800'}}>🎮 H5P Interactif</span>
            </div>
          )}
          <iframe
            ref={iframeRef}
            srcDoc={srcdocContent}
            style={{width:'100%',height:'100%',border:'none',display:'block'}}
            title={fileName}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-pointer-lock allow-orientation-lock"
            allow="autoplay; fullscreen; microphone; camera"
          />
        </div>
      )}
    </div>
  )
}

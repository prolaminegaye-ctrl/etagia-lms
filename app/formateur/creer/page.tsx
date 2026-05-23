'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* ─── Types ─────────────────────────────────────────────────────────────── */
type VideoSource = 'file' | 'youtube' | 'heygen'
type Block = {
  id: string; type: 'text'|'video'|'pdf'|'quiz'|'html'|'h5p'|'activity'
  title: string; content: string; url?: string
  videoSource?: VideoSource; youtubeUrl?: string
}
type Module = { id: string; title: string; objectif: string; duration: string; intro: string; blocks: Block[]; ressources: string[] }
type Info = { title: string; description: string; level: string; category: string; duration: string; audience: string }
type CourseData = { introduction?: string; objectifs_generaux?: string[]; prerequis?: string[]; modules: any[]; evaluation_finale?: any; conclusion?: string }

const g = () => Math.random().toString(36).slice(2, 8)

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const S = {
  card:  { background:'#FFFFFF', border:'1px solid rgba(28,25,23,0.07)', borderRadius:'16px' } as React.CSSProperties,
  inp:   { background:'rgba(232,101,26,0.06)', color:'#1C1917', border:'1px solid rgba(28,25,23,0.09)', borderRadius:'10px', padding:'10px 14px', width:'100%', fontSize:'14px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const } as React.CSSProperties,
  btn:   { background:'linear-gradient(135deg,#E8651A,#D4A017)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', transition:'opacity .18s' } as React.CSSProperties,
  ghost: { background:'#FAF9F7', border:'1px solid rgba(28,25,23,0.09)', borderRadius:'10px', padding:'10px 18px', color:'#78716C', fontSize:'13px', cursor:'pointer', fontWeight:'600' } as React.CSSProperties,
  lbl:   { fontSize:'11px', color:'#A8A29E', display:'block', marginBottom:'5px', fontWeight:'700', textTransform:'uppercase' as const, letterSpacing:'0.7px' },
}

/* ─── YouTube helpers ───────────────────────────────────────────────────── */
function parseYouTubeId(url: string): string | null {
  const patterns = [
    /(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^[A-Za-z0-9_-]{11}$/,
  ]
  for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
  return null
}
function parseYouTubePlaylist(url: string): string | null {
  const m = url.match(/[?&]list=([A-Za-z0-9_-]+)/)
  return m ? m[1] : null
}
function getYouTubeEmbed(url: string): string | null {
  const pl = parseYouTubePlaylist(url)
  if (pl) return `https://www.youtube-nocookie.com/embed/videoseries?list=${pl}&cc_load_policy=1&rel=0`
  const id = parseYouTubeId(url)
  if (id) return `https://www.youtube-nocookie.com/embed/${id}?cc_load_policy=1&rel=0&modestbranding=1`
  return null
}
function getYouTubeThumbnail(url: string): string | null {
  const id = parseYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

/* ─── Block type palette ────────────────────────────────────────────────── */
const blockTypes = [
  { t:'text',    icon:'📝', label:'Contenu',  color:'#E8651A' },
  { t:'activity',icon:'🎯', label:'Activité', color:'#D4A017' },
  { t:'video',   icon:'🎬', label:'Vidéo',    color:'#7C3AED' },
  { t:'pdf',     icon:'📄', label:'PDF',      color:'#0EA5E9' },
  { t:'quiz',    icon:'❓', label:'Quiz',     color:'#10B981' },
  { t:'html',    icon:'💻', label:'HTML',     color:'#F43F5E' },
  { t:'h5p',     icon:'🎮', label:'H5P',      color:'#8B5CF6' },
]

/* ─── Preview renderer ──────────────────────────────────────────────────── */
function BlockPreview({ block }: { block: Block }) {
  const embed = block.type === 'video' && block.videoSource === 'youtube' && block.youtubeUrl
    ? getYouTubeEmbed(block.youtubeUrl) : null

  return (
    <div style={{ background:'#1a1d2e', borderRadius:'12px', overflow:'hidden', marginBottom:'12px' }}>
      <div style={{ background:'rgba(255,255,255,0.04)', padding:'8px 14px', fontSize:'11px', color:'#888', fontWeight:'700', letterSpacing:'.5px', display:'flex', alignItems:'center', gap:'6px' }}>
        <span>{blockTypes.find(b=>b.t===block.type)?.icon}</span>
        <span style={{ color:'#ccc' }}>{block.title || block.type.toUpperCase()}</span>
      </div>
      <div style={{ padding:'14px' }}>
        {block.type === 'text' && (
          <div style={{ fontSize:'13px', color:'#D4D0CA', lineHeight:'1.6', whiteSpace:'pre-wrap' }}>
            {block.content || <span style={{ color:'#555' }}><em>Aucun contenu</em></span>}
          </div>
        )}
        {block.type === 'video' && block.videoSource === 'youtube' && embed && (
          <div style={{ position:'relative', paddingBottom:'56.25%', borderRadius:'8px', overflow:'hidden', background:'#000' }}>
            <iframe src={embed} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }} allow="autoplay; encrypted-media" allowFullScreen title={block.title} />
          </div>
        )}
        {block.type === 'video' && block.videoSource === 'youtube' && !embed && block.youtubeUrl && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'10px', fontSize:'12px', color:'#F87171' }}>⚠️ URL YouTube non reconnue</div>
        )}
        {block.type === 'video' && block.videoSource === 'youtube' && !block.youtubeUrl && (
          <div style={{ background:'rgba(124,58,237,0.08)', border:'1px dashed rgba(124,58,237,0.3)', borderRadius:'8px', padding:'16px', textAlign:'center', fontSize:'12px', color:'#666' }}>▶ Collez une URL YouTube pour l&apos;aperçu</div>
        )}
        {block.type === 'video' && block.videoSource === 'file' && (
          <div style={{ background:'rgba(124,58,237,0.08)', border:'1px dashed rgba(124,58,237,0.3)', borderRadius:'8px', padding:'16px', textAlign:'center', fontSize:'12px', color:'#A78BFA' }}>🎬 Fichier vidéo · {block.url||'aucun fichier'}</div>
        )}
        {block.type === 'video' && block.videoSource === 'heygen' && (
          <div style={{ background:'rgba(124,58,237,0.08)', border:'1px dashed rgba(124,58,237,0.3)', borderRadius:'8px', padding:'16px', textAlign:'center', fontSize:'12px', color:'#A78BFA' }}>🤖 Vidéo HeyGen IA · {block.url ? '✅ URL définie' : '⏳ En attente'}</div>
        )}
        {block.type === 'quiz' && (() => {
          try { const q = JSON.parse(block.content); return (
            <div style={{ fontSize:'12px', color:'#D4D0CA' }}>
              <div style={{ fontWeight:'700', marginBottom:'8px', color:'#FCD34D' }}>❓ {q.question}</div>
              {q.options?.map((opt: string, i: number) => (
                <div key={i} style={{ padding:'6px 10px', margin:'3px 0', background:'rgba(255,255,255,0.04)', borderRadius:'6px', display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ color: opt===q.reponse?'#10B981':'#666' }}>{opt===q.reponse?'✓':'○'}</span>{opt}
                </div>
              ))}
            </div>
          )} catch { return <div style={{ fontSize:'12px', color:'#666' }}>{block.content}</div> }
        })()}
        {block.type === 'activity' && (() => {
          try { const a = JSON.parse(block.content); return (
            <div style={{ fontSize:'12px', color:'#D4D0CA' }}>
              <div style={{ fontWeight:'700', marginBottom:'6px', color:'#FCD34D' }}>🎯 {a.titre||'Activité'}</div>
              <div style={{ color:'#A8A29E' }}>{a.description||a.consigne||'Activité pratique'}</div>
            </div>
          )} catch { return <div style={{ fontSize:'12px', color:'#D4D0CA', whiteSpace:'pre-wrap' }}>{block.content}</div> }
        })()}
        {(block.type === 'pdf'||block.type === 'html'||block.type === 'h5p') && (
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px dashed rgba(255,255,255,0.1)', borderRadius:'8px', padding:'16px', textAlign:'center', fontSize:'12px', color:'#666' }}>
            {blockTypes.find(b=>b.t===block.type)?.icon} {block.type.toUpperCase()} · {block.url||'aucun fichier'}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Video block editor ────────────────────────────────────────────────── */
function VideoEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const [tab, setTab] = useState<VideoSource>(block.videoSource||'youtube')
  const [ytUrl, setYtUrl] = useState(block.youtubeUrl||'')
  const [ytThumb, setYtThumb] = useState<string|null>(block.youtubeUrl ? getYouTubeThumbnail(block.youtubeUrl) : null)

  const applyYt = (url: string) => {
    setYtUrl(url)
    setYtThumb(getYouTubeThumbnail(url))
    onChange({ ...block, videoSource:'youtube', youtubeUrl: url })
  }
  const switchTab = (t: VideoSource) => {
    setTab(t)
    onChange({ ...block, videoSource: t })
  }

  const tabBtn = (t: VideoSource, label: string) => ({
    padding:'6px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700' as const,
    background: tab===t ? 'linear-gradient(135deg,#E8651A,#D4A017)' : 'rgba(28,25,23,0.05)',
    color: tab===t ? '#fff' : '#A8A29E', transition:'all .15s',
  })

  return (
    <div style={{ marginTop:'6px' }}>
      <div style={{ display:'flex', gap:'4px', marginBottom:'12px', background:'rgba(28,25,23,0.04)', padding:'3px', borderRadius:'9px', width:'fit-content' }}>
        <button style={tabBtn('youtube','▶ YouTube')} onClick={()=>switchTab('youtube')}>▶ YouTube</button>
        <button style={tabBtn('file','📁 Fichier')} onClick={()=>switchTab('file')}>📁 Fichier</button>
        <button style={tabBtn('heygen','🤖 HeyGen')} onClick={()=>switchTab('heygen')}>🤖 HeyGen IA</button>
      </div>

      {tab === 'youtube' && (
        <div>
          <label style={S.lbl}>Lien YouTube (standard, Shorts, playlist)</label>
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <input style={{ ...S.inp, flex:1 }}
              placeholder="https://youtu.be/... ou youtube.com/watch?v=... ou /shorts/..."
              value={ytUrl}
              onChange={e=>applyYt(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') applyYt(ytUrl) }}
            />
            {ytThumb && (
              <div style={{ width:'72px', height:'40px', borderRadius:'6px', overflow:'hidden', flexShrink:0, border:'2px solid rgba(232,101,26,0.3)' }}>
                <img src={ytThumb} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            )}
          </div>
          {ytUrl && !getYouTubeEmbed(ytUrl) && <div style={{ marginTop:'5px', fontSize:'11px', color:'#F87171' }}>⚠️ URL non reconnue — vérifiez le lien</div>}
          {ytUrl && getYouTubeEmbed(ytUrl) && (
            <div style={{ marginTop:'5px', fontSize:'11px', color:'#10B981' }}>
              ✅ {parseYouTubePlaylist(ytUrl) ? 'Playlist' : 'Vidéo'} détectée · sous-titres CC activés
            </div>
          )}
          <div style={{ marginTop:'6px', display:'flex', gap:'5px', flexWrap:'wrap' }}>
            {[
              { label:'Standard', url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { label:'Shorts',   url:'https://youtube.com/shorts/dQw4w9WgXcQ' },
              { label:'Playlist', url:'https://youtube.com/playlist?list=PLxxxx' },
            ].map(ex=>(
              <span key={ex.label}
                style={{ fontSize:'10px', color:'#A8A29E', background:'rgba(28,25,23,0.04)', border:'1px solid rgba(28,25,23,0.08)', borderRadius:'4px', padding:'2px 7px', cursor:'pointer' }}
                onClick={()=>applyYt(ex.url)} title={ex.url}>{ex.label} ex.</span>
            ))}
          </div>
        </div>
      )}

      {tab === 'file' && (
        <div>
          <label style={S.lbl}>URL directe du fichier vidéo</label>
          <input style={S.inp} placeholder="https://…/video.mp4 (.mp4, .webm, .mov)"
            value={block.url||''} onChange={e=>onChange({...block, videoSource:'file', url:e.target.value})} />
          <div style={{ marginTop:'5px', fontSize:'11px', color:'#A8A29E' }}>CDN recommandé : Cloudinary, Vercel Blob, AWS S3</div>
        </div>
      )}

      {tab === 'heygen' && (
        <div style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'10px', padding:'12px' }}>
          <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px' }}>
            <span style={{ fontSize:'18px' }}>🤖</span>
            <div>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#C4B5FD' }}>Vidéo IA HeyGen</div>
              <div style={{ fontSize:'10px', color:'#7C6FA0' }}>Avatar animé + voix naturelle</div>
            </div>
          </div>
          <input style={{ ...S.inp, background:'rgba(124,58,237,0.08)' }}
            placeholder="URL HeyGen (captioned_video_url recommandée)"
            value={block.url||''} onChange={e=>onChange({...block, videoSource:'heygen', url:e.target.value})} />
          <div style={{ marginTop:'5px', fontSize:'10px', color:'#7C6FA0' }}>⚠️ URLs signées HeyGen expirent dans 7 jours. Téléchargez et hébergez sur CDN pour permanence.</div>
        </div>
      )}
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function CreerCours() {
  const router = useRouter()
  const [step, setStep]             = useState(0)
  const [info, setInfo]             = useState<Info>({ title:'', description:'', level:'débutant', category:'Tech', duration:'3h', audience:'' })
  const [modules, setModules]       = useState<Module[]>([])
  const [courseData, setCourseData] = useState<CourseData|null>(null)
  const [busy, setBusy]             = useState(false)
  const [aiError, setAiError]       = useState('')
  const [aiLog, setAiLog]           = useState('')
  const [open, setOpen]             = useState<string|null>(null)
  const [addBlk, setAddBlk]         = useState<string|null>(null)
  const [published, setPublished]   = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewModId, setPreviewModId] = useState<string|null>(null)

  // Drag & Drop refs
  const dragBlock     = useRef<{modId:string;blockId:string}|null>(null)
  const dragOverBlock = useRef<{modId:string;blockId:string}|null>(null)

  /* ── AI generation ── */
  const genAI = async () => {
    if (!info.title) return
    setBusy(true); setAiError(''); setAiLog('Génération de la structure pédagogique…')
    try {
      const res = await fetch('/api/generate-course', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title:info.title, level:info.level, duration:info.duration, audience:info.audience, category:info.category })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`)
      if (!data.modules) throw new Error('Structure invalide')
      setCourseData(data)
      const newModules: Module[] = data.modules.map((m: any) => {
        const blocks: Block[] = []
        if (m.introduction) blocks.push({ id:g(), type:'text',     title:'Introduction',       content:m.introduction, videoSource:'youtube' })
        blocks.push({                     id:g(), type:'text',     title:'Contenu du cours',   content:m.contenu||'', videoSource:'youtube' })
        if (m.activite)     blocks.push({ id:g(), type:'activity', title:m.activite.titre||'Activité pratique', content:JSON.stringify(m.activite), videoSource:'youtube' })
        if (m.quiz)         blocks.push({ id:g(), type:'quiz',     title:m.quiz.question||'Quiz', content:JSON.stringify(m.quiz), videoSource:'youtube' })
        return { id:g(), title:m.titre||'Module', objectif:m.objectif||'', duration:m.duree||'45min', intro:m.introduction||'', blocks, ressources:m.ressources||[] }
      })
      setModules(newModules); setAiLog(''); setStep(2)
    } catch (e: any) { setAiError(e.message||'Erreur IA'); setAiLog('') } finally { setBusy(false) }
  }

  /* ── Module helpers ── */
  const addModule = () => {
    const m: Module = { id:g(), title:'Nouveau module', objectif:'', duration:'45min', intro:'', blocks:[], ressources:[] }
    setModules(p=>[...p, m])
    setOpen(m.id)
  }
  const updModule = (id: string, patch: Partial<Module>) => setModules(p=>p.map(m=>m.id===id?{...m,...patch}:m))
  const delModule = (id: string) => setModules(p=>p.filter(m=>m.id!==id))

  /* ── Block helpers ── */
  const addBlock = (modId: string, type: string) => {
    const b: Block = { id:g(), type:type as Block['type'], title:blockTypes.find(bt=>bt.t===type)?.label||type, content:'', videoSource:'youtube' }
    setModules(p=>p.map(m=>m.id!==modId?m:{ ...m, blocks:[...m.blocks, b] }))
    setAddBlk(null)
  }
  const updBlock = (modId: string, blockId: string, patch: Partial<Block>) =>
    setModules(p=>p.map(m=>m.id!==modId?m:{ ...m, blocks:m.blocks.map(b=>b.id!==blockId?b:{...b,...patch}) }))
  const delBlock = (modId: string, blockId: string) =>
    setModules(p=>p.map(m=>m.id!==modId?m:{ ...m, blocks:m.blocks.filter(b=>b.id!==blockId) }))

  /* ── Drag & Drop ── */
  const onDragStart = (modId: string, blockId: string) => { dragBlock.current = {modId, blockId} }
  const onDragOver  = (e: React.DragEvent, modId: string, blockId: string) => {
    e.preventDefault(); dragOverBlock.current = {modId, blockId}
  }
  const onDrop = (modId: string) => {
    const from = dragBlock.current; const to = dragOverBlock.current
    if (!from || !to || from.blockId === to.blockId) { dragBlock.current=null; dragOverBlock.current=null; return }
    if (from.modId !== modId) { dragBlock.current=null; dragOverBlock.current=null; return }
    setModules(prev => prev.map(m => {
      if (m.id !== modId) return m
      const blocks = [...m.blocks]
      const fi = blocks.findIndex(b=>b.id===from.blockId)
      const ti = blocks.findIndex(b=>b.id===to.blockId)
      const [moved] = blocks.splice(fi,1); blocks.splice(ti,0,moved)
      return {...m, blocks}
    }))
    dragBlock.current=null; dragOverBlock.current=null
  }

  const previewMod = modules.find(m=>m.id===previewModId) || modules[0]

  /* ── Published screen ── */
  if (published) return (
    <div style={{ minHeight:'100vh', background:'#FAF9F7', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ ...S.card, padding:'3rem', textAlign:'center', maxWidth:'480px', width:'100%' }}>
        <div style={{ fontSize:'64px', marginBottom:'1rem' }}>🎉</div>
        <h2 style={{ fontSize:'24px', fontWeight:'900', color:'#1C1917', marginBottom:'8px' }}>Cours publié !</h2>
        <p style={{ color:'#A8A29E', marginBottom:'2rem' }}>{info.title} · {modules.length} modules · Niveau {info.level}</p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
          <button style={S.ghost} onClick={()=>{ setPublished(false);setStep(0);setModules([]);setInfo({title:'',description:'',level:'débutant',category:'Tech',duration:'3h',audience:''}) }}>+ Nouveau cours</button>
          <button style={S.btn} onClick={()=>router.push('/formateur')}>← Dashboard</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#FAF9F7' }}>

      {/* ── Sticky header ── */}
      <div style={{ background:'#FFFFFF', borderBottom:'1px solid rgba(28,25,23,0.07)', padding:'0 2.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <button style={S.ghost} onClick={()=>router.push('/formateur')}>← Retour</button>
          {/* Breadcrumb steps */}
          <div style={{ display:'flex', alignItems:'center', gap:'2px' }}>
            {['Infos','Structure','Contenu','Publier'].map((s,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center' }}>
                <button onClick={()=>{ if(i<=step||modules.length>0) setStep(i) }}
                  style={{ padding:'6px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700',
                    background: step===i?'linear-gradient(135deg,#E8651A,#D4A017)':'transparent',
                    color: step===i?'#fff':step>i?'#E8651A':'#A8A29E', transition:'all .15s' }}>
                  {step>i?'✓ ':''}{s}
                </button>
                {i<3&&<div style={{ width:'16px', height:'1px', background:'rgba(28,25,23,0.1)' }}/>}
              </div>
            ))}
          </div>
        </div>
        {step===2&&(
          <button style={{ ...S.ghost, fontSize:'12px', display:'flex', alignItems:'center', gap:'6px' }} onClick={()=>setShowPreview(p=>!p)}>
            <span>{showPreview?'◀':'▶'}</span> {showPreview?'Masquer':'Aperçu live'}
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ display:'flex', height:'calc(100vh - 60px)', overflow:'hidden' }}>

        {/* Main scroll area */}
        <div style={{ flex:1, overflowY:'auto', padding:'2rem 2.5rem' }}>

          {/* ── STEP 0 · Infos ── */}
          {step===0&&(
            <div style={{ maxWidth:'680px', margin:'0 auto' }}>
              <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ fontSize:'26px', fontWeight:'900', color:'#1C1917', margin:'0 0 6px' }}>Créer un cours</h1>
                <p style={{ color:'#A8A29E', fontSize:'14px', margin:0 }}>Renseignez les informations clés — l&apos;IA génère la structure pédagogique.</p>
              </div>
              <div style={{ ...S.card, padding:'2rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={S.lbl}>Titre du cours *</label>
                  <input style={S.inp} value={info.title} onChange={e=>setInfo({...info,title:e.target.value})}
                    placeholder="Ex: Maîtriser l'art de la vente consultative" />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={S.lbl}>Description courte</label>
                  <textarea style={{ ...S.inp, minHeight:'80px', resize:'vertical' }} value={info.description}
                    onChange={e=>setInfo({...info,description:e.target.value})} placeholder="Ce que les apprenants vont acquérir…" />
                </div>
                <div>
                  <label style={S.lbl}>Niveau</label>
                  <select style={S.inp} value={info.level} onChange={e=>setInfo({...info,level:e.target.value})}>
                    {['débutant','intermédiaire','avancé','expert'].map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Catégorie</label>
                  <select style={S.inp} value={info.category} onChange={e=>setInfo({...info,category:e.target.value})}>
                    {['Tech','Vente','Management','RH','Marketing','Finance','Design','Autre'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Durée estimée</label>
                  <select style={S.inp} value={info.duration} onChange={e=>setInfo({...info,duration:e.target.value})}>
                    {['30min','1h','2h','3h','5h','8h','10h+'].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Public cible</label>
                  <input style={S.inp} value={info.audience} onChange={e=>setInfo({...info,audience:e.target.value})}
                    placeholder="Ex: Commerciaux débutants" />
                </div>
              </div>
              <div style={{ marginTop:'1.5rem', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                <button style={S.ghost} onClick={()=>{ setModules([]); setStep(2) }}>Structurer manuellement →</button>
                <button style={{ ...S.btn, opacity:!info.title||busy?0.5:1 }}
                  onClick={()=>{ setStep(1); setTimeout(genAI, 200) }} disabled={!info.title||busy}>
                  ✨ Générer avec l&apos;IA →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1 · Génération IA ── */}
          {step===1&&(
            <div style={{ maxWidth:'480px', margin:'4rem auto', textAlign:'center' }}>
              <div style={{ ...S.card, padding:'3rem' }}>
                {busy&&<div style={{ fontSize:'48px', marginBottom:'1rem', display:'inline-block', animation:'spin 1.2s linear infinite' }}>⚙️</div>}
                {!busy&&!aiError&&<div style={{ fontSize:'48px', marginBottom:'1rem' }}>✅</div>}
                {aiError&&<div style={{ fontSize:'48px', marginBottom:'1rem' }}>❌</div>}
                <div style={{ fontSize:'15px', fontWeight:'700', color:'#1C1917', marginBottom:'8px' }}>{aiLog||aiError||'Structure générée avec succès !'}</div>
                {aiError&&<button style={{ ...S.btn, marginTop:'1rem' }} onClick={()=>setStep(0)}>← Retour</button>}
              </div>
            </div>
          )}

          {/* ── STEP 2 · Éditeur ── */}
          {step===2&&(
            <div style={{ maxWidth:'760px', margin:'0 auto' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                <div>
                  <h2 style={{ fontSize:'20px', fontWeight:'900', color:'#1C1917', margin:'0 0 3px' }}>{info.title||'Nouveau cours'}</h2>
                  <p style={{ color:'#A8A29E', fontSize:'12px', margin:0 }}>
                    {modules.length} module{modules.length!==1?'s':''} · {modules.reduce((a,m)=>a+m.blocks.length,0)} blocs
                    {modules.some(m=>m.blocks.some(b=>b.type==='video'&&b.videoSource==='youtube'&&b.youtubeUrl)) ? ' · ▶ vidéos YouTube' : ''}
                  </p>
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button style={S.ghost} onClick={addModule}>+ Module</button>
                  <button style={S.btn} onClick={()=>setStep(3)}>Publier →</button>
                </div>
              </div>

              {modules.map((mod, mi) => (
                <div key={mod.id} style={{ ...S.card, marginBottom:'1.5rem', overflow:'hidden' }}>

                  {/* Module header */}
                  <div style={{ padding:'1rem 1.25rem', background:'linear-gradient(135deg,rgba(232,101,26,0.06),rgba(212,160,23,0.04))', borderBottom:'1px solid rgba(28,25,23,0.06)', display:'flex', alignItems:'center', gap:'10px' }}>
                    <span style={{ fontSize:'11px', fontWeight:'900', color:'#E8651A', background:'rgba(232,101,26,0.1)', padding:'2px 8px', borderRadius:'6px', flexShrink:0 }}>M{mi+1}</span>
                    <input style={{ ...S.inp, flex:1, background:'transparent', border:'none', padding:'4px 0', fontWeight:'700', fontSize:'15px', width:'auto' }}
                      value={mod.title} onChange={e=>updModule(mod.id,{title:e.target.value})} />
                    <button style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', color:'#F87171', borderRadius:'8px', padding:'4px 10px', cursor:'pointer', fontSize:'12px', flexShrink:0 }}
                      onClick={()=>delModule(mod.id)}>×</button>
                    <button style={{ background:open===mod.id?'rgba(232,101,26,0.1)':'rgba(28,25,23,0.04)', border:'1px solid rgba(28,25,23,0.09)', borderRadius:'8px', padding:'4px 10px', cursor:'pointer', fontSize:'12px', color:'#78716C', flexShrink:0 }}
                      onClick={()=>setOpen(p=>p===mod.id?null:mod.id)}>{open===mod.id?'▲':'▼'}</button>
                  </div>

                  {open===mod.id&&(
                    <div style={{ padding:'1.25rem' }}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'1.25rem' }}>
                        <div><label style={S.lbl}>Objectif pédagogique</label><input style={S.inp} value={mod.objectif} onChange={e=>updModule(mod.id,{objectif:e.target.value})} placeholder="L'apprenant saura…" /></div>
                        <div><label style={S.lbl}>Durée</label><input style={S.inp} value={mod.duration} onChange={e=>updModule(mod.id,{duration:e.target.value})} placeholder="45min" /></div>
                      </div>

                      {/* Blocks with DnD */}
                      <div onDragOver={e=>e.preventDefault()} onDrop={()=>onDrop(mod.id)}>
                        {mod.blocks.length===0&&<div style={{ textAlign:'center', color:'#D4CBC4', fontSize:'13px', padding:'1.5rem 0', borderRadius:'8px', border:'1px dashed rgba(28,25,23,0.1)' }}>Ajoutez votre premier bloc ↓</div>}
                        {mod.blocks.map((blk) => {
                          const bt = blockTypes.find(b=>b.t===blk.type)
                          return (
                            <div key={blk.id}
                              draggable
                              onDragStart={()=>onDragStart(mod.id, blk.id)}
                              onDragOver={e=>onDragOver(e, mod.id, blk.id)}
                              style={{ background:'#FAFAF8', border:'1px solid rgba(28,25,23,0.08)', borderRadius:'12px', marginBottom:'10px', overflow:'hidden', cursor:'grab', transition:'box-shadow .15s, transform .1s' }}
                              onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 4px 16px rgba(232,101,26,0.1)' }}
                              onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none' }}
                            >
                              {/* Block bar */}
                              <div style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:'8px', borderBottom:'1px solid rgba(28,25,23,0.05)', background:'rgba(255,255,255,0.6)' }}>
                                <span style={{ color:'#C4B5A4', fontSize:'14px', userSelect:'none', cursor:'grab' }} title="Glisser pour réordonner">⠿</span>
                                <span style={{ fontSize:'14px' }}>{bt?.icon}</span>
                                <input style={{ ...S.inp, background:'transparent', border:'none', padding:'2px 0', fontWeight:'600', fontSize:'13px', flex:1, width:'auto', minWidth:0 }}
                                  value={blk.title} onChange={e=>updBlock(mod.id,blk.id,{title:e.target.value})} />
                                <span style={{ fontSize:'10px', color:bt?.color, background:`${bt?.color}15`, border:`1px solid ${bt?.color}30`, padding:'2px 7px', borderRadius:'4px', fontWeight:'700', flexShrink:0 }}>{blk.type.toUpperCase()}</span>
                                <button style={{ background:'none', border:'none', color:'#D4CBC4', cursor:'pointer', fontSize:'18px', padding:'0 2px', lineHeight:1, flexShrink:0 }}
                                  onClick={()=>delBlock(mod.id,blk.id)} title="Supprimer">×</button>
                              </div>

                              {/* Block content editor */}
                              <div style={{ padding:'12px' }}>
                                {blk.type==='text'&&(
                                  <textarea style={{ ...S.inp, minHeight:'72px', resize:'vertical' }} placeholder="Rédigez votre contenu…"
                                    value={blk.content} onChange={e=>updBlock(mod.id,blk.id,{content:e.target.value})} />
                                )}
                                {blk.type==='video'&&(
                                  <VideoEditor block={blk} onChange={b=>setModules(p=>p.map(m=>m.id!==mod.id?m:{...m,blocks:m.blocks.map(bk=>bk.id!==blk.id?bk:b)}))} />
                                )}
                                {blk.type==='quiz'&&(()=>{
                                  let q:any={question:'',options:['','','',''],reponse:''}
                                  try{q=JSON.parse(blk.content)}catch{}
                                  const save=(upd:any)=>updBlock(mod.id,blk.id,{content:JSON.stringify(upd)})
                                  return (<div>
                                    <input style={{ ...S.inp, marginBottom:'8px' }} placeholder="Posez votre question…" value={q.question} onChange={e=>save({...q,question:e.target.value})} />
                                    {(q.options||['','','','']).map((opt:string,oi:number)=>(
                                      <div key={oi} style={{ display:'flex', gap:'6px', marginBottom:'5px', alignItems:'center' }}>
                                        <button style={{ width:'26px', height:'26px', borderRadius:'50%', border:`2px solid ${opt&&opt===q.reponse?'#10B981':'rgba(28,25,23,0.15)'}`, background:opt&&opt===q.reponse?'#10B981':'transparent', color:opt&&opt===q.reponse?'#fff':'#A8A29E', cursor:'pointer', fontSize:'11px', flexShrink:0 }}
                                          onClick={()=>save({...q,reponse:opt})}>✓</button>
                                        <input style={S.inp} placeholder={`Option ${oi+1}`} value={opt}
                                          onChange={e=>{const opts=[...q.options];opts[oi]=e.target.value;save({...q,options:opts})}} />
                                      </div>
                                    ))}
                                    <div style={{ fontSize:'10px', color:'#A8A29E', marginTop:'4px' }}>Cliquez ✓ pour désigner la bonne réponse</div>
                                  </div>)
                                })()}
                                {blk.type==='activity'&&(()=>{
                                  let a:any={titre:'',description:'',duree:'10min'}
                                  try{a=JSON.parse(blk.content)}catch{}
                                  const save=(upd:any)=>updBlock(mod.id,blk.id,{content:JSON.stringify(upd)})
                                  return (<div style={{ display:'grid', gap:'8px' }}>
                                    <input style={S.inp} placeholder="Titre de l'activité" value={a.titre} onChange={e=>save({...a,titre:e.target.value})} />
                                    <textarea style={{ ...S.inp, minHeight:'60px', resize:'vertical' }} placeholder="Consigne / description" value={a.description} onChange={e=>save({...a,description:e.target.value})} />
                                    <input style={S.inp} placeholder="Durée estimée (ex: 15min)" value={a.duree} onChange={e=>save({...a,duree:e.target.value})} />
                                  </div>)
                                })()}
                                {(blk.type==='pdf'||blk.type==='html'||blk.type==='h5p')&&(
                                  <input style={S.inp} placeholder={`URL du fichier ${blk.type.toUpperCase()}`}
                                    value={blk.url||''} onChange={e=>updBlock(mod.id,blk.id,{url:e.target.value})} />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Add block palette */}
                      {addBlk===mod.id?(
                        <div style={{ marginTop:'8px' }}>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
                            {blockTypes.map(bt=>(
                              <button key={bt.t} onClick={()=>addBlock(mod.id,bt.t)}
                                style={{ background:`${bt.color}12`, border:`1px solid ${bt.color}30`, color:bt.color, borderRadius:'8px', padding:'6px 12px', cursor:'pointer', fontSize:'12px', fontWeight:'700', display:'flex', alignItems:'center', gap:'5px', transition:'all .15s' }}
                                onMouseEnter={e=>(e.currentTarget.style.background=`${bt.color}22`)}
                                onMouseLeave={e=>(e.currentTarget.style.background=`${bt.color}12`)}>
                                {bt.icon} {bt.label}
                              </button>
                            ))}
                          </div>
                          <button style={S.ghost} onClick={()=>setAddBlk(null)}>Annuler</button>
                        </div>
                      ):(
                        <button style={{ ...S.ghost, width:'100%', textAlign:'center', border:'1px dashed rgba(232,101,26,0.3)', color:'#E8651A', background:'rgba(232,101,26,0.04)', marginTop:'6px' }}
                          onClick={()=>{ setAddBlk(mod.id); setOpen(mod.id) }}>+ Ajouter un bloc</button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {modules.length===0&&(
                <div style={{ ...S.card, padding:'3rem', textAlign:'center' }}>
                  <div style={{ fontSize:'40px', marginBottom:'12px' }}>📦</div>
                  <div style={{ color:'#A8A29E', marginBottom:'1.5rem' }}>Aucun module pour l&apos;instant.</div>
                  <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
                    <button style={S.ghost} onClick={()=>setStep(0)}>← Retour</button>
                    <button style={S.btn} onClick={addModule}>+ Créer un module</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3 · Publier ── */}
          {step===3&&(
            <div style={{ maxWidth:'560px', margin:'0 auto' }}>
              <div style={{ ...S.card, padding:'2.5rem', textAlign:'center' }}>
                <div style={{ fontSize:'48px', marginBottom:'1rem' }}>🚀</div>
                <h2 style={{ fontSize:'22px', fontWeight:'800', marginBottom:'8px', color:'#1C1917' }}>Prêt à publier !</h2>
                <p style={{ color:'#A8A29E', marginBottom:'4px', fontSize:'16px', fontWeight:'600' }}>{info.title}</p>
                <p style={{ color:'#57534E', fontSize:'13px', marginBottom:'2rem' }}>
                  {modules.length} modules · {modules.reduce((a,m)=>a+m.blocks.length,0)} blocs ·&nbsp;
                  {modules.reduce((a,m)=>a+m.blocks.filter(b=>b.type==='video'&&b.videoSource==='youtube'&&!!b.youtubeUrl).length,0)} vidéos YouTube ·&nbsp;
                  Niveau {info.level} · {info.duration}
                </p>
                {courseData?.evaluation_finale&&(
                  <div style={{ background:'rgba(240,180,41,0.08)', border:'1px solid rgba(240,180,41,0.2)', borderRadius:'12px', padding:'12px', marginBottom:'1.5rem', textAlign:'left' }}>
                    <div style={{ fontSize:'12px', color:'#FFB300', fontWeight:'700', marginBottom:'4px' }}>📝 ÉVALUATION FINALE · {(courseData.evaluation_finale.type||'').toUpperCase()}</div>
                    <div style={{ fontSize:'13px', color:'#A8A29E' }}>{courseData.evaluation_finale.description}</div>
                  </div>
                )}
                <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
                  <button onClick={()=>setStep(2)} style={S.ghost}>← Modifier</button>
                  <button onClick={()=>setPublished(true)} style={{ ...S.btn, background:'rgba(240,180,41,0.15)', color:'#FFB300', border:'1px solid rgba(240,180,41,0.3)' }}>💾 Brouillon</button>
                  <button onClick={()=>setPublished(true)} style={S.btn}>✅ Publier le cours</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── LIVE PREVIEW PANEL ── */}
        {showPreview&&step===2&&(
          <div style={{ width:'390px', borderLeft:'1px solid rgba(28,25,23,0.09)', background:'#0f1117', overflowY:'auto', flexShrink:0, display:'flex', flexDirection:'column' }}>
            {/* Panel header */}
            <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#555', letterSpacing:'.5px' }}>APERÇU LIVE</div>
              {modules.length>0&&(
                <div style={{ display:'flex', gap:'3px', flexWrap:'wrap' }}>
                  {modules.map((m,i)=>(
                    <button key={m.id} onClick={()=>setPreviewModId(m.id)}
                      style={{ padding:'3px 8px', borderRadius:'5px', border:'none', cursor:'pointer', fontSize:'10px', fontWeight:'700',
                        background: (previewModId?m.id===previewModId:i===0)?'rgba(232,101,26,0.8)':'rgba(255,255,255,0.06)',
                        color: (previewModId?m.id===previewModId:i===0)?'#fff':'#555', transition:'all .15s' }}>M{i+1}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Panel body */}
            <div style={{ padding:'14px', flex:1, overflowY:'auto' }}>
              {previewMod ? (
                <>
                  <div style={{ marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:'13px', fontWeight:'800', color:'#E8651A', marginBottom:'3px' }}>{previewMod.title}</div>
                    {previewMod.objectif&&<div style={{ fontSize:'11px', color:'#555' }}>🎯 {previewMod.objectif}</div>}
                    <div style={{ fontSize:'10px', color:'#444', marginTop:'2px' }}>{previewMod.blocks.length} bloc{previewMod.blocks.length!==1?'s':''} · {previewMod.duration}</div>
                  </div>
                  {previewMod.blocks.length===0&&(
                    <div style={{ textAlign:'center', color:'#333', fontSize:'12px', padding:'2rem 0' }}>Ce module est vide</div>
                  )}
                  {previewMod.blocks.map(b=><BlockPreview key={b.id} block={b} />)}
                </>
              ):(
                <div style={{ textAlign:'center', color:'#333', fontSize:'12px', padding:'3rem 0' }}>
                  Créez des modules pour voir l&apos;aperçu ici
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box }
        textarea, input, select { font-family: inherit }
        ::-webkit-scrollbar { width: 5px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: rgba(28,25,23,0.12); border-radius: 4px }
      `}</style>
    </div>
  )
}

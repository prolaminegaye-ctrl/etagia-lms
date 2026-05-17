'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Block = { id: string; type: 'text'|'video'|'pdf'|'quiz'|'html'|'h5p'|'activity'; content: string; title: string; url?: string }
type Module = { id: string; title: string; objectif: string; duration: string; intro: string; blocks: Block[]; ressources: string[] }
type Info = { title: string; description: string; level: string; category: string; duration: string; audience: string }
type CourseData = { introduction?: string; objectifs_generaux?: string[]; prerequis?: string[]; modules: any[]; evaluation_finale?: any; conclusion?: string }

const g = () => Math.random().toString(36).slice(2, 8)
const S = {
  card: { background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '1px solid rgba(123,92,245,0.12)', borderRadius: '16px' } as React.CSSProperties,
  inp: { background: 'rgba(123,92,245,0.06)', color: '#F0EEFF', border: '1px solid rgba(123,92,245,0.2)', borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px', fontFamily: 'inherit', outline: 'none' } as React.CSSProperties,
  btn: { background: 'linear-gradient(135deg,#7B5CF5,#E040A0)', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer' } as React.CSSProperties,
  lbl: { fontSize: '11px', color: '#8B7BAE', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '0.7px' },
}
const blockTypes = [
  { t:'text',icon:'📝',label:'Contenu'},{ t:'activity',icon:'🎯',label:'Activité'},
  { t:'video',icon:'🎬',label:'Vidéo'},{ t:'pdf',icon:'📄',label:'PDF'},
  { t:'quiz',icon:'❓',label:'Quiz'},{ t:'html',icon:'💻',label:'HTML'},{ t:'h5p',icon:'🎮',label:'H5P'},
]

export default function CreerCours() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState<Info>({ title:'', description:'', level:'débutant', category:'Tech', duration:'3h', audience:'' })
  const [modules, setModules] = useState<Module[]>([])
  const [courseData, setCourseData] = useState<CourseData|null>(null)
  const [busy, setBusy] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiLog, setAiLog] = useState('')
  const [open, setOpen] = useState<string|null>(null)
  const [addBlk, setAddBlk] = useState<string|null>(null)
  const [published, setPublished] = useState(false)
  const refs = useRef<Record<string,HTMLInputElement|null>>({})

  const genAI = async () => {
    if (!info.title) return
    setBusy(true); setAiError(''); setAiLog('Génération de la structure pédagogique...')
    try {
      const res = await fetch('/api/generate-course', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ title:info.title, level:info.level, duration:info.duration, audience:info.audience, category:info.category })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`)
      if (!data.modules) throw new Error('Structure invalide')

      setCourseData(data)
      const newModules: Module[] = data.modules.map((m: any) => {
        const blocks: Block[] = []
        if (m.introduction) blocks.push({ id:g(), type:'text', title:'Introduction', content:m.introduction })
        blocks.push({ id:g(), type:'text', title:'Contenu du cours', content:m.contenu||'' })
        if (m.activite) blocks.push({ id:g(), type:'activity', title:m.activite.titre||'Activité pratique', content:JSON.stringify(m.activite) })
        if (m.quiz) blocks.push({ id:g(), type:'quiz', title:m.quiz.question||'Quiz', content:JSON.stringify(m.quiz) })
        return { id:g(), title:m.titre||'Module', objectif:m.objectif||'', duration:m.duree||'45min', intro:m.introduction||'', blocks, ressources:m.ressources||[] }
      })
      setModules(newModules)
      setAiLog(''); setStep(2)
    } catch (e: any) { setAiError(e.message||'Erreur IA'); setAiLog('') }
    setBusy(false)
  }

  const addMod = () => {
    const m: Module = { id:g(), title:`Module ${modules.length+1}`, objectif:'', duration:'45min', intro:'', blocks:[], ressources:[] }
    setModules(p=>[...p,m]); setOpen(m.id); if(step<2) setStep(2)
  }
  const updMod = (id:string,k:string,v:string) => setModules(p=>p.map(m=>m.id===id?{...m,[k]:v}:m))
  const delMod = (id:string) => setModules(p=>p.filter(m=>m.id!==id))
  const addBlkFn = (mid:string,type:string) => {
    const b:Block={id:g(),type:type as Block['type'],title:blockTypes.find(x=>x.t===type)!.label,content:''}
    setModules(p=>p.map(m=>m.id===mid?{...m,blocks:[...m.blocks,b]}:m)); setAddBlk(null)
  }
  const updBlk = (mid:string,bid:string,k:string,v:any) => setModules(p=>p.map(m=>m.id===mid?{...m,blocks:m.blocks.map(b=>b.id===bid?{...b,[k]:v}:b)}:m))
  const delBlk = (mid:string,bid:string) => setModules(p=>p.map(m=>m.id===mid?{...m,blocks:m.blocks.filter(b=>b.id!==bid)}:m))
  const upFile = (mid:string,bid:string,file:File) => { updBlk(mid,bid,'url',URL.createObjectURL(file)); updBlk(mid,bid,'title',file.name) }

  if (published) return (
    <div style={{textAlign:'center',padding:'4rem 2rem'}}>
      <div style={{fontSize:'64px',marginBottom:'1.5rem'}}>🎉</div>
      <h1 style={{fontSize:'28px',fontWeight:'800',marginBottom:'8px',background:'linear-gradient(135deg,#A78BF8,#E040A0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Cours publié avec succès !</h1>
      <p style={{color:'#8B7BAE',marginBottom:'2rem'}}>"{info.title}" · {modules.length} modules · Visible pour vos apprenants</p>
      <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
        <button style={S.btn} onClick={()=>router.push('/formateur/cours')}>Voir mes cours →</button>
        <button style={{...S.btn,background:'linear-gradient(135deg,#E040A0,#F0B429)'}} onClick={()=>{setPublished(false);setStep(0);setModules([]);setCourseData(null);setInfo({title:'',description:'',level:'débutant',category:'Tech',duration:'3h',audience:''})}}>+ Nouveau cours</button>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:'1.5rem',padding:'1.25rem 1.5rem',...S.card,background:'linear-gradient(135deg,rgba(123,92,245,0.1),rgba(224,64,160,0.05))',border:'1px solid rgba(123,92,245,0.2)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1 style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#F0EEFF,#A78BF8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>✦ Créer un cours</h1>
            <p style={{color:'#8B7BAE',fontSize:'12px',marginTop:'2px'}}>Structure pédagogique complète · Activités · Évaluations · Export</p>
          </div>
          <div style={{display:'flex',gap:'6px'}}>
            {['Infos','Méthode','Modules & Activités','Publier'].map((s,i)=>(
              <div key={i} onClick={()=>i<step&&setStep(i)} style={{padding:'5px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',background:step===i?'linear-gradient(135deg,#7B5CF5,#E040A0)':'rgba(123,92,245,0.08)',color:step===i?'#fff':'#4A3D6A',cursor:i<step?'pointer':'default'}}>{i+1}. {s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 0 */}
      {step===0&&(
        <div style={{...S.card,padding:'2rem'}}>
          <h2 style={{fontSize:'17px',fontWeight:'700',marginBottom:'1.5rem',color:'#F0EEFF'}}>📋 Informations du cours</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.lbl}>Titre *</label><input style={S.inp} value={info.title} onChange={e=>setInfo({...info,title:e.target.value})} placeholder="Ex: Maîtriser la Data Science avec Python" /></div>
            <div><label style={S.lbl}>Catégorie</label>
              <select style={S.inp} value={info.category} onChange={e=>setInfo({...info,category:e.target.value})}>
                {['Tech','Business','Soft Skills','Entrepreneuriat','Finance','Marketing','Management','RH'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={S.lbl}>Niveau</label>
              <select style={S.inp} value={info.level} onChange={e=>setInfo({...info,level:e.target.value})}>
                {['débutant','intermédiaire','avancé','tous niveaux'].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div><label style={S.lbl}>Durée estimée</label><input style={S.inp} value={info.duration} onChange={e=>setInfo({...info,duration:e.target.value})} placeholder="ex: 6h, 3 jours" /></div>
            <div><label style={S.lbl}>Public cible</label><input style={S.inp} value={info.audience} onChange={e=>setInfo({...info,audience:e.target.value})} placeholder="ex: Managers, entrepreneurs africains..." /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.lbl}>Description</label><textarea style={{...S.inp,resize:'vertical'}} rows={3} value={info.description} onChange={e=>setInfo({...info,description:e.target.value})} placeholder="Ce que les apprenants vont apprendre et accomplir..." /></div>
          </div>
          <button style={{...S.btn,opacity:!info.title?0.5:1}} disabled={!info.title} onClick={()=>setStep(1)}>Suivant →</button>
        </div>
      )}

      {/* STEP 1 */}
      {step===1&&(
        <div>
          <h2 style={{fontSize:'17px',fontWeight:'700',marginBottom:'1.5rem',color:'#F0EEFF'}}>🚀 Méthode de création</h2>
          {aiError&&(
            <div style={{background:'rgba(240,90,90,0.08)',border:'1px solid rgba(240,90,90,0.25)',borderRadius:'12px',padding:'1rem',marginBottom:'1rem'}}>
              <div style={{fontWeight:'700',color:'#F08080',marginBottom:'4px'}}>⚠️ {aiError}</div>
              <div style={{fontSize:'12px',color:'#8B7BAE'}}>Vérifiez <strong style={{color:'#A78BF8'}}>ANTHROPIC_API_KEY</strong> dans <a href="https://vercel.com/lamine-s-projects1/etagia-lms/settings/environment-variables" target="_blank" style={{color:'#A78BF8'}}>Vercel Settings</a></div>
            </div>
          )}
          {aiLog&&<div style={{background:'rgba(123,92,245,0.08)',border:'1px solid rgba(123,92,245,0.2)',borderRadius:'12px',padding:'1rem',marginBottom:'1rem',display:'flex',gap:'10px',alignItems:'center'}}>
            <div style={{width:'18px',height:'18px',borderRadius:'50%',border:'2px solid #7B5CF5',borderTopColor:'transparent',animation:'spin 1s linear infinite',flexShrink:0}} />
            <span style={{fontSize:'13px',color:'#A78BF8'}}>{aiLog}</span>
          </div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
            <button onClick={genAI} disabled={busy} style={{...S.card,padding:'2rem',cursor:busy?'not-allowed':'pointer',border:'1px solid rgba(123,92,245,0.35)',background:'linear-gradient(145deg,rgba(123,92,245,0.1),rgba(224,64,160,0.05))',textAlign:'left',opacity:busy?0.8:1}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>✦</div>
              <div style={{fontSize:'17px',fontWeight:'800',color:'#A78BF8',marginBottom:'8px'}}>{busy?'Génération...':'IA Ingénieur Pédagogique'}</div>
              <p style={{fontSize:'13px',color:'#8B7BAE',lineHeight:'1.7',marginBottom:'10px'}}>Structure complète générée : objectifs SMART, contenus, <strong style={{color:'#A78BF8'}}>activités engageantes</strong> (études de cas, mises en situation), quiz formatifs, évaluation sommative.</p>
              <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px'}}>
                {['Taxonomie Bloom','Apprentissage actif','Évaluation formative','Exemples africains'].map(t=>(
                  <span key={t} style={{fontSize:'10px',background:'rgba(123,92,245,0.15)',color:'#A78BF8',padding:'2px 8px',borderRadius:'20px',fontWeight:'600'}}>{t}</span>
                ))}
              </div>
              <div style={{fontSize:'13px',fontWeight:'700',background:'linear-gradient(135deg,#A78BF8,#E040A0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>⚡ Recommandé — 30 secondes →</div>
            </button>
            <button onClick={addMod} disabled={busy} style={{...S.card,padding:'2rem',cursor:'pointer',border:'1px solid rgba(224,64,160,0.3)',background:'linear-gradient(145deg,rgba(224,64,160,0.06),rgba(123,92,245,0.03))',textAlign:'left'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>🏗️</div>
              <div style={{fontSize:'17px',fontWeight:'800',color:'#E040A0',marginBottom:'8px'}}>Créer manuellement</div>
              <p style={{fontSize:'13px',color:'#8B7BAE',lineHeight:'1.7',marginBottom:'12px'}}>Construisez chaque module. Ajoutez textes, vidéos, PDFs, <strong style={{color:'#E040A0'}}>activités pratiques</strong>, quiz, HTML interactif et H5P.</p>
              <div style={{fontSize:'13px',fontWeight:'700',color:'#E040A0'}}>🎨 Contrôle total →</div>
            </button>
          </div>
          <button onClick={()=>setStep(0)} style={{marginTop:'1rem',background:'none',border:'none',color:'#8B7BAE',fontSize:'13px',cursor:'pointer'}}>← Retour</button>
        </div>
      )}

      {/* STEP 2 */}
      {step===2&&(
        <div>
          {/* Course overview */}
          {courseData&&(
            <div style={{...S.card,padding:'1.5rem',marginBottom:'1.5rem',background:'linear-gradient(135deg,rgba(123,92,245,0.08),rgba(224,64,160,0.04))',border:'1px solid rgba(123,92,245,0.2)'}}>
              {courseData.introduction&&<p style={{color:'#8B7BAE',fontSize:'13px',fontStyle:'italic',marginBottom:'1rem'}}>{courseData.introduction}</p>}
              {courseData.objectifs_generaux&&(
                <div style={{marginBottom:'1rem'}}>
                  <div style={{fontSize:'11px',color:'#4A3D6A',fontWeight:'700',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>Objectifs généraux</div>
                  {courseData.objectifs_generaux.map((o,i)=>(
                    <div key={i} style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'4px'}}>
                      <span style={{color:'#22D4A8',fontWeight:'700',fontSize:'12px',flexShrink:0}}>✓</span>
                      <span style={{fontSize:'13px',color:'#8B7BAE'}}>{o}</span>
                    </div>
                  ))}
                </div>
              )}
              {courseData.evaluation_finale&&(
                <div style={{background:'rgba(240,180,41,0.08)',border:'1px solid rgba(240,180,41,0.2)',borderRadius:'10px',padding:'12px'}}>
                  <div style={{fontSize:'11px',color:'#F0B429',fontWeight:'700',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>Évaluation finale · {courseData.evaluation_finale.type}</div>
                  <div style={{fontSize:'13px',color:'#8B7BAE'}}>{courseData.evaluation_finale.description}</div>
                </div>
              )}
            </div>
          )}

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <div>
              <h2 style={{fontSize:'17px',fontWeight:'700',color:'#F0EEFF'}}>{info.title}</h2>
              <p style={{color:'#8B7BAE',fontSize:'12px',marginTop:'2px'}}>{modules.length} module(s) · {modules.reduce((a,m)=>a+m.blocks.length,0)} blocs</p>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={addMod} style={{background:'rgba(123,92,245,0.1)',border:'1px solid rgba(123,92,245,0.2)',borderRadius:'10px',padding:'8px 14px',color:'#A78BF8',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>+ Module</button>
              <button onClick={()=>setStep(3)} disabled={modules.length===0} style={{...S.btn,opacity:modules.length===0?0.5:1}}>Publier →</button>
            </div>
          </div>

          {modules.map((mod,mi)=>(
            <div key={mod.id} style={{...S.card,marginBottom:'0.75rem',overflow:'hidden'}}>
              <div style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'12px',cursor:'pointer',background:open===mod.id?'rgba(123,92,245,0.06)':'transparent',borderBottom:open===mod.id?'1px solid rgba(123,92,245,0.1)':'none'}} onClick={()=>setOpen(open===mod.id?null:mod.id)}>
                <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#7B5CF5,#E040A0)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#fff',fontSize:'12px',flexShrink:0}}>{mi+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:'600',fontSize:'14px',color:'#F0EEFF'}}>{mod.title}</div>
                  <div style={{fontSize:'11px',color:'#8B7BAE'}}>{mod.objectif&&<span style={{color:'#22D4A8'}}>🎯 {mod.objectif.slice(0,60)}... · </span>}{mod.blocks.length} blocs · {mod.duration}</div>
                </div>
                <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                  {mod.blocks.map(b=>b.type).filter((v,i,a)=>a.indexOf(v)===i).map(t=>(
                    <span key={t} style={{fontSize:'14px'}}>{blockTypes.find(x=>x.t===t)?.icon}</span>
                  ))}
                  <span style={{color:'#4A3D6A',fontSize:'11px',marginLeft:'4px'}}>{open===mod.id?'▲':'▼'}</span>
                  <button onClick={e=>{e.stopPropagation();delMod(mod.id)}} style={{background:'rgba(240,90,90,0.1)',border:'none',borderRadius:'6px',padding:'4px 8px',color:'#F05A5A',fontSize:'11px',cursor:'pointer'}}>✕</button>
                </div>
              </div>

              {open===mod.id&&(
                <div style={{padding:'1.25rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem',marginBottom:'1.25rem'}}>
                    <div><label style={S.lbl}>Titre</label><input style={S.inp} value={mod.title} onChange={e=>updMod(mod.id,'title',e.target.value)} /></div>
                    <div><label style={S.lbl}>Objectif pédagogique</label><input style={S.inp} value={mod.objectif} onChange={e=>updMod(mod.id,'objectif',e.target.value)} placeholder="Verbe d'action + compétence" /></div>
                    <div><label style={S.lbl}>Durée</label><input style={S.inp} value={mod.duration} onChange={e=>updMod(mod.id,'duration',e.target.value)} /></div>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:'0.75rem'}}>
                    {mod.blocks.map(blk=>(
                      <div key={blk.id} style={{background:'#F4F2FF',border:'1px solid rgba(123,92,245,0.1)',borderRadius:'10px',padding:'0.875rem'}}>
                        <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'8px'}}>
                          <span>{blockTypes.find(x=>x.t===blk.type)?.icon}</span>
                          <span style={{fontSize:'10px',color:'#A78BF8',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.5px'}}>{blk.type}</span>
                          <input style={{...S.inp,flex:1,padding:'5px 10px',fontSize:'12px'}} value={blk.title} onChange={e=>updBlk(mod.id,blk.id,'title',e.target.value)} placeholder="Titre" />
                          <button onClick={()=>delBlk(mod.id,blk.id)} style={{background:'rgba(240,90,90,0.1)',border:'none',borderRadius:'5px',padding:'4px 7px',color:'#F05A5A',fontSize:'11px',cursor:'pointer',flexShrink:0}}>✕</button>
                        </div>
                        {['text','html'].includes(blk.type)&&<textarea style={{...S.inp,resize:'vertical',minHeight:'70px',fontFamily:blk.type==='html'?'monospace':'inherit',fontSize:blk.type==='html'?'12px':'14px',color:blk.type==='html'?'#A8D8A8':'#F0EEFF'}} value={blk.content} onChange={e=>updBlk(mod.id,blk.id,'content',e.target.value)} placeholder={blk.type==='html'?'<div>HTML interactif...</div>':'Contenu pédagogique...'} />}
                        {blk.type==='activity'&&(()=>{
                          let a:any={}; try{a=blk.content?JSON.parse(blk.content):{}}catch{}
                          return <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                            <div style={{fontSize:'11px',color:'#22D4A8',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.5px',padding:'4px 0'}}>🎯 Activité d'apprentissage — {a.type?.replace('_',' ')}</div>
                            <input style={S.inp} value={a.description||''} onChange={e=>updBlk(mod.id,blk.id,'content',JSON.stringify({...a,description:e.target.value}))} placeholder="Description de l'activité pratique" />
                            <textarea style={{...S.inp,resize:'vertical',minHeight:'60px'}} value={a.consigne||''} onChange={e=>updBlk(mod.id,blk.id,'content',JSON.stringify({...a,consigne:e.target.value}))} placeholder="Consigne détaillée pour l'apprenant" />
                          </div>
                        })()}
                        {blk.type==='quiz'&&(()=>{
                          let q:any={}; try{q=blk.content?JSON.parse(blk.content):{}}catch{}
                          return <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                            <input style={S.inp} value={q.question||''} onChange={e=>updBlk(mod.id,blk.id,'content',JSON.stringify({...q,question:e.target.value}))} placeholder="Question de vérification" />
                            {[0,1,2,3].map(i=><div key={i} style={{display:'flex',gap:'6px',alignItems:'center'}}>
                              <input type="radio" checked={q.bonne===i} onChange={()=>updBlk(mod.id,blk.id,'content',JSON.stringify({...q,bonne:i}))} />
                              <input style={{...S.inp,border:q.bonne===i?'1px solid rgba(34,212,168,0.5)':undefined}} value={(q.reponses||[])[i]||''} onChange={e=>{const r=[...(q.reponses||['','','',''])];r[i]=e.target.value;updBlk(mod.id,blk.id,'content',JSON.stringify({...q,reponses:r}))}} placeholder={`Réponse ${String.fromCharCode(65+i)}`} />
                            </div>)}
                            <input style={S.inp} value={q.explication||''} onChange={e=>updBlk(mod.id,blk.id,'content',JSON.stringify({...q,explication:e.target.value}))} placeholder="Explication pédagogique" />
                          </div>
                        })()}
                        {['video','pdf','h5p'].includes(blk.type)&&(
                          <div>
                            <input ref={el=>{refs.current[blk.id]=el}} type="file" style={{display:'none'}} accept={blk.type==='video'?'.mp4,.mov,.webm':blk.type==='pdf'?'.pdf':'.h5p,.zip'} onChange={e=>{if(e.target.files?.[0])upFile(mod.id,blk.id,e.target.files[0])}} />
                            {blk.url?(
                              <div style={{background:'rgba(34,212,168,0.06)',border:'1px solid rgba(34,212,168,0.2)',borderRadius:'10px',padding:'10px',display:'flex',gap:'8px',alignItems:'center'}}>
                                <span style={{color:'#22D4A8',fontWeight:'600',fontSize:'12px',flex:1}}>✓ {blk.title}</span>
                                {blk.type==='pdf'&&<a href={blk.url} target="_blank" rel="noreferrer" style={{color:'#A78BF8',fontSize:'12px',fontWeight:'600'}}>👁 Voir</a>}
                                {blk.type==='video'&&<video src={blk.url} controls style={{width:'100%',maxHeight:'160px',borderRadius:'8px',marginTop:'8px'}} />}
                                <button onClick={()=>refs.current[blk.id]?.click()} style={{background:'rgba(123,92,245,0.1)',border:'none',borderRadius:'6px',padding:'4px 10px',color:'#A78BF8',fontSize:'11px',cursor:'pointer'}}>Remplacer</button>
                              </div>
                            ):(
                              <button onClick={()=>refs.current[blk.id]?.click()} style={{width:'100%',background:'rgba(123,92,245,0.04)',border:'2px dashed rgba(123,92,245,0.2)',borderRadius:'10px',padding:'14px',color:'#A78BF8',fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>
                                ☁️ Uploader {blk.type==='video'?'une vidéo':blk.type==='pdf'?'un PDF':'un fichier H5P'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {addBlk===mod.id?(
                    <div style={{background:'#F4F2FF',borderRadius:'10px',padding:'1rem'}}>
                      <div style={{fontSize:'10px',color:'#8B7BAE',marginBottom:'8px',fontWeight:'700',letterSpacing:'1px'}}>AJOUTER UN BLOC</div>
                      <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                        {blockTypes.map(b=><button key={b.t} onClick={()=>addBlkFn(mod.id,b.t)} style={{background:'rgba(123,92,245,0.08)',border:'1px solid rgba(123,92,245,0.15)',borderRadius:'8px',padding:'7px 12px',color:'#F0EEFF',fontSize:'12px',cursor:'pointer'}}>{b.icon} {b.label}</button>)}
                        <button onClick={()=>setAddBlk(null)} style={{background:'none',border:'1px solid rgba(107,78,255,0.10)',borderRadius:'8px',padding:'7px 12px',color:'#4A3D6A',fontSize:'12px',cursor:'pointer'}}>Annuler</button>
                      </div>
                    </div>
                  ):(
                    <button onClick={()=>setAddBlk(mod.id)} style={{width:'100%',background:'rgba(123,92,245,0.06)',border:'1px dashed rgba(123,92,245,0.2)',borderRadius:'10px',padding:'10px',color:'#A78BF8',fontWeight:'600',fontSize:'12px',cursor:'pointer'}}>
                      + Ajouter un bloc (texte · activité · vidéo · PDF · quiz · HTML · H5P)
                    </button>
                  )}

                  {/* Resources */}
                  {mod.ressources.length>0&&(
                    <div style={{marginTop:'1rem',padding:'10px 14px',background:'rgba(240,180,41,0.06)',border:'1px solid rgba(240,180,41,0.15)',borderRadius:'10px'}}>
                      <div style={{fontSize:'11px',color:'#F0B429',fontWeight:'700',marginBottom:'6px'}}>📚 RESSOURCES COMPLÉMENTAIRES</div>
                      {mod.ressources.map((r,i)=><div key={i} style={{fontSize:'12px',color:'#8B7BAE',marginBottom:'3px'}}>• {r}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {modules.length===0&&<div style={{...S.card,padding:'3rem',textAlign:'center'}}><div style={{fontSize:'40px',marginBottom:'12px'}}>📦</div><div style={{color:'#8B7BAE'}}>Aucun module. Ajoutez-en un ou utilisez l&apos;IA.</div></div>}
        </div>
      )}

      {/* STEP 3 */}
      {step===3&&(
        <div style={{...S.card,padding:'2.5rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>🚀</div>
          <h2 style={{fontSize:'22px',fontWeight:'800',marginBottom:'8px',color:'#F0EEFF'}}>Prêt à publier !</h2>
          <p style={{color:'#8B7BAE',marginBottom:'0.5rem',fontSize:'16px',fontWeight:'600'}}>{info.title}</p>
          <p style={{color:'#4A3D6A',fontSize:'13px',marginBottom:'2rem'}}>{modules.length} modules · {modules.reduce((a,m)=>a+m.blocks.length,0)} blocs · Niveau {info.level} · {info.duration}</p>
          {courseData?.evaluation_finale&&(
            <div style={{background:'rgba(240,180,41,0.08)',border:'1px solid rgba(240,180,41,0.2)',borderRadius:'12px',padding:'12px',marginBottom:'1.5rem',textAlign:'left'}}>
              <div style={{fontSize:'12px',color:'#F0B429',fontWeight:'700',marginBottom:'4px'}}>📝 ÉVALUATION FINALE · {courseData.evaluation_finale.type?.toUpperCase()}</div>
              <div style={{fontSize:'13px',color:'#8B7BAE'}}>{courseData.evaluation_finale.description}</div>
            </div>
          )}
          <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={()=>setStep(2)} style={{background:'#F4F2FF',border:'1px solid rgba(107,78,255,0.10)',borderRadius:'10px',padding:'10px 18px',color:'#8B7BAE',fontSize:'13px',cursor:'pointer'}}>← Retour</button>
            <button onClick={()=>setPublished(true)} style={{...S.btn,background:'rgba(240,180,41,0.15)',color:'#F0B429',border:'1px solid rgba(240,180,41,0.3)'}}>💾 Brouillon</button>
            <button onClick={()=>setPublished(true)} style={S.btn}>✅ Publier le cours</button>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

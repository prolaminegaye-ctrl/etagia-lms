'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Block = { id: string; type: 'text'|'video'|'pdf'|'quiz'|'html'|'h5p'; content: string; title: string; url?: string }
type Module = { id: string; title: string; objectif: string; duration: string; blocks: Block[] }
type Info = { title: string; description: string; level: string; category: string; duration: string; audience: string }

const g = () => Math.random().toString(36).slice(2, 8)

const S = {
  card: { background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '1px solid rgba(123,92,245,0.12)', borderRadius: '16px' } as React.CSSProperties,
  inp: { background: 'rgba(123,92,245,0.06)', color: '#F0EEFF', border: '1px solid rgba(123,92,245,0.2)', borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px', fontFamily: 'inherit', outline: 'none' } as React.CSSProperties,
  btn: { background: 'linear-gradient(135deg,#7B5CF5,#E040A0)', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer' } as React.CSSProperties,
  lbl: { fontSize: '11px', color: '#8B7BAE', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '0.7px' },
}

const blockTypes = [
  { t:'text', icon:'📝', label:'Texte' }, { t:'video', icon:'🎬', label:'Vidéo' },
  { t:'pdf', icon:'📄', label:'PDF' }, { t:'quiz', icon:'❓', label:'Quiz' },
  { t:'html', icon:'💻', label:'HTML' }, { t:'h5p', icon:'🎮', label:'H5P' },
]

export default function CreerCours() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState<Info>({ title:'', description:'', level:'débutant', category:'Tech', duration:'3h', audience:'' })
  const [modules, setModules] = useState<Module[]>([])
  const [busy, setBusy] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiLog, setAiLog] = useState('')
  const [open, setOpen] = useState<string|null>(null)
  const [addBlk, setAddBlk] = useState<string|null>(null)
  const [done, setDone] = useState(false)
  const refs = useRef<Record<string, HTMLInputElement|null>>({})

  const genAI = async () => {
    if (!info.title) return
    setBusy(true); setAiError(''); setAiLog('Connexion à l\'IA...')
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Crée la structure pédagogique pour: "${info.title}"\nNiveau: ${info.level} | Durée: ${info.duration} | Public: ${info.audience||'général'} | Catégorie: ${info.category}\n\nRéponds UNIQUEMENT en JSON valide, sans markdown ni backticks:\n{"modules":[{"titre":"...","objectif":"...","duree":"30min","contenu":"...paragraphe pédagogique min 3 phrases...","quiz":{"question":"...","reponses":["A...","B...","C...","D..."],"bonne":0,"explication":"..."}}]}`
          }]
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(err.error || `Erreur HTTP ${res.status}`)
      }

      setAiLog('Génération en cours...')
      let txt = ''
      const rdr = res.body!.getReader()
      const dec = new TextDecoder()

      while (true) {
        const { done: d, value } = await rdr.read()
        if (d) break
        const chunk = dec.decode(value)
        for (const ln of chunk.split('\n')) {
          if (!ln.startsWith('data: ')) continue
          const x = ln.slice(6).trim()
          if (x === '[DONE]') break
          try {
            const delta = JSON.parse(x)?.delta?.text || ''
            if (delta) { txt += delta; setAiLog(`Génération... ${txt.length} caractères`) }
          } catch { /* skip */ }
        }
      }

      setAiLog('Traitement de la réponse...')
      // Extract JSON from response
      const jsonMatch = txt.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error(`Réponse IA invalide. Reçu: ${txt.slice(0,200)}`)
      
      const parsed = JSON.parse(jsonMatch[0])
      if (!parsed.modules || !Array.isArray(parsed.modules)) throw new Error('Structure JSON invalide')

      const newModules: Module[] = parsed.modules.map((m: any) => ({
        id: g(), title: m.titre || 'Module', objectif: m.objectif || '', duration: m.duree || '30min',
        blocks: [
          { id: g(), type: 'text' as const, title: 'Contenu du cours', content: m.contenu || '' },
          m.quiz ? { id: g(), type: 'quiz' as const, title: m.quiz.question || 'Quiz', content: JSON.stringify(m.quiz) } : null
        ].filter(Boolean) as Block[]
      }))

      setModules(newModules)
      setAiLog('')
      setStep(2)
    } catch (e: any) {
      setAiError(e.message || 'Erreur inconnue')
      setAiLog('')
    }
    setBusy(false)
  }

  const addMod = () => {
    const m: Module = { id: g(), title: `Module ${modules.length+1}`, objectif: '', duration: '30min', blocks: [] }
    setModules(p => [...p, m]); setOpen(m.id); if (step < 2) setStep(2)
  }
  const updMod = (id: string, k: string, v: string) => setModules(p => p.map(m => m.id===id ? {...m,[k]:v} : m))
  const delMod = (id: string) => setModules(p => p.filter(m => m.id!==id))
  const addBlkFn = (mid: string, type: string) => {
    const b: Block = { id: g(), type: type as Block['type'], title: blockTypes.find(x=>x.t===type)!.label, content: '' }
    setModules(p => p.map(m => m.id===mid ? {...m, blocks:[...m.blocks,b]} : m)); setAddBlk(null)
  }
  const updBlk = (mid: string, bid: string, k: string, v: any) =>
    setModules(p => p.map(m => m.id===mid ? {...m, blocks: m.blocks.map(b => b.id===bid ? {...b,[k]:v} : b)} : m))
  const delBlk = (mid: string, bid: string) =>
    setModules(p => p.map(m => m.id===mid ? {...m, blocks:m.blocks.filter(b=>b.id!==bid)} : m))
  const upFile = (mid: string, bid: string, file: File) => {
    updBlk(mid, bid, 'url', URL.createObjectURL(file))
    updBlk(mid, bid, 'title', file.name)
  }

  if (done) return (
    <div style={{textAlign:'center',padding:'4rem 2rem'}}>
      <div style={{fontSize:'64px',marginBottom:'1.5rem'}}>🎉</div>
      <h1 style={{fontSize:'28px',fontWeight:'800',marginBottom:'8px',background:'linear-gradient(135deg,#A78BF8,#E040A0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Cours publié !</h1>
      <p style={{color:'#8B7BAE',marginBottom:'2rem'}}>"{info.title}" · {modules.length} modules</p>
      <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
        <button style={S.btn} onClick={()=>router.push('/formateur')}>← Dashboard</button>
        <button style={{...S.btn,background:'linear-gradient(135deg,#E040A0,#F0B429)'}} onClick={()=>{setDone(false);setStep(0);setModules([]);setInfo({title:'',description:'',level:'débutant',category:'Tech',duration:'3h',audience:''})}}>+ Nouveau cours</button>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:'1.5rem',padding:'1.25rem 1.5rem',...S.card,background:'linear-gradient(135deg,rgba(123,92,245,0.12),rgba(224,64,160,0.06))',border:'1px solid rgba(123,92,245,0.25)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1 style={{fontSize:'22px',fontWeight:'800',background:'linear-gradient(135deg,#F0EEFF,#A78BF8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>✦ Créer un cours</h1>
            <p style={{color:'#8B7BAE',fontSize:'12px',marginTop:'2px'}}>Formateur / Admin · IA + upload vidéo, PDF, H5P, SCORM</p>
          </div>
          <div style={{display:'flex',gap:'6px'}}>
            {['Infos','Méthode','Modules','Publier'].map((s,i)=>(
              <div key={i} onClick={()=>i<step&&setStep(i)} style={{padding:'5px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',background:step===i?'linear-gradient(135deg,#7B5CF5,#E040A0)':'rgba(123,92,245,0.08)',color:step===i?'#fff':'#4A3D6A',cursor:i<step?'pointer':'default'}}>{i+1}. {s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 0 - Info */}
      {step===0&&(
        <div style={{...S.card,padding:'2rem'}}>
          <h2 style={{fontSize:'17px',fontWeight:'700',marginBottom:'1.5rem',color:'#F0EEFF'}}>📋 Informations du cours</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.lbl}>Titre *</label><input style={S.inp} value={info.title} onChange={e=>setInfo({...info,title:e.target.value})} placeholder="Ex: Data Science pour débutants" /></div>
            <div><label style={S.lbl}>Catégorie</label>
              <select style={S.inp} value={info.category} onChange={e=>setInfo({...info,category:e.target.value})}>
                {['Tech','Business','Soft Skills','Entrepreneuriat','Finance','Marketing'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={S.lbl}>Niveau</label>
              <select style={S.inp} value={info.level} onChange={e=>setInfo({...info,level:e.target.value})}>
                {['débutant','intermédiaire','avancé'].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div><label style={S.lbl}>Durée</label><input style={S.inp} value={info.duration} onChange={e=>setInfo({...info,duration:e.target.value})} placeholder="ex: 4h" /></div>
            <div><label style={S.lbl}>Public cible</label><input style={S.inp} value={info.audience} onChange={e=>setInfo({...info,audience:e.target.value})} placeholder="ex: Entrepreneurs africains" /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.lbl}>Description</label><textarea style={{...S.inp,resize:'vertical'}} rows={3} value={info.description} onChange={e=>setInfo({...info,description:e.target.value})} placeholder="Ce que les apprenants vont apprendre..." /></div>
          </div>
          <button style={{...S.btn,opacity:!info.title?0.5:1}} disabled={!info.title} onClick={()=>setStep(1)}>Suivant →</button>
        </div>
      )}

      {/* STEP 1 - Method */}
      {step===1&&(
        <div>
          <h2 style={{fontSize:'17px',fontWeight:'700',marginBottom:'1.5rem',color:'#F0EEFF'}}>🚀 Méthode de création</h2>
          
          {/* AI Error display */}
          {aiError&&(
            <div style={{background:'rgba(240,90,90,0.08)',border:'1px solid rgba(240,90,90,0.25)',borderRadius:'12px',padding:'1rem',marginBottom:'1rem'}}>
              <div style={{fontWeight:'700',color:'#F08080',marginBottom:'4px'}}>⚠️ Erreur IA</div>
              <div style={{fontSize:'13px',color:'#F08080',marginBottom:'8px'}}>{aiError}</div>
              <div style={{fontSize:'12px',color:'#8B7BAE'}}>
                Vérifiez que <strong style={{color:'#A78BF8'}}>ANTHROPIC_API_KEY</strong> est bien configurée dans{' '}
                <a href="https://vercel.com/lamine-s-projects1/etagia-lms/settings/environment-variables" target="_blank" style={{color:'#A78BF8',fontWeight:'600'}}>Vercel → Settings → Env Vars</a>
                {' '}puis Redeploy.
              </div>
            </div>
          )}

          {aiLog&&(
            <div style={{background:'rgba(123,92,245,0.08)',border:'1px solid rgba(123,92,245,0.2)',borderRadius:'12px',padding:'1rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'50%',border:'2px solid #7B5CF5',borderTopColor:'transparent',animation:'spin 1s linear infinite',flexShrink:0}} />
              <span style={{fontSize:'13px',color:'#A78BF8'}}>{aiLog}</span>
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
            <button onClick={genAI} disabled={busy} style={{...S.card,padding:'2rem',cursor:busy?'not-allowed':'pointer',border:'1px solid rgba(123,92,245,0.3)',background:'linear-gradient(145deg,rgba(123,92,245,0.1),rgba(224,64,160,0.05))',textAlign:'left',transition:'all .2s',opacity:busy?0.8:1}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>✦</div>
              <div style={{fontSize:'17px',fontWeight:'800',color:'#A78BF8',marginBottom:'8px'}}>{busy?'Génération...':'Générer avec l\'IA'}</div>
              <p style={{fontSize:'13px',color:'#8B7BAE',lineHeight:'1.7'}}>L&apos;IA crée automatiquement tous vos modules, objectifs, contenus pédagogiques et quiz en 30 secondes.</p>
              <div style={{marginTop:'14px',fontSize:'13px',fontWeight:'700',background:'linear-gradient(135deg,#A78BF8,#E040A0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>⚡ Recommandé →</div>
            </button>
            <button onClick={addMod} disabled={busy} style={{...S.card,padding:'2rem',cursor:'pointer',border:'1px solid rgba(224,64,160,0.25)',background:'linear-gradient(145deg,rgba(224,64,160,0.06),rgba(123,92,245,0.03))',textAlign:'left',transition:'all .2s'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>🏗️</div>
              <div style={{fontSize:'17px',fontWeight:'800',color:'#E040A0',marginBottom:'8px'}}>Créer manuellement</div>
              <p style={{fontSize:'13px',color:'#8B7BAE',lineHeight:'1.7'}}>Construisez module par module. Ajoutez textes, vidéos, PDFs, quiz, HTML et H5P selon votre pédagogie.</p>
              <div style={{marginTop:'14px',fontSize:'13px',fontWeight:'700',color:'#E040A0'}}>🎨 Contrôle total →</div>
            </button>
          </div>
          <button onClick={()=>setStep(0)} style={{marginTop:'1rem',background:'none',border:'none',color:'#8B7BAE',fontSize:'13px',cursor:'pointer'}}>← Retour</button>
        </div>
      )}

      {/* STEP 2 - Modules */}
      {step===2&&(
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
            <div>
              <h2 style={{fontSize:'17px',fontWeight:'700',color:'#F0EEFF'}}>📚 {info.title}</h2>
              <p style={{color:'#8B7BAE',fontSize:'12px',marginTop:'2px'}}>{modules.length} module(s)</p>
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
                  <div style={{fontSize:'11px',color:'#8B7BAE'}}>{mod.blocks.length} bloc(s) · {mod.duration}</div>
                </div>
                <span style={{color:'#4A3D6A',fontSize:'11px'}}>{open===mod.id?'▲':'▼'}</span>
                <button onClick={e=>{e.stopPropagation();delMod(mod.id)}} style={{background:'rgba(240,90,90,0.1)',border:'none',borderRadius:'6px',padding:'4px 8px',color:'#F05A5A',fontSize:'11px',cursor:'pointer'}}>✕</button>
              </div>

              {open===mod.id&&(
                <div style={{padding:'1.25rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem',marginBottom:'1.25rem'}}>
                    <div><label style={S.lbl}>Titre</label><input style={S.inp} value={mod.title} onChange={e=>updMod(mod.id,'title',e.target.value)} /></div>
                    <div><label style={S.lbl}>Objectif</label><input style={S.inp} value={mod.objectif} onChange={e=>updMod(mod.id,'objectif',e.target.value)} placeholder="Ce que l'apprenant saura faire" /></div>
                    <div><label style={S.lbl}>Durée</label><input style={S.inp} value={mod.duration} onChange={e=>updMod(mod.id,'duration',e.target.value)} /></div>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:'0.75rem'}}>
                    {mod.blocks.map(blk=>(
                      <div key={blk.id} style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(123,92,245,0.1)',borderRadius:'10px',padding:'0.875rem'}}>
                        <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'8px'}}>
                          <span>{blockTypes.find(x=>x.t===blk.type)?.icon}</span>
                          <span style={{fontSize:'10px',color:'#A78BF8',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.5px'}}>{blk.type}</span>
                          <input style={{...S.inp,flex:1,padding:'5px 10px',fontSize:'12px'}} value={blk.title} onChange={e=>updBlk(mod.id,blk.id,'title',e.target.value)} placeholder="Titre" />
                          <button onClick={()=>delBlk(mod.id,blk.id)} style={{background:'rgba(240,90,90,0.1)',border:'none',borderRadius:'5px',padding:'4px 7px',color:'#F05A5A',fontSize:'11px',cursor:'pointer',flexShrink:0}}>✕</button>
                        </div>

                        {blk.type==='text'&&<textarea style={{...S.inp,resize:'vertical',minHeight:'70px'}} value={blk.content} onChange={e=>updBlk(mod.id,blk.id,'content',e.target.value)} placeholder="Contenu pédagogique..." />}
                        {blk.type==='html'&&<textarea style={{...S.inp,resize:'vertical',fontFamily:'monospace',fontSize:'12px',color:'#A8D8A8',minHeight:'70px'}} value={blk.content} onChange={e=>updBlk(mod.id,blk.id,'content',e.target.value)} placeholder="<div>HTML interactif...</div>" />}
                        {blk.type==='quiz'&&(()=>{
                          let q: any={}; try{q=blk.content?JSON.parse(blk.content):{}}catch{}
                          return <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                            <input style={S.inp} value={q.question||''} onChange={e=>updBlk(mod.id,blk.id,'content',JSON.stringify({...q,question:e.target.value}))} placeholder="Question" />
                            {[0,1,2,3].map(i=><div key={i} style={{display:'flex',gap:'6px',alignItems:'center'}}>
                              <input type="radio" checked={q.bonne===i} onChange={()=>updBlk(mod.id,blk.id,'content',JSON.stringify({...q,bonne:i}))} />
                              <input style={{...S.inp,border:q.bonne===i?'1px solid rgba(34,212,168,0.5)':undefined}} value={(q.reponses||[])[i]||''} onChange={e=>{const r=[...(q.reponses||['','','',''])];r[i]=e.target.value;updBlk(mod.id,blk.id,'content',JSON.stringify({...q,reponses:r}))}} placeholder={`Réponse ${String.fromCharCode(65+i)}`} />
                            </div>)}
                            <input style={S.inp} value={q.explication||''} onChange={e=>updBlk(mod.id,blk.id,'content',JSON.stringify({...q,explication:e.target.value}))} placeholder="Explication de la bonne réponse" />
                          </div>
                        })()}
                        {['video','pdf','h5p'].includes(blk.type)&&(
                          <div>
                            <input ref={el=>{refs.current[blk.id]=el}} type="file" style={{display:'none'}} accept={blk.type==='video'?'.mp4,.mov,.webm,.avi':blk.type==='pdf'?'.pdf':'.h5p,.zip'} onChange={e=>{if(e.target.files?.[0])upFile(mod.id,blk.id,e.target.files[0])}} />
                            {blk.url?(
                              <div style={{background:'rgba(34,212,168,0.06)',border:'1px solid rgba(34,212,168,0.2)',borderRadius:'10px',padding:'10px'}}>
                                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:blk.type==='video'?'8px':'0'}}>
                                  <span style={{color:'#22D4A8',fontWeight:'600',fontSize:'12px'}}>✓ {blk.title}</span>
                                  {blk.type==='pdf'&&<a href={blk.url} target="_blank" rel="noreferrer" style={{color:'#A78BF8',fontSize:'12px',fontWeight:'600'}}>👁 Voir PDF</a>}
                                  <button onClick={()=>refs.current[blk.id]?.click()} style={{marginLeft:'auto',background:'rgba(123,92,245,0.1)',border:'1px solid rgba(123,92,245,0.2)',borderRadius:'6px',padding:'4px 10px',color:'#A78BF8',fontSize:'11px',cursor:'pointer'}}>Remplacer</button>
                                </div>
                                {blk.type==='video'&&<video src={blk.url} controls style={{width:'100%',maxHeight:'180px',borderRadius:'8px',marginTop:'4px'}} />}
                              </div>
                            ):(
                              <button onClick={()=>refs.current[blk.id]?.click()} style={{width:'100%',background:'rgba(123,92,245,0.04)',border:'2px dashed rgba(123,92,245,0.2)',borderRadius:'10px',padding:'16px',color:'#A78BF8',fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>
                                ☁️ Uploader {blk.type==='video'?'une vidéo (.mp4/.mov)':blk.type==='pdf'?'un PDF':' un fichier H5P (.h5p)'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {addBlk===mod.id?(
                    <div style={{background:'rgba(0,0,0,0.3)',borderRadius:'10px',padding:'1rem'}}>
                      <div style={{fontSize:'10px',color:'#8B7BAE',marginBottom:'8px',fontWeight:'700',letterSpacing:'1px'}}>CHOISIR UN TYPE DE BLOC</div>
                      <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                        {blockTypes.map(b=><button key={b.t} onClick={()=>addBlkFn(mod.id,b.t)} style={{background:'rgba(123,92,245,0.08)',border:'1px solid rgba(123,92,245,0.15)',borderRadius:'8px',padding:'7px 12px',color:'#F0EEFF',fontSize:'12px',cursor:'pointer'}}>{b.icon} {b.label}</button>)}
                        <button onClick={()=>setAddBlk(null)} style={{background:'none',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',padding:'7px 12px',color:'#4A3D6A',fontSize:'12px',cursor:'pointer'}}>Annuler</button>
                      </div>
                    </div>
                  ):(
                    <button onClick={()=>setAddBlk(mod.id)} style={{width:'100%',background:'rgba(123,92,245,0.06)',border:'1px dashed rgba(123,92,245,0.2)',borderRadius:'10px',padding:'10px',color:'#A78BF8',fontWeight:'600',fontSize:'12px',cursor:'pointer'}}>+ Ajouter un bloc (texte · vidéo · PDF · quiz · HTML · H5P)</button>
                  )}
                </div>
              )}
            </div>
          ))}
          {modules.length===0&&<div style={{...S.card,padding:'3rem',textAlign:'center'}}><div style={{fontSize:'40px',marginBottom:'12px'}}>📦</div><div style={{color:'#8B7BAE'}}>Aucun module. Ajoutez-en un ou utilisez l&apos;IA ci-dessus.</div></div>}
        </div>
      )}

      {/* STEP 3 - Publish */}
      {step===3&&(
        <div style={{...S.card,padding:'2.5rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>🚀</div>
          <h2 style={{fontSize:'22px',fontWeight:'800',marginBottom:'8px',color:'#F0EEFF'}}>Prêt à publier !</h2>
          <p style={{color:'#8B7BAE',marginBottom:'2rem'}}><strong style={{color:'#F0EEFF'}}>{info.title}</strong> · {modules.length} modules · Niveau {info.level}</p>
          <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={()=>setStep(2)} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'10px 18px',color:'#8B7BAE',fontSize:'13px',cursor:'pointer'}}>← Retour</button>
            <button onClick={()=>setDone(true)} style={{...S.btn,background:'rgba(240,180,41,0.15)',color:'#F0B429',border:'1px solid rgba(240,180,41,0.3)'}}>💾 Brouillon</button>
            <button onClick={()=>setDone(true)} style={S.btn}>✅ Publier</button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

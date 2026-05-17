'use client'
import { useState } from 'react'

type Org = { id: string; name: string; slug: string; country: string; users: number; courses: number; plan: string; status: string; email: string; created: string }

const planColors: Record<string,string> = { Enterprise: '#F0B429', Pro: '#5B8DEF', Starter: '#22D4A8' }

const defaultOrgs: Org[] = [
  { id:'1', name:'SJT Formation', slug:'sjt', country:'🇸🇳', users:87, courses:12, plan:'Pro', status:'Actif', email:'admin@sjt.sn', created:'12 jan 2026' },
  { id:'2', name:'ETAGIA', slug:'etagia', country:'🌍', users:34, courses:28, plan:'Enterprise', status:'Actif', email:'admin@etagia.com', created:'1 jan 2026' },
  { id:'3', name:'CampusForma', slug:'campusforma', country:'🇨🇮', users:52, courses:8, plan:'Starter', status:'Actif', email:'admin@campusforma.ci', created:'5 mar 2026' },
  { id:'4', name:'AfricaTech Hub', slug:'africatech', country:'🇬🇭', users:23, courses:5, plan:'Pro', status:'Suspendu', email:'admin@africatech.gh', created:'20 avr 2026' },
]

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<Org[]>(defaultOrgs)
  const [modal, setModal] = useState<string|null>(null)
  const [sel, setSel] = useState<Org|null>(null)
  const [form, setForm] = useState<Partial<Org>>({})
  const [search, setSearch] = useState('')

  const inp: React.CSSProperties = { background:'#F4F2FF', color:'#1A1550', border:'1px solid rgba(107,78,255,0.15)', borderRadius:'10px', padding:'9px 12px', width:'100%', fontSize:'14px', fontFamily:'inherit', outline:'none' }
  const lbl: React.CSSProperties = { fontSize:'11px', color:'#9B8EC0', display:'block', marginBottom:'5px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.7px' }
  const btnPrimary: React.CSSProperties = { background:'linear-gradient(135deg,#5B8DEF,#22D4A8)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer' }
  const btnCancel: React.CSSProperties = { background:'#F4F2FF', border:'1px solid rgba(107,78,255,0.15)', borderRadius:'10px', padding:'10px 18px', color:'#9B8EC0', fontSize:'14px', cursor:'pointer' }

  const openCreate = () => { setForm({ id: Date.now().toString(), name:'', slug:'', country:'🇸🇳', plan:'Starter', status:'Actif', email:'', users:0, courses:0, created: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}) }); setModal('form') }
  const openEdit = (o: Org) => { setSel(o); setForm({...o}); setModal('form') }
  const openSettings = (o: Org) => { setSel(o); setForm({...o}); setModal('settings') }
  const openDelete = (o: Org) => { setSel(o); setModal('delete') }

  const save = () => {
    if (!form.id) return
    if (sel) setOrgs(p => p.map(o => o.id===form.id ? {...o,...form} as Org : o))
    else setOrgs(p => [...p, form as Org])
    setSel(null); setModal(null)
  }

  const confirmDelete = () => { setOrgs(p => p.filter(o => o.id!==sel?.id)); setSel(null); setModal(null) }
  const toggle = (id: string) => setOrgs(p => p.map(o => o.id===id ? {...o, status: o.status==='Actif'?'Suspendu':'Actif'} : o))

  const filtered = orgs.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,rgba(240,180,41,0.1),rgba(91,141,239,0.05))',border:'1px solid rgba(240,180,41,0.2)',borderRadius:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1A1550'}}>Organisations</h1>
          <p style={{color:'#9B8EC0',fontSize:'13px',marginTop:'3px'}}>{orgs.length} organisations · {orgs.filter(o=>o.status==='Actif').length} actives · {orgs.reduce((a,o)=>a+o.users,0)} utilisateurs</p>
        </div>
        <button onClick={openCreate} style={btnPrimary}>+ Nouvelle organisation</button>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..." style={{...inp,marginBottom:'1.5rem',padding:'12px 16px',fontSize:'14px'}} />

      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1rem'}}>
        {filtered.map(org=>(
          <div key={org.id} style={{background:'#FFFFFF',border:'1px solid rgba(107,78,255,0.10)',borderRadius:'18px',padding:'1.5rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:`linear-gradient(135deg,${planColors[org.plan]||'#5B8DEF'},${planColors[org.plan]||'#5B8DEF'}66)`}} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem',marginTop:'4px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{fontSize:'32px'}}>{org.country}</div>
                <div>
                  <div style={{fontWeight:'700',fontSize:'16px',color:'#1A1550'}}>{org.name}</div>
                  <div style={{fontSize:'11px',color:'#9B8EC0'}}>/{org.slug} · {org.email}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:'5px',flexDirection:'column',alignItems:'flex-end'}}>
                <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',background:(planColors[org.plan]||'#5B8DEF')+'22',color:planColors[org.plan]||'#5B8DEF'}}>{org.plan}</span>
                <span style={{fontSize:'11px',fontWeight:'600',padding:'3px 10px',borderRadius:'20px',background:org.status==='Actif'?'rgba(34,212,168,0.15)':'rgba(240,90,90,0.1)',color:org.status==='Actif'?'#22D4A8':'#F05A5A'}}>{org.status}</span>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.6rem',marginBottom:'1.25rem'}}>
              {[{l:'Utilisateurs',v:org.users,c:'#5B8DEF'},{l:'Cours',v:org.courses,c:'#22D4A8'},{l:'Créée',v:org.created,c:'#F0B429',s:true}].map(s=>(
                <div key={s.l} style={{background:'#F4F2FF',borderRadius:'10px',padding:'10px',textAlign:'center'}}>
                  <div style={{fontSize:s.s?'11px':'22px',fontWeight:'700',color:s.c,fontFamily:s.s?'inherit':'Syne,sans-serif',marginBottom:'3px'}}>{s.v}</div>
                  <div style={{fontSize:'10px',color:'#9B8EC0',textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              <button onClick={()=>openEdit(org)} style={{flex:1,background:'rgba(91,141,239,0.1)',border:'1px solid rgba(91,141,239,0.2)',borderRadius:'8px',padding:'8px',color:'#5B8DEF',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>✏️ Modifier</button>
              <button onClick={()=>openSettings(org)} style={{flex:1,background:'rgba(240,180,41,0.08)',border:'1px solid rgba(240,180,41,0.2)',borderRadius:'8px',padding:'8px',color:'#F0B429',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>⚙️ Paramètres</button>
              <button onClick={()=>toggle(org.id)} style={{flex:1,background:org.status==='Actif'?'rgba(240,90,90,0.08)':'rgba(34,212,168,0.08)',border:`1px solid ${org.status==='Actif'?'rgba(240,90,90,0.2)':'rgba(34,212,168,0.2)'}`,borderRadius:'8px',padding:'8px',color:org.status==='Actif'?'#F05A5A':'#22D4A8',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>{org.status==='Actif'?'⏸ Suspendre':'▶ Activer'}</button>
              <button onClick={()=>openDelete(org)} style={{background:'rgba(240,90,90,0.08)',border:'1px solid rgba(240,90,90,0.15)',borderRadius:'8px',padding:'8px 10px',color:'#F05A5A',fontSize:'12px',cursor:'pointer'}}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit modal */}
      {modal==='form'&&(
        <div style={{position:'fixed',inset:0,background:'#F4F2FF',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'1rem'}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(91,141,239,0.25)',borderRadius:'20px',padding:'2rem',width:'100%',maxWidth:'520px'}}>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1A1550',marginBottom:'1.5rem'}}>{sel?'✏️ Modifier':'+ Nouvelle organisation'}</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              <div style={{gridColumn:'1/-1'}}><label style={lbl}>Nom *</label><input style={inp} value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nom de l'organisation" /></div>
              <div><label style={lbl}>Slug URL</label><input style={inp} value={form.slug||''} onChange={e=>setForm({...form,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="mon-organisation" /></div>
              <div><label style={lbl}>Email admin</label><input style={inp} type="email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} placeholder="admin@org.com" /></div>
              <div><label style={lbl}>Pays</label>
                <select style={inp} value={form.country||'🇸🇳'} onChange={e=>setForm({...form,country:e.target.value})}>
                  {[['🇸🇳','Sénégal'],['🇨🇮','Côte d\'Ivoire'],['🇬🇭','Ghana'],['🇨🇲','Cameroun'],['🇲🇱','Mali'],['🇧🇫','Burkina'],['🌍','Autre']].map(([f,n])=><option key={f} value={f}>{f} {n}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Plan</label>
                <select style={inp} value={form.plan||'Starter'} onChange={e=>setForm({...form,plan:e.target.value})}>
                  {['Starter','Pro','Enterprise'].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button onClick={()=>{setModal(null);setSel(null)}} style={btnCancel}>Annuler</button>
              <button onClick={save} disabled={!form.name} style={{...btnPrimary,opacity:!form.name?0.5:1}}>{sel?'Sauvegarder':'Créer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {modal==='settings'&&(
        <div style={{position:'fixed',inset:0,background:'#F4F2FF',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'1rem'}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(240,180,41,0.25)',borderRadius:'20px',padding:'2rem',width:'100%',maxWidth:'520px'}}>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1A1550',marginBottom:'1.5rem'}}>⚙️ Paramètres — {sel?.name}</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem',marginBottom:'1.5rem'}}>
              <div><label style={lbl}>Plan</label>
                <select style={inp} value={form.plan||'Starter'} onChange={e=>setForm({...form,plan:e.target.value})}>
                  {['Starter','Pro','Enterprise'].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Utilisateurs max</label><input style={inp} type="number" placeholder="100" /></div>
              <div><label style={lbl}>Domaine personnalisé</label><input style={inp} placeholder="lms.monorganisation.com" /></div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:'#F4F2FF',border:'1px solid rgba(107,78,255,0.10)',borderRadius:'10px'}}>
                <div><div style={{fontWeight:'600',fontSize:'14px',color:'#1A1550'}}>SSO SAML 2.0</div><div style={{fontSize:'12px',color:'#9B8EC0'}}>Authentification entreprise</div></div>
                <span style={{background:'rgba(240,180,41,0.15)',color:'#F0B429',fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px'}}>Pro+</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:'#F4F2FF',border:'1px solid rgba(107,78,255,0.10)',borderRadius:'10px'}}>
                <div><div style={{fontWeight:'600',fontSize:'14px',color:'#1A1550'}}>Marque blanche</div><div style={{fontSize:'12px',color:'#9B8EC0'}}>Logo et couleurs personnalisés</div></div>
                <span style={{background:'rgba(240,180,41,0.15)',color:'#F0B429',fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px'}}>Enterprise</span>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button onClick={()=>{setModal(null);setSel(null)}} style={btnCancel}>Annuler</button>
              <button onClick={save} style={{...btnPrimary,background:'linear-gradient(135deg,#F0B429,#F97316)'}}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {modal==='delete'&&(
        <div style={{position:'fixed',inset:0,background:'#F4F2FF',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(240,90,90,0.3)',borderRadius:'20px',padding:'2.5rem',textAlign:'center',maxWidth:'400px',margin:'1rem'}}>
            <div style={{fontSize:'48px',marginBottom:'1rem'}}>⚠️</div>
            <h2 style={{fontSize:'18px',fontWeight:'800',color:'#F05A5A',marginBottom:'8px'}}>Supprimer {sel?.name} ?</h2>
            <p style={{color:'#9B8EC0',fontSize:'13px',marginBottom:'2rem',lineHeight:'1.6'}}>Action irréversible. Tous les {sel?.users} utilisateurs et {sel?.courses} cours seront supprimés définitivement.</p>
            <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
              <button onClick={()=>{setModal(null);setSel(null)}} style={btnCancel}>Annuler</button>
              <button onClick={confirmDelete} style={{background:'linear-gradient(135deg,#F05A5A,#C0392B)',border:'none',borderRadius:'10px',padding:'10px 20px',color:'#fff',fontWeight:'700',fontSize:'14px',cursor:'pointer'}}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

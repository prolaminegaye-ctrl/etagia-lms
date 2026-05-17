'use client'
import { useState } from 'react'

type User = { id: string; name: string; email: string; role: string; org: string; status: string; courses: number; joined: string }

const defaultUsers: User[] = [
  { id:'1', name:'Fatou Diallo', email:'fatou@sjt.sn', role:'Apprenant', org:'SJT', status:'Actif', courses:3, joined:'12 jan 2026' },
  { id:'2', name:'Moussa Traoré', email:'moussa@etagia.com', role:'Formateur', org:'ETAGIA', status:'Actif', courses:5, joined:'3 fév 2026' },
  { id:'3', name:'Aïda Koné', email:'aida@sjt.sn', role:'Apprenant', org:'SJT', status:'Inactif', courses:1, joined:'20 mar 2026' },
  { id:'4', name:'Ibrahim Diop', email:'ibrahim@etagia.com', role:'Admin', org:'ETAGIA', status:'Actif', courses:0, joined:'1 jan 2026' },
  { id:'5', name:'Aminata Sow', email:'aminata@campusforma.ci', role:'Apprenant', org:'CampusForma', status:'Actif', courses:4, joined:'5 avr 2026' },
  { id:'6', name:'Cheikh Ndiaye', email:'cheikh@sjt.sn', role:'Formateur', org:'SJT', status:'Actif', courses:2, joined:'18 avr 2026' },
]

const emptyUser: Partial<User> = { name:'', email:'', role:'Apprenant', org:'ETAGIA', status:'Actif', courses:0, joined:'' }

const S = {
  inp: { background:'rgba(123,92,245,0.06)', color:'#1C1917', border:'1px solid rgba(28,25,23,0.09)', borderRadius:'10px', padding:'9px 12px', width:'100%', fontSize:'14px', fontFamily:'inherit', outline:'none' } as React.CSSProperties,
  lbl: { fontSize:'11px', color:'#A8A29E', display:'block', marginBottom:'5px', fontWeight:'700', textTransform:'uppercase' as const, letterSpacing:'0.7px' },
  btn: { background:'linear-gradient(135deg,#FF5722,#FFB300)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer' } as React.CSSProperties,
  cancel: { background:'#FAF9F7', border:'1px solid rgba(28,25,23,0.07)', borderRadius:'10px', padding:'10px 18px', color:'#A8A29E', fontSize:'14px', cursor:'pointer' } as React.CSSProperties,
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(defaultUsers)
  const [modal, setModal] = useState<'add'|'edit'|'delete'|null>(null)
  const [sel, setSel] = useState<User|null>(null)
  const [form, setForm] = useState<Partial<User>>(emptyUser)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('Tous')

  const filtered = users.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
    const mr = filterRole === 'Tous' || u.role === filterRole
    return ms && mr
  })

  const openAdd = () => { setForm({...emptyUser, id: Date.now().toString(), joined: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}); setSel(null); setModal('add') }
  const openEdit = (u: User) => { setSel(u); setForm({...u}); setModal('edit') }
  const openDelete = (u: User) => { setSel(u); setModal('delete') }

  const save = () => {
    if (!form.name || !form.email) return
    if (modal === 'add') setUsers(p => [...p, form as User])
    else setUsers(p => p.map(u => u.id===form.id ? {...u,...form} as User : u))
    setModal(null)
  }

  const confirmDelete = () => { setUsers(p => p.filter(u => u.id!==sel?.id)); setModal(null) }
  const toggleStatus = (id: string) => setUsers(p => p.map(u => u.id===id ? {...u, status: u.status==='Actif'?'Inactif':'Actif'} : u))

  const roleColors: Record<string,string> = { Admin:'#FFB300', Formateur:'#FF5722', Apprenant:'#00BFA5' }

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,rgba(28,25,23,0.06),rgba(34,212,168,0.05))',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Utilisateurs</h1>
          <p style={{color:'#A8A29E',fontSize:'13px',marginTop:'3px'}}>{users.length} utilisateurs · {users.filter(u=>u.status==='Actif').length} actifs</p>
        </div>
        <button onClick={openAdd} style={S.btn}>+ Inviter un utilisateur</button>
      </div>

      <div style={{display:'flex',gap:'10px',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher nom ou email..." style={{...S.inp,flex:1,minWidth:'200px',padding:'11px 16px'}} />
        {['Tous','Admin','Formateur','Apprenant'].map(r=>(
          <button key={r} onClick={()=>setFilterRole(r)} style={{padding:'8px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'600',border:`1px solid ${filterRole===r?'rgba(123,92,245,0.5)':'rgba(28,25,23,0.08)'}`,background:filterRole===r?'rgba(28,25,23,0.08)':'transparent',color:filterRole===r?'#E8651A':'#A8A29E',cursor:'pointer'}}>
            {r}
          </button>
        ))}
      </div>

      <div style={{background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.07)',borderRadius:'16px',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'1px solid rgba(28,25,23,0.06)',background:'#FAF9F7'}}>
              {['Utilisateur','Rôle','Organisation','Cours','Inscrit le','Statut','Actions'].map(h=>(
                <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'10px',fontWeight:'700',color:'#57534E',textTransform:'uppercase',letterSpacing:'0.8px'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u,i)=>(
              <tr key={u.id} style={{borderBottom:i<filtered.length-1?'1px solid rgba(123,92,245,0.07)':'none',transition:'background .15s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(123,92,245,0.04)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                <td style={{padding:'14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'34px',height:'34px',borderRadius:'50%',background:`${roleColors[u.role]||'#FF5722'}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'700',color:roleColors[u.role]||'#E8651A',flexShrink:0}}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{fontWeight:'500',fontSize:'13px',color:'#1C1917'}}>{u.name}</div>
                      <div style={{fontSize:'11px',color:'#57534E'}}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:'14px'}}>
                  <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',background:`${roleColors[u.role]||'#FF5722'}22`,color:roleColors[u.role]||'#E8651A'}}>{u.role}</span>
                </td>
                <td style={{padding:'14px',fontSize:'13px',color:'#A8A29E'}}>{u.org}</td>
                <td style={{padding:'14px',fontSize:'14px',fontWeight:'700',color:'#E8651A'}}>{u.courses}</td>
                <td style={{padding:'14px',fontSize:'12px',color:'#57534E'}}>{u.joined}</td>
                <td style={{padding:'14px'}}>
                  <button onClick={()=>toggleStatus(u.id)} style={{fontSize:'11px',fontWeight:'700',padding:'4px 10px',borderRadius:'20px',border:'none',cursor:'pointer',background:u.status==='Actif'?'rgba(34,212,168,0.15)':'rgba(240,90,90,0.1)',color:u.status==='Actif'?'#00BFA5':'#F05A5A'}}>
                    {u.status}
                  </button>
                </td>
                <td style={{padding:'14px'}}>
                  <div style={{display:'flex',gap:'5px'}}>
                    <button onClick={()=>openEdit(u)} style={{background:'rgba(28,25,23,0.06)',border:'none',borderRadius:'6px',padding:'5px 10px',color:'#E8651A',fontSize:'11px',fontWeight:'600',cursor:'pointer'}}>✏️ Éditer</button>
                    <button onClick={()=>openDelete(u)} style={{background:'rgba(240,90,90,0.08)',border:'none',borderRadius:'6px',padding:'5px 8px',color:'#F05A5A',fontSize:'11px',cursor:'pointer'}}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:'3rem',textAlign:'center',color:'#57534E'}}>Aucun utilisateur trouvé</div>}
      </div>

      {/* Add/Edit modal */}
      {(modal==='add'||modal==='edit')&&(
        <div style={{position:'fixed',inset:0,background:'#FAF9F7',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'1rem'}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(232,101,26,0.30)',borderRadius:'20px',padding:'2rem',width:'100%',maxWidth:'500px'}}>
            <h2 style={{fontSize:'20px',fontWeight:'800',color:'#1C1917',marginBottom:'1.5rem'}}>{modal==='add'?'+ Inviter un utilisateur':'✏️ Modifier l\'utilisateur'}</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
              <div style={{gridColumn:'1/-1'}}><label style={S.lbl}>Nom complet *</label><input style={S.inp} value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Prénom Nom" /></div>
              <div style={{gridColumn:'1/-1'}}><label style={S.lbl}>Email *</label><input style={S.inp} type="email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@exemple.com" /></div>
              <div><label style={S.lbl}>Rôle</label>
                <select style={S.inp} value={form.role||'Apprenant'} onChange={e=>setForm({...form,role:e.target.value})}>
                  {['Apprenant','Formateur','Admin'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label style={S.lbl}>Organisation</label>
                <select style={S.inp} value={form.org||'ETAGIA'} onChange={e=>setForm({...form,org:e.target.value})}>
                  {['ETAGIA','SJT','CampusForma','AfricaTech Hub'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div><label style={S.lbl}>Statut</label>
                <select style={S.inp} value={form.status||'Actif'} onChange={e=>setForm({...form,status:e.target.value})}>
                  {['Actif','Inactif','Suspendu'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {modal==='add'&&(
              <div style={{background:'rgba(123,92,245,0.06)',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'10px',padding:'10px 14px',marginBottom:'1.5rem',fontSize:'12px',color:'#A8A29E'}}>
                📧 Un email d'invitation sera envoyé à l'adresse indiquée
              </div>
            )}
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button onClick={()=>setModal(null)} style={S.cancel}>Annuler</button>
              <button onClick={save} disabled={!form.name||!form.email} style={{...S.btn,opacity:(!form.name||!form.email)?0.5:1}}>
                {modal==='add'?'Inviter':'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {modal==='delete'&&(
        <div style={{position:'fixed',inset:0,background:'#FAF9F7',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(240,90,90,0.3)',borderRadius:'20px',padding:'2.5rem',textAlign:'center',maxWidth:'380px',margin:'1rem'}}>
            <div style={{fontSize:'48px',marginBottom:'1rem'}}>⚠️</div>
            <h2 style={{fontSize:'18px',fontWeight:'800',color:'#F05A5A',marginBottom:'8px'}}>Supprimer {sel?.name} ?</h2>
            <p style={{color:'#A8A29E',fontSize:'13px',marginBottom:'2rem'}}>L'utilisateur perdra l'accès à tous ses cours et ses données seront supprimées.</p>
            <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
              <button onClick={()=>setModal(null)} style={S.cancel}>Annuler</button>
              <button onClick={confirmDelete} style={{...S.btn,background:'linear-gradient(135deg,#F05A5A,#C0392B)'}}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

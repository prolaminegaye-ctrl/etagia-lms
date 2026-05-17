'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Cours = { id: string; title: string; author: string; category: string; level: string; enrolled: number; completion: number; status: string; modules: number; duration: string }

const defaultCours: Cours[] = [
  { id:'1', title:'Data Science avec Python', author:'Moussa Traoré', category:'Tech', level:'Intermédiaire', enrolled:54, completion:72, status:'Publié', modules:6, duration:'24h' },
  { id:'2', title:'Marketing Digital Afrique', author:'Aminata Sow', category:'Business', level:'Débutant', enrolled:43, completion:58, status:'Publié', modules:5, duration:'15h' },
  { id:'3', title:'Leadership & Management', author:'Cheikh Ndiaye', category:'Soft Skills', level:'Intermédiaire', enrolled:30, completion:45, status:'Brouillon', modules:4, duration:'10h' },
  { id:'4', title:'IA Générative pour pros', author:'Ibrahim Diop', category:'Tech', level:'Avancé', enrolled:89, completion:34, status:'Publié', modules:8, duration:'20h' },
  { id:'5', title:'Comptabilité SME Afrique', author:'Fatou Diallo', category:'Finance', level:'Débutant', enrolled:27, completion:61, status:'Publié', modules:5, duration:'12h' },
]

export default function AdminCoursPage() {
  const router = useRouter()
  const [cours, setCours] = useState<Cours[]>(defaultCours)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [modal, setModal] = useState<'edit'|'delete'|null>(null)
  const [sel, setSel] = useState<Cours|null>(null)
  const [form, setForm] = useState<Partial<Cours>>({})

  const filtered = cours.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.author.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Tous' || c.status === filter || c.category === filter
    return matchSearch && matchFilter
  })

  const openEdit = (c: Cours) => { setSel(c); setForm({...c}); setModal('edit') }
  const openDelete = (c: Cours) => { setSel(c); setModal('delete') }
  const saveEdit = () => { setCours(p => p.map(c => c.id===form.id ? {...c,...form} as Cours : c)); setModal(null) }
  const confirmDelete = () => { setCours(p => p.filter(c => c.id!==sel?.id)); setModal(null) }
  const toggleStatus = (id: string) => setCours(p => p.map(c => c.id===id ? {...c, status: c.status==='Publié'?'Archivé':'Publié'} : c))

  const S = {
    inp: { background:'rgba(123,92,245,0.06)', color:'#1C1917', border:'1px solid rgba(28,25,23,0.09)', borderRadius:'10px', padding:'9px 12px', width:'100%', fontSize:'14px', fontFamily:'inherit', outline:'none' } as React.CSSProperties,
    lbl: { fontSize:'11px', color:'#A8A29E', display:'block', marginBottom:'5px', fontWeight:'700', textTransform:'uppercase' as const, letterSpacing:'0.7px' },
    btn: { background:'linear-gradient(135deg,#FF5722,#FFB300)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer' } as React.CSSProperties,
    cancel: { background:'#FAF9F7', border:'1px solid rgba(28,25,23,0.07)', borderRadius:'10px', padding:'10px 18px', color:'#A8A29E', fontSize:'14px', cursor:'pointer' } as React.CSSProperties,
  }

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,rgba(28,25,23,0.06),rgba(34,212,168,0.05))',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Gestion des cours</h1>
          <p style={{color:'#A8A29E',fontSize:'13px',marginTop:'3px'}}>{cours.length} cours · {cours.filter(c=>c.status==='Publié').length} publiés · {cours.reduce((a,c)=>a+c.enrolled,0)} inscrits</p>
        </div>
        <button onClick={()=>router.push('/formateur/creer')} style={S.btn}>+ Créer un cours</button>
      </div>

      {/* Search + filters */}
      <div style={{display:'flex',gap:'10px',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..." style={{...S.inp,flex:1,minWidth:'200px',padding:'11px 16px'}} />
        {['Tous','Publié','Brouillon','Tech','Business','Finance'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:'8px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'600',border:`1px solid ${filter===f?'rgba(123,92,245,0.5)':'rgba(28,25,23,0.08)'}`,background:filter===f?'rgba(28,25,23,0.08)':'transparent',color:filter===f?'#E8651A':'#A8A29E',cursor:'pointer'}}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.07)',borderRadius:'16px',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'1px solid rgba(28,25,23,0.06)',background:'#FAF9F7'}}>
              {['Cours','Auteur','Catégorie','Inscrits','Complétion','Statut','Actions'].map(h=>(
                <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'10px',fontWeight:'700',color:'#57534E',textTransform:'uppercase',letterSpacing:'0.8px'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i)=>(
              <tr key={c.id} style={{borderBottom:i<filtered.length-1?'1px solid rgba(123,92,245,0.07)':'none',transition:'background .15s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(123,92,245,0.04)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                <td style={{padding:'14px'}}>
                  <div style={{fontWeight:'600',fontSize:'13px',color:'#1C1917',marginBottom:'2px'}}>{c.title}</div>
                  <div style={{fontSize:'11px',color:'#57534E'}}>{c.modules} modules · {c.duration}</div>
                </td>
                <td style={{padding:'14px',fontSize:'13px',color:'#A8A29E'}}>{c.author}</td>
                <td style={{padding:'14px'}}><span style={{fontSize:'11px',fontWeight:'600',padding:'3px 8px',borderRadius:'6px',background:'rgba(28,25,23,0.06)',color:'#E8651A'}}>{c.category}</span></td>
                <td style={{padding:'14px',fontSize:'14px',fontWeight:'700',color:'#E8651A'}}>{c.enrolled}</td>
                <td style={{padding:'14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <div style={{flex:1,height:'4px',background:'rgba(28,25,23,0.06)',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${c.completion}%`,background:'linear-gradient(90deg,#FF5722,#FFB300)',borderRadius:'2px'}} />
                    </div>
                    <span style={{fontSize:'12px',color:'#E8651A',fontWeight:'600',minWidth:'30px'}}>{c.completion}%</span>
                  </div>
                </td>
                <td style={{padding:'14px'}}>
                  <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',
                    background:c.status==='Publié'?'rgba(34,212,168,0.15)':c.status==='Brouillon'?'rgba(240,180,41,0.15)':'rgba(240,90,90,0.1)',
                    color:c.status==='Publié'?'#00BFA5':c.status==='Brouillon'?'#FFB300':'#F05A5A'}}>{c.status}</span>
                </td>
                <td style={{padding:'14px'}}>
                  <div style={{display:'flex',gap:'5px'}}>
                    <button onClick={()=>openEdit(c)} style={{background:'rgba(28,25,23,0.06)',border:'none',borderRadius:'6px',padding:'5px 10px',color:'#E8651A',fontSize:'11px',fontWeight:'600',cursor:'pointer'}}>✏️ Éditer</button>
                    <button onClick={()=>toggleStatus(c.id)} style={{background:'rgba(34,212,168,0.08)',border:'none',borderRadius:'6px',padding:'5px 10px',color:'#00BFA5',fontSize:'11px',cursor:'pointer'}}>⇄</button>
                    <button onClick={()=>openDelete(c)} style={{background:'rgba(240,90,90,0.08)',border:'none',borderRadius:'6px',padding:'5px 8px',color:'#F05A5A',fontSize:'11px',cursor:'pointer'}}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:'3rem',textAlign:'center',color:'#57534E'}}>Aucun cours trouvé</div>}
      </div>

      {/* Edit modal */}
      {modal==='edit'&&(
        <div style={{position:'fixed',inset:0,background:'#FAF9F7',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'1rem'}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'20px',padding:'2rem',width:'100%',maxWidth:'500px'}}>
            <h2 style={{fontSize:'18px',fontWeight:'800',color:'#1C1917',marginBottom:'1.5rem'}}>✏️ Modifier le cours</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem',marginBottom:'1.5rem'}}>
              <div><label style={S.lbl}>Titre</label><input style={S.inp} value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div><label style={S.lbl}>Catégorie</label>
                  <select style={S.inp} value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})}>
                    {['Tech','Business','Soft Skills','Finance','Marketing'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={S.lbl}>Statut</label>
                  <select style={S.inp} value={form.status||''} onChange={e=>setForm({...form,status:e.target.value})}>
                    {['Publié','Brouillon','Archivé'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button onClick={()=>setModal(null)} style={S.cancel}>Annuler</button>
              <button onClick={saveEdit} style={S.btn}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {modal==='delete'&&(
        <div style={{position:'fixed',inset:0,background:'#FAF9F7',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(240,90,90,0.3)',borderRadius:'20px',padding:'2.5rem',textAlign:'center',maxWidth:'400px',margin:'1rem'}}>
            <div style={{fontSize:'48px',marginBottom:'1rem'}}>⚠️</div>
            <h2 style={{fontSize:'18px',fontWeight:'800',color:'#F05A5A',marginBottom:'8px'}}>Supprimer "{sel?.title}" ?</h2>
            <p style={{color:'#A8A29E',fontSize:'13px',marginBottom:'2rem'}}>Action irréversible. Les {sel?.enrolled} apprenants inscrits perdront l&apos;accès.</p>
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

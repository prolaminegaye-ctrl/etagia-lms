'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Cours = { id: string; title: string; category: string; level: string; modules: number; duration: string; enrolled: number; completion: number; status: 'Brouillon'|'Publié'|'Archivé'; updated: string; moduleUrl?: string; satisfaction?: string }

const defaultCours: Cours[] = [
  { id:'1', title:'Data Science avec Python', category:'Tech', level:'Intermédiaire', modules:6, duration:'24h', enrolled:54, completion:72, status:'Publié', updated:'14 mai 2026', satisfaction:'4.7/5' },
  { id:'2', title:'Marketing Digital Afrique', category:'Business', level:'Débutant', modules:5, duration:'15h', enrolled:43, completion:58, status:'Publié', updated:'12 mai 2026', satisfaction:'4.7/5' },
  { id:'3', title:'Leadership & Management', category:'Soft Skills', level:'Intermédiaire', modules:4, duration:'10h', enrolled:0, completion:0, status:'Brouillon', updated:'10 mai 2026' },
  {
    id:'4',
    title:"L'Art de Vendre & Conseiller",
    category:'Commercial',
    level:'Intermédiaire',
    modules:7,
    duration:'3h30',
    enrolled:0,
    completion:0,
    status:'Publié',
    updated:'23 mai 2026',
    satisfaction:'—',
    moduleUrl:'/modules/vendre-conseiller.html',
  },
]

const statusColors = { Publié:'#00BFA5', Brouillon:'#FFB300', Archivé:'#A8A29E' }

export default function FormateurCoursPage() {
  const router = useRouter()
  const [cours, setCours] = useState<Cours[]>(defaultCours)
  const [confirm, setConfirm] = useState<{id:string;action:string}|null>(null)
  const [launching, setLaunching] = useState<string|null>(null)

  const publish = (id: string) => setCours(p => p.map(c => c.id===id ? {...c, status:'Publié', updated: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})} : c))
  const archive = (id: string) => setCours(p => p.map(c => c.id===id ? {...c, status:'Archivé'} : c))
  const unpublish = (id: string) => setCours(p => p.map(c => c.id===id ? {...c, status:'Brouillon', enrolled:0} : c))

  if (launching) {
    return (
      <div style={{position:'fixed',inset:0,zIndex:9999,background:'#F0F4FF',display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 16px',background:'rgba(255,255,255,0.95)',borderBottom:'1px solid #e5e7eb',backdropFilter:'blur(8px)'}}>
          <button
            onClick={()=>setLaunching(null)}
            style={{background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:'8px',padding:'6px 14px',fontSize:'13px',fontWeight:'600',color:'#374151',cursor:'pointer'}}
          >
            ← Retour aux cours
          </button>
          <span style={{fontSize:'14px',fontWeight:'700',color:'#1C1917'}}>L&apos;Art de Vendre &amp; Conseiller</span>
          <span style={{marginLeft:'auto',fontSize:'12px',color:'#A8A29E'}}>Module e-learning interactif · ETAGIA</span>
        </div>
        <iframe
          src={launching}
          title="L'Art de Vendre & Conseiller — ETAGIA"
          style={{flex:1,border:'none',display:'block',width:'100%'}}
          allow="fullscreen"
        />
      </div>
    )
  }

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,rgba(28,25,23,0.06),rgba(34,212,168,0.05))',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Mes cours</h1>
          <p style={{color:'#A8A29E',fontSize:'13px',marginTop:'3px'}}>{cours.length} cours · {cours.filter(c=>c.status==='Publié').length} publiés · {cours.reduce((a,c)=>a+c.enrolled,0)} apprenants total</p>
        </div>
        <button onClick={()=>router.push('/formateur/creer')} style={{background:'linear-gradient(135deg,#E8651A,#D4A017)',border:'none',borderRadius:'12px',padding:'11px 22px',color:'#fff',fontWeight:'700',fontSize:'14px',cursor:'pointer',boxShadow:'0 4px 16px rgba(232,101,26,0.30)'}}>
          ✦ Créer un cours
        </button>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {cours.map(c=>(
          <div key={c.id} style={{background:'#FFFFFF',border: c.id==='4' ? '2px solid rgba(255,99,64,0.35)' : '1px solid rgba(28,25,23,0.07)',borderRadius:'18px',padding:'1.5rem',transition:'all .2s',boxShadow: c.id==='4' ? '0 4px 20px rgba(255,99,64,0.10)' : 'none'}}>
            {c.id==='4' && (
              <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#FF6340,#FF8C40)',borderRadius:'20px',padding:'4px 12px',fontSize:'11px',fontWeight:'700',color:'#fff',marginBottom:'10px',letterSpacing:'0.03em'}}>
                ✦ MODULE E-LEARNING INTERACTIF
              </div>
            )}
            <div style={{display:'flex',alignItems:'flex-start',gap:'1.5rem'}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                  <h3 style={{fontSize:'17px',fontWeight:'700',color:'#1C1917'}}>{c.title}</h3>
                  <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',background:statusColors[c.status]+'22',color:statusColors[c.status]}}>{c.status}</span>
                </div>
                <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'1rem'}}>
                  {[
                    {l:'Catégorie',v:c.category},{l:'Niveau',v:c.level},{l:'Modules',v:c.modules},{l:'Durée',v:c.duration},{l:'Mis à jour',v:c.updated}
                  ].map(x=>(
                    <div key={x.l}>
                      <span style={{fontSize:'10px',color:'#57534E',textTransform:'uppercase' as const,letterSpacing:'0.5px'}}>{x.l} </span>
                      <span style={{fontSize:'12px',color:'#A8A29E',fontWeight:'500'}}>{String(x.v)}</span>
                    </div>
                  ))}
                </div>
                {c.status==='Publié'&&(
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
                    {[
                      {l:'Apprenants inscrits',v:String(c.enrolled),color:'#E8651A'},
                      {l:'Complétion moyenne',v:`${c.completion}%`,color:'#00BFA5'},
                      {l:'Satisfaction',v: c.satisfaction ? `${c.satisfaction} ⭐` : '— ⭐',color:'#FFB300'},
                    ].map(s=>(
                      <div key={s.l} style={{background:'#FAF9F7',borderRadius:'10px',padding:'10px 14px'}}>
                        <div style={{fontSize:'20px',fontWeight:'800',color:s.color,fontFamily:'Syne,sans-serif'}}>{s.v}</div>
                        <div style={{fontSize:'11px',color:'#57534E',marginTop:'2px'}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:'8px',minWidth:'160px'}}>
                {c.moduleUrl && c.status==='Publié' && (
                  <button
                    onClick={()=>setLaunching(c.moduleUrl!)}
                    style={{background:'linear-gradient(135deg,#FF6340,#FF8C40)',border:'none',borderRadius:'10px',padding:'10px 16px',color:'#fff',fontSize:'13px',fontWeight:'700',cursor:'pointer',textAlign:'center',boxShadow:'0 3px 12px rgba(255,99,64,0.35)'}}
                  >
                    🎓 Lancer le module
                  </button>
                )}
                {c.status==='Brouillon'&&(
                  <>
                    <button onClick={()=>router.push('/formateur/creer')} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'10px',padding:'9px 16px',color:'#E8651A',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>✏️ Continuer</button>
                    <button onClick={()=>setConfirm({id:c.id,action:'publish'})} style={{background:'linear-gradient(135deg,#E8651A,#D4A017)',border:'none',borderRadius:'10px',padding:'9px 16px',color:'#fff',fontSize:'13px',fontWeight:'700',cursor:'pointer',textAlign:'center'}}>🚀 Publier</button>
                  </>
                )}
                {c.status==='Publié'&&(
                  <>
                    {!c.moduleUrl && <button onClick={()=>router.push('/formateur/creer')} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'10px',padding:'9px 16px',color:'#E8651A',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>✏️ Modifier</button>}
                    <button onClick={()=>router.push('/formateur/apprenants')} style={{background:'rgba(34,212,168,0.1)',border:'1px solid rgba(34,212,168,0.25)',borderRadius:'10px',padding:'9px 16px',color:'#00BFA5',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>👥 Apprenants</button>
                    <button onClick={()=>setConfirm({id:c.id,action:'archive'})} style={{background:'rgba(240,90,90,0.08)',border:'1px solid rgba(240,90,90,0.2)',borderRadius:'10px',padding:'9px 16px',color:'#F05A5A',fontSize:'12px',cursor:'pointer',textAlign:'center'}}>Archiver</button>
                  </>
                )}
                {c.status==='Archivé'&&(
                  <button onClick={()=>unpublish(c.id)} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'10px',padding:'9px 16px',color:'#E8651A',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>↩ Restaurer</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirm&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(232,101,26,0.30)',borderRadius:'20px',padding:'2rem',textAlign:'center',maxWidth:'400px',margin:'1rem'}}>
            <div style={{fontSize:'48px',marginBottom:'1rem'}}>{confirm.action==='publish'?'🚀':'📦'}</div>
            <h2 style={{fontSize:'18px',fontWeight:'800',color:'#1C1917',marginBottom:'8px'}}>
              {confirm.action==='publish'?'Publier ce cours ?':'Archiver ce cours ?'}
            </h2>
            <p style={{color:'#A8A29E',fontSize:'13px',marginBottom:'2rem'}}>
              {confirm.action==='publish'?'Le cours sera visible pour tous vos apprenants immédiatement.':'Le cours ne sera plus accessible aux nouveaux apprenants.'}
            </p>
            <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
              <button onClick={()=>setConfirm(null)} style={{background:'#FAF9F7',border:'1px solid rgba(28,25,23,0.07)',borderRadius:'10px',padding:'10px 20px',color:'#A8A29E',fontSize:'14px',cursor:'pointer'}}>Annuler</button>
              <button onClick={()=>{confirm.action==='publish'?publish(confirm.id):archive(confirm.id);setConfirm(null)}} style={{background:confirm.action==='publish'?'linear-gradient(135deg,#E8651A,#D4A017)':'linear-gradient(135deg,#F05A5A,#C0392B)',border:'none',borderRadius:'10px',padding:'10px 20px',color:'#fff',fontWeight:'700',fontSize:'14px',cursor:'pointer'}}>
                {confirm.action==='publish'?'Publier':'Archiver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

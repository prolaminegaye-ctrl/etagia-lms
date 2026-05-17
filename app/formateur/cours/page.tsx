'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Cours = { id: string; title: string; category: string; level: string; modules: number; duration: string; enrolled: number; completion: number; status: 'Brouillon'|'Publié'|'Archivé'; updated: string }

const defaultCours: Cours[] = [
  { id:'1', title:'Data Science avec Python', category:'Tech', level:'Intermédiaire', modules:6, duration:'24h', enrolled:54, completion:72, status:'Publié', updated:'14 mai 2026' },
  { id:'2', title:'Marketing Digital Afrique', category:'Business', level:'Débutant', modules:5, duration:'15h', enrolled:43, completion:58, status:'Publié', updated:'12 mai 2026' },
  { id:'3', title:'Leadership & Management', category:'Soft Skills', level:'Intermédiaire', modules:4, duration:'10h', enrolled:0, completion:0, status:'Brouillon', updated:'10 mai 2026' },
]

const statusColors = { Publié:'#22D4A8', Brouillon:'#F0B429', Archivé:'#8B7BAE' }

export default function FormateurCoursPage() {
  const router = useRouter()
  const [cours, setCours] = useState<Cours[]>(defaultCours)
  const [confirm, setConfirm] = useState<{id:string;action:string}|null>(null)

  const publish = (id: string) => setCours(p => p.map(c => c.id===id ? {...c, status:'Publié', updated: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})} : c))
  const archive = (id: string) => setCours(p => p.map(c => c.id===id ? {...c, status:'Archivé'} : c))
  const unpublish = (id: string) => setCours(p => p.map(c => c.id===id ? {...c, status:'Brouillon', enrolled:0} : c))

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,rgba(123,92,245,0.1),rgba(34,212,168,0.05))',border:'1px solid rgba(123,92,245,0.2)',borderRadius:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'800',background:'linear-gradient(135deg,#F0EEFF,#A78BF8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Mes cours</h1>
          <p style={{color:'#8B7BAE',fontSize:'13px',marginTop:'3px'}}>{cours.length} cours · {cours.filter(c=>c.status==='Publié').length} publiés · {cours.reduce((a,c)=>a+c.enrolled,0)} apprenants total</p>
        </div>
        <button onClick={()=>router.push('/formateur/creer')} style={{background:'linear-gradient(135deg,#7B5CF5,#E040A0)',border:'none',borderRadius:'12px',padding:'11px 22px',color:'#fff',fontWeight:'700',fontSize:'14px',cursor:'pointer',boxShadow:'0 4px 16px rgba(123,92,245,0.3)'}}>
          ✦ Créer un cours
        </button>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {cours.map(c=>(
          <div key={c.id} style={{background:'linear-gradient(145deg,#1A1530,#130F23)',border:'1px solid rgba(123,92,245,0.12)',borderRadius:'18px',padding:'1.5rem',transition:'all .2s'}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:'1.5rem'}}>
              {/* Info */}
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                  <h3 style={{fontSize:'17px',fontWeight:'700',color:'#F0EEFF'}}>{c.title}</h3>
                  <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',background:statusColors[c.status]+'22',color:statusColors[c.status]}}>{c.status}</span>
                </div>
                <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'1rem'}}>
                  {[
                    {l:'Catégorie',v:c.category},{l:'Niveau',v:c.level},{l:'Modules',v:c.modules},{l:'Durée',v:c.duration},{l:'Mis à jour',v:c.updated}
                  ].map(x=>(
                    <div key={x.l}>
                      <span style={{fontSize:'10px',color:'#4A3D6A',textTransform:'uppercase',letterSpacing:'0.5px'}}>{x.l} </span>
                      <span style={{fontSize:'12px',color:'#8B7BAE',fontWeight:'500'}}>{x.v}</span>
                    </div>
                  ))}
                </div>
                {c.status==='Publié'&&(
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
                    {[
                      {l:'Apprenants inscrits',v:c.enrolled,color:'#A78BF8'},
                      {l:'Complétion moyenne',v:`${c.completion}%`,color:'#22D4A8'},
                      {l:'Satisfaction',v:'4.7/5 ⭐',color:'#F0B429'},
                    ].map(s=>(
                      <div key={s.l} style={{background:'#F4F2FF',borderRadius:'10px',padding:'10px 14px'}}>
                        <div style={{fontSize:'20px',fontWeight:'800',color:s.color,fontFamily:'Syne,sans-serif'}}>{s.v}</div>
                        <div style={{fontSize:'11px',color:'#4A3D6A',marginTop:'2px'}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{display:'flex',flexDirection:'column',gap:'8px',minWidth:'160px'}}>
                {c.status==='Brouillon'&&(
                  <>
                    <button onClick={()=>router.push('/formateur/creer')} style={{background:'rgba(123,92,245,0.1)',border:'1px solid rgba(123,92,245,0.25)',borderRadius:'10px',padding:'9px 16px',color:'#A78BF8',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>✏️ Continuer</button>
                    <button onClick={()=>setConfirm({id:c.id,action:'publish'})} style={{background:'linear-gradient(135deg,#7B5CF5,#E040A0)',border:'none',borderRadius:'10px',padding:'9px 16px',color:'#fff',fontSize:'13px',fontWeight:'700',cursor:'pointer',textAlign:'center'}}>🚀 Publier</button>
                  </>
                )}
                {c.status==='Publié'&&(
                  <>
                    <button onClick={()=>router.push(`/formateur/creer`)} style={{background:'rgba(123,92,245,0.1)',border:'1px solid rgba(123,92,245,0.25)',borderRadius:'10px',padding:'9px 16px',color:'#A78BF8',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>✏️ Modifier</button>
                    <button onClick={()=>router.push('/formateur/apprenants')} style={{background:'rgba(34,212,168,0.1)',border:'1px solid rgba(34,212,168,0.25)',borderRadius:'10px',padding:'9px 16px',color:'#22D4A8',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>👥 Apprenants</button>
                    <button onClick={()=>setConfirm({id:c.id,action:'archive'})} style={{background:'rgba(240,90,90,0.08)',border:'1px solid rgba(240,90,90,0.2)',borderRadius:'10px',padding:'9px 16px',color:'#F05A5A',fontSize:'12px',cursor:'pointer',textAlign:'center'}}>Archiver</button>
                  </>
                )}
                {c.status==='Archivé'&&(
                  <button onClick={()=>unpublish(c.id)} style={{background:'rgba(123,92,245,0.1)',border:'1px solid rgba(123,92,245,0.25)',borderRadius:'10px',padding:'9px 16px',color:'#A78BF8',fontSize:'13px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>↩ Restaurer</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {confirm&&(
        <div style={{position:'fixed',inset:0,background:'#F4F2FF',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'linear-gradient(145deg,#1A1530,#130F23)',border:'1px solid rgba(123,92,245,0.3)',borderRadius:'20px',padding:'2rem',textAlign:'center',maxWidth:'400px',margin:'1rem'}}>
            <div style={{fontSize:'48px',marginBottom:'1rem'}}>{confirm.action==='publish'?'🚀':'📦'}</div>
            <h2 style={{fontSize:'18px',fontWeight:'800',color:'#F0EEFF',marginBottom:'8px'}}>
              {confirm.action==='publish'?'Publier ce cours ?':'Archiver ce cours ?'}
            </h2>
            <p style={{color:'#8B7BAE',fontSize:'13px',marginBottom:'2rem'}}>
              {confirm.action==='publish'?'Le cours sera visible pour tous vos apprenants immédiatement.':'Le cours ne sera plus accessible aux nouveaux apprenants.'}
            </p>
            <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
              <button onClick={()=>setConfirm(null)} style={{background:'#F4F2FF',border:'1px solid rgba(107,78,255,0.10)',borderRadius:'10px',padding:'10px 20px',color:'#8B7BAE',fontSize:'14px',cursor:'pointer'}}>Annuler</button>
              <button onClick={()=>{confirm.action==='publish'?publish(confirm.id):archive(confirm.id);setConfirm(null)}} style={{background:confirm.action==='publish'?'linear-gradient(135deg,#7B5CF5,#E040A0)':'linear-gradient(135deg,#F05A5A,#C0392B)',border:'none',borderRadius:'10px',padding:'10px 20px',color:'#fff',fontWeight:'700',fontSize:'14px',cursor:'pointer'}}>
                {confirm.action==='publish'?'Publier':'Archiver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

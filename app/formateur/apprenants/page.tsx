'use client'
import { useState } from 'react'

const apprenants = [
  { id:'1', name:'Fatou Diallo', email:'fatou@sjt.sn', cours:'Data Science Python', progress:72, score:85, lastSeen:'Aujourd\'hui', status:'Actif', streak:5 },
  { id:'2', name:'Moussa Koné', email:'moussa@example.com', cours:'Marketing Digital', progress:45, score:78, lastSeen:'Hier', status:'Actif', streak:3 },
  { id:'3', name:'Aïda Traoré', email:'aida@example.com', cours:'Data Science Python', progress:90, score:92, lastSeen:'Aujourd\'hui', status:'Actif', streak:12 },
  { id:'4', name:'Ibrahim Sow', email:'ibrahim@example.com', cours:'Leadership', progress:20, score:60, lastSeen:'Il y a 5 jours', status:'Inactif', streak:0 },
  { id:'5', name:'Aminata Diop', email:'aminata@example.com', cours:'Marketing Digital', progress:88, score:91, lastSeen:'Aujourd\'hui', status:'Actif', streak:8 },
  { id:'6', name:'Cheikh Ba', email:'cheikh@example.com', cours:'Leadership', progress:55, score:74, lastSeen:'Il y a 2 jours', status:'Actif', streak:2 },
]

export default function ApprenantPage() {
  const [search, setSearch] = useState('')
  const [sel, setSel] = useState<typeof apprenants[0]|null>(null)

  const filtered = apprenants.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.cours.toLowerCase().includes(search.toLowerCase())
  )

  const avg = (arr: number[]) => Math.round(arr.reduce((a,b)=>a+b,0)/arr.length)

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,rgba(28,25,23,0.06),rgba(34,212,168,0.05))',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'20px'}}>
        <h1 style={{fontSize:'24px',fontWeight:'800',background:'linear-gradient(135deg,#1C1917,#E8651A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Mes apprenants</h1>
        <p style={{color:'#A8A29E',fontSize:'13px',marginTop:'3px'}}>{apprenants.length} apprenants · Progression moyenne {avg(apprenants.map(a=>a.progress))}% · Score moyen {avg(apprenants.map(a=>a.score))}/100</p>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {[
          {l:'Actifs cette semaine',v:apprenants.filter(a=>a.status==='Actif').length,c:'#E8651A'},
          {l:'Progression moyenne',v:`${avg(apprenants.map(a=>a.progress))}%`,c:'#00BFA5'},
          {l:'Score moyen',v:`${avg(apprenants.map(a=>a.score))}/100`,c:'#FFB300'},
          {l:'Streak moyen',v:`${avg(apprenants.map(a=>a.streak))}j 🔥`,c:'#FFB300'},
        ].map(k=>(
          <div key={k.l} style={{background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.07)',borderRadius:'14px',padding:'1.25rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:k.c}} />
            <div style={{fontSize:'26px',fontWeight:'800',color:k.c,fontFamily:'Syne,sans-serif',marginTop:'4px',marginBottom:'4px'}}>{k.v}</div>
            <div style={{fontSize:'11px',color:'#57534E'}}>{k.l}</div>
          </div>
        ))}
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher un apprenant ou un cours..."
        style={{width:'100%',background:'rgba(123,92,245,0.06)',color:'#1C1917',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'12px',padding:'11px 16px',fontSize:'14px',fontFamily:'inherit',outline:'none',marginBottom:'1.5rem'}} />

      <div style={{background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.07)',borderRadius:'16px',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'1px solid rgba(28,25,23,0.06)',background:'#FAF9F7'}}>
              {['Apprenant','Cours','Progression','Score','Streak','Dernière activité','Statut','Action'].map(h=>(
                <th key={h} style={{padding:'11px 14px',textAlign:'left',fontSize:'10px',fontWeight:'700',color:'#57534E',textTransform:'uppercase',letterSpacing:'0.8px'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a,i)=>(
              <tr key={a.id} style={{borderBottom:i<filtered.length-1?'1px solid rgba(123,92,245,0.07)':'none',transition:'background .15s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(123,92,245,0.04)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                <td style={{padding:'13px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#FF5722,#FFB300)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'800',color:'#fff',flexShrink:0}}>{a.name[0]}</div>
                    <div>
                      <div style={{fontWeight:'500',fontSize:'13px',color:'#1C1917'}}>{a.name}</div>
                      <div style={{fontSize:'11px',color:'#57534E'}}>{a.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:'13px 14px',fontSize:'12px',color:'#A8A29E',maxWidth:'140px'}}><div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.cours}</div></td>
                <td style={{padding:'13px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <div style={{width:'60px',height:'4px',background:'rgba(28,25,23,0.06)',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${a.progress}%`,background:'linear-gradient(90deg,#FF5722,#FFB300)',borderRadius:'2px'}} />
                    </div>
                    <span style={{fontSize:'12px',color:'#E8651A',fontWeight:'600'}}>{a.progress}%</span>
                  </div>
                </td>
                <td style={{padding:'13px 14px',fontSize:'13px',fontWeight:'700',color:a.score>=80?'#00BFA5':a.score>=60?'#FFB300':'#F05A5A'}}>{a.score}/100</td>
                <td style={{padding:'13px 14px',fontSize:'12px',color:'#FFB300'}}>{a.streak>0?`🔥 ${a.streak}j`:'—'}</td>
                <td style={{padding:'13px 14px',fontSize:'12px',color:'#A8A29E'}}>{a.lastSeen}</td>
                <td style={{padding:'13px 14px'}}>
                  <span style={{fontSize:'11px',fontWeight:'600',padding:'3px 8px',borderRadius:'20px',background:a.status==='Actif'?'rgba(34,212,168,0.12)':'rgba(240,90,90,0.1)',color:a.status==='Actif'?'#00BFA5':'#F05A5A'}}>{a.status}</span>
                </td>
                <td style={{padding:'13px 14px'}}>
                  <button onClick={()=>setSel(a)} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'6px',padding:'5px 10px',color:'#E8651A',fontSize:'11px',fontWeight:'600',cursor:'pointer'}}>Détails</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {sel&&(
        <div style={{position:'fixed',inset:0,background:'#FAF9F7',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'1rem'}}>
          <div style={{background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'20px',padding:'2rem',width:'100%',maxWidth:'480px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
              <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'linear-gradient(135deg,#FF5722,#FFB300)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:'800',color:'#fff'}}>{sel.name[0]}</div>
                <div>
                  <div style={{fontWeight:'700',fontSize:'16px',color:'#1C1917'}}>{sel.name}</div>
                  <div style={{fontSize:'12px',color:'#57534E'}}>{sel.email}</div>
                </div>
              </div>
              <button onClick={()=>setSel(null)} style={{background:'none',border:'none',color:'#57534E',fontSize:'18px',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1.5rem'}}>
              {[
                {l:'Cours',v:sel.cours,c:'#E8651A'},{l:'Progression',v:`${sel.progress}%`,c:'#00BFA5'},
                {l:'Score',v:`${sel.score}/100`,c:'#FFB300'},{l:'Streak',v:`${sel.streak} jours 🔥`,c:'#FFB300'},
                {l:'Dernière activité',v:sel.lastSeen,c:'#A8A29E'},{l:'Statut',v:sel.status,c:sel.status==='Actif'?'#00BFA5':'#F05A5A'},
              ].map(s=>(
                <div key={s.l} style={{background:'#FAF9F7',borderRadius:'10px',padding:'12px'}}>
                  <div style={{fontSize:'10px',color:'#57534E',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'4px'}}>{s.l}</div>
                  <div style={{fontSize:'14px',fontWeight:'700',color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{background:'rgba(123,92,245,0.06)',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'12px',padding:'14px',marginBottom:'1rem'}}>
              <div style={{fontSize:'12px',color:'#A8A29E',marginBottom:'8px',fontWeight:'600'}}>MESSAGE PERSONNALISÉ</div>
              <textarea placeholder={`Envoyer un message de suivi à ${sel.name}...`} rows={3} style={{width:'100%',background:'#FAF9F7',color:'#1C1917',border:'1px solid rgba(28,25,23,0.08)',borderRadius:'8px',padding:'8px 12px',fontSize:'13px',fontFamily:'inherit',outline:'none',resize:'none'}} />
              <button style={{marginTop:'8px',background:'linear-gradient(135deg,#FF5722,#FFB300)',border:'none',borderRadius:'8px',padding:'8px 16px',color:'#fff',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>Envoyer le message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

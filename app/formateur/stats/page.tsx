'use client'

const months = ['Jan','Fév','Mar','Avr','Mai']
const inscriptions = [12,28,35,48,54]
const completions = [8,18,25,38,44]
const maxVal = Math.max(...inscriptions)

const topCours = [
  { title:'Data Science avec Python', enrolled:54, completion:72, satisfaction:4.8, color:'#E8651A' },
  { title:'Marketing Digital Afrique', enrolled:43, completion:58, satisfaction:4.6, color:'#00BFA5' },
  { title:'Leadership & Management', enrolled:30, completion:45, satisfaction:4.5, color:'#FFB300' },
]

const activities = [
  {day:'Lun',val:68},{day:'Mar',val:82},{day:'Mer',val:75},
  {day:'Jeu',val:91},{day:'Ven',val:60},{day:'Sam',val:34},{day:'Dim',val:28},
]
const maxAct = Math.max(...activities.map(a=>a.val))

const card: React.CSSProperties = { background:'#FFFFFF', border:'1.5px solid rgba(28,25,23,0.07)', borderRadius:'18px', boxShadow:'0 2px 12px rgba(28,25,23,0.05)' }

export default function StatsPage() {
  return (
    <div>
      {/* Hero orange */}
      <div style={{ borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 50%, #FFB347 100%)', boxShadow: '0 6px 24px rgba(244,89,31,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Statistiques</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.3px', marginBottom: '3px' }}>Statistiques</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Analysez vos performances pédagogiques.</p>
      </div>
>
      <div style={{marginBottom:'2rem',padding:'2rem',background:'linear-gradient(135deg,#E8651A 0%,#FFB300 100%)',borderRadius:'24px',boxShadow:'0 8px 32px rgba(232,101,26,0.28)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-60px',right:'-40px',width:'200px',height:'200px',borderRadius:'50%',background:'rgba(255,255,255,0.08)',pointerEvents:'none'}}/>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#FFFFFF',fontFamily:'Syne,sans-serif',position:'relative'}}>Statistiques</h1>
        <p style={{color:'rgba(255,255,255,0.80)',fontSize:'13px',marginTop:'4px',position:'relative'}}>Tableau de bord pédagogique · Mis à jour en temps réel</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {[
          {l:'Apprenants total',v:'127',delta:'+12 ce mois',c:'#E8651A',grad:'linear-gradient(135deg,#E8651A,#D4A017)'},
          {l:'Taux complétion',v:'71%',delta:'+4% ce mois',c:'#00BFA5',grad:'linear-gradient(135deg,#00BFA5,#7C3AED)'},
          {l:'Satisfaction',v:'4.7/5',delta:'⭐ Excellent',c:'#FFB300',grad:'linear-gradient(135deg,#D4A017,#E8651A)'},
          {l:'Heures de formation',v:'1 248h',delta:'+180h semaine',c:'#7C3AED',grad:'linear-gradient(135deg,#7C3AED,#00BFA5)'},
        ].map(k=>(
          <div key={k.l} style={{...card,padding:'1.25rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:k.grad}}/>
            <div style={{fontSize:'26px',fontWeight:'800',color:k.c,fontFamily:'Syne,sans-serif',marginTop:'10px',marginBottom:'3px',lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:'11px',color:'#57534E',marginBottom:'5px'}}>{k.l}</div>
            <div style={{fontSize:'11px',color:k.c,fontWeight:'700'}}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'1.5rem',marginBottom:'1.5rem'}}>
        <div style={{...card,padding:'1.5rem'}}>
          <h2 style={{fontSize:'15px',fontWeight:'700',color:'#1C1917',marginBottom:'1.5rem',fontFamily:'Syne,sans-serif'}}>Évolution des inscriptions</h2>
          <div style={{display:'flex',alignItems:'flex-end',gap:'16px',height:'140px'}}>
            {months.map((m,i)=>(
              <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                <div style={{fontSize:'11px',color:'#E8651A',fontWeight:'700'}}>{inscriptions[i]}</div>
                <div style={{width:'100%',display:'flex',gap:'3px',alignItems:'flex-end',height:'100px'}}>
                  <div style={{flex:1,background:'linear-gradient(180deg,#E8651A,#D4A017)',borderRadius:'4px 4px 0 0',height:`${(inscriptions[i]/maxVal)*100}%`}}/>
                  <div style={{flex:1,background:'linear-gradient(180deg,#00BFA5,#00BFA588)',borderRadius:'4px 4px 0 0',height:`${(completions[i]/maxVal)*100}%`}}/>
                </div>
                <div style={{fontSize:'11px',color:'#A8A29E'}}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'16px',marginTop:'14px'}}>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}><div style={{width:'10px',height:'10px',borderRadius:'2px',background:'#E8651A'}}/><span style={{fontSize:'11px',color:'#A8A29E'}}>Inscrits</span></div>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}><div style={{width:'10px',height:'10px',borderRadius:'2px',background:'#00BFA5'}}/><span style={{fontSize:'11px',color:'#A8A29E'}}>Complétions</span></div>
          </div>
        </div>

        <div style={{...card,padding:'1.5rem'}}>
          <h2 style={{fontSize:'15px',fontWeight:'700',color:'#1C1917',marginBottom:'1.5rem',fontFamily:'Syne,sans-serif'}}>Activité cette semaine</h2>
          <div style={{display:'flex',alignItems:'flex-end',gap:'8px',height:'120px'}}>
            {activities.map(a=>(
              <div key={a.day} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                <div style={{fontSize:'10px',color:'#E8651A',fontWeight:'700'}}>{a.val}</div>
                <div style={{width:'100%',background:`linear-gradient(180deg,#D4A017,#E8651A)`,borderRadius:'4px 4px 0 0',height:`${(a.val/maxAct)*90}px`,minHeight:'4px'}}/>
                <div style={{fontSize:'10px',color:'#A8A29E'}}>{a.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{...card,padding:'1.5rem'}}>
        <h2 style={{fontSize:'15px',fontWeight:'700',color:'#1C1917',marginBottom:'1.25rem',fontFamily:'Syne,sans-serif'}}>Performance des cours</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {topCours.map((c,i)=>(
            <div key={c.title} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'14px 16px',background:'#FAF9F7',borderRadius:'12px',border:'1px solid rgba(28,25,23,0.06)'}}>
              <div style={{width:'30px',height:'30px',borderRadius:'50%',background:`${c.color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:c.color,fontSize:'13px',flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:'600',fontSize:'13px',color:'#1C1917',marginBottom:'5px'}}>{c.title}</div>
                <div style={{height:'5px',background:'rgba(28,25,23,0.07)',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${c.completion}%`,background:`linear-gradient(90deg,${c.color},${c.color}AA)`,borderRadius:'3px'}}/>
                </div>
              </div>
              <div style={{textAlign:'right',minWidth:'80px'}}>
                <div style={{fontSize:'14px',fontWeight:'800',color:c.color,fontFamily:'Syne,sans-serif'}}>{c.completion}%</div>
                <div style={{fontSize:'11px',color:'#A8A29E'}}>{c.enrolled} inscrits</div>
              </div>
              <div style={{textAlign:'center',minWidth:'60px'}}>
                <div style={{fontSize:'14px',fontWeight:'700',color:'#FFB300'}}>{c.satisfaction}</div>
                <div style={{fontSize:'10px',color:'#A8A29E'}}>satisfaction</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

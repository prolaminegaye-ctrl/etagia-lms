'use client'

const months = ['Jan','Fév','Mar','Avr','Mai']
const inscriptions = [12,28,35,48,54]
const completions = [8,18,25,38,44]
const maxVal = Math.max(...inscriptions)

const topCours = [
  { title:'Data Science avec Python', enrolled:54, completion:72, satisfaction:4.8, color:'#6B4EFF' },
  { title:'Marketing Digital Afrique', enrolled:43, completion:58, satisfaction:4.6, color:'#00B89C' },
  { title:'Leadership & Management', enrolled:30, completion:45, satisfaction:4.5, color:'#E6A817' },
]

const activities = [
  { day:'Lun', val:68 },{ day:'Mar', val:82 },{ day:'Mer', val:75 },
  { day:'Jeu', val:91 },{ day:'Ven', val:60 },{ day:'Sam', val:34 },{ day:'Dim', val:28 },
]
const maxAct = Math.max(...activities.map(a=>a.val))

const card: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid rgba(107,78,255,0.10)',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(107,78,255,0.06)',
}

export default function StatsPage() {
  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'1.5rem',background:'linear-gradient(135deg,#EBE7FF 0%,#F9F0FF 100%)',border:'1px solid rgba(107,78,255,0.15)',borderRadius:'20px'}}>
        <h1 style={{fontSize:'24px',fontWeight:'800',color:'#1A1550',fontFamily:'Syne,sans-serif'}}>Statistiques</h1>
        <p style={{color:'#9B8EC0',fontSize:'13px',marginTop:'3px'}}>Tableau de bord pédagogique · Mis à jour en temps réel</p>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {[
          {l:'Apprenants total',v:'127',delta:'+12 ce mois',c:'#6B4EFF',grad:'linear-gradient(135deg,#6B4EFF,#8B70FF)'},
          {l:'Taux complétion',v:'71%',delta:'+4% ce mois',c:'#00B89C',grad:'linear-gradient(135deg,#00B89C,#6B4EFF)'},
          {l:'Satisfaction',v:'4.7/5',delta:'⭐ Excellent',c:'#E6A817',grad:'linear-gradient(135deg,#E6A817,#D63384)'},
          {l:'Heures de formation',v:'1 248h',delta:'+180h semaine',c:'#D63384',grad:'linear-gradient(135deg,#D63384,#6B4EFF)'},
        ].map(k=>(
          <div key={k.l} style={{...card,padding:'1.25rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:k.grad}} />
            <div style={{fontSize:'26px',fontWeight:'800',color:k.c,fontFamily:'Syne,sans-serif',marginTop:'8px',marginBottom:'4px'}}>{k.v}</div>
            <div style={{fontSize:'11px',color:'#6B5EA8',marginBottom:'4px'}}>{k.l}</div>
            <div style={{fontSize:'11px',color:k.c,fontWeight:'600'}}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'1.5rem',marginBottom:'1.5rem'}}>
        {/* Inscriptions chart */}
        <div style={{...card,padding:'1.5rem'}}>
          <h2 style={{fontSize:'15px',fontWeight:'700',color:'#1A1550',marginBottom:'1.5rem'}}>Évolution des inscriptions</h2>
          <div style={{display:'flex',alignItems:'flex-end',gap:'16px',height:'140px'}}>
            {months.map((m,i)=>(
              <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                <div style={{fontSize:'11px',color:'#6B4EFF',fontWeight:'600'}}>{inscriptions[i]}</div>
                <div style={{width:'100%',display:'flex',gap:'3px',alignItems:'flex-end',height:'100px'}}>
                  <div style={{flex:1,background:'linear-gradient(180deg,#6B4EFF,#6B4EFF88)',borderRadius:'4px 4px 0 0',height:`${(inscriptions[i]/maxVal)*100}%`}} />
                  <div style={{flex:1,background:'linear-gradient(180deg,#00B89C,#00B89C88)',borderRadius:'4px 4px 0 0',height:`${(completions[i]/maxVal)*100}%`}} />
                </div>
                <div style={{fontSize:'11px',color:'#9B8EC0'}}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'16px',marginTop:'12px'}}>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}><div style={{width:'10px',height:'10px',borderRadius:'2px',background:'#6B4EFF'}} /><span style={{fontSize:'11px',color:'#9B8EC0'}}>Inscrits</span></div>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}><div style={{width:'10px',height:'10px',borderRadius:'2px',background:'#00B89C'}} /><span style={{fontSize:'11px',color:'#9B8EC0'}}>Complétions</span></div>
          </div>
        </div>

        {/* Weekly activity */}
        <div style={{...card,padding:'1.5rem'}}>
          <h2 style={{fontSize:'15px',fontWeight:'700',color:'#1A1550',marginBottom:'1.5rem'}}>Activité cette semaine</h2>
          <div style={{display:'flex',alignItems:'flex-end',gap:'8px',height:'120px'}}>
            {activities.map(a=>(
              <div key={a.day} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                <div style={{fontSize:'10px',color:'#6B4EFF',fontWeight:'600'}}>{a.val}</div>
                <div style={{width:'100%',background:'linear-gradient(180deg,#D63384,#6B4EFF)',borderRadius:'4px 4px 0 0',height:`${(a.val/maxAct)*90}px`,minHeight:'4px'}} />
                <div style={{fontSize:'10px',color:'#9B8EC0'}}>{a.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top cours */}
      <div style={{...card,padding:'1.5rem'}}>
        <h2 style={{fontSize:'15px',fontWeight:'700',color:'#1A1550',marginBottom:'1.25rem'}}>Performance des cours</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {topCours.map((c,i)=>(
            <div key={c.title} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'12px 14px',background:'#F4F2FF',borderRadius:'12px',border:'1px solid rgba(107,78,255,0.08)'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'50%',background:`${c.color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:c.color,fontSize:'13px',flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:'600',fontSize:'13px',color:'#1A1550',marginBottom:'4px'}}>{c.title}</div>
                <div style={{height:'4px',background:'rgba(107,78,255,0.10)',borderRadius:'2px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${c.completion}%`,background:`linear-gradient(90deg,${c.color},${c.color}88)`,borderRadius:'2px'}} />
                </div>
              </div>
              <div style={{textAlign:'right',minWidth:'80px'}}>
                <div style={{fontSize:'13px',fontWeight:'700',color:c.color}}>{c.completion}%</div>
                <div style={{fontSize:'11px',color:'#9B8EC0'}}>{c.enrolled} inscrits</div>
              </div>
              <div style={{textAlign:'center',minWidth:'60px'}}>
                <div style={{fontSize:'14px',fontWeight:'700',color:'#E6A817'}}>{c.satisfaction}</div>
                <div style={{fontSize:'10px',color:'#9B8EC0'}}>satisfaction</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

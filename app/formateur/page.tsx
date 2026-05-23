'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const LEVELS = ['Novice','Apprenti','Expert','Maître ✦','Légende 🏆']
const LEVEL_COLORS = ['#A8A29E','#00BFA5','#FFB300','#E8651A','#7C3AED']
const LEVEL_XP = [0,300,700,1400,2500]

const badges = [
  {icon:'🎓',label:'1er cours',earned:true},{icon:'🤖',label:'Pionnier IA',earned:true},
  {icon:'👥',label:'100 apprenants',earned:true},{icon:'🔥',label:'7 jours streak',earned:true},
  {icon:'📦',label:'Expert SCORM',earned:false},{icon:'🎬',label:'Vidéaste IA',earned:false},
]

const activity = [
  {time:'2h',icon:'🎬',text:'Vidéo HeyGen publiée','sub':'Alex — Son premier jour · Ch.01',color:'#7C3AED'},
  {time:'5h',icon:'🤖',text:'Cours généré par IA','sub':'Vendre & Conseiller · 7 modules',color:'#E8651A'},
  {time:'1j',icon:'👤',text:'Nouvel apprenant','sub':'Kofi Asante → Marketing Digital',color:'#00BFA5'},
  {time:'2j',icon:'⭐',text:'Note reçue','sub':'4.8/5 · Data Science Python',color:'#FFB300'},
]

const quickActions = [
  {href:'/formateur/creer',icon:'✦',label:"Créer un cours IA",desc:'Structure + contenu + activités en 30s',color:'#E8651A',hot:true},
  {href:'/formateur/import',icon:'↑',label:'Importer SCORM / H5P',desc:'Upload ZIP, H5P, HTML, PDF',color:'#00BFA5',hot:false},
  {href:'/formateur/viewer',icon:'▶',label:'Visualiseur e-learning',desc:'Prévisualiser tout format',color:'#7C3AED',hot:false},
  {href:'/formateur/apprenants',icon:'◎',label:'Suivi apprenants',desc:'Progression et résultats',color:'#FFB300',hot:false},
]

function Counter({target,suffix=''}:{target:number,suffix?:string}){
  const [val,setVal]=useState(0)
  useEffect(()=>{
    let f=0
    const step=target/40
    const t=setInterval(()=>{
      f=Math.min(f+step,target)
      setVal(Math.floor(f))
      if(f>=target)clearInterval(t)
    },30)
    return()=>clearInterval(t)
  },[target])
  return <>{val}{suffix}</>
}

export default function FormateurPage(){
  const router=useRouter()
  const XP=1240
  const lvl=LEVEL_XP.findLastIndex((x:number)=>XP>=x)
  const nextXP=LEVEL_XP[lvl+1]??9999
  const pct=Math.round(((XP-LEVEL_XP[lvl])/(nextXP-LEVEL_XP[lvl]))*100)
  const [activeTab,setActiveTab]=useState<'overview'|'activity'>('overview')
  const [hovered,setHovered]=useState<string|null>(null)

  return(
    <div style={{paddingBottom:'2rem'}}>
      {/* HERO */}
      <div style={{marginBottom:'1.75rem',padding:'1.75rem 2rem',borderRadius:'24px',background:'linear-gradient(135deg,#12100E 0%,#1a1714 60%,#1e1510 100%)',position:'relative',overflow:'hidden',boxShadow:'0 8px 40px rgba(0,0,0,0.22)'}}>
        <div style={{position:'absolute',top:'-80px',right:'-60px',width:'260px',height:'260px',borderRadius:'50%',background:'radial-gradient(circle,rgba(232,101,26,0.15),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-50px',left:'30%',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,191,165,0.10),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1.5rem'}}>
          <div>
            <div style={{display:'inline-block',background:'rgba(232,101,26,0.18)',border:'1px solid rgba(232,101,26,0.35)',borderRadius:'8px',padding:'3px 12px',fontSize:'10px',fontWeight:'800',color:'#FF7043',marginBottom:'12px',letterSpacing:'1.5px'}}>ESPACE FORMATEUR</div>
            <h1 style={{fontSize:'28px',fontWeight:'800',color:'#F5F0E8',marginBottom:'6px',lineHeight:1.2}}>Bonjour, Formateur 👨‍🏫</h1>
            <p style={{color:'rgba(245,240,232,0.5)',fontSize:'14px'}}>Créez, gérez et transformez vos apprenants avec l&apos;IA</p>
          </div>
          {/* XP Widget */}
          <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:'16px',padding:'1rem 1.25rem',minWidth:'220px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
              <span style={{fontSize:'12px',fontWeight:'700',color:LEVEL_COLORS[lvl]}}>{LEVELS[lvl]}</span>
              <span style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{XP} / {nextXP} XP</span>
            </div>
            <div style={{height:'8px',background:'rgba(255,255,255,0.08)',borderRadius:'4px',overflow:'hidden',marginBottom:'8px'}}>
              <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${LEVEL_COLORS[lvl]},${LEVEL_COLORS[Math.min(lvl+1,4)]})`,borderRadius:'4px',transition:'width 1.2s ease'}}/>
            </div>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {badges.filter(b=>b.earned).map(b=>(
                <span key={b.label} title={b.label} style={{fontSize:'16px',cursor:'default'}}>{b.icon}</span>
              ))}
              {badges.filter(b=>!b.earned).map(b=>(
                <span key={b.label} title={b.label} style={{fontSize:'16px',opacity:0.25,filter:'grayscale(1)',cursor:'default'}}>{b.icon}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.75rem'}}>
        {[
          {label:'Cours publiés',value:3,suffix:'',icon:'📚',color:'#E8651A',grad:'linear-gradient(135deg,#E8651A,#D4A017)'},
          {label:'Apprenants',value:127,suffix:'',icon:'👥',color:'#00BFA5',grad:'linear-gradient(135deg,#00BFA5,#0099ff)'},
          {label:'Taux complétion',value:74,suffix:'%',icon:'✅',color:'#FFB300',grad:'linear-gradient(135deg,#FFB300,#E8651A)'},
          {label:'Score moyen',value:81,suffix:'/100',icon:'⭐',color:'#7C3AED',grad:'linear-gradient(135deg,#7C3AED,#00BFA5)'},
        ].map(s=>(
          <div key={s.label} style={{background:'#fff',border:'1.5px solid rgba(28,25,23,0.07)',borderRadius:'20px',padding:'1.25rem',position:'relative',overflow:'hidden',boxShadow:'0 2px 12px rgba(28,25,23,0.05)',cursor:'default',transition:'transform .2s,box-shadow .2s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-3px)';(e.currentTarget as HTMLElement).style.boxShadow=`0 8px 28px ${s.color}22`}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow='0 2px 12px rgba(28,25,23,0.05)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:s.grad}}/>
            <div style={{fontSize:'26px',marginBottom:'4px',marginTop:'8px'}}>{s.icon}</div>
            <div style={{fontSize:'30px',fontWeight:'800',color:s.color,lineHeight:1,marginBottom:'4px'}}>
              <Counter target={s.value} suffix={s.suffix}/>
            </div>
            <div style={{fontSize:'12px',color:'#57534E'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{marginBottom:'1.75rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <h2 style={{fontSize:'15px',fontWeight:'800',color:'#1C1917',letterSpacing:'-0.3px'}}>Actions rapides</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.875rem'}}>
          {quickActions.map(a=>(
            <button key={a.href} onClick={()=>router.push(a.href)}
              style={{background:'#fff',border:`1.5px solid ${hovered===a.href?a.color+'44':'rgba(28,25,23,0.07)'}`,borderRadius:'18px',padding:'1.25rem',textAlign:'left',cursor:'pointer',transition:'all .2s',position:'relative',overflow:'hidden',boxShadow:hovered===a.href?`0 8px 24px ${a.color}18`:'0 2px 12px rgba(28,25,23,0.05)',transform:hovered===a.href?'translateY(-3px)':''}}
              onMouseEnter={()=>setHovered(a.href)} onMouseLeave={()=>setHovered(null)}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:`linear-gradient(90deg,${a.color},${a.color}88)`}}/>
              {a.hot&&<div style={{position:'absolute',top:'10px',right:'10px',fontSize:'9px',background:'linear-gradient(135deg,#FF4D6D,#E8651A)',color:'#fff',padding:'2px 7px',borderRadius:'20px',fontWeight:'800',letterSpacing:'0.5px'}}>HOT</div>}
              <div style={{width:'40px',height:'40px',borderRadius:'12px',background:a.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',color:a.color,marginBottom:'12px',marginTop:'8px'}}>{a.icon}</div>
              <div style={{fontWeight:'700',fontSize:'13px',color:'#1C1917',marginBottom:'5px'}}>{a.label}</div>
              <div style={{fontSize:'11px',color:'#A8A29E',lineHeight:1.5,marginBottom:'10px'}}>{a.desc}</div>
              <div style={{fontSize:'11px',fontWeight:'700',color:a.color}}>Accéder →</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom: Courses + Activity */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'1.25rem'}}>
        {/* Courses */}
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h2 style={{fontSize:'15px',fontWeight:'800',color:'#1C1917'}}>Mes cours</h2>
            <button onClick={()=>router.push('/formateur/cours')} style={{background:'none',border:'none',fontSize:'12px',color:'#E8651A',fontWeight:'700',cursor:'pointer'}}>Voir tout →</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
            {[
              {title:"L'Art de Vendre & Conseiller",cat:'Commercial',apprenants:12,completion:28,status:'Publié',color:'#FF6340',modules:7,ai:true},
              {title:'Data Science avec Python',cat:'Tech',apprenants:54,completion:72,status:'Publié',color:'#E8651A',modules:6,ai:false},
              {title:'Marketing Digital Afrique',cat:'Business',apprenants:43,completion:58,status:'Publié',color:'#00BFA5',modules:5,ai:false},
              {title:'Leadership & Management',cat:'Soft Skills',apprenants:0,completion:0,status:'Brouillon',color:'#FFB300',modules:4,ai:true},
            ].map(c=>(
              <div key={c.title} style={{background:'#fff',border:'1.5px solid rgba(28,25,23,0.07)',borderRadius:'14px',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem',boxShadow:'0 1px 6px rgba(28,25,23,0.04)',transition:'all .15s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.boxShadow=`0 4px 16px ${c.color}18`}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.boxShadow='0 1px 6px rgba(28,25,23,0.04)'}>
                <div style={{width:'4px',height:'44px',borderRadius:'2px',background:`linear-gradient(180deg,${c.color},${c.color}55)`,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:'600',fontSize:'14px',color:'#1C1917',marginBottom:'3px',display:'flex',alignItems:'center',gap:'7px'}}>
                    {c.title}
                    {c.ai&&<span style={{fontSize:'9px',background:'rgba(124,58,237,0.12)',color:'#7C3AED',padding:'1px 6px',borderRadius:'4px',fontWeight:'800'}}>IA</span>}
                  </div>
                  <div style={{fontSize:'11px',color:'#A8A29E',display:'flex',alignItems:'center',gap:'8px'}}>
                    <span>{c.cat}</span>
                    <span>·</span>
                    <span>{c.modules} modules</span>
                    <span>·</span>
                    <span>{c.apprenants} apprenants</span>
                    {c.apprenants>0&&<>
                      <span>·</span>
                      <span style={{color:c.completion>60?'#00BFA5':c.completion>30?'#FFB300':'#A8A29E'}}>{c.completion}%</span>
                    </>}
                  </div>
                </div>
                {c.apprenants>0&&<div style={{width:'60px'}}>
                  <div style={{height:'4px',background:'rgba(28,25,23,0.06)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${c.completion}%`,background:`linear-gradient(90deg,${c.color},${c.color}aa)`,borderRadius:'2px'}}/>
                  </div>
                </div>}
                <span style={{fontSize:'11px',fontWeight:'700',padding:'4px 12px',borderRadius:'20px',background:c.status==='Publié'?'rgba(0,191,165,0.10)':'rgba(255,179,0,0.10)',color:c.status==='Publié'?'#00BFA5':'#CC8800',flexShrink:0}}>{c.status}</span>
                <button onClick={()=>router.push('/formateur/cours')} style={{background:'linear-gradient(135deg,#E8651A,#D4A017)',border:'none',borderRadius:'9px',padding:'7px 16px',color:'#fff',fontSize:'11px',fontWeight:'700',cursor:'pointer',flexShrink:0}}>Gérer →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + Badges */}
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {/* Achievements */}
          <div style={{background:'#fff',border:'1.5px solid rgba(28,25,23,0.07)',borderRadius:'18px',padding:'1.25rem',boxShadow:'0 2px 12px rgba(28,25,23,0.05)'}}>
            <h3 style={{fontSize:'13px',fontWeight:'800',color:'#1C1917',marginBottom:'12px',letterSpacing:'-0.2px'}}>🏆 Badges</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
              {badges.map(b=>(
                <div key={b.label} style={{background:b.earned?'rgba(232,101,26,0.06)':'rgba(28,25,23,0.03)',border:`1px solid ${b.earned?'rgba(232,101,26,0.18)':'rgba(28,25,23,0.06)'}`,borderRadius:'10px',padding:'10px 6px',textAlign:'center',opacity:b.earned?1:0.5}}>
                  <div style={{fontSize:'22px',marginBottom:'4px'}}>{b.icon}</div>
                  <div style={{fontSize:'9px',fontWeight:'700',color:b.earned?'#E8651A':'#A8A29E',lineHeight:1.3}}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Activity */}
          <div style={{background:'#fff',border:'1.5px solid rgba(28,25,23,0.07)',borderRadius:'18px',padding:'1.25rem',boxShadow:'0 2px 12px rgba(28,25,23,0.05)',flex:1}}>
            <h3 style={{fontSize:'13px',fontWeight:'800',color:'#1C1917',marginBottom:'12px'}}>⚡ Activité récente</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {activity.map((a,i)=>(
                <div key={i} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'10px',background:a.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>{a.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'12px',fontWeight:'600',color:'#1C1917',marginBottom:'2px'}}>{a.text}</div>
                    <div style={{fontSize:'11px',color:'#A8A29E',lineHeight:1.4}}>{a.sub}</div>
                  </div>
                  <span style={{fontSize:'10px',color:'#C4BDBA',flexShrink:0}}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

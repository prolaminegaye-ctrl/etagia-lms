'use client'
import { useState } from 'react'

const PLUGINS = [
  { id:'edugears', name:'EduGears AI', version:'1.4.0', protocol:'LTI 1.3 Advantage', status:'actif', icon:'🤖', color:'#FF5722', tools:10,
    desc:'Suite complète d\'outils pédagogiques IA — génération de cours, quiz adaptatifs, tuteur conversationnel, notation automatique.',
    config:{ claimCode:'EG-4UGR-MVU9', issuer:'https://etagia-lms.vercel.app', clientId:'7c4a2b1e-9f3d-4e8a-b5c6-3a2d1f0e8b7c', authLoginUrl:'https://lti-api.edugears.ai/lti/auth', authTokenUrl:'https://lti-api.edugears.ai/lti/token', keySetUrl:'https://etagia-lms.vercel.app/lti/certs' } },
  { id:'scorm', name:'SCORM Runtime', version:'2.1.0', protocol:'SCORM 1.2 / 2004', status:'actif', icon:'📦', color:'#00BFA5', tools:1,
    desc:'Moteur de lecture SCORM natif — compatible SCORM 1.2 et SCORM 2004, suivi xAPI, import ZIP, table des matières interactive.',
    config:null },
]

const card: React.CSSProperties = { background:'#FFFFFF', border:'1.5px solid rgba(28,25,23,0.07)', borderRadius:'18px', boxShadow:'0 2px 12px rgba(28,25,23,0.05)' }

export default function AdminPluginsPage() {
  const [selected, setSelected] = useState<string|null>(null)
  const [copied, setCopied] = useState<string|null>(null)

  function copy(text:string, key:string) {
    navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(null),1500) })
  }

  const plugin = PLUGINS.find(p=>p.id===selected)

  return (
    <div>
      <div style={{marginBottom:'2rem',padding:'2rem',background:'linear-gradient(135deg,#12100E 0%,#1C1714 100%)',borderRadius:'24px',boxShadow:'0 8px 32px rgba(0,0,0,0.20)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-50px',right:'-30px',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(255,87,34,0.08)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(255,87,34,0.18)',border:'1px solid rgba(255,87,34,0.30)',borderRadius:'8px',padding:'3px 10px',fontSize:'10px',fontWeight:'700',color:'#FF7043',marginBottom:'10px',letterSpacing:'1px',position:'relative'}}>INTÉGRATIONS LTI</div>
        <h1 style={{fontSize:'22px',fontWeight:'800',color:'#F5F0E8',fontFamily:'Syne,sans-serif',marginBottom:'4px',position:'relative'}}>Plugins & Intégrations LTI</h1>
        <p style={{color:'rgba(245,240,232,0.50)',fontSize:'13px',position:'relative'}}>Gérez les plugins installés et leurs configurations LTI 1.3</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {[
          {l:'Plugins installés',v:'2',c:'#FF5722',grad:'linear-gradient(135deg,#FF5722,#FFB300)'},
          {l:'Plugins actifs',v:'2',c:'#00BFA5',grad:'linear-gradient(135deg,#00BFA5,#7C3AED)'},
          {l:'Protocoles',v:'LTI · SCORM',c:'#FFB300',grad:'linear-gradient(135deg,#FFB300,#FF5722)'},
          {l:'Outils IA',v:'10',c:'#7C3AED',grad:'linear-gradient(135deg,#7C3AED,#00BFA5)'},
        ].map(k=>(
          <div key={k.l} style={{...card,padding:'1.25rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:k.grad}}/>
            <div style={{fontSize:'20px',fontWeight:'800',color:k.c,marginTop:'10px',marginBottom:'4px',fontFamily:'Syne,sans-serif'}}>{k.v}</div>
            <div style={{fontSize:'11px',color:'#57534E'}}>{k.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:selected?'1fr 1.6fr':'1fr',gap:'1.5rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {PLUGINS.map(p=>(
            <div key={p.id} onClick={()=>setSelected(selected===p.id?null:p.id)}
              style={{...card,padding:'1.25rem',cursor:'pointer',border:`1.5px solid ${selected===p.id?p.color+'55':'rgba(28,25,23,0.07)'}`,background:selected===p.id?p.color+'08':'#FFFFFF',transition:'all .15s'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
                <div style={{width:'50px',height:'50px',borderRadius:'14px',background:`${p.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:0}}>{p.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'5px'}}>
                    <span style={{fontWeight:'700',fontSize:'15px',color:'#1C1917'}}>{p.name}</span>
                    <span style={{fontSize:'10px',color:p.color,background:`${p.color}15`,borderRadius:'5px',padding:'2px 7px',fontWeight:'700'}}>v{p.version}</span>
                    <span style={{fontSize:'10px',color:'#00BFA5',background:'rgba(0,191,165,0.12)',borderRadius:'5px',padding:'2px 7px',fontWeight:'700'}}>● {p.status}</span>
                  </div>
                  <div style={{fontSize:'11px',color:'#A8A29E',marginBottom:'8px'}}>{p.protocol}</div>
                  <p style={{fontSize:'12px',color:'#57534E',lineHeight:'1.5'}}>{p.desc}</p>
                </div>
              </div>
              {p.config&&<div style={{marginTop:'12px',fontSize:'11px',color:p.color,background:`${p.color}12`,borderRadius:'7px',padding:'5px 12px',display:'inline-block',fontWeight:'700',border:`1px solid ${p.color}25`}}>Configurer →</div>}
            </div>
          ))}
        </div>

        {selected&&plugin?.config&&(
          <div style={{...card,padding:'1.5rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:'1.5px solid rgba(28,25,23,0.06)'}}>
              <span style={{fontSize:'24px'}}>{plugin.icon}</span>
              <div>
                <div style={{fontWeight:'700',fontSize:'16px',color:'#1C1917',fontFamily:'Syne,sans-serif'}}>{plugin.name} — Config LTI</div>
                <div style={{fontSize:'11px',color:'#A8A29E'}}>LTI 1.3 Advantage · OAuth 2.0</div>
              </div>
            </div>
            {[
              {label:'Code de réclamation',key:'claimCode',value:plugin.config.claimCode,highlight:true},
              {label:'Issuer (Platform ID)',key:'issuer',value:plugin.config.issuer},
              {label:'Client ID',key:'clientId',value:plugin.config.clientId},
              {label:'Auth Login URL',key:'authLoginUrl',value:plugin.config.authLoginUrl},
              {label:'Auth Token URL',key:'authTokenUrl',value:plugin.config.authTokenUrl},
              {label:'Key Set URL (JWKS)',key:'keySetUrl',value:plugin.config.keySetUrl},
            ].map(field=>(
              <div key={field.key} style={{marginBottom:'12px'}}>
                <div style={{fontSize:'10px',color:'#A8A29E',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'5px'}}>{field.label}</div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',background:field.highlight?'rgba(0,191,165,0.05)':'#FAF9F7',borderRadius:'10px',padding:'10px 14px',border:field.highlight?'1.5px solid rgba(0,191,165,0.25)':'1.5px solid rgba(28,25,23,0.06)'}}>
                  <code style={{flex:1,fontSize:'12px',color:field.highlight?'#00BFA5':'#57534E',fontFamily:'monospace',wordBreak:'break-all'}}>{field.value}</code>
                  <button onClick={()=>copy(field.value,field.key)} style={{background:copied===field.key?'rgba(0,191,165,0.12)':'rgba(28,25,23,0.06)',border:'none',borderRadius:'7px',padding:'5px 10px',color:copied===field.key?'#00BFA5':'#57534E',fontSize:'11px',cursor:'pointer',fontWeight:'700',flexShrink:0,transition:'all .15s'}}>
                    {copied===field.key?'✓ Copié':'Copier'}
                  </button>
                </div>
              </div>
            ))}
            <div style={{display:'flex',gap:'10px',marginTop:'1rem',paddingTop:'1rem',borderTop:'1.5px solid rgba(28,25,23,0.06)'}}>
              {[{l:'Deep Linking ✓',c:'#FF5722'},{l:'Grade Passback ✓',c:'#FFB300'},{l:'● Actif',c:'#00BFA5'}].map(item=>(
                <div key={item.l} style={{flex:1,background:item.c+'10',border:`1.5px solid ${item.c}25`,borderRadius:'10px',padding:'10px',textAlign:'center'}}>
                  <div style={{fontSize:'12px',color:item.c,fontWeight:'700'}}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

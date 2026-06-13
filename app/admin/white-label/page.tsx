'use client'
import { useState, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface WLConfig {
  enabled: boolean
  orgName: string
  tagline: string
  logoUrl: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  textColor: string
  fontBody: string
  fontDisplay: string
  customDomain: string
  sslEnabled: boolean
  emailSender: string
  emailSubjectWelcome: string
  emailBodyWelcome: string
  emailSubjectCert: string
  certBackground: string
  certSignature: string
  certLogo: string
  loginBanner: string
  loginTitle: string
  loginSubtitle: string
  loginBgColor: string
  bannerUrl: string
  heroText: string
  supportEmail: string
  supportPhone: string
  footerText: string
}

const DEFAULT: WLConfig = {
  enabled: false,
  orgName: 'Mon Académie',
  tagline: 'La formation qui vous propulse',
  logoUrl: '',
  favicon: '',
  primaryColor: '#E8651A',
  secondaryColor: '#00BFA5',
  accentColor: '#D4A017',
  bgColor: '#FAF9F7',
  textColor: 'var(--canvas)',
  fontBody: 'Plus Jakarta Sans',
  fontDisplay: 'Syne',
  customDomain: '',
  sslEnabled: true,
  emailSender: 'noreply@mon-academie.com',
  emailSubjectWelcome: 'Bienvenue sur {{platformName}} 🎉',
  emailBodyWelcome: 'Bonjour {{firstName}},\n\nBienvenue sur {{platformName}} ! Votre compte est maintenant activé.\n\nCommencez dès maintenant : {{loginUrl}}\n\nL\'équipe {{platformName}}',
  emailSubjectCert: 'Félicitations ! Votre certificat {{courseName}} est disponible',
  certBackground: '#FAF9F7',
  certSignature: '',
  certLogo: '',
  loginBanner: '',
  loginTitle: 'Connectez-vous',
  loginSubtitle: 'Accédez à votre espace de formation',
  loginBgColor: '#FAF9F7',
  bannerUrl: '',
  heroText: 'La formation digitale au service de votre croissance',
  supportEmail: 'support@mon-academie.com',
  supportPhone: '',
  footerText: '© 2026 Mon Académie. Tous droits réservés.',
}

type Tab = 'identite' | 'couleurs' | 'typo' | 'domaine' | 'emails' | 'certificats' | 'login' | 'medias'

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'identite',   icon: '🏷',  label: 'Identité'       },
  { id: 'couleurs',   icon: '🎨',  label: 'Couleurs'       },
  { id: 'typo',       icon: '✍',   label: 'Typographie'    },
  { id: 'domaine',    icon: '🌐',  label: 'Domaine'        },
  { id: 'emails',     icon: '📧',  label: 'Emails'         },
  { id: 'certificats',icon: '🏆',  label: 'Certificats'    },
  { id: 'login',      icon: '🔐',  label: 'Page connexion' },
  { id: 'medias',     icon: '🖼',  label: 'Médias'         },
]

const FONTS = ['Plus Jakarta Sans','Syne','Inter','Poppins','DM Sans','Outfit','Nunito','Raleway','Montserrat','Lato']

// ─── Styles ───────────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background:'#FFFFFF', border:'1px solid rgba(28,25,23,0.08)', borderRadius:'16px', boxShadow:'0 2px 12px rgba(28,25,23,0.04)' }
const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:'9px', border:'1px solid rgba(28,25,23,0.12)', background:'#FAF9F7', color:'var(--canvas)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }
const label: React.CSSProperties = { fontSize:'11px', fontWeight:'700', color:'#57534E', textTransform:'uppercase' as const, letterSpacing:'0.5px', display:'block', marginBottom:'5px' }

// ─── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ width:'46px', height:'26px', borderRadius:'13px', border:'none', cursor:'pointer', position:'relative', background: checked ? '#E8651A' : 'rgba(28,25,23,0.15)', transition:'background .2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:'3px', left: checked ? '23px' : '3px', width:'20px', height:'20px', borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,0.20)' }} />
    </button>
  )
}

// ─── Color picker ──────────────────────────────────────────────────────────────
function ColorPick({ label: lbl, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom:'12px' }}>
      <div style={label}>{lbl}</div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width:'40px', height:'36px', borderRadius:'8px', border:'1px solid rgba(28,25,23,0.12)', cursor:'pointer', padding:'2px' }} />
        <input value={value} onChange={e => onChange(e.target.value)} style={{ ...inp, flex:1, fontFamily:'monospace' }} />
        <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:value, flexShrink:0, border:'1px solid rgba(28,25,23,0.10)' }} />
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function WhiteLabelPage() {
  const [cfg, setCfg] = useState<WLConfig>(DEFAULT)
  const [tab, setTab] = useState<Tab>('identite')
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(false)

  const set = useCallback(<K extends keyof WLConfig>(key: K, val: WLConfig[K]) => {
    setCfg(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }, [])

  const save = () => {
    // In prod: PUT /api/admin/white-label with cfg
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth:'1100px' }}>

      {/* Header */}
      <div style={{ marginBottom:'1.75rem', padding:'1.75rem 2rem', borderRadius:'20px',
        background: cfg.enabled ? `linear-gradient(135deg,${cfg.primaryColor} 0%,${cfg.accentColor} 100%)` : 'linear-gradient(135deg,#1E1B4B 0%,#4C1D95 100%)',
        boxShadow: cfg.enabled ? `0 8px 32px ${cfg.primaryColor}44` : '0 4px 20px rgba(0,0,0,0.20)',
        position:'relative', overflow:'hidden', transition:'all .4s' }}>

      {/* Hero orange */}
      <div style={{
        borderRadius: '24px', padding: '2rem 2.5rem', marginBottom: '2rem',
        background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 45%, #FFB347 100%)',
        position: 'relative', overflow: 'hidden', color: '#fff',
        boxShadow: '0 8px 32px rgba(244,89,31,0.25)',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>White Label</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.4px', marginBottom: '4px' }}>White Label</h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '14px' }}>Personnalisez ETAGIA aux couleurs de votre organisation.</p>
        </div>
      </div>
        <div style={{ position:'absolute', top:'-50px', right:'-30px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.10),transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
              <span style={{ fontSize:'24px' }}>🏷</span>
              <h1 style={{ fontSize:'22px', fontWeight:'800', color:'#fff', fontFamily:'Syne,sans-serif', margin:0 }}>
                White Label / Marque Blanche
              </h1>
            </div>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px', margin:0 }}>
              Personnalisez entièrement la plateforme pour chaque organisation
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.15)', borderRadius:'12px', padding:'10px 16px' }}>
              <span style={{ fontSize:'12px', fontWeight:'700', color:'#fff' }}>{cfg.enabled ? '✅ White Label actif' : '⭕ Désactivé'}</span>
              <Toggle checked={cfg.enabled} onChange={v => set('enabled', v)} />
            </div>
            <button onClick={save} style={{ background:'#fff', border:'none', borderRadius:'12px', padding:'10px 20px', fontWeight:'800', fontSize:'13px', color: cfg.enabled ? cfg.primaryColor : 'var(--canvas)', cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
              {saved ? '✓ Enregistré !' : '💾 Enregistrer'}
            </button>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {!cfg.enabled && (
        <div style={{ ...card, padding:'12px 16px', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'12px', borderLeft:'4px solid #D4A017', background:'rgba(212,160,23,0.05)' }}>
          <span style={{ fontSize:'18px' }}>💡</span>
          <div style={{ fontSize:'13px', color:'#57534E' }}>
            <strong style={{ color:'var(--canvas)' }}>Mode White Label désactivé.</strong> Activez le toggle ci-dessus pour appliquer le branding personnalisé aux organisations.
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'1.5rem', alignItems:'start' }}>

        {/* Sidebar tabs */}
        <div style={{ ...card, padding:'8px', position:'sticky', top:'20px' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'9px 12px', borderRadius:'9px',
              border:'none', cursor:'pointer', textAlign:'left', marginBottom:'2px', transition:'all .15s',
              background: tab === t.id ? 'rgba(232,101,26,0.10)' : 'transparent',
              color: tab === t.id ? '#E8651A' : '#57534E',
              fontWeight: tab === t.id ? '700' : '400', fontSize:'13px', fontFamily:'inherit',
              borderLeft: tab === t.id ? '3px solid #E8651A' : '3px solid transparent',
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div>

          {/* ── IDENTITÉ ──────────────────────────────────────────────── */}
          {tab === 'identite' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>🏷 Identité de la plateforme</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                <div>
                  <span style={label}>Nom de la plateforme</span>
                  <input value={cfg.orgName} onChange={e=>set('orgName',e.target.value)} style={inp} placeholder="Mon Académie Digitale" />
                </div>
                <div>
                  <span style={label}>Email de support</span>
                  <input value={cfg.supportEmail} onChange={e=>set('supportEmail',e.target.value)} style={inp} placeholder="support@mon-academie.com" />
                </div>
              </div>
              <div style={{ marginBottom:'16px' }}>
                <span style={label}>Slogan / Tagline</span>
                <input value={cfg.tagline} onChange={e=>set('tagline',e.target.value)} style={inp} placeholder="La formation qui vous propulse" />
              </div>
              <div style={{ marginBottom:'16px' }}>
                <span style={label}>Texte hero principal</span>
                <textarea value={cfg.heroText} onChange={e=>set('heroText',e.target.value)} rows={2} style={{ ...inp, resize:'vertical' as const }} placeholder="La formation digitale au service de votre croissance" />
              </div>
              <div style={{ marginBottom:'16px' }}>
                <span style={label}>Texte footer</span>
                <input value={cfg.footerText} onChange={e=>set('footerText',e.target.value)} style={inp} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div>
                  <span style={label}>URL du logo (PNG/SVG)</span>
                  <input value={cfg.logoUrl} onChange={e=>set('logoUrl',e.target.value)} style={inp} placeholder="https://..." />
                  {cfg.logoUrl && <img src={cfg.logoUrl} alt="logo preview" style={{ marginTop:'8px', height:'40px', objectFit:'contain', borderRadius:'6px', background:'#F4F4F4', padding:'4px' }} onError={e=>(e.currentTarget.style.display='none')} />}
                </div>
                <div>
                  <span style={label}>URL du favicon</span>
                  <input value={cfg.favicon} onChange={e=>set('favicon',e.target.value)} style={inp} placeholder="https://.../favicon.ico" />
                </div>
              </div>
              <div style={{ marginTop:'20px', padding:'16px', background:'rgba(232,101,26,0.05)', borderRadius:'12px', border:'1px solid rgba(232,101,26,0.15)' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#E8651A', marginBottom:'8px' }}>APERÇU — IDENTITÉ</div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`linear-gradient(135deg,${cfg.primaryColor},${cfg.accentColor})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'800', fontSize:'16px' }}>
                    {cfg.orgName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:'800', fontSize:'16px', color:'var(--canvas)' }}>{cfg.orgName || 'Mon Académie'}</div>
                    <div style={{ fontSize:'12px', color:'#A8A29E' }}>{cfg.tagline}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COULEURS ──────────────────────────────────────────────── */}
          {tab === 'couleurs' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>🎨 Palette de couleurs</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                <div>
                  <ColorPick label="Couleur principale (Primary)" value={cfg.primaryColor} onChange={v=>set('primaryColor',v)} />
                  <ColorPick label="Couleur secondaire (Secondary)" value={cfg.secondaryColor} onChange={v=>set('secondaryColor',v)} />
                  <ColorPick label="Couleur d'accent / Gold" value={cfg.accentColor} onChange={v=>set('accentColor',v)} />
                </div>
                <div>
                  <ColorPick label="Couleur de fond (Background)" value={cfg.bgColor} onChange={v=>set('bgColor',v)} />
                  <ColorPick label="Couleur du texte (Text)" value={cfg.textColor} onChange={v=>set('textColor',v)} />
                </div>
              </div>
              {/* Palette preview */}
              <div style={{ marginTop:'20px', padding:'16px', background:'#F9F9F7', borderRadius:'12px', border:'1px solid rgba(28,25,23,0.08)' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#A8A29E', marginBottom:'10px' }}>APERÇU PALETTE</div>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {[
                    { label:'Primary', color:cfg.primaryColor },
                    { label:'Secondary', color:cfg.secondaryColor },
                    { label:'Accent', color:cfg.accentColor },
                    { label:'Background', color:cfg.bgColor },
                    { label:'Text', color:cfg.textColor },
                  ].map(c => (
                    <div key={c.label} style={{ textAlign:'center' }}>
                      <div style={{ width:'56px', height:'56px', borderRadius:'12px', background:c.color, border:'1px solid rgba(28,25,23,0.10)', marginBottom:'4px' }} />
                      <div style={{ fontSize:'9px', color:'#A8A29E', fontWeight:'600' }}>{c.label}</div>
                      <div style={{ fontSize:'9px', color:'#A8A29E', fontFamily:'monospace' }}>{c.color}</div>
                    </div>
                  ))}
                </div>
                {/* Mock button preview */}
                <div style={{ marginTop:'14px', display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
                  <button style={{ background:cfg.primaryColor, border:'none', borderRadius:'10px', padding:'9px 20px', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'default' }}>
                    Bouton primaire
                  </button>
                  <button style={{ background:'transparent', border:`1.5px solid ${cfg.primaryColor}`, borderRadius:'10px', padding:'9px 20px', color:cfg.primaryColor, fontWeight:'700', fontSize:'13px', cursor:'default' }}>
                    Bouton outline
                  </button>
                  <span style={{ background:`${cfg.secondaryColor}18`, color:cfg.secondaryColor, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:'700' }}>Badge</span>
                </div>
              </div>
              {/* Presets */}
              <div style={{ marginTop:'16px' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#A8A29E', marginBottom:'8px' }}>PALETTES PRÉDÉFINIES</div>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {[
                    { name:'Soleil Kente', primary:'#E8651A', secondary:'#00BFA5', accent:'#D4A017' },
                    { name:'Océan Indigo', primary:'#4F46E5', secondary:'#06B6D4', accent:'#F59E0B' },
                    { name:'Forêt Émeraude', primary:'#059669', secondary:'#7C3AED', accent:'#F59E0B' },
                    { name:'Nuit Royale', primary:'#7C3AED', secondary:'#EC4899', accent:'#F59E0B' },
                    { name:'Sahel Rouge', primary:'var(--orange)', secondary:'#D4A017', accent:'#78350F' },
                  ].map(p => (
                    <button key={p.name} onClick={()=>{ set('primaryColor',p.primary); set('secondaryColor',p.secondary); set('accentColor',p.accent) }}
                      style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', borderRadius:'20px', border:'1px solid rgba(28,25,23,0.10)', background:'#fff', cursor:'pointer', fontSize:'12px', fontWeight:'600', color:'#57534E' }}>
                      <div style={{ display:'flex', gap:'2px' }}>
                        <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:p.primary }} />
                        <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:p.secondary }} />
                        <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:p.accent }} />
                      </div>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TYPOGRAPHIE ────────────────────────────────────────────── */}
          {tab === 'typo' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>✍ Typographie</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
                <div>
                  <span style={label}>Police du corps de texte</span>
                  <select value={cfg.fontBody} onChange={e=>set('fontBody',e.target.value)} style={inp}>
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <span style={label}>Police des titres (Display)</span>
                  <select value={cfg.fontDisplay} onChange={e=>set('fontDisplay',e.target.value)} style={inp}>
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              {/* Font preview */}
              <div style={{ padding:'20px', background:'#FAF9F7', borderRadius:'12px', border:'1px solid rgba(28,25,23,0.08)' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#A8A29E', marginBottom:'12px' }}>APERÇU TYPOGRAPHIQUE</div>
                <div style={{ fontFamily:`'${cfg.fontDisplay}',sans-serif`, fontSize:'28px', fontWeight:'800', color:'var(--canvas)', marginBottom:'8px', lineHeight:1.2 }}>
                  {cfg.orgName || 'Mon Académie'} — Titre H1
                </div>
                <div style={{ fontFamily:`'${cfg.fontDisplay}',sans-serif`, fontSize:'18px', fontWeight:'700', color:'#57534E', marginBottom:'10px' }}>
                  Sous-titre H2 — Formation digitale
                </div>
                <div style={{ fontFamily:`'${cfg.fontBody}',sans-serif`, fontSize:'14px', color:'#57534E', lineHeight:1.7, marginBottom:'10px' }}>
                  Corps de texte — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. La plateforme {cfg.orgName} vous offre les meilleures formations.
                </div>
                <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                  <span style={{ fontFamily:`'${cfg.fontBody}',sans-serif`, fontSize:'12px', color:'#A8A29E' }}>Caption — Texte secondaire</span>
                  <span style={{ fontFamily:`'${cfg.fontBody}',sans-serif`, fontSize:'12px', fontWeight:'700', color:cfg.primaryColor }}>Lien actif</span>
                </div>
              </div>
            </div>
          )}

          {/* ── DOMAINE ────────────────────────────────────────────────── */}
          {tab === 'domaine' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>🌐 Nom de domaine personnalisé</h2>
              <div style={{ marginBottom:'16px' }}>
                <span style={label}>Domaine personnalisé</span>
                <div style={{ display:'flex', gap:'8px' }}>
                  <input value={cfg.customDomain} onChange={e=>set('customDomain',e.target.value)} style={{ ...inp, flex:1 }} placeholder="academie.monorganisme.com" />
                  <button style={{ background:cfg.primaryColor, border:'none', borderRadius:'9px', padding:'9px 16px', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer', whiteSpace:'nowrap' }}>
                    Vérifier DNS
                  </button>
                </div>
                <div style={{ fontSize:'11px', color:'#A8A29E', marginTop:'5px' }}>
                  Pointez votre CNAME vers <code style={{ background:'#F4F4F4', padding:'1px 6px', borderRadius:'4px' }}>etagia-lms.vercel.app</code>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'#FAF9F7', borderRadius:'10px', border:'1px solid rgba(28,25,23,0.08)', marginBottom:'12px' }}>
                <div>
                  <div style={{ fontWeight:'600', fontSize:'13px', color:'var(--canvas)' }}>SSL / HTTPS automatique</div>
                  <div style={{ fontSize:'11px', color:'#A8A29E' }}>Let&apos;s Encrypt — certificat auto-renouvelé</div>
                </div>
                <Toggle checked={cfg.sslEnabled} onChange={v=>set('sslEnabled',v)} />
              </div>
              {/* DNS Guide */}
              <div style={{ background:'rgba(0,191,165,0.06)', border:'1px solid rgba(0,191,165,0.20)', borderRadius:'12px', padding:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:'800', color:'#00897B', marginBottom:'10px' }}>📋 Guide de configuration DNS</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {[
                    { type:'CNAME', host:'www', value:'etagia-lms.vercel.app' },
                    { type:'CNAME', host:'@', value:'etagia-lms.vercel.app' },
                  ].map((r,i) => (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 80px 1fr', gap:'8px', alignItems:'center' }}>
                      <span style={{ fontSize:'11px', fontWeight:'700', background:'#E8F5E9', color:'#2E7D32', padding:'2px 8px', borderRadius:'4px', textAlign:'center' }}>{r.type}</span>
                      <code style={{ fontSize:'11px', color:'var(--canvas)', background:'#F4F4F4', padding:'2px 8px', borderRadius:'4px' }}>{r.host}</code>
                      <code style={{ fontSize:'11px', color:'#57534E', background:'#F4F4F4', padding:'2px 8px', borderRadius:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.value}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── EMAILS ─────────────────────────────────────────────────── */}
          {tab === 'emails' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>📧 Templates d&apos;emails automatiques</h2>
              <div style={{ marginBottom:'16px' }}>
                <span style={label}>Adresse expéditeur</span>
                <input value={cfg.emailSender} onChange={e=>set('emailSender',e.target.value)} style={inp} placeholder="noreply@mon-academie.com" />
              </div>
              <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'var(--canvas)', marginBottom:'10px' }}>📬 Email de bienvenue</div>
                <div style={{ marginBottom:'8px' }}>
                  <span style={label}>Objet</span>
                  <input value={cfg.emailSubjectWelcome} onChange={e=>set('emailSubjectWelcome',e.target.value)} style={inp} />
                </div>
                <div>
                  <span style={label}>Corps du message</span>
                  <textarea value={cfg.emailBodyWelcome} onChange={e=>set('emailBodyWelcome',e.target.value)} rows={6} style={{ ...inp, resize:'vertical' as const, fontFamily:'monospace', fontSize:'12px' }} />
                </div>
              </div>
              <div style={{ marginBottom:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'var(--canvas)', marginBottom:'10px' }}>🏆 Email certificat</div>
                <span style={label}>Objet</span>
                <input value={cfg.emailSubjectCert} onChange={e=>set('emailSubjectCert',e.target.value)} style={inp} />
              </div>
              <div style={{ padding:'12px', background:'rgba(212,160,23,0.08)', borderRadius:'10px', border:'1px solid rgba(212,160,23,0.20)' }}>
                <div style={{ fontSize:'11px', color:'#78350F', fontWeight:'700', marginBottom:'4px' }}>Variables disponibles</div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {['{{firstName}}','{{lastName}}','{{platformName}}','{{loginUrl}}','{{courseName}}','{{certUrl}}'].map(v => (
                    <code key={v} style={{ fontSize:'11px', background:'rgba(212,160,23,0.15)', color:'#92400E', padding:'2px 7px', borderRadius:'4px' }}>{v}</code>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CERTIFICATS ────────────────────────────────────────────── */}
          {tab === 'certificats' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>🏆 Personnalisation des certificats</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                <div>
                  <span style={label}>Logo sur le certificat (URL)</span>
                  <input value={cfg.certLogo} onChange={e=>set('certLogo',e.target.value)} style={inp} placeholder="https://..." />
                </div>
                <div>
                  <span style={label}>Couleur de fond</span>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                    <input type="color" value={cfg.certBackground} onChange={e=>set('certBackground',e.target.value)} style={{ width:'40px', height:'36px', borderRadius:'8px', border:'1px solid rgba(28,25,23,0.12)', cursor:'pointer', padding:'2px' }} />
                    <input value={cfg.certBackground} onChange={e=>set('certBackground',e.target.value)} style={{ ...inp, flex:1, fontFamily:'monospace' }} />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom:'16px' }}>
                <span style={label}>Signature (URL image PNG transparent)</span>
                <input value={cfg.certSignature} onChange={e=>set('certSignature',e.target.value)} style={inp} placeholder="https://..." />
              </div>
              {/* Certificate preview */}
              <div style={{ background:'#F9F9F7', borderRadius:'12px', padding:'16px', border:'1px solid rgba(28,25,23,0.08)' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#A8A29E', marginBottom:'12px' }}>APERÇU CERTIFICAT</div>
                <div style={{ background:cfg.certBackground, borderRadius:'12px', border:`3px solid ${cfg.primaryColor}`, padding:'24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'6px', background:`linear-gradient(90deg,${cfg.primaryColor},${cfg.accentColor})` }} />
                  <div style={{ fontSize:'11px', fontWeight:'700', letterSpacing:'3px', color:cfg.primaryColor, textTransform:'uppercase', marginBottom:'8px' }}>CERTIFICAT DE RÉUSSITE</div>
                  <div style={{ fontSize:'22px', fontWeight:'800', color:'var(--canvas)', marginBottom:'6px', fontFamily:'Syne,sans-serif' }}>Prénom Nom</div>
                  <div style={{ fontSize:'12px', color:'#57534E', marginBottom:'10px' }}>a complété avec succès la formation</div>
                  <div style={{ fontSize:'15px', fontWeight:'700', color:cfg.primaryColor, marginBottom:'16px' }}>« Nom du cours »</div>
                  <div style={{ fontSize:'11px', color:'#A8A29E', marginBottom:'12px' }}>Délivré le 17 mai 2026</div>
                  <div style={{ fontSize:'13px', fontWeight:'800', color:'var(--canvas)' }}>{cfg.orgName}</div>
                  {cfg.certSignature && <img src={cfg.certSignature} alt="signature" style={{ height:'40px', marginTop:'8px', objectFit:'contain' }} />}
                </div>
              </div>
            </div>
          )}

          {/* ── PAGE CONNEXION ─────────────────────────────────────────── */}
          {tab === 'login' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>🔐 Page de connexion</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                <div>
                  <span style={label}>Titre</span>
                  <input value={cfg.loginTitle} onChange={e=>set('loginTitle',e.target.value)} style={inp} />
                </div>
                <div>
                  <span style={label}>Sous-titre</span>
                  <input value={cfg.loginSubtitle} onChange={e=>set('loginSubtitle',e.target.value)} style={inp} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                <div>
                  <span style={label}>Couleur de fond</span>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                    <input type="color" value={cfg.loginBgColor} onChange={e=>set('loginBgColor',e.target.value)} style={{ width:'40px', height:'36px', borderRadius:'8px', border:'1px solid rgba(28,25,23,0.12)', cursor:'pointer', padding:'2px' }} />
                    <input value={cfg.loginBgColor} onChange={e=>set('loginBgColor',e.target.value)} style={{ ...inp, flex:1, fontFamily:'monospace' }} />
                  </div>
                </div>
                <div>
                  <span style={label}>URL bannière latérale</span>
                  <input value={cfg.loginBanner} onChange={e=>set('loginBanner',e.target.value)} style={inp} placeholder="https://..." />
                </div>
              </div>
              {/* Login preview */}
              <div style={{ background:'#F9F9F7', borderRadius:'12px', padding:'16px', border:'1px solid rgba(28,25,23,0.08)' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#A8A29E', marginBottom:'12px' }}>APERÇU PAGE DE CONNEXION</div>
                <div style={{ background:cfg.loginBgColor, borderRadius:'10px', padding:'24px', display:'flex', gap:'16px' }}>
                  {cfg.loginBanner && (
                    <div style={{ width:'40%', borderRadius:'8px', background:`url(${cfg.loginBanner}) center/cover`, minHeight:'120px' }} />
                  )}
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:'800', fontSize:'16px', color:'var(--canvas)', marginBottom:'4px' }}>{cfg.loginTitle}</div>
                    <div style={{ fontSize:'12px', color:'#A8A29E', marginBottom:'14px' }}>{cfg.loginSubtitle}</div>
                    <div style={{ background:'#fff', borderRadius:'8px', padding:'8px 12px', marginBottom:'8px', border:'1px solid rgba(28,25,23,0.10)', fontSize:'12px', color:'#A8A29E' }}>Email</div>
                    <div style={{ background:'#fff', borderRadius:'8px', padding:'8px 12px', marginBottom:'10px', border:'1px solid rgba(28,25,23,0.10)', fontSize:'12px', color:'#A8A29E' }}>Mot de passe</div>
                    <div style={{ background:`linear-gradient(135deg,${cfg.primaryColor},${cfg.accentColor})`, borderRadius:'8px', padding:'9px', textAlign:'center', color:'#fff', fontWeight:'700', fontSize:'13px' }}>
                      Se connecter
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MÉDIAS ─────────────────────────────────────────────────── */}
          {tab === 'medias' && (
            <div style={{ ...card, padding:'1.5rem' }}>
              <h2 style={{ fontSize:'16px', fontWeight:'800', color:'var(--canvas)', marginBottom:'1.25rem' }}>🖼 Médias & Bannières</h2>
              <div style={{ marginBottom:'16px' }}>
                <span style={label}>Bannière principale (Hero) — URL image</span>
                <input value={cfg.bannerUrl} onChange={e=>set('bannerUrl',e.target.value)} style={inp} placeholder="https://votre-cdn.com/banner.jpg" />
                {cfg.bannerUrl && (
                  <img src={cfg.bannerUrl} alt="banner" style={{ marginTop:'10px', width:'100%', borderRadius:'10px', objectFit:'cover', maxHeight:'180px', border:'1px solid rgba(28,25,23,0.08)' }}
                    onError={e=>(e.currentTarget.style.display='none')} />
                )}
              </div>
              <div style={{ padding:'14px', background:'#FAF9F7', borderRadius:'12px', border:'1px dashed rgba(28,25,23,0.15)' }}>
                <div style={{ textAlign:'center', padding:'20px' }}>
                  <div style={{ fontSize:'28px', marginBottom:'8px' }}>📁</div>
                  <div style={{ fontWeight:'700', fontSize:'13px', color:'var(--canvas)', marginBottom:'4px' }}>Upload direct d&apos;images</div>
                  <div style={{ fontSize:'12px', color:'#A8A29E', marginBottom:'12px' }}>PNG, JPG, SVG, WebP — max 5 MB</div>
                  <button style={{ background:cfg.primaryColor, border:'none', borderRadius:'9px', padding:'9px 20px', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
                    Parcourir les fichiers
                  </button>
                </div>
              </div>
              <div style={{ marginTop:'16px', padding:'12px', background:'rgba(0,191,165,0.06)', borderRadius:'10px', border:'1px solid rgba(0,191,165,0.15)' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#00897B', marginBottom:'6px' }}>💡 Recommandations</div>
                <div style={{ fontSize:'12px', color:'#57534E', lineHeight:'1.7' }}>
                  Logo : SVG ou PNG transparent, 200×60px min · Bannière hero : 1440×600px · Favicon : 32×32 ICO ou PNG · Signature certificat : PNG transparent, fond blanc
                </div>
              </div>
            </div>
          )}

          {/* Save button bottom */}
          <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'1.25rem' }}>
            <button onClick={()=>setCfg(DEFAULT)} style={{ background:'transparent', border:'1px solid rgba(28,25,23,0.12)', borderRadius:'10px', padding:'10px 20px', color:'#A8A29E', fontWeight:'600', fontSize:'13px', cursor:'pointer' }}>
              Réinitialiser
            </button>
            <button onClick={save} style={{ background:`linear-gradient(135deg,${cfg.primaryColor},${cfg.accentColor})`, border:'none', borderRadius:'10px', padding:'10px 24px', color:'#fff', fontWeight:'800', fontSize:'14px', cursor:'pointer', boxShadow:`0 4px 16px ${cfg.primaryColor}44` }}>
              {saved ? '✓ Enregistré !' : '💾 Enregistrer les changements'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'

type Screen = 'landing' | 'payment' | 'access'
type PayMethod = 'wave' | 'orange' | null

const SUBJECTS = [
  { id: 'maths', icon: '📐', label: 'Mathématiques', desc: '8 exercices + 6 fiches', color: '#6366F1' },
  { id: 'physique', icon: '⚗️', label: 'Physique-Chimie', desc: '8 exercices + 6 fiches', color: '#3B82F6' },
  { id: 'svt', icon: '🧬', label: 'SVT', desc: '7 exercices + 8 fiches', color: '#10B981' },
  { id: 'francais', icon: '📝', label: 'Français', desc: '6 exercices + 7 fiches', color: '#F59E0B' },
  { id: 'histoire', icon: '🏛️', label: 'Histoire-Géo', desc: '7 exercices + 6 fiches', color: '#EF4444' },
  { id: 'philo', icon: '🦉', label: 'Philosophie', desc: '6 exercices + 5 fiches', color: '#8B5CF6' },
  { id: 'anglais', icon: '🗣️', label: 'Anglais', desc: '8 exercices + 6 fiches', color: '#06B6D4' },
  { id: 'geo', icon: '🌍', label: 'Géographie', desc: '6 exercices + 6 fiches', color: '#84CC16' },
]

const PLANS = [
  {
    id: 'weekly', label: '7 jours', price: '500 FCFA', badge: null, wave: '221 77 000 0000', orange: '221 77 111 1111',
    desc: 'Accès complet une semaine — idéal à la veille des épreuves.',
    features: ['Toutes les matières', 'Quiz illimités', 'Fiches de révision'],
  },
  {
    id: 'monthly', label: '30 jours', price: '1 500 FCFA', badge: '⭐ POPULAIRE', wave: '221 77 000 0000', orange: '221 77 111 1111',
    desc: 'Préparez-vous sereinement sur un mois complet.',
    features: ['Toutes les matières', 'Quiz illimités', 'Fiches de révision', 'Examens blancs', 'Suivi de progression'],
  },
  {
    id: 'annual', label: 'Année scolaire', price: '5 000 FCFA', badge: '🏆 MEILLEURE OFFRE', wave: '221 77 000 0000', orange: '221 77 111 1111',
    desc: 'L\'accès complet pour toute l\'année scolaire.',
    features: ['Toutes les matières', 'Quiz illimités', 'Fiches de révision', 'Examens blancs', 'Suivi de progression', 'Nouveaux contenus inclus'],
  },
]

export default function PassBacMini() {
  const [screen, setScreen]     = useState<Screen>('landing')
  const [plan, setPlan]         = useState(PLANS[1])
  const [payMethod, setPayMethod] = useState<PayMethod>(null)
  const [phone, setPhone]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [paid, setPaid]         = useState(false)
  const [copiedNum, setCopiedNum] = useState<string | null>(null)

  function simulatePay() {
    if (!phone || phone.length < 9) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setPaid(true); setTimeout(() => setScreen('access'), 1400) }, 2200)
  }

  function copyNum(num: string) {
    navigator.clipboard.writeText(num.replace(/\s/g, '')).catch(() => {})
    setCopiedNum(num)
    setTimeout(() => setCopiedNum(null), 2000)
  }

  // ─── LANDING ────────────────────────────────────────────────────────────────
  if (screen === 'landing') return (
    <div style={{ minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', background:'linear-gradient(160deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', color:'#fff', overflowX:'hidden' }}>

      {/* Hero */}
      <div style={{ padding:'48px 20px 32px', textAlign:'center', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,0.2),transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'50px', padding:'8px 18px', marginBottom:'24px', fontSize:'13px', fontWeight:'700' }}>
          <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#10B981', animation:'pulse 2s infinite' }} />
          Disponible maintenant — Prépare ton BAC 🇸🇳
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
        <h1 style={{ fontSize:'clamp(32px,8vw,52px)', fontWeight:'900', margin:'0 0 16px', lineHeight:1.1, letterSpacing:'-1px' }}>
          Mon <span style={{ background:'linear-gradient(135deg,#A855F7,#6366F1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Pass'BAC</span>
        </h1>
        <p style={{ fontSize:'clamp(14px,4vw,18px)', color:'rgba(255,255,255,0.6)', margin:'0 auto 32px', maxWidth:'320px', lineHeight:1.6 }}>
          Tous tes cours, quiz et fiches de révision pour réussir le Baccalauréat — accessibles sur mobile.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginBottom:'32px' }}>
          {['8 matières', '60+ exercices', 'Fiches 3D', 'Examens blancs'].map(f => (
            <span key={f} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'50px', padding:'6px 14px', fontSize:'12px', fontWeight:'700' }}>✓ {f}</span>
          ))}
        </div>
        <button onClick={() => setScreen('payment')}
          style={{ padding:'16px 40px', borderRadius:'16px', border:'none', background:'linear-gradient(135deg,#A855F7,#6366F1)', color:'#fff', fontWeight:'900', fontSize:'16px', cursor:'pointer', boxShadow:'0 8px 32px rgba(168,85,247,0.4)', letterSpacing:'-0.3px' }}>
          Commencer — Accès immédiat ✨
        </button>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', marginTop:'12px' }}>Paiement mobile • Accès instantané • Sans inscription longue</p>
      </div>

      {/* Subjects grid */}
      <div style={{ padding:'0 16px 32px' }}>
        <h2 style={{ textAlign:'center', fontSize:'18px', fontWeight:'800', marginBottom:'20px', color:'rgba(255,255,255,0.85)' }}>Ce que tu vas réviser 📚</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px' }}>
          {SUBJECTS.map(s => (
            <div key={s.id} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${s.color}30`, borderRadius:'16px', padding:'16px 14px', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`${s.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ fontWeight:'700', fontSize:'13px' }}>{s.label}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', marginTop:'2px' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div style={{ padding:'24px 20px 48px', textAlign:'center' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:'24px', flexWrap:'wrap' }}>
          {[['2 400+', 'Apprenants actifs'], ['96%', 'Taux de satisfaction'], ['4.9/5', 'Note moyenne']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize:'28px', fontWeight:'900', background:'linear-gradient(135deg,#A855F7,#6366F1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{v}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:'600' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ─── PAYMENT ────────────────────────────────────────────────────────────────
  if (screen === 'payment') return (
    <div style={{ minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', background:'#F7F5FF', padding:'24px 16px 40px' }}>
      <button onClick={() => setScreen('landing')} style={{ border:'none', background:'transparent', color:'#6366F1', fontWeight:'700', fontSize:'14px', cursor:'pointer', marginBottom:'20px', display:'flex', alignItems:'center', gap:'6px', padding:0 }}>← Retour</button>

      <h1 style={{ fontSize:'22px', fontWeight:'900', color:'#1E1B2E', marginBottom:'6px' }}>Choisissez votre accès</h1>
      <p style={{ color:'#6B7280', fontSize:'13px', marginBottom:'24px' }}>Accès immédiat après paiement mobile</p>

      {/* Plans */}
      <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'28px' }}>
        {PLANS.map(p => (
          <button key={p.id} onClick={() => setPlan(p)}
            style={{ padding:'18px 16px', borderRadius:'16px', border:`2px solid ${plan.id===p.id ? '#A855F7' : '#E5E7EB'}`, background: plan.id===p.id ? 'rgba(168,85,247,0.06)' : '#fff', cursor:'pointer', textAlign:'left', position:'relative', transition:'all 0.2s' }}>
            {p.badge && <span style={{ position:'absolute', top:'-10px', left:'16px', background:'linear-gradient(135deg,#A855F7,#6366F1)', color:'#fff', fontSize:'10px', fontWeight:'800', padding:'3px 10px', borderRadius:'50px', letterSpacing:'0.5px' }}>{p.badge}</span>}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:'800', fontSize:'16px', color:'#1E1B2E' }}>{p.label}</div>
                <div style={{ fontSize:'12px', color:'#9CA3AF', marginTop:'3px' }}>{p.desc}</div>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'8px' }}>
                  {p.features.map(f => <span key={f} style={{ fontSize:'10px', background:'rgba(168,85,247,0.08)', color:'#7C3AED', padding:'2px 8px', borderRadius:'50px', fontWeight:'700' }}>✓ {f}</span>)}
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0, marginLeft:'12px' }}>
                <div style={{ fontSize:'20px', fontWeight:'900', color:'#A855F7' }}>{p.price}</div>
                <div style={{ width:'22px', height:'22px', borderRadius:'50%', border:`2px solid ${plan.id===p.id ? '#A855F7' : '#D1D5DB'}`, background: plan.id===p.id ? '#A855F7' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:'auto', marginTop:'6px', transition:'all 0.2s' }}>
                  {plan.id===p.id && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#fff' }} />}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Payment method */}
      <h2 style={{ fontSize:'16px', fontWeight:'800', color:'#1E1B2E', marginBottom:'14px' }}>Mode de paiement</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px' }}>
        {([
          { id:'wave', label:'Wave', icon:'🌊', color:'#0088FF', bg:'#EFF6FF', num: plan.wave },
          { id:'orange', label:'Orange Money', icon:'🍊', color:'#FF6600', bg:'#FFF7ED', num: plan.orange },
        ] as const).map(m => (
          <button key={m.id} onClick={() => setPayMethod(m.id)}
            style={{ padding:'16px 12px', borderRadius:'14px', border:`2px solid ${payMethod===m.id ? m.color : '#E5E7EB'}`, background: payMethod===m.id ? m.bg : '#fff', cursor:'pointer', textAlign:'center', transition:'all 0.2s' }}>
            <div style={{ fontSize:'28px', marginBottom:'6px' }}>{m.icon}</div>
            <div style={{ fontWeight:'800', fontSize:'13px', color:'#1E1B2E' }}>{m.label}</div>
            {payMethod === m.id && (
              <div style={{ marginTop:'8px', padding:'6px 8px', background:'rgba(0,0,0,0.04)', borderRadius:'8px', fontSize:'11px', color:'#6B7280', fontWeight:'600' }}>
                Envoyez à : {m.num}
                <button onClick={e => { e.stopPropagation(); copyNum(m.num) }}
                  style={{ display:'block', width:'100%', marginTop:'4px', background: copiedNum===m.num ? '#10B981' : m.color, color:'#fff', border:'none', borderRadius:'6px', padding:'4px', fontSize:'10px', fontWeight:'800', cursor:'pointer', transition:'background 0.2s' }}>
                  {copiedNum===m.num ? '✓ Copié !' : '📋 Copier le numéro'}
                </button>
              </div>
            )}
          </button>
        ))}
      </div>

      {payMethod && (
        <div style={{ background:'#fff', borderRadius:'16px', padding:'20px', border:'1px solid #E5E7EB', marginBottom:'20px' }}>
          <div style={{ fontWeight:'800', fontSize:'14px', color:'#1E1B2E', marginBottom:'12px' }}>
            {payMethod === 'wave' ? '🌊 Confirmer votre paiement Wave' : '🍊 Confirmer votre paiement Orange Money'}
          </div>
          <div style={{ fontSize:'12px', color:'#6B7280', marginBottom:'16px', lineHeight:'1.7', background:'rgba(168,85,247,0.04)', borderRadius:'10px', padding:'12px', border:'1px solid rgba(168,85,247,0.15)' }}>
            <strong>Instructions :</strong><br />
            1. Ouvrez votre app {payMethod === 'wave' ? 'Wave' : 'Orange Money'}<br />
            2. Envoyez <strong>{plan.price}</strong> au numéro ci-dessus<br />
            3. Entrez votre numéro de téléphone ci-dessous pour activer votre accès
          </div>
          <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#57534E', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Votre numéro de téléphone</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', fontSize:'16px' }}>📱</span>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+221 77 000 00 00" type="tel"
              style={{ width:'100%', padding:'12px 12px 12px 40px', boxSizing:'border-box', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'15px', outline:'none', color:'#1E1B2E', fontWeight:'600' }}
              onFocus={e => e.target.style.borderColor = '#A855F7'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
          </div>
        </div>
      )}

      {paid && (
        <div style={{ background:'rgba(16,185,129,0.08)', border:'1.5px solid rgba(16,185,129,0.3)', borderRadius:'14px', padding:'14px 16px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'22px' }}>✅</span>
          <div>
            <div style={{ fontWeight:'800', fontSize:'14px', color:'#065F46' }}>Paiement confirmé !</div>
            <div style={{ fontSize:'12px', color:'#059669' }}>Redirection en cours…</div>
          </div>
        </div>
      )}

      <button onClick={simulatePay} disabled={!payMethod || !phone || loading || paid}
        style={{
          width:'100%', padding:'16px', borderRadius:'14px', border:'none',
          background: payMethod && phone ? 'linear-gradient(135deg,#A855F7,#6366F1)' : '#E5E7EB',
          color: payMethod && phone ? '#fff' : '#9CA3AF',
          fontWeight:'900', fontSize:'16px', cursor: payMethod && phone ? 'pointer' : 'default',
          boxShadow: payMethod && phone ? '0 8px 24px rgba(168,85,247,0.35)' : 'none',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.25s',
        }}>
        {loading ? <><div style={{ width:'18px', height:'18px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style> Vérification…</> : `🔓 Accéder au Pass'BAC — ${plan.price}`}
      </button>
      <p style={{ textAlign:'center', fontSize:'11px', color:'#9CA3AF', marginTop:'12px', lineHeight:'1.5' }}>🔒 Paiement sécurisé • Accès immédiat après confirmation</p>
    </div>
  )

  // ─── ACCESS ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', background:'#F7F5FF', padding:'20px 16px 40px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', background:'#fff', borderRadius:'16px', padding:'16px', border:'1px solid rgba(168,85,247,0.15)', boxShadow:'0 2px 8px rgba(168,85,247,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'linear-gradient(135deg,#A855F7,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'900', fontSize:'16px' }}>E</div>
          <div>
            <div style={{ fontWeight:'800', fontSize:'14px', color:'#1E1B2E' }}>Pass'BAC</div>
            <div style={{ fontSize:'10px', color:'#A855F7', fontWeight:'700' }}>ACCÈS {plan.label.toUpperCase()} ACTIVÉ ✓</div>
          </div>
        </div>
        <div style={{ background:'rgba(16,185,129,0.1)', color:'#059669', fontSize:'11px', fontWeight:'800', padding:'5px 12px', borderRadius:'50px', border:'1px solid rgba(16,185,129,0.2)' }}>✓ Actif</div>
      </div>

      <h1 style={{ fontSize:'20px', fontWeight:'900', color:'#1E1B2E', marginBottom:'4px' }}>Tes matières 📚</h1>
      <p style={{ fontSize:'13px', color:'#6B7280', marginBottom:'20px' }}>Accès complet à toutes les ressources</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
        {SUBJECTS.map(s => (
          <div key={s.id}
            style={{ background:'#fff', borderRadius:'18px', padding:'18px 14px', border:`1.5px solid ${s.color}20`, boxShadow:'0 2px 8px rgba(0,0,0,0.05)', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${s.color}20` }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', marginBottom:'10px' }}>{s.icon}</div>
            <div style={{ fontWeight:'800', fontSize:'13px', color:'#1E1B2E', marginBottom:'3px' }}>{s.label}</div>
            <div style={{ fontSize:'11px', color:'#9CA3AF', marginBottom:'10px' }}>{s.desc}</div>
            <div style={{ display:'flex', gap:'5px' }}>
              {['Quiz', 'Fiches', 'Cours'].map(t => (
                <span key={t} style={{ fontSize:'9px', fontWeight:'800', background:`${s.color}12`, color:s.color, padding:'2px 7px', borderRadius:'50px' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:'24px', background:'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(99,102,241,0.08))', borderRadius:'16px', padding:'18px', border:'1px solid rgba(168,85,247,0.15)', textAlign:'center' }}>
        <div style={{ fontSize:'20px', marginBottom:'8px' }}>🎯</div>
        <div style={{ fontWeight:'800', fontSize:'14px', color:'#1E1B2E', marginBottom:'4px' }}>Tu as accès à la version complète</div>
        <div style={{ fontSize:'12px', color:'#6B7280' }}>Pour une expérience encore plus riche, accède à la plateforme web</div>
        <a href="/apprenant/passbac" style={{ display:'inline-block', marginTop:'12px', padding:'10px 20px', background:'linear-gradient(135deg,#A855F7,#6366F1)', color:'#fff', borderRadius:'10px', fontWeight:'800', fontSize:'13px', textDecoration:'none' }}>
          Ouvrir la version complète →
        </a>
      </div>
    </div>
  )
}

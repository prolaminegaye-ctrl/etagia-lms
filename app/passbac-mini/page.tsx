'use client'
import { useState } from 'react'

type Screen = 'landing' | 'access'

const SUBJECTS = [
  { id: 'maths',    icon: '📐', label: 'Mathématiques',  desc: '8 exercices · 6 fiches', color: '#6366F1' },
  { id: 'physique', icon: '⚗️', label: 'Physique-Chimie', desc: '8 exercices · 6 fiches', color: '#3B82F6' },
  { id: 'svt',      icon: '🧬', label: 'SVT',             desc: '7 exercices · 8 fiches', color: '#10B981' },
  { id: 'francais', icon: '📝', label: 'Français',        desc: '6 exercices · 7 fiches', color: '#F59E0B' },
  { id: 'histoire', icon: '🏛️', label: 'Histoire-Géo',   desc: '7 exercices · 6 fiches', color: '#EF4444' },
  { id: 'philo',    icon: '🦉', label: 'Philosophie',     desc: '6 exercices · 5 fiches', color: '#8B5CF6' },
  { id: 'anglais',  icon: '🗣️', label: 'Anglais',        desc: '8 exercices · 6 fiches', color: '#06B6D4' },
  { id: 'geo',      icon: '🌍', label: 'Géographie',      desc: '6 exercices · 6 fiches', color: '#84CC16' },
]

export default function PassBacMini() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [activeSubj, setActiveSubj] = useState(SUBJECTS[0])

  /* ─── LANDING ────────────────────────────────────────────────────────────── */
  if (screen === 'landing') return (
    <div style={{
      minHeight: '100vh',
      fontFamily: '"Plus Jakarta Sans",system-ui,sans-serif',
      background: 'linear-gradient(160deg,#0F0C29 0%,#302B63 55%,#24243E 100%)',
      color: '#fff',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes pulse   { 0%,100%{opacity:1}  50%{opacity:.4} }
        @keyframes floatUp { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* Hero */}
      <div style={{ padding: '52px 20px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* BG orbs */}
        <div style={{ position:'absolute', top:'-60px', left:'50%', transform:'translateX(-50%)', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,0.18),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40px', right:'-80px', width:'260px', height:'260px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)', pointerEvents:'none' }} />

        {/* Live badge */}
        <div style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'50px', padding:'7px 18px', marginBottom:'28px', fontSize:'12px', fontWeight:'700' }}>
          <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#10B981', animation:'pulse 2s infinite', display:'inline-block' }} />
          Disponible maintenant — Prépare ton BAC 🇸🇳
        </div>

        {/* Title */}
        <h1 style={{ fontSize:'clamp(36px,9vw,56px)', fontWeight:'900', margin:'0 0 16px', lineHeight:1.05, letterSpacing:'-1.5px', position:'relative' }}>
          Mon{' '}
          <span style={{
            background: 'linear-gradient(135deg,#A855F7 0%,#6366F1 50%,#38BDF8 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
          }}>Pass'BAC</span>
        </h1>

        <p style={{ fontSize:'clamp(14px,4vw,17px)', color:'rgba(255,255,255,0.58)', margin:'0 auto 36px', maxWidth:'320px', lineHeight:1.65, position:'relative' }}>
          Tous tes cours, quiz et fiches de révision pour réussir le Baccalauréat — accessibles sur mobile.
        </p>

        {/* Feature chips */}
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap', marginBottom:'36px', position:'relative' }}>
          {['8 matières', '60+ exercices', 'Fiches 3D', 'Examens blancs'].map(f => (
            <span key={f} style={{
              background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)',
              borderRadius:'50px', padding:'6px 15px', fontSize:'12px', fontWeight:'700',
            }}>✓ {f}</span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ position:'relative', display:'inline-block' }}>
          <div style={{ position:'absolute', inset:'-3px', borderRadius:'18px', background:'linear-gradient(135deg,#A855F7,#6366F1,#38BDF8)', opacity:.5, filter:'blur(8px)' }} />
          <button
            onClick={() => setScreen('access')}
            style={{
              position:'relative', display:'block',
              background: 'linear-gradient(135deg,#A855F7,#6366F1)',
              color:'#fff', border:'none', borderRadius:'14px',
              padding:'16px 48px', fontSize:'16px', fontWeight:'800',
              cursor:'pointer', letterSpacing:'0.02em',
              boxShadow: '0 8px 32px rgba(168,85,247,0.35)',
              animation: 'floatUp 3s ease-in-out infinite',
            }}>
            🎓 Accéder gratuitement →
          </button>
        </div>

        <p style={{ marginTop:'14px', fontSize:'11px', color:'rgba(255,255,255,0.28)', position:'relative' }}>
          Phase test — accès entièrement gratuit
        </p>
      </div>

      {/* Subject grid */}
      <div style={{ padding:'0 16px 48px' }}>
        <h2 style={{ textAlign:'center', fontWeight:'800', fontSize:'1.05rem', color:'rgba(255,255,255,0.70)', marginBottom:'20px', letterSpacing:'0.03em', textTransform:'uppercase' }}>
          📚 8 matières couvertes
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px', maxWidth:'420px', margin:'0 auto' }}>
          {SUBJECTS.map(s => (
            <div key={s.id} style={{
              background: 'rgba(255,255,255,0.06)', border: `1px solid ${s.color}35`,
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              transition: 'transform .2s',
            }}>
              <div style={{
                width:'38px', height:'38px', borderRadius:'10px', flexShrink:0,
                background: `${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'18px', border:`1px solid ${s.color}35`,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontWeight:'700', fontSize:'12px', color:'rgba(255,255,255,0.88)' }}>{s.label}</div>
                <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', marginTop:'2px' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ background:'rgba(255,255,255,0.04)', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'24px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-around', maxWidth:'400px', margin:'0 auto' }}>
          {[['5 000+','Apprenants'],['94%','Taux de réussite'],['60+','Exercices']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'clamp(22px,6vw,30px)', fontWeight:'900', background:'linear-gradient(135deg,#A855F7,#6366F1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{val}</div>
              <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.40)', fontWeight:'600', marginTop:'3px' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ─── ACCESS ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: '"Plus Jakarta Sans",system-ui,sans-serif',
      background: '#F0F2FF',
      color: '#1E1B4B',
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .subj-card:hover { transform:translateY(-2px)!important; }
      `}</style>

      {/* Top bar */}
      <div style={{
        background: 'linear-gradient(135deg,#1E1B4B,#4C1D95)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>🎓</div>
          <div>
            <div style={{ fontWeight:'800', fontSize:'14px', color:'#fff' }}>Mon Pass'BAC</div>
            <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.50)' }}>Baccalauréat · Sénégal</div>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'20px', padding:'5px 12px', fontSize:'11px', fontWeight:'700', color:'rgba(255,255,255,0.80)' }}>
          Phase test 🚀
        </div>
      </div>

      {/* Subject tabs */}
      <div style={{ padding:'16px 16px 8px', overflowX:'auto' }}>
        <div style={{ display:'flex', gap:'8px', width:'max-content' }}>
          {SUBJECTS.map(s => (
            <button key={s.id}
              onClick={() => setActiveSubj(s)}
              style={{
                padding:'8px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap',
                border:`2px solid ${activeSubj.id === s.id ? s.color : 'transparent'}`,
                background: activeSubj.id === s.id ? `${s.color}18` : 'rgba(30,27,75,0.05)',
                color: activeSubj.id === s.id ? s.color : 'rgba(30,27,75,0.45)',
                transition:'all .15s',
              }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding:'8px 16px 48px', animation:'fadeIn .35s ease' }}>
        <div style={{
          background:'#fff', borderRadius:'18px', padding:'20px',
          border:`2px solid ${activeSubj.color}25`,
          boxShadow:`0 4px 24px ${activeSubj.color}12`,
          marginBottom:'16px',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:`${activeSubj.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', border:`1px solid ${activeSubj.color}30` }}>
              {activeSubj.icon}
            </div>
            <div>
              <h2 style={{ margin:0, fontSize:'1rem', fontWeight:'800', color:'#1E1B4B' }}>{activeSubj.label}</h2>
              <p style={{ margin:0, fontSize:'11px', color:'rgba(30,27,75,0.45)' }}>{activeSubj.desc}</p>
            </div>
          </div>

          {/* Quick access cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {[
              { icon:'📖', label:'Cours', sub:'Leçons complètes', color:'#6366F1' },
              { icon:'🃏', label:'Flashcards', sub:'Mémorisation rapide', color:activeSubj.color },
              { icon:'❓', label:'Quiz', sub:'Teste tes connaissances', color:'#10B981' },
              { icon:'📝', label:'Examens blancs', sub:'Conditions réelles', color:'#F59E0B' },
            ].map(card => (
              <div key={card.label} style={{
                background:`${card.color}0D`, border:`1px solid ${card.color}25`,
                borderRadius:'12px', padding:'14px 12px', cursor:'pointer',
                transition:'all .2s',
              }}>
                <div style={{ fontSize:'20px', marginBottom:'6px' }}>{card.icon}</div>
                <div style={{ fontWeight:'700', fontSize:'12px', color:'#1E1B4B' }}>{card.label}</div>
                <div style={{ fontSize:'10px', color:'rgba(30,27,75,0.45)', marginTop:'2px' }}>{card.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample flashcard preview */}
        <div style={{ background:'#fff', borderRadius:'18px', padding:'18px', border:`1px solid ${activeSubj.color}20`, boxShadow:`0 2px 12px rgba(0,0,0,0.05)` }}>
          <div style={{ fontSize:'12px', fontWeight:'800', color:'rgba(30,27,75,0.50)', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'14px' }}>
            📌 Fiche mémo — À retenir
          </div>
          {activeSubj.id === 'maths' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {["Théorème de Pythagore : a² + b² = c²","Discriminant : Δ = b² − 4ac","Dérivée de xⁿ = n·xⁿ⁻¹"].map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                  <span style={{ width:'22px', height:'22px', borderRadius:'6px', background:`${activeSubj.color}18`, color:activeSubj.color, fontSize:'11px', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
                  <span style={{ fontSize:'13px', color:'#1E1B4B', lineHeight:1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}
          {activeSubj.id !== 'maths' && (
            <div style={{ textAlign:'center', padding:'16px', color:'rgba(30,27,75,0.35)', fontSize:'13px' }}>
              <div style={{ fontSize:'28px', marginBottom:'8px' }}>{activeSubj.icon}</div>
              Fiches disponibles pour {activeSubj.label} — accède depuis l'app principale.
            </div>
          )}
          <div style={{ marginTop:'14px', textAlign:'center' }}>
            <a href="/apprenant/passbac" style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              background:`linear-gradient(135deg,${activeSubj.color},#4C1D95)`,
              color:'#fff', borderRadius:'10px', padding:'10px 24px',
              fontSize:'12px', fontWeight:'800', textDecoration:'none',
              boxShadow:`0 4px 16px ${activeSubj.color}35`,
            }}>
              Ouvrir l'app complète →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

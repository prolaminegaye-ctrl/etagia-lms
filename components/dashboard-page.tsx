'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

/* ── Helpers progression KA ── */
const KA_STORAGE_KEY = 'etagia_ka_progress'
function loadKAProgress(): Record<string, { domain: string; openedAt: string }> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(KA_STORAGE_KEY) ?? '{}') } catch { return {} }
}
const KA_TOTAL = 50  // total modules catalogue (100% français)

/* ── Tokens — Système chaud ETAGIA ── */
const T = {
  accent:      '#F4B01E',       // or premium
  accentLight: '#FFF7E2',       // gold-50
  border:      'rgba(42,33,24,.10)',
  bg:          '#FAF6EE',       // canvas crème
  surface:     '#FFFFFF',
  subtle:      '#F5EEDF',       // surface-2
  txt:         '#2A2118',       // ink
  txtMuted:    '#6E6155',       // ink-mut
  inv:         '#FAF6EE',
  success:     '#0FB6CC',       // turquoise intelligence
  warning:     '#F4B01E',       // gold
  orange:      '#FB6514',       // orange énergie
  fontDisplay: "'Newsreader', Georgia, serif",
  fontBody:    "'Hanken Grotesk', sans-serif",
}

const card: React.CSSProperties = {
  background:   T.surface,
  border:       `1px solid ${T.border}`,
  borderRadius: '16px',
  boxShadow:    '0 1px 4px rgba(0,0,0,0.05)',
}

const kpis = [
  { label: 'Cours en cours', value: '4',   color: '#F4B01E', bg: '#FFF7E2', delta: '+1 ce mois',  icon: '◈' },
  { label: 'Progression',    value: '68%', color: '#0FB6CC', bg: '#E6FBFD', delta: '+5% semaine', icon: '↑' },
  { label: 'Score moyen',    value: '82',  color: '#C28705', bg: '#FFF7E2', delta: 'Top 15%',     icon: '⭐' },
  { label: 'Heures / sem.',  value: '12h', color: '#FB6514', bg: '#FFF1E8', delta: 'Obj: 15h',    icon: '⏱' },
]

const courses = [
  { title: 'Data Science avec Python',    progress: 72, cat: 'Tech',        color: '#0FB6CC', done: 17, total: 24 },
  { title: 'Marketing Digital Afrique',   progress: 45, cat: 'Business',    color: '#FB6514', done: 8,  total: 18 },
  { title: 'Leadership & Management',     progress: 30, cat: 'Soft Skills', color: '#F4B01E', done: 4,  total: 12 },
]

const reco = [
  { title: 'IA Générative pour pros',   tag: 'Nouveau',   color: '#0FB6CC', emoji: '🤖' },
  { title: 'Comptabilité SME Afrique',  tag: 'Populaire', color: '#FB6514', emoji: '💼' },
  { title: 'Pitch & Fundraising',       tag: 'Tendance',  color: '#F4B01E', emoji: '🚀' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [kaProgress, setKaProgress] = useState<Record<string, { domain: string; openedAt: string }>>({})

  useEffect(() => {
    setKaProgress(loadKAProgress())
    const handler = () => setKaProgress(loadKAProgress())
    window.addEventListener('ka-progress-update', handler)
    return () => window.removeEventListener('ka-progress-update', handler)
  }, [])

  const kaCount   = Object.keys(kaProgress).length
  const kaPct     = Math.round((kaCount / KA_TOTAL) * 100)
  /* Compter les domaines explorés */
  const kaDomains = new Set(Object.values(kaProgress).map(p => p.domain)).size

  return (
    <div style={{ animation: 'fadeIn 0.25s ease-out' }}>

      {/* ── Hero greeting ── */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.75rem 2rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #FFF7E2 0%, #FFF1E8 100%)',
        border: '1px solid rgba(244,176,30,.20)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-30px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,30,.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '35%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,101,20,.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: '22px', fontWeight: '800', color: T.txt, marginBottom: '6px', letterSpacing: '-0.03em' }}>
              Bonjour, Lamine 👋
            </h1>
            <p style={{ color: T.txtMuted, fontSize: '13.5px', fontFamily: T.fontBody }}>
              Lundi 25 mai 2026 · 7 jours de streak 🔥
            </p>
          </div>
          <div style={{ background: T.surface, border: '1px solid rgba(108,41,255,0.16)', borderRadius: '14px', padding: '12px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(108,41,255,0.08)', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', color: T.txtMuted, marginBottom: '4px', fontFamily: T.fontBody }}>Objectif hebdo</div>
            <div style={{ fontFamily: T.fontDisplay, fontSize: '20px', fontWeight: '800', color: T.accent }}>15h / sem</div>
            <div style={{ fontSize: '11px', color: T.success, marginTop: '3px', fontWeight: '600', fontFamily: T.fontBody }}>12h ✓</div>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.color, borderRadius: '16px 16px 0 0' }} />
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '10px', marginTop: '4px' }}>
              {k.icon}
            </div>
            <div style={{ fontFamily: T.fontDisplay, fontSize: '26px', fontWeight: '800', color: k.color, marginBottom: '2px', letterSpacing: '-0.03em' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: T.txtMuted, fontFamily: T.fontBody, marginBottom: '4px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: k.color, fontWeight: '600', fontFamily: T.fontBody }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Widget Khan Academy ── */}
      <div
        style={{ ...card, padding: '1.5rem', marginBottom: '2rem', cursor: 'pointer', transition: 'all .2s', position: 'relative', overflow: 'hidden' }}
        onClick={() => router.push('/apprenant/khan-academy')}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(244,176,30,0.40)'; el.style.boxShadow = '0 4px 20px rgba(244,176,30,0.10)'; el.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.border; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; el.style.transform = 'translateY(0)' }}
      >
        {/* Bande décorative haut */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F4B01E, #FB6514)', borderRadius: '16px 16px 0 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>

          {/* Titre + description */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(244,176,30,0.15), rgba(244,176,30,.12))', border: '1px solid rgba(244,176,30,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
              🎓
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontFamily: T.fontDisplay, fontWeight: '700', fontSize: '13px', color: T.txt, letterSpacing: '-0.02em' }}>
                  Khan Academy Français
                </span>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: 'rgba(244,176,30,0.12)', color: '#F4B01E', border: '1px solid rgba(244,176,30,0.20)' }}>
                  Gratuit
                </span>
              </div>
              <div style={{ fontSize: '12px', color: T.txtMuted, fontFamily: T.fontBody }}>
                {kaCount > 0
                  ? `${kaCount} module${kaCount > 1 ? 's' : ''} consulté${kaCount > 1 ? 's' : ''} · ${kaDomains} domaine${kaDomains > 1 ? 's' : ''} exploré${kaDomains > 1 ? 's' : ''}`
                  : '50 modules de formation en français · Informatique, Finance, Sciences…'}
              </div>
            </div>
          </div>

          {/* KPIs progression */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            {/* Modules vus */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: '22px', fontWeight: '800', color: '#F4B01E', letterSpacing: '-0.03em', lineHeight: 1 }}>{kaCount}</div>
              <div style={{ fontSize: '10px', color: T.txtMuted, fontFamily: T.fontBody, marginTop: '2px' }}>consultés</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: T.border }} />
            {/* % progression */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: '22px', fontWeight: '800', color: '#FB6514', letterSpacing: '-0.03em', lineHeight: 1 }}>{kaPct}%</div>
              <div style={{ fontSize: '10px', color: T.txtMuted, fontFamily: T.fontBody, marginTop: '2px' }}>progression</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: T.border }} />
            {/* Domaines */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: '22px', fontWeight: '800', color: '#F0B429', letterSpacing: '-0.03em', lineHeight: 1 }}>{kaDomains}</div>
              <div style={{ fontSize: '10px', color: T.txtMuted, fontFamily: T.fontBody, marginTop: '2px' }}>domaines</div>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        {kaPct > 0 && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ height: '5px', background: T.subtle, borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${kaPct}%`, background: 'linear-gradient(90deg, #F4B01E, #FB6514)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize: '11px', color: T.txtMuted, marginTop: '5px', fontFamily: T.fontBody }}>
              {kaCount} / 50 modules · Continuer →
            </div>
          </div>
        )}

        {kaCount === 0 && (
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#F4B01E', fontFamily: T.fontBody, fontWeight: '500' }}>
            Commencer ma formation Khan Academy →
          </div>
        )}
      </div>

      {/* ── Contenu principal ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>

        {/* Cours en cours */}
        <div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: '13px', fontWeight: '700', marginBottom: '1rem', color: T.txt, letterSpacing: '-0.02em' }}>
            Continuer l&apos;apprentissage
          </h2>
          {courses.map(c => (
            <div
              key={c.title}
              onClick={() => router.push('/cours')}
              style={{ ...card, padding: '1.1rem 1.25rem', cursor: 'pointer', marginBottom: '0.75rem', transition: 'all .15s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(108,41,255,0.25)'; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 4px 16px rgba(244,176,30,.12)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.border; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: T.txt, marginBottom: '5px', fontFamily: T.fontBody }}>{c.title}</div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 9px', borderRadius: '20px', background: T.accentLight, color: T.accent, fontFamily: T.fontBody }}>
                    {c.cat}
                  </span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: '20px', fontWeight: '800', color: c.color, letterSpacing: '-0.03em' }}>{c.progress}%</div>
                  <div style={{ fontSize: '11px', color: T.txtMuted, fontFamily: T.fontBody }}>{c.done}/{c.total} leçons</div>
                </div>
              </div>
              <div style={{ height: '5px', background: T.subtle, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.progress}%`, background: c.color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Colonne droite */}
        <div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: '13px', fontWeight: '700', marginBottom: '1rem', color: T.txt, letterSpacing: '-0.02em' }}>
            Recommandé pour toi
          </h2>

          {reco.map(r => (
            <div
              key={r.title}
              onClick={() => router.push('/cours')}
              style={{ ...card, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.6rem', transition: 'all .15s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(108,41,255,0.25)'; el.style.background = T.subtle }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.border; el.style.background = T.surface }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{r.emoji}</div>
              <span style={{ flex: 1, fontWeight: '500', fontSize: '13px', color: T.txt, fontFamily: T.fontBody }}>{r.title}</span>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: `${r.color}18`, color: r.color, fontFamily: T.fontBody, flexShrink: 0 }}>{r.tag}</span>
            </div>
          ))}

          {/* AI Tutor CTA */}
          <div
            onClick={() => router.push('/tutor')}
            style={{
              marginTop: '1rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
              background: T.accentLight, border: '1px solid rgba(108,41,255,0.20)', borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(108,41,255,0.08)', transition: 'all .2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 6px 24px rgba(108,41,255,0.18)'; el.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 12px rgba(108,41,255,0.08)'; el.style.transform = 'translateY(0)' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✦</div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: '700', fontSize: '12px', color: T.accent, marginBottom: '6px', letterSpacing: '-0.02em' }}>
              AI Tutor ETAGIA
            </div>
            <div style={{ fontSize: '12px', color: T.txtMuted, marginBottom: '14px', fontFamily: T.fontBody }}>
              Posez vos questions, obtenez des explications personnalisées
            </div>
            <div style={{
              display: 'inline-block', background: T.accent, borderRadius: '32px',
              padding: '8px 22px', color: T.inv, fontSize: '13px', fontWeight: '600',
              fontFamily: T.fontBody, boxShadow: '0 4px 20px rgba(108,41,255,0.30)',
            }}>
              Ouvrir le Tutor →
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

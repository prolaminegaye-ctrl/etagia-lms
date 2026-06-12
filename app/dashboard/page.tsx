'use client'
import { useRouter } from 'next/navigation'

const kpis = [
  { label: 'Cours en cours',  value: '4',      icon: '📚', bg: 'var(--turq-50)',   color: 'var(--turq-700)',   grad: 'var(--grad-ia)',        delta: '+1 ce mois' },
  { label: 'Progression moy', value: '68%',    icon: '📈', bg: 'var(--gold-50)',   color: 'var(--gold-700)',   grad: 'var(--grad-energie)',   delta: '+5% semaine' },
  { label: 'Score moyen',     value: '82/100', icon: '🏆', bg: 'var(--orange-50)', color: 'var(--orange-700)', grad: 'var(--grad-signature)', delta: 'Top 15%' },
  { label: 'Heures semaine',  value: '12h',    icon: '⏱',  bg: 'var(--gold-50)',   color: 'var(--gold-700)',   grad: 'var(--grad-energie)',   delta: 'Obj : 15h' },
]

const courses = [
  { title: 'Data Science avec Python',  progress: 72, cat: 'Tech',        color: 'var(--turq-700)',   bg: 'var(--turq-50)',   done: 17, total: 24 },
  { title: 'Marketing Digital Afrique', progress: 45, cat: 'Business',    color: 'var(--orange-700)', bg: 'var(--orange-50)', done: 8,  total: 18 },
  { title: 'Leadership & Management',   progress: 30, cat: 'Soft Skills', color: 'var(--gold-700)',   bg: 'var(--gold-50)',   done: 4,  total: 12 },
]

const activities = [
  { text: 'Quiz validé — Data Science Ch.4', time: 'Il y a 2h',   icon: '✅', bg: 'var(--turq-50)',   color: 'var(--turq-700)' },
  { text: 'Nouveau cours : IA Générative',   time: 'Ce matin',    icon: '🆕', bg: 'var(--gold-50)',   color: 'var(--gold-700)' },
  { text: 'Session live planifiée demain',   time: 'Demain 14h',  icon: '🎥', bg: 'var(--orange-50)', color: 'var(--orange-700)' },
]

const featureCards = [
  { bg: 'var(--turq-50)',   label: 'Mes cours',   emoji: '📚', sub: '4 en cours',        href: '/cours',              accent: 'var(--turq-700)' },
  { bg: 'var(--orange-50)', label: 'Classes live', emoji: '🎥', sub: 'Prochaine : demain', href: '/live',               accent: 'var(--orange-700)' },
  { bg: 'var(--gold-50)',   label: 'AI Tutor',     emoji: '✦',  sub: 'Disponible 24/7',   href: '/tutor',              accent: 'var(--gold-700)' },
  { bg: 'var(--surface-2)', label: 'Marketplace',  emoji: '🛒', sub: '200+ formations',   href: '/market',             accent: 'var(--ink-mut)' },
  { bg: 'var(--gold-50)',   label: "Pass'BAC",     emoji: '🎓', sub: '8 matières',         href: '/apprenant/passbac', accent: 'var(--gold-700)' },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px' }}>

      {/* Page title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold-700)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Tableau de bord</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.85rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.03em' }}>Bonjour, Lamine 👋</h1>
        <p style={{ color: 'var(--ink-mut)', fontSize: '14px', marginTop: '5px' }}>Continuez sur votre lancée — vous avez progressé de 5% cette semaine.</p>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {featureCards.map(({ bg, label, emoji, sub, href, accent }) => (
          <div key={label} onClick={() => router.push(href)} style={{
            borderRadius: '18px', overflow: 'hidden', cursor: 'pointer',
            boxShadow: 'var(--sh-1)', transition: 'transform .15s, box-shadow .15s',
            background: 'var(--surface)', border: '1px solid var(--line)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--sh-2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--sh-1)' }}
          >
            <div style={{ background: bg, padding: '1rem 1.125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '13px', color: accent }}>{label}</span>
              <span style={{ fontSize: '22px' }}>{emoji}</span>
            </div>
            <div style={{ padding: '0.75rem 1.125rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--ink-mut)', fontWeight: 500 }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(({ label, value, icon, bg, color, delta }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--sh-1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
              <span style={{ fontSize: '10px', background: bg, color, padding: '3px 9px', borderRadius: '99px', fontWeight: 700 }}>{delta}</span>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.03em' }}>{value}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--ink-soft)', marginTop: '3px', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem' }}>

        {/* Cours en cours */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--sh-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 700, color: 'var(--gold-700)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>En cours</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 600, color: 'var(--ink)' }}>Mes formations</h3>
            </div>
            <button onClick={() => router.push('/cours')} style={{
              fontSize: '12px', color: 'var(--gold-700)', background: 'var(--gold-50)',
              border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
              fontFamily: 'var(--sans)', fontWeight: 700,
            }}>Voir tout →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {courses.map(({ title, progress, cat, color, bg, done, total }) => (
              <div key={title} onClick={() => router.push('/cours')} style={{
                padding: '1rem', borderRadius: '14px', border: '1px solid var(--line)',
                background: 'var(--surface-2)', cursor: 'pointer', transition: 'all .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--gold-50)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-2)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '14px', color: 'var(--ink)', marginBottom: '5px' }}>{title}</div>
                    <span style={{ fontSize: '10px', background: bg, color, padding: '2px 9px', borderRadius: '99px', fontWeight: 700 }}>{cat}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, color, letterSpacing: '-0.03em' }}>{progress}%</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--ink-soft)', fontWeight: 500 }}>{done}/{total} leçons</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: '5px', background: 'var(--line)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '99px', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '1.25rem', boxShadow: 'var(--sh-1)' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 700, color: 'var(--gold-700)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Fil d&apos;activité</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1.25rem' }}>Récent</h3>
          {activities.map(({ text, time, icon, bg, color }) => (
            <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ width: 30, height: 30, borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.4 }}>{text}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--ink-soft)', marginTop: '3px', fontWeight: 500 }}>{time}</div>
              </div>
            </div>
          ))}
          <button onClick={() => router.push('/market')} style={{
            width: '100%', padding: '11px',
            background: 'var(--grad-signature)',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '13px',
            cursor: 'pointer', marginTop: '4px',
            boxShadow: '0 3px 12px rgba(240,137,74,.30)',
          }}>
            Explorer la marketplace →
          </button>
        </div>

      </div>
    </div>
  )
}

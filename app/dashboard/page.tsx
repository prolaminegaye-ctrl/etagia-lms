'use client'
import { useRouter } from 'next/navigation'
import PageHero from '@/components/PageHero'

const kpis = [
  { label: 'Cours en cours',  value: '4',      icon: '📚', bg: '#C9F0F0', color: '#0F766E', delta: '+1 ce mois' },
  { label: 'Progression moy', value: '68%',    icon: '📈', bg: '#E8EAFF', color: '#4255FF', delta: '+5% semaine' },
  { label: 'Score moyen',     value: '82/100', icon: '🏆', bg: '#FFBF80', color: '#C2410C', delta: 'Top 15%' },
  { label: 'Heures semaine',  value: '12h',    icon: '⏱',  bg: '#FFD6FD', color: '#9333EA', delta: 'Obj : 15h' },
]

const courses = [
  { title: 'Data Science avec Python',  progress: 72, cat: 'Tech',        color: '#4255FF', bg: '#E8EAFF', done: 17, total: 24 },
  { title: 'Marketing Digital Afrique', progress: 45, cat: 'Business',    color: '#F4591F', bg: '#FFF3EE', done: 8,  total: 18 },
  { title: 'Leadership & Management',   progress: 30, cat: 'Soft Skills', color: '#6B52D4', bg: '#EDE9FE', done: 4,  total: 12 },
]

const activities = [
  { text: 'Quiz validé — Data Science Ch.4', time: 'Il y a 2h', icon: '✅', bg: '#CCFBDC', color: '#16A34A' },
  { text: 'Nouveau cours : IA Générative',   time: 'Ce matin',  icon: '🆕', bg: '#E8EAFF', color: '#4255FF' },
  { text: 'Session live planifiée demain',   time: 'Demain 14h', icon: '🎥', bg: '#FFD6FD', color: '#9333EA' },
]

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div style={{ padding: '2rem', maxWidth: '1100px' }}>

      {/* Page title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Tableau de bord</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.5px' }}>Bonjour, Lamine 👋</h1>
        <p style={{ color: '#586380', fontSize: '14px', marginTop: '4px' }}>Continuez sur votre lancée — vous avez progressé de 5% cette semaine.</p>
      </div>

      {/* Quizlet-style colored feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { bg: '#C9F0F0', label: 'Mes cours',     emoji: '📚', sub: '4 en cours',        href: '/cours' },
          { bg: '#E8EAFF', label: 'Classes live',  emoji: '🎥', sub: 'Prochaine: demain', href: '/live' },
          { bg: '#FFD6FD', label: 'AI Tutor',       emoji: '✦',  sub: 'Disponible 24/7',  href: '/tutor' },
          { bg: '#FFBF80', label: 'Marketplace',   emoji: '🛒', sub: '200+ formations',   href: '/market' },
          { bg: '#CCFBDC', label: "Pass'BAC",       emoji: '🎓', sub: '8 matières',        href: '/apprenant/passbac' },
        ].map(({ bg, label, emoji, sub, href }) => (
          <div key={label} onClick={() => router.push(href)} style={{
            borderRadius: '18px', overflow: 'hidden', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(46,56,86,0.08)', transition: 'transform .15s',
            background: '#fff', border: '1px solid #D9DBE9',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
          >
            <div style={{ background: bg, padding: '1rem 1.125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '14px', color: '#2E3856' }}>{label}</span>
              <span style={{ fontSize: '22px' }}>{emoji}</span>
            </div>
            <div style={{ padding: '0.75rem 1.125rem' }}>
              <p style={{ fontSize: '12px', color: '#586380', fontWeight: '500' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(({ label, value, icon, bg, color, delta }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #D9DBE9', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
              <span style={{ fontSize: '10px', background: bg, color, padding: '3px 9px', borderRadius: '99px', fontWeight: '700' }}>{delta}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.5px' }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#939BB4', marginTop: '3px', fontWeight: '500' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem' }}>

        {/* Cours en cours */}
        <div style={{ background: '#fff', border: '1px solid #D9DBE9', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>En cours</div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#2E3856' }}>Mes formations</h3>
            </div>
            <button onClick={() => router.push('/cours')} style={{ fontSize: '12px', color: '#4255FF', background: '#E8EAFF', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>Voir tout →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {courses.map(({ title, progress, cat, color, bg, done, total }) => (
              <div key={title} onClick={() => router.push('/cours')} style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #ECEEF5', background: '#FAFBFD', cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#F6F7FB'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#FAFBFD'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#2E3856', marginBottom: '5px' }}>{title}</div>
                    <span style={{ fontSize: '10px', background: bg, color, padding: '2px 9px', borderRadius: '99px', fontWeight: '700' }}>{cat}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: '900', color, letterSpacing: '-0.5px' }}>{progress}%</div>
                    <div style={{ fontSize: '10px', color: '#939BB4', fontWeight: '500' }}>{done}/{total} leçons</div>
                  </div>
                </div>
                <div style={{ height: '6px', background: '#ECEEF5', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '99px', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: '#fff', border: '1px solid #D9DBE9', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Fil d'activité</div>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#2E3856', marginBottom: '1.25rem' }}>Récent</h3>
          {activities.map(({ text, time, icon, bg, color }) => (
            <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #ECEEF5' }}>
              <div style={{ width: 30, height: 30, borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: '12px', color: '#2E3856', fontWeight: '600', lineHeight: 1.4 }}>{text}</div>
                <div style={{ fontSize: '10px', color: '#939BB4', marginTop: '3px', fontWeight: '500' }}>{time}</div>
              </div>
            </div>
          ))}
          <button onClick={() => router.push('/market')} style={{ width: '100%', padding: '11px', background: '#4255FF', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
            Explorer la marketplace →
          </button>
        </div>
      </div>
    </div>
  )
}

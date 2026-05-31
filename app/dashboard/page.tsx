'use client'
import { useRouter } from 'next/navigation'

const kpis = [
  { label: 'Cours en cours',  value: '4',     icon: '📚', color: '#1565C0', bg: '#EFF6FF', delta: '+1 ce mois' },
  { label: 'Progression moy', value: '68%',   icon: '📈', color: '#16A34A', bg: '#F0FDF4', delta: '+5% semaine' },
  { label: 'Score moyen',     value: '82/100',icon: '🏆', color: '#F4591F', bg: '#FFF3EE', delta: 'Top 15%' },
  { label: 'Heures semaine',  value: '12h',   icon: '⏱',  color: '#7C3AED', bg: '#F5F3FF', delta: 'Obj : 15h' },
]

const courses = [
  { title: 'Data Science avec Python',    progress: 72, cat: 'Tech',       color: '#1565C0', done: 17, total: 24 },
  { title: 'Marketing Digital Afrique',   progress: 45, cat: 'Business',   color: '#F4591F', done: 8,  total: 18 },
  { title: 'Leadership & Management',     progress: 30, cat: 'Soft Skills',color: '#7C3AED', done: 4,  total: 12 },
]

const reco = [
  { title: 'IA Générative pour pros',  tag: 'Nouveau',  color: '#1565C0', emoji: '🤖' },
  { title: 'Comptabilité SME Afrique', tag: 'Populaire',color: '#16A34A', emoji: '💼' },
  { title: 'Pitch & Fundraising',      tag: 'Tendance', color: '#F4591F', emoji: '🚀' },
]

const activities = [
  { text: 'Quiz validé — Data Science Ch.4', time: 'Il y a 2h', icon: '✅', color: '#16A34A' },
  { text: 'Nouveau cours : IA Générative',   time: 'Ce matin',  icon: '🆕', color: '#1565C0' },
  { text: 'Session live planifiée demain',   time: 'Demain 14h', icon: '🎥', color: '#F4591F' },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px' }}>

      {/* Hero banner */}
      <div style={{
        borderRadius: '20px', padding: '2rem 2.5rem', marginBottom: '2rem',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
        position: 'relative', overflow: 'hidden', color: '#fff',
        boxShadow: '0 8px 40px rgba(21,101,192,0.25)',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: '20%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(244,89,31,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: '6px', fontWeight: 700 }}>Tableau de bord</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 6px', color: '#fff' }}>
            Bonjour, Lamine 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '1.25rem' }}>
            Continuez sur votre lancée — 68% de progression cette semaine.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/cours')} style={{
              background: '#fff', color: '#1565C0', fontWeight: 700, fontSize: '13px',
              padding: '8px 20px', borderRadius: '99px', border: 'none', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}>Mes cours →</button>
            <button onClick={() => router.push('/live')} style={{
              background: 'rgba(244,89,31,0.85)', color: '#fff', fontWeight: 700, fontSize: '13px',
              padding: '8px 20px', borderRadius: '99px', border: 'none', cursor: 'pointer',
            }}>🎥 Classe live</button>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {[['12', 'Cours terminés'], ['4', 'En cours'], ['3', 'Certifications'], ['82%', 'Score moyen']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{v}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(({ label, value, icon, color, bg, delta }) => (
          <div key={label} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px',
            padding: '1.25rem', boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
            transition: 'all .18s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
              <span style={{ fontSize: '10px', background: bg, color, padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>{delta}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Cours en cours */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1565C0', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>En cours</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Mes formations</h3>
            </div>
            <button onClick={() => router.push('/cours')} style={{ fontSize: '12px', color: '#1565C0', background: '#EFF6FF', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}>Voir tout</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {courses.map(({ title, progress, cat, color, done, total }) => (
              <div key={title} onClick={() => router.push('/cours')} style={{
                padding: '1rem', borderRadius: '14px', border: '1px solid #F1F5F9',
                background: '#FAFBFC', cursor: 'pointer', transition: 'all .15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A', marginBottom: '3px' }}>{title}</div>
                    <span style={{ fontSize: '10px', background: '#EFF6FF', color: '#1565C0', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>{cat}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{progress}%</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{done}/{total} leçons</div>
                  </div>
                </div>
                <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '99px', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Activité récente */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#1565C0', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Activité</div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Récente</h3>
            {activities.map(({ text, time, icon, color }) => (
              <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #F8FAFB' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 500, lineHeight: 1.4 }}>{text}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>{time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommandations */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#F4591F', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Pour vous</div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recommandés</h3>
            {reco.map(({ title, tag, color, emoji }) => (
              <div key={title} onClick={() => router.push('/market')} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px', borderRadius: '10px', cursor: 'pointer',
                marginBottom: '4px', transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#F8FAFB'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                </div>
                <span style={{ fontSize: '9px', background: color + '15', color, padding: '2px 7px', borderRadius: '99px', fontWeight: 700, flexShrink: 0 }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

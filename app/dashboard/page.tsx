'use client'

const kpis = [
  { label: 'Cours en cours', value: '4', icon: '◈', color: 'var(--accent)', bg: 'var(--accent-muted)' },
  { label: 'Progression', value: '68%', icon: '◎', color: 'var(--teal)', bg: 'var(--teal-muted)' },
  { label: 'Score moyen', value: '82/100', icon: '✦', color: 'var(--gold)', bg: 'var(--gold-muted)' },
  { label: 'Heures cette semaine', value: '12h', icon: '⏱', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
]

const courses = [
  { title: 'Data Science avec Python', progress: 72, category: 'Tech', color: 'var(--accent)', lessons: 24, completed: 17 },
  { title: 'Marketing Digital Afrique', progress: 45, category: 'Business', color: 'var(--teal)', lessons: 18, completed: 8 },
  { title: 'Leadership & Management', progress: 30, category: 'Soft Skills', color: 'var(--gold)', lessons: 12, completed: 4 },
]

const recommended = [
  { title: 'IA Générative pour pros', tag: 'Nouveau', color: 'var(--accent)' },
  { title: 'Comptabilité SME Afrique', tag: 'Populaire', color: 'var(--teal)' },
  { title: 'Pitch & Fundraising', tag: 'Tendance', color: 'var(--gold)' },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Bonjour, Lamine 👋</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Mercredi 13 mai 2026 · 7 jours de streak 🔥</p>
          </div>
          <div style={{
            background: 'var(--accent-muted)', border: '1px solid rgba(74,127,245,0.2)',
            borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>🎯</span>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Objectif hebdo</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)' }}>15h / semaine</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.25rem'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', background: k.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color: k.color, marginBottom: '12px'
            }}>{k.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Courses in progress */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Continuer l&apos;apprentissage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.map(c => (
              <div key={c.title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1rem 1.25rem', cursor: 'pointer',
                transition: 'border-color .15s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '3px' }}>{c.title}</div>
                    <span style={{
                      fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px',
                      background: 'var(--bg-secondary)', color: 'var(--text-secondary)'
                    }}>{c.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: c.color, fontFamily: 'var(--font-display)' }}>{c.progress}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.completed}/{c.lessons} leçons</div>
                  </div>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: c.color, borderRadius: '2px', transition: 'width .3s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Recommandé pour toi</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommended.map(r => (
              <div key={r.title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1rem 1.25rem', cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{r.title}</div>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px',
                    background: 'var(--bg-secondary)', color: r.color
                  }}>{r.tag}</span>
                </div>
                <div style={{ height: '2px', background: 'var(--bg-secondary)', borderRadius: '1px', marginTop: '10px' }}>
                  <div style={{ height: '100%', width: '0%', background: r.color, borderRadius: '1px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI Tutor CTA */}
          <div style={{
            marginTop: '1rem', background: 'linear-gradient(135deg, rgba(74,127,245,0.1) 0%, rgba(32,212,168,0.1) 100%)',
            border: '1px solid rgba(74,127,245,0.2)', borderRadius: '14px', padding: '1.25rem',
            textAlign: 'center', cursor: 'pointer'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>✦</div>
            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>AI Tutor ETAGIA</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Posez vos questions, obtenez des explications personnalisées</div>
            <a href="/tutor" style={{
              display: 'inline-block', background: 'var(--accent)', color: '#fff',
              borderRadius: '8px', padding: '7px 16px', fontSize: '13px',
              fontWeight: '600', textDecoration: 'none', fontFamily: 'var(--font-display)'
            }}>Ouvrir le Tutor →</a>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

const kpis = [
  { label: 'Cours en cours', value: '4', icon: '◈', color: 'var(--accent)', bg: 'var(--accent-muted)', delta: '+1 ce mois' },
  { label: 'Progression', value: '68%', icon: '◎', color: 'var(--teal)', bg: 'var(--teal-muted)', delta: '+5% cette semaine' },
  { label: 'Score moyen', value: '82/100', icon: '✦', color: 'var(--gold)', bg: 'var(--gold-muted)', delta: 'Top 15%' },
  { label: 'Heures semaine', value: '12h', icon: '⏱', color: 'var(--purple)', bg: 'var(--purple-muted)', delta: 'Objectif: 15h' },
]

const courses = [
  { title: 'Data Science avec Python', progress: 72, category: 'Tech', color: 'var(--accent)', lessons: 24, completed: 17 },
  { title: 'Marketing Digital Afrique', progress: 45, category: 'Business', color: 'var(--teal)', lessons: 18, completed: 8 },
  { title: 'Leadership & Management', progress: 30, category: 'Soft Skills', color: 'var(--gold)', lessons: 12, completed: 4 },
]

const recommended = [
  { title: 'IA Générative pour pros', tag: 'Nouveau', color: 'var(--accent)', emoji: '🤖' },
  { title: 'Comptabilité SME Afrique', tag: 'Populaire', color: 'var(--teal)', emoji: '💼' },
  { title: 'Pitch & Fundraising', tag: 'Tendance', color: 'var(--gold)', emoji: '🚀' },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Hero header */}
      <div style={{
        marginBottom: '2rem', padding: '2rem', borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(91,141,239,0.15) 0%, rgba(34,212,168,0.08) 100%)',
        border: '1px solid var(--border-active)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,141,239,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', background: 'linear-gradient(135deg, #EDF2FF 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Bonjour, Lamine 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Mercredi 14 mai 2026 · 7 jours de streak 🔥 · Continue comme ça !</p>
          </div>
          <div style={{ background: 'var(--accent-muted)', border: '1px solid var(--border-active)', borderRadius: '14px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Objectif hebdo</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>15h / sem</div>
            <div style={{ fontSize: '11px', color: 'var(--teal)', marginTop: '2px' }}>12h accomplies ✓</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(k => (
          <div key={k.label} className="card-hover" style={{
            background: 'var(--gradient-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--shadow-card)',
            transition: 'all .2s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: k.color }}>{k.icon}</div>
              <span style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: '600', background: 'var(--teal-muted)', padding: '2px 8px', borderRadius: '20px' }}>{k.delta}</span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '4px', color: k.color }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Courses */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Continuer l&apos;apprentissage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.map(c => (
              <div key={c.title} className="card-hover" style={{
                background: 'var(--gradient-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1.1rem 1.25rem', cursor: 'pointer',
                boxShadow: 'var(--shadow-card)', transition: 'all .2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{c.title}</div>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{c.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: c.color, fontFamily: 'var(--font-display)' }}>{c.progress}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.completed}/{c.lessons} leçons</div>
                  </div>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}99)`, borderRadius: '3px', boxShadow: `0 0 8px ${c.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem' }}>Recommandé pour toi</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {recommended.map(r => (
              <div key={r.title} className="card-hover" style={{
                background: 'var(--gradient-card)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '12px 14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all .2s',
                boxShadow: 'var(--shadow-card)'
              }}>
                <span style={{ fontSize: '20px' }}>{r.emoji}</span>
                <span style={{ flex: 1, fontWeight: '500', fontSize: '13px' }}>{r.title}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: r.color }}>{r.tag}</span>
              </div>
            ))}
          </div>

          {/* AI Tutor CTA */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(91,141,239,0.15) 0%, rgba(34,212,168,0.12) 100%)',
            border: '1px solid var(--border-active)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center',
            boxShadow: '0 0 30px rgba(91,141,239,0.1)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✦</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Tutor ETAGIA</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>Posez vos questions, obtenez des explications personnalisées en temps réel</div>
            <a href="/tutor" style={{
              display: 'inline-block', background: 'var(--gradient-accent)', color: '#fff',
              borderRadius: '10px', padding: '8px 20px', fontSize: '13px',
              fontWeight: '700', textDecoration: 'none', fontFamily: 'var(--font-display)',
              boxShadow: '0 4px 16px rgba(91,141,239,0.4)'
            }}>Ouvrir le Tutor →</a>
          </div>
        </div>
      </div>
    </div>
  )
}

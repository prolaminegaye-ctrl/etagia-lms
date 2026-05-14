'use client'

const skills = [
  { name: 'Python', level: 72, color: 'var(--accent)' },
  { name: 'Marketing Digital', level: 45, color: 'var(--teal)' },
  { name: 'Leadership', level: 58, color: 'var(--gold)' },
  { name: 'Data Analysis', level: 33, color: '#A78BFA' },
]

const badges = [
  { emoji: '🔥', name: 'Streak Master', desc: '7 jours consécutifs' },
  { emoji: '🎯', name: 'Objectif atteint', desc: '15h en une semaine' },
  { emoji: '🐍', name: 'Pythonista', desc: 'Module Python validé' },
  { emoji: '⭐', name: 'Top 10%', desc: 'Classement Data Science' },
]

export default function ProfilPage() {
  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '2rem' }}>Mon profil</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        <div>
          {/* Profile card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 auto 1rem',
              fontFamily: 'var(--font-display)'
            }}>LG</div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Lamine Gaye</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1rem' }}>prolaminegaye@gmail.com</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>4</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cours</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--teal)' }}>🔥7</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Streak</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--gold)' }}>82</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Score</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1rem' }}>Badges obtenus</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {badges.map(b => (
                <div key={b.name} style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{b.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>{b.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Skills */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1.25rem' }}>Compétences acquises</h3>
            {skills.map(s => (
              <div key={s.name} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{s.name}</span>
                  <span style={{ fontSize: '13px', color: s.color, fontWeight: '600' }}>{s.level}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.level}%`, background: s.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1.25rem' }}>Paramètres</h3>
            {[
              { label: 'Pays', value: 'Sénégal 🇸🇳' },
              { label: 'Langue', value: 'Français' },
              { label: 'Niveau', value: 'Intermédiaire' },
              { label: 'Objectif hebdo', value: '15h / semaine' },
              { label: 'Plan', value: 'Pro · Actif ✓' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{item.value}</span>
              </div>
            ))}
            <button style={{
              marginTop: '1rem', width: '100%', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '10px', padding: '10px',
              color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)'
            }}>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'

const learningPath = [
  { id: 1, title: 'Fondamentaux Python', status: 'completed', score: 92, type: 'obligatoire', duration: '3h' },
  { id: 2, title: 'Structures de données', status: 'completed', score: 78, type: 'obligatoire', duration: '2h' },
  { id: 3, title: 'Analyse de données avec Pandas', status: 'current', score: 0, type: 'recommandé', duration: '4h' },
  { id: 4, title: 'Visualisation avec Matplotlib', status: 'locked', score: 0, type: 'recommandé', duration: '2h' },
  { id: 5, title: 'Machine Learning — Introduction', status: 'locked', score: 0, type: 'avancé', duration: '6h' },
  { id: 6, title: 'Projet final : Analyse prédictive', status: 'locked', score: 0, type: 'projet', duration: '8h' },
]

const typeColors: Record<string, string> = {
  obligatoire: 'var(--accent)',
  recommandé: 'var(--teal)',
  avancé: 'var(--purple)',
  projet: 'var(--gold)',
}

export default function AdaptivePage() {
  const [selected, setSelected] = useState<number | null>(null)
  const completed = learningPath.filter(l => l.status === 'completed').length
  const avgScore = learningPath.filter(l => l.score > 0).reduce((acc, l, _, arr) => acc + l.score / arr.length, 0)

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>🧠 Parcours Adaptatif</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>L&apos;IA adapte votre parcours selon vos performances en temps réel</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Modules complétés', value: `${completed}/${learningPath.length}`, color: 'var(--teal)' },
          { label: 'Score moyen', value: `${Math.round(avgScore)}%`, color: 'var(--accent)' },
          { label: 'Niveau actuel', value: 'Intermédiaire', color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI insight */}
      <div style={{ background: 'linear-gradient(135deg, rgba(91,141,239,0.12) 0%, rgba(34,212,168,0.08) 100%)', border: '1px solid var(--border-active)', borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '24px', flexShrink: 0 }}>✦</div>
        <div>
          <div style={{ fontWeight: '700', color: 'var(--accent)', marginBottom: '6px', fontSize: '14px' }}>Recommandation IA personnalisée</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Votre score de <strong style={{ color: 'var(--text-primary)' }}>78% en structures de données</strong> suggère de consolider les bases avant d&apos;avancer. Je recommande de revoir le module 2 avant Pandas. Vous progressez <strong style={{ color: 'var(--teal)' }}>23% plus vite</strong> que la moyenne des apprenants de votre niveau.
          </p>
        </div>
      </div>

      {/* Path */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {learningPath.map((item, i) => (
          <div key={item.id}>
            <div onClick={() => setSelected(selected === item.id ? null : item.id)} style={{
              background: item.status === 'current' ? 'rgba(91,141,239,0.08)' : 'var(--bg-card)',
              border: `1px solid ${item.status === 'current' ? 'var(--border-active)' : 'var(--border)'}`,
              borderRadius: '14px', padding: '14px 18px', cursor: item.status !== 'locked' ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: '14px', opacity: item.status === 'locked' ? 0.5 : 1,
              transition: 'all .15s'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                background: item.status === 'completed' ? 'var(--teal-muted)' : item.status === 'current' ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                color: item.status === 'completed' ? 'var(--teal)' : item.status === 'current' ? 'var(--accent)' : 'var(--text-muted)'
              }}>
                {item.status === 'completed' ? '✓' : item.status === 'current' ? '▶' : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>{item.title}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: typeColors[item.type] + '20', color: typeColors[item.type] }}>{item.type}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱ {item.duration}</span>
                  {item.score > 0 && <span style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: '600' }}>Score: {item.score}%</span>}
                </div>
              </div>
              {item.status === 'current' && <a href="/cours" style={{ background: 'var(--gradient-accent)', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(91,141,239,0.4)' }}>Continuer →</a>}
            </div>
            {i < learningPath.length - 1 && (
              <div style={{ width: '2px', height: '10px', background: 'var(--border)', margin: '0 auto', marginLeft: '28px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'

export default function SatisfactionPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const criteria = [
    { key: 'content', label: 'Qualité des contenus', icon: '📚' },
    { key: 'tutor', label: 'AI Tutor & assistance', icon: '✦' },
    { key: 'design', label: 'Interface & navigation', icon: '🎨' },
    { key: 'speed', label: 'Fluidité & rapidité', icon: '⚡' },
    { key: 'value', label: 'Valeur pour votre carrière', icon: '🚀' },
  ]

  const avg = Object.values(ratings).length ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1) : '—'

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🙏</div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Merci pour votre retour !</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Note moyenne : <strong style={{ color: 'var(--gold)', fontSize: '20px' }}>{avg}/5</strong></p>
      <a href="/dashboard"><button className="btn-primary">Retour au dashboard</button></a>
    </div>
  )

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>⭐ Évaluation de satisfaction</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>Votre avis nous aide à améliorer ETAGIA LMS</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {criteria.map(c => (
          <div key={c.key} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '24px' }}>{c.icon}</span>
            <span style={{ flex: 1, fontWeight: '500', fontSize: '14px', color: 'var(--text-primary)' }}>{c.label}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRatings(r => ({...r, [c.key]: star}))}
                  style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', transition: 'transform .1s', transform: ratings[c.key] >= star ? 'scale(1.1)' : 'scale(1)' }}>
                  {ratings[c.key] >= star ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: '500' }}>Commentaire libre (optionnel)</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
          placeholder="Vos suggestions, points forts, améliorations souhaitées..."
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', width: '100%', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(ratings).length < criteria.length} className="btn-primary"
          style={{ opacity: Object.keys(ratings).length < criteria.length ? 0.5 : 1 }}>
          Envoyer mon évaluation
        </button>
        {avg !== '—' && <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '16px' }}>Moy. actuelle : {avg}/5</span>}
      </div>
    </div>
  )
}

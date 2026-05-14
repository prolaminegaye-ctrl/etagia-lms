'use client'
import { useState } from 'react'

const questions = [
  { id: 1, cat: 'Tech', q: 'Quel est votre niveau en informatique ?', opts: ['Aucune notion', 'Débutant — je sais utiliser un PC', 'Intermédiaire — je code un peu', 'Avancé — je développe des applications'] },
  { id: 2, cat: 'Business', q: 'Avez-vous déjà géré un projet professionnel ?', opts: ['Jamais', 'Oui, en tant que membre', 'Oui, en tant que chef de projet', 'Oui, plusieurs projets complexes'] },
  { id: 3, cat: 'Soft Skills', q: 'Comment évaluez-vous votre communication professionnelle ?', opts: ['À améliorer', 'Satisfaisante', 'Bonne', 'Excellente'] },
  { id: 4, cat: 'Objectifs', q: 'Quel est votre principal objectif sur ETAGIA ?', opts: ['Changer de métier', 'Monter en compétences', 'Créer mon entreprise', 'Former mon équipe'] },
  { id: 5, cat: 'Temps', q: 'Combien de temps pouvez-vous consacrer à l\'apprentissage ?', opts: ['< 2h par semaine', '2-5h par semaine', '5-10h par semaine', '> 10h par semaine'] },
  { id: 6, cat: 'Format', q: 'Quel format d\'apprentissage préférez-vous ?', opts: ['Vidéos courtes', 'Lectures & articles', 'Exercices pratiques', 'Projets réels guidés'] },
]

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [current, setCurrent] = useState(0)

  const answer = (qId: number, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }))
    if (current < questions.length - 1) setTimeout(() => setCurrent(c => c + 1), 400)
  }

  const submit = () => setSubmitted(true)

  const progress = (Object.keys(answers).length / questions.length) * 100

  const getProfile = () => {
    const techScore = (answers[1] || 0)
    const bizScore = (answers[2] || 0)
    const timeScore = (answers[5] || 0)
    if (techScore >= 2) return { label: 'Profil Tech', color: 'var(--accent)', courses: ['Data Science avec Python', 'IA Générative pour pros', 'Excel Pro'] }
    if (bizScore >= 2) return { label: 'Profil Business', color: 'var(--teal)', courses: ['Marketing Digital Afrique', 'Leadership & Management', 'Pitch & Fundraising'] }
    return { label: 'Profil Polyvalent', color: 'var(--gold)', courses: ['Communication professionnelle', 'Gestion de projet', 'Comptabilité SME'] }
  }

  if (submitted) {
    const profile = getProfile()
    return (
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>🎯 Votre profil d&apos;apprentissage</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>Basé sur votre évaluation diagnostique</p>

        <div style={{ background: 'var(--bg-card)', border: `1px solid ${profile.color}50`, borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: profile.color, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>{profile.label}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Voici les cours recommandés pour vous par notre IA adaptive</p>
        </div>

        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Parcours recommandé</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {profile.courses.map((c, i) => (
            <div key={c} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${profile.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: profile.color, fontFamily: 'var(--font-display)' }}>{i+1}</div>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{c}</span>
              <a href="/cours" style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '13px', fontWeight: '600' }}>Commencer →</a>
            </div>
          ))}
        </div>
        <a href="/dashboard" style={{ display: 'inline-block' }}>
          <button className="btn-primary">Aller à mon dashboard →</button>
        </a>
      </div>
    )
  }

  const q = questions[current]
  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>📋 Évaluation diagnostique</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>Aidez-nous à personnaliser votre parcours d&apos;apprentissage</p>

      {/* Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span>Question {current + 1} / {questions.length}</span>
          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-accent)', borderRadius: '3px', transition: 'width .4s ease' }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-active)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{q.cat}</div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{q.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => answer(q.id, i)} style={{
              background: answers[q.id] === i ? 'var(--accent-muted)' : 'var(--bg-secondary)',
              border: `1px solid ${answers[q.id] === i ? 'var(--border-active)' : 'var(--border)'}`,
              borderRadius: '12px', padding: '14px 18px', color: answers[q.id] === i ? 'var(--accent)' : 'var(--text-primary)',
              fontSize: '14px', fontWeight: answers[q.id] === i ? '600' : '400', textAlign: 'left',
              transition: 'all .15s', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: answers[q.id] === i ? 'var(--accent)' : 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: answers[q.id] === i ? '#fff' : 'var(--text-muted)', flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        {current > 0 && <button onClick={() => setCurrent(c => c-1)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 20px', color: 'var(--text-secondary)', fontSize: '14px' }}>← Précédent</button>}
        {current < questions.length - 1
          ? <button onClick={() => setCurrent(c => c+1)} disabled={answers[q.id] === undefined} className="btn-primary" style={{ marginLeft: 'auto', opacity: answers[q.id] === undefined ? 0.5 : 1 }}>Suivant →</button>
          : <button onClick={submit} disabled={Object.keys(answers).length < questions.length} className="btn-primary" style={{ marginLeft: 'auto', opacity: Object.keys(answers).length < questions.length ? 0.5 : 1 }}>🎯 Voir mon profil</button>
        }
      </div>
    </div>
  )
}

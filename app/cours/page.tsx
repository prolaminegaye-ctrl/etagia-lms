'use client'
import { useState } from 'react'

const categories = ['Tous', 'Tech', 'Business', 'Soft Skills', 'Entrepreneuriat', 'Finance']

const allCourses = [
  { title: 'Data Science avec Python', category: 'Tech', level: 'Intermédiaire', duration: '24h', lessons: 24, enrolled: 1240, color: 'var(--accent)', emoji: '🐍' },
  { title: 'Marketing Digital Afrique', category: 'Business', level: 'Débutant', duration: '15h', lessons: 18, enrolled: 890, color: 'var(--teal)', emoji: '📱' },
  { title: 'Leadership & Management', category: 'Soft Skills', level: 'Intermédiaire', duration: '10h', lessons: 12, enrolled: 654, color: 'var(--gold)', emoji: '🎯' },
  { title: 'IA Générative pour pros', category: 'Tech', level: 'Avancé', duration: '20h', lessons: 20, enrolled: 2100, color: '#A78BFA', emoji: '🤖' },
  { title: 'Comptabilité SME Afrique', category: 'Finance', level: 'Débutant', duration: '12h', lessons: 14, enrolled: 430, color: '#F97316', emoji: '💼' },
  { title: 'Pitch & Fundraising', category: 'Entrepreneuriat', level: 'Intermédiaire', duration: '8h', lessons: 10, enrolled: 780, color: '#EC4899', emoji: '🚀' },
  { title: 'Excel & Google Sheets Pro', category: 'Tech', level: 'Débutant', duration: '18h', lessons: 22, enrolled: 3200, color: 'var(--teal)', emoji: '📊' },
  { title: 'Communication Interculturelle', category: 'Soft Skills', level: 'Tous niveaux', duration: '6h', lessons: 8, enrolled: 560, color: 'var(--gold)', emoji: '🌍' },
  { title: 'Création d\'entreprise', category: 'Entrepreneuriat', level: 'Débutant', duration: '14h', lessons: 16, enrolled: 1100, color: 'var(--accent)', emoji: '✨' },
]

export default function CoursPage() {
  const [cat, setCat] = useState('Tous')
  const filtered = cat === 'Tous' ? allCourses : allCourses.filter(c => c.category === cat)

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '6px' }}>Catalogue de cours</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{allCourses.length} cours disponibles · Mis à jour aujourd&apos;hui</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text" placeholder="🔍 Rechercher un cours, une compétence..."
          style={{
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '12px 16px', color: 'var(--text-primary)',
            fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)'
          }}
        />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
            border: '1px solid ' + (cat === c ? 'var(--accent)' : 'var(--border)'),
            background: cat === c ? 'var(--accent-muted)' : 'var(--bg-card)',
            color: cat === c ? 'var(--accent)' : 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s'
          }}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {filtered.map(course => (
          <div key={course.title} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.25rem', cursor: 'pointer',
            transition: 'border-color .15s, transform .15s'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: course.color + '1a', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', marginBottom: '1rem'
            }}>{course.emoji}</div>
            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px', lineHeight: '1.4' }}>{course.title}</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{course.category}</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{course.level}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📚 {course.lessons} leçons · {course.duration}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>👥 {course.enrolled.toLocaleString()}</span>
            </div>
            <button style={{
              width: '100%', background: course.color + '1a', border: '1px solid ' + course.color + '33',
              borderRadius: '8px', padding: '8px', color: course.color, fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all .15s'
            }}>
              Commencer le cours →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

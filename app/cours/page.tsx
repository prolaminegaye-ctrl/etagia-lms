'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import PageHero from '@/components/PageHero'

const COURSES = [
  { id: 1, title: 'Data Science avec Python',      cat: 'Tech',        progress: 72, done: 17, total: 24, color: 'var(--turq)', bg: 'var(--turq-50)', emoji: '🐍' },
  { id: 2, title: 'Marketing Digital Afrique',      cat: 'Business',    progress: 45, done: 8,  total: 18, color: 'var(--orange-700)', bg: 'var(--orange-50)', emoji: '📱' },
  { id: 3, title: 'Leadership & Management',        cat: 'Soft Skills', progress: 30, done: 4,  total: 12, color: 'var(--violet)', bg: 'var(--violet-50)', emoji: '🏆' },
  { id: 4, title: 'Techniques de Vente Avancées',   cat: 'Commerce',    progress: 88, done: 21, total: 24, color: 'var(--turq-700)', bg: 'var(--turq-50)', emoji: '💼' },
  { id: 5, title: 'Comptabilité & Gestion PME',    cat: 'Finance',     progress: 15, done: 2,  total: 16, color: 'var(--gold-700)', bg: 'var(--gold-50)', emoji: '📊' },
  { id: 6, title: 'Communication Commerciale',      cat: 'Soft Skills', progress: 60, done: 9,  total: 15, color: 'var(--violet)', bg: 'var(--violet-50)', emoji: '🗣️' },
]

const FILTERS = ['Tous', 'En cours', 'Terminés', 'À commencer']

export default function CoursPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('Tous')
  const [search, setSearch] = useState('')

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Tous' ? true
      : filter === 'En cours' ? (c.progress > 0 && c.progress < 100)
      : filter === 'Terminés' ? c.progress === 100
      : c.progress === 0
    return matchSearch && matchFilter
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar role="apprenant" />
      <main style={{ marginLeft: '248px', flex: 1, padding: '2rem', maxWidth: '1100px' }}>

        <PageHero
          eyebrow="Formation"
          title="Mes cours"
          subtitle="Reprenez où vous vous étiez arrêté. Chaque leçon compte."
          stats={[{value:'6',label:'Cours inscrits'},{value:'4',label:'En cours'},{value:'1',label:'Terminé'},{value:'68%',label:'Progression moy.'}]}
        />

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="🔍  Rechercher un cours..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', maxWidth: '340px', padding: '10px 16px', borderRadius: '99px', border: '2px solid #D9DBE9', fontSize: '14px', outline: 'none', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
            onBlur={e => e.target.style.borderColor = 'var(--line)'}
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 16px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '700', transition: 'all .15s',
                background: filter === f ? 'var(--grad-signature)' : 'var(--surface)',
                color: filter === f ? '#fff' : 'var(--ink-mut)',
                boxShadow: filter === f ? '0 4px 12px rgba(240,137,74,.25)' : '0 1px 3px rgba(46,56,86,0.08)',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'En cours', v: COURSES.filter(c => c.progress > 0 && c.progress < 100).length, bg: 'var(--turq-50)', color: 'var(--turq-700)' },
            { label: 'Terminés', v: COURSES.filter(c => c.progress === 100).length, bg: 'var(--turq-50)', color: 'var(--turq-700)' },
            { label: 'Total inscrit', v: COURSES.length, bg: 'var(--gold-50)', color: 'var(--gold-700)' },
          ].map(({ label, v, bg, color }) => (
            <div key={label} style={{ padding: '10px 18px', background: bg, borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color }}>{v}</span>
              <span style={{ fontSize: '12px', color, fontWeight: '600' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Course grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map(({ id, title, cat, progress, done, total, color, bg, emoji }) => (
            <div key={id} onClick={() => router.push('/cours/' + id)} style={{
              background: 'var(--surface)', border: '1px solid #D9DBE9', borderRadius: '20px',
              overflow: 'hidden', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(46,56,86,0.07)', transition: 'transform .15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
            >
              <div style={{ background: bg, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '30px' }}>{emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', background: 'rgba(255,255,255,0.7)', color, padding: '3px 10px', borderRadius: '99px' }}>{cat}</span>
              </div>
              <div style={{ padding: '1.125rem' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.4 }}>{title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{done}/{total} leçons</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color }}>{progress}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--line)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'var(--grad-ia)', borderRadius: '99px' }} />
                </div>
                <button style={{ marginTop: '12px', width: '100%', padding: '9px', background: 'var(--grad-signature)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  {progress === 0 ? 'Commencer →' : progress === 100 ? '✅ Terminé' : 'Continuer →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

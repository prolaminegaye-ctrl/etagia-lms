'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const COURSES = [
  { id: 1, title: 'Data Science avec Python',      cat: 'Tech',        progress: 72, done: 17, total: 24, color: '#4255FF', bg: '#E8EAFF', emoji: '🐍' },
  { id: 2, title: 'Marketing Digital Afrique',      cat: 'Business',    progress: 45, done: 8,  total: 18, color: '#F4591F', bg: '#FFF3EE', emoji: '📱' },
  { id: 3, title: 'Leadership & Management',        cat: 'Soft Skills', progress: 30, done: 4,  total: 12, color: '#6B52D4', bg: '#EDE9FE', emoji: '🏆' },
  { id: 4, title: 'Techniques de Vente Avancées',   cat: 'Commerce',    progress: 88, done: 21, total: 24, color: '#0F766E', bg: '#CCFBDC', emoji: '💼' },
  { id: 5, title: 'Comptabilité & Gestion PME',    cat: 'Finance',     progress: 15, done: 2,  total: 16, color: '#D97706', bg: '#FEF3C7', emoji: '📊' },
  { id: 6, title: 'Communication Commerciale',      cat: 'Soft Skills', progress: 60, done: 9,  total: 15, color: '#9333EA', bg: '#FFD6FD', emoji: '🗣️' },
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F7FB' }}>
      <Sidebar role="apprenant" />
      <main style={{ marginLeft: '248px', flex: 1, padding: '2rem', maxWidth: '1100px' }}>

        <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Formation</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.5px', marginBottom: '1.5rem' }}>Mes cours</h1>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="🔍  Rechercher un cours..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', maxWidth: '340px', padding: '10px 16px', borderRadius: '99px', border: '2px solid #D9DBE9', fontSize: '14px', outline: 'none', background: '#fff', color: '#2E3856', fontFamily: 'Inter, sans-serif' }}
            onFocus={e => e.target.style.borderColor = '#4255FF'}
            onBlur={e => e.target.style.borderColor = '#D9DBE9'}
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 16px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '700', transition: 'all .15s',
                background: filter === f ? '#4255FF' : '#fff',
                color: filter === f ? '#fff' : '#586380',
                boxShadow: filter === f ? '0 4px 12px rgba(66,85,255,0.25)' : '0 1px 3px rgba(46,56,86,0.08)',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'En cours', v: COURSES.filter(c => c.progress > 0 && c.progress < 100).length, bg: '#E8EAFF', color: '#4255FF' },
            { label: 'Terminés', v: COURSES.filter(c => c.progress === 100).length, bg: '#CCFBDC', color: '#16A34A' },
            { label: 'Total inscrit', v: COURSES.length, bg: '#FEF3C7', color: '#D97706' },
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
              background: '#fff', border: '1px solid #D9DBE9', borderRadius: '20px',
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
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#2E3856', marginBottom: '8px', lineHeight: 1.4 }}>{title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#939BB4' }}>{done}/{total} leçons</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color }}>{progress}%</span>
                </div>
                <div style={{ height: '6px', background: '#ECEEF5', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '99px' }} />
                </div>
                <button style={{ marginTop: '12px', width: '100%', padding: '9px', background: color, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
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

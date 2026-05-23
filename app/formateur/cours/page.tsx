'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type SavedCourse = {
  id: string
  title: string
  description: string
  level: string
  category: string
  duration: string
  modules: number
  blocks: number
  savedAt: string
  published: boolean
  hasYoutube: boolean
  hasScorm: boolean
  data: any
}

const S = {
  card: { background: '#fff', border: '1px solid rgba(28,25,23,0.08)', borderRadius: '16px' } as React.CSSProperties,
  btn: { background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '9px', padding: '8px 18px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' } as React.CSSProperties,
  ghost: { background: '#FAF9F7', border: '1px solid rgba(28,25,23,0.08)', borderRadius: '9px', padding: '7px 14px', color: '#78716C', fontSize: '12px', cursor: 'pointer', fontWeight: '600' } as React.CSSProperties,
  tag: { borderRadius: '20px', padding: '3px 10px', fontSize: '10px', fontWeight: '700' as const },
}

const LEVEL_COLORS: Record<string, string> = {
  débutant: '#10B981', intermédiaire: '#F59E0B', avancé: '#EF4444', expert: '#8B5CF6'
}
const CAT_ICONS: Record<string, string> = {
  Tech: '💻', Vente: '🤝', Management: '👥', RH: '👤', Marketing: '📣', Finance: '💰', Design: '🎨', Autre: '📚'
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'à l\'instant'
  if (m < 60) return `il y a ${m}min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  return `il y a ${Math.floor(h / 24)}j`
}

export default function MesCours() {
  const router = useRouter()
  const [courses, setCourses] = useState<SavedCourse[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [delId, setDelId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('etagia_courses')
      if (raw) setCourses(JSON.parse(raw))
    } catch {}
  }, [])

  const save = (list: SavedCourse[]) => {
    setCourses(list)
    localStorage.setItem('etagia_courses', JSON.stringify(list))
  }

  const deleteCourse = (id: string) => {
    save(courses.filter(c => c.id !== id))
    setDelId(null)
  }

  const duplicate = (c: SavedCourse) => {
    const copy: SavedCourse = {
      ...c,
      id: Math.random().toString(36).slice(2),
      title: c.title + ' (copie)',
      savedAt: new Date().toISOString(),
      published: false,
    }
    save([copy, ...courses])
  }

  const filtered = courses.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || (filter === 'published' && c.published) || (filter === 'draft' && !c.published)
    return matchSearch && matchFilter
  })

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F7', padding: '2rem 2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1C1917', margin: '0 0 4px' }}>Mes cours</h1>
          <p style={{ color: '#A8A29E', fontSize: '13px', margin: 0 }}>
            {courses.length} cours enregistré{courses.length !== 1 ? 's' : ''} · {courses.filter(c => c.published).length} publié{courses.filter(c => c.published).length !== 1 ? 's' : ''}
          </p>
        </div>
        <button style={S.btn} onClick={() => router.push('/formateur/creer')}>+ Créer un cours</button>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          style={{ background: '#fff', border: '1px solid rgba(28,25,23,0.09)', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', outline: 'none', flex: '1 1 220px', color: '#1C1917', fontFamily: 'inherit' }}
          placeholder="🔍 Rechercher un cours…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        {['all', 'published', 'draft'].map(f => (
          <button key={f} style={{ ...S.ghost, background: filter === f ? 'rgba(232,101,26,0.08)' : '#FAF9F7', color: filter === f ? '#E8651A' : '#78716C', border: filter === f ? '1px solid rgba(232,101,26,0.3)' : '1px solid rgba(28,25,23,0.08)' }}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'Tous' : f === 'published' ? '✅ Publiés' : '📝 Brouillons'}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div style={{ ...S.card, padding: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1C1917', marginBottom: '8px' }}>Aucun cours créé</h2>
          <p style={{ color: '#A8A29E', marginBottom: '1.5rem' }}>Créez votre premier cours avec l'IA ou manuellement.</p>
          <button style={S.btn} onClick={() => router.push('/formateur/creer')}>✨ Créer mon premier cours</button>
        </div>
      )}

      {/* No results */}
      {courses.length > 0 && filtered.length === 0 && (
        <div style={{ ...S.card, padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
          <div style={{ color: '#A8A29E' }}>Aucun résultat pour « {search} »</div>
        </div>
      )}

      {/* Course grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(course => (
          <div key={course.id} style={{ ...S.card, overflow: 'hidden', transition: 'box-shadow .2s, transform .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(232,101,26,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>

            {/* Card header */}
            <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(28,25,23,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '32px' }}>{CAT_ICONS[course.category] || '📚'}</div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <span style={{ ...S.tag, background: course.published ? 'rgba(16,185,129,0.1)' : 'rgba(28,25,23,0.06)', color: course.published ? '#059669' : '#A8A29E', border: `1px solid ${course.published ? 'rgba(16,185,129,0.2)' : 'rgba(28,25,23,0.09)'}` }}>
                    {course.published ? '✅ Publié' : '📝 Brouillon'}
                  </span>
                  <span style={{ ...S.tag, background: `${LEVEL_COLORS[course.level] || '#888'}15`, color: LEVEL_COLORS[course.level] || '#888', border: `1px solid ${LEVEL_COLORS[course.level] || '#888'}30` }}>
                    {course.level}
                  </span>
                </div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1C1917', margin: '0 0 6px', lineHeight: 1.3 }}>{course.title}</h3>
              {course.description && <p style={{ fontSize: '12px', color: '#78716C', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>}
            </div>

            {/* Stats */}
            <div style={{ padding: '10px 1.25rem', display: 'flex', gap: '12px', borderBottom: '1px solid rgba(28,25,23,0.05)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#A8A29E' }}>📦 {course.modules} module{course.modules !== 1 ? 's' : ''}</span>
              <span style={{ fontSize: '11px', color: '#A8A29E' }}>🧩 {course.blocks} blocs</span>
              <span style={{ fontSize: '11px', color: '#A8A29E' }}>⏱ {course.duration}</span>
              {course.hasYoutube && <span style={{ fontSize: '11px', color: '#F00' }}>▶ YouTube</span>}
              {course.hasScorm && <span style={{ fontSize: '11px', color: '#E8651A' }}>📦 SCORM</span>}
            </div>

            {/* Timestamp */}
            <div style={{ padding: '8px 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(28,25,23,0.04)' }}>
              <span style={{ fontSize: '10px', color: '#C4B5A4' }}>Sauvegardé {timeAgo(course.savedAt)}</span>
              <span style={{ fontSize: '10px', color: '#C4B5A4' }}>{course.category}</span>
            </div>

            {/* Actions */}
            <div style={{ padding: '10px 1.25rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button style={{ ...S.btn, flex: 1, textAlign: 'center', fontSize: '12px', padding: '7px 12px' }}
                onClick={() => router.push(`/formateur/viewer`)}>
                ▶ Visualiser
              </button>
              <button style={{ ...S.ghost, fontSize: '12px', padding: '7px 12px' }}
                onClick={() => router.push(`/formateur/creer`)}>
                ✏️ Éditer
              </button>
              <button style={{ ...S.ghost, fontSize: '12px', padding: '7px 12px' }}
                onClick={() => duplicate(course)} title="Dupliquer">
                ⧉
              </button>
              {delId === course.id ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ ...S.ghost, fontSize: '11px', padding: '5px 8px', background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
                    onClick={() => deleteCourse(course.id)}>Confirmer</button>
                  <button style={{ ...S.ghost, fontSize: '11px', padding: '5px 8px' }} onClick={() => setDelId(null)}>Annuler</button>
                </div>
              ) : (
                <button style={{ ...S.ghost, fontSize: '12px', padding: '7px 10px', color: '#F87171' }}
                  onClick={() => setDelId(course.id)} title="Supprimer">🗑</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

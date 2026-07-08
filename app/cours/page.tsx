'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHero from '@/components/PageHero'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { logActivity } from '@/lib/activity'

type Course = {
  id: string
  title: string
  category: string
  thumbnail_emoji: string | null
  thumbnail_color: string | null
  status: string
}

type Enrollment = { course_id: string; progress: number; completed_at: string | null }

const FILTERS = ['Tous', 'En cours', 'Terminés', 'À commencer']

export default function CoursPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('Tous')
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = getSupabase()
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      setUserId(auth.user?.id ?? null)

      const { data: courseRows } = await supabase
        .from('courses')
        .select('id, title, category, thumbnail_emoji, thumbnail_color, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      setCourses(courseRows ?? [])

      if (auth.user) {
        const { data: enrollRows } = await supabase
          .from('enrollments')
          .select('course_id, progress, completed_at')
          .eq('user_id', auth.user.id)
        const map: Record<string, Enrollment> = {}
        for (const e of enrollRows ?? []) map[e.course_id] = e
        setEnrollments(map)
      }
      setLoading(false)
    })()
  }, [])

  const startCourse = async (courseId: string) => {
    if (!userId) { router.push('/auth'); return }
    if (!enrollments[courseId]) {
      const supabase = getSupabase()
      await supabase.from('enrollments').upsert(
        { user_id: userId, course_id: courseId, progress: 0, last_accessed: new Date().toISOString() },
        { onConflict: 'user_id,course_id' }
      )
      await logActivity('course_started', { course_id: courseId })
    }
    router.push('/cours/' + courseId)
  }

  const withProgress = courses.map((c) => {
    const e = enrollments[c.id]
    return { ...c, progress: e ? Math.round(Number(e.progress) || 0) : 0, enrolled: Boolean(e) }
  })

  const filtered = withProgress.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Tous' ? true
      : filter === 'En cours' ? (c.progress > 0 && c.progress < 100)
      : filter === 'Terminés' ? c.progress === 100
      : c.progress === 0
    return matchSearch && matchFilter
  })

  const enrolledCount = withProgress.filter((c) => c.enrolled).length
  const doneCount = withProgress.filter((c) => c.progress === 100).length
  const avgProgress = enrolledCount
    ? Math.round(withProgress.filter((c) => c.enrolled).reduce((sum, c) => sum + c.progress, 0) / enrolledCount)
    : 0

  return (
    <div style={{ maxWidth: '1100px' }}>
        <PageHero
          eyebrow="Formation"
          title="Mes cours"
          subtitle="Reprenez où vous vous étiez arrêté. Chaque leçon compte."
          stats={[
            { value: String(courses.length), label: 'Cours disponibles' },
            { value: String(enrolledCount), label: 'Inscrits' },
            { value: String(doneCount), label: 'Terminés' },
            { value: `${avgProgress}%`, label: 'Progression moy.' },
          ]}
        />

        {!isSupabaseConfigured && (
          <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--orange-50)', color: 'var(--orange-700)', fontSize: '13px', marginBottom: '1.5rem' }}>
            Connexion à la base indisponible pour le moment. Réessayez dans un instant.
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="🔍  Rechercher un cours..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', maxWidth: '340px', padding: '10px 16px', borderRadius: '99px', border: '2px solid #D9DBE9', fontSize: '14px', outline: 'none', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}
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

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
            Aucun cours ne correspond pour l&apos;instant.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filtered.map(({ id, title, category, progress, thumbnail_emoji, thumbnail_color }) => (
              <div key={id} onClick={() => startCourse(id)} style={{
                background: 'var(--surface)', border: '1px solid #D9DBE9', borderRadius: '20px',
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(46,56,86,0.07)', transition: 'transform .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
              >
                <div style={{ background: thumbnail_color ? `${thumbnail_color}22` : 'var(--turq-50)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '30px' }}>{thumbnail_emoji || '📘'}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', background: 'rgba(255,255,255,0.7)', color: thumbnail_color || 'var(--turq)', padding: '3px 10px', borderRadius: '99px' }}>{category}</span>
                </div>
                <div style={{ padding: '1.125rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.4 }}>{title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{progress === 0 ? 'Non commencé' : `${progress}% complété`}</span>
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
        )}
    </div>
  )
}

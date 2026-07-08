'use client'
import { useEffect, useState, use as usePromise } from 'react'
import Link from 'next/link'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { logActivity } from '@/lib/activity'

type Course = {
  id: string
  title: string
  description: string | null
  category: string
  level: string | null
  duration_hours: number | null
  thumbnail_emoji: string | null
  thumbnail_color: string | null
  status: string
}

type Module = { id: string; title: string; description: string | null; order_index: number }

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params)
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [progress, setProgress] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = getSupabase()
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      setUserId(auth.user?.id ?? null)

      const { data: courseRow, error } = await supabase
        .from('courses')
        .select('id, title, description, category, level, duration_hours, thumbnail_emoji, thumbnail_color, status')
        .eq('id', id)
        .maybeSingle()

      if (error || !courseRow) { setNotFound(true); setLoading(false); return }
      setCourse(courseRow)

      const { data: moduleRows } = await supabase
        .from('course_modules')
        .select('id, title, description, order_index')
        .eq('course_id', id)
        .order('order_index', { ascending: true })
      setModules(moduleRows ?? [])

      if (auth.user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('progress')
          .eq('user_id', auth.user.id)
          .eq('course_id', id)
          .maybeSingle()
        setProgress(enrollment ? Math.round(Number(enrollment.progress) || 0) : null)
      }
      setLoading(false)
    })()
  }, [id])

  const enroll = async () => {
    if (!userId) { window.location.href = '/auth'; return }
    setSaving(true)
    const supabase = getSupabase()
    await supabase.from('enrollments').upsert(
      { user_id: userId, course_id: id, progress: 0, last_accessed: new Date().toISOString() },
      { onConflict: 'user_id,course_id' }
    )
    await logActivity('course_started', { course_id: id })
    setProgress(0)
    setSaving(false)
  }

  const markComplete = async () => {
    if (!userId) return
    setSaving(true)
    const supabase = getSupabase()
    await supabase.from('enrollments').update({
      progress: 100,
      completed_at: new Date().toISOString(),
      last_accessed: new Date().toISOString(),
    }).eq('user_id', userId).eq('course_id', id)
    await logActivity('course_completed', { course_id: id })
    setProgress(100)
    setSaving(false)
  }

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
  }

  if (notFound || !course) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>Cours introuvable</h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>Ce cours n&apos;existe pas ou n&apos;est plus disponible.</p>
        <Link href="/cours" style={{ color: 'var(--orange-700)', fontWeight: 700 }}>← Retour à mes cours</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px' }}>
        <Link href="/cours" style={{ fontSize: '13px', color: 'var(--ink-soft)', fontWeight: 600 }}>← Mes cours</Link>

        <div style={{ marginTop: '1rem', borderRadius: '20px', padding: '2rem', background: course.thumbnail_color ? `${course.thumbnail_color}18` : 'var(--turq-50)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '40px' }}>{course.thumbnail_emoji || '📘'}</span>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: course.thumbnail_color || 'var(--turq-700)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{course.category}{course.level ? ` · ${course.level}` : ''}</span>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--ink)', marginTop: '4px' }}>{course.title}</h1>
            </div>
          </div>
          {course.description && <p style={{ color: 'var(--ink-mut)', lineHeight: 1.6, marginBottom: '1rem' }}>{course.description}</p>}
          {course.duration_hours ? <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>⏱ Durée estimée : {course.duration_hours}h</p> : null}

          <div style={{ marginTop: '1.5rem' }}>
            {progress === null ? (
              <button onClick={enroll} disabled={saving} style={{ padding: '11px 22px', background: 'var(--grad-signature)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                {saving ? 'Inscription…' : 'Commencer ce cours →'}
              </button>
            ) : progress === 100 ? (
              <span style={{ padding: '10px 18px', borderRadius: '10px', background: 'var(--turq-50)', color: 'var(--turq-700)', fontWeight: 700, fontSize: '14px' }}>✅ Cours terminé</span>
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 220px' }}>
                  <div style={{ height: '8px', background: 'var(--line)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--grad-ia)', borderRadius: '99px' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{progress}% complété</span>
                </div>
                <button onClick={markComplete} disabled={saving} style={{ padding: '10px 18px', background: 'var(--grad-signature)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  {saving ? 'Enregistrement…' : 'Marquer comme terminé ✅'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem' }}>Contenu du cours</h2>
          {modules.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
              Le contenu détaillé de ce cours est en préparation par l&apos;équipe pédagogique.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {modules.map((m, i) => (
                <div key={m.id} style={{ padding: '1rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--orange-50)', color: 'var(--orange-700)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>{m.title}</div>
                    {m.description && <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{m.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  )
}

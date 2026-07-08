'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { logActivity } from '@/lib/activity'

type Course = { id: string; title: string; thumbnail_emoji: string | null }
type SessionRow = {
  id: string
  title: string
  description: string | null
  course_id: string | null
  starts_at: string | null
  ends_at: string | null
  status: string
  created_at: string
  memberCount: number
  courseTitle: string
}

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: 'Brouillon', bg: '#F5F5F4', color: '#78716C' },
  active: { label: '🟢 Active', bg: 'var(--turq-50)', color: 'var(--turq-700)' },
  completed: { label: '✅ Terminée', bg: 'var(--gold-50)', color: 'var(--gold-700)' },
  archived: { label: 'Archivée', bg: '#F5F5F4', color: '#78716C' },
}

export default function FormateurSessionsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [creating, setCreating] = useState(false)

  const load = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = getSupabase()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { setLoading(false); return }
    setUserId(auth.user.id)

    const [{ data: sessionRows }, { data: courseRows }, { data: memberRows }] = await Promise.all([
      supabase.from('training_sessions').select('id, title, description, course_id, starts_at, ends_at, status, created_at').eq('formateur_id', auth.user.id).order('created_at', { ascending: false }),
      supabase.from('courses').select('id, title, thumbnail_emoji'),
      supabase.from('session_members').select('session_id'),
    ])

    const courseMap = new Map((courseRows ?? []).map((c) => [c.id, c.title]))
    const counts = new Map<string, number>()
    for (const m of memberRows ?? []) counts.set(m.session_id, (counts.get(m.session_id) ?? 0) + 1)

    setCourses(courseRows ?? [])
    setSessions((sessionRows ?? []).map((s) => ({
      ...s,
      memberCount: counts.get(s.id) ?? 0,
      courseTitle: s.course_id ? courseMap.get(s.course_id) ?? 'Cours' : 'Sans cours associé',
    })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const createSession = async () => {
    if (!title.trim() || !userId) return
    setCreating(true)
    const supabase = getSupabase()
    const { data, error } = await supabase.from('training_sessions').insert({
      formateur_id: userId,
      title: title.trim(),
      course_id: courseId || null,
      starts_at: startsAt || null,
      ends_at: endsAt || null,
      status: 'active',
    }).select('id').single()
    setCreating(false)
    if (error || !data) return
    await logActivity('session_created', { session_id: data.id, title: title.trim() })
    setShowCreate(false)
    setTitle(''); setCourseId(''); setStartsAt(''); setEndsAt('')
    router.push(`/formateur/sessions/${data.id}`)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>Mes sessions</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '4px' }}>
            Créez une session, affectez vos apprenants, suivez présence et progression en temps réel.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ padding: '10px 20px', background: 'var(--grad-signature)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          + Créer une session
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
      ) : sessions.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px' }}>
          <div style={{ fontSize: '44px', marginBottom: '1rem' }}>🧑‍🎓</div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>Aucune session pour l&apos;instant</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.25rem', fontSize: '13px' }}>Créez votre première session pour affecter des apprenants et suivre leur assiduité.</p>
          <button onClick={() => setShowCreate(true)} style={{ padding: '10px 20px', background: 'var(--grad-signature)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>+ Créer ma première session</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {sessions.map((s) => {
            const meta = STATUS_META[s.status] ?? STATUS_META.active
            return (
              <div key={s.id} onClick={() => router.push(`/formateur/sessions/${s.id}`)} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.25rem', cursor: 'pointer',
                transition: 'transform .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>{s.title}</h3>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: meta.bg, color: meta.color, whiteSpace: 'nowrap' }}>{meta.label}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '10px' }}>📘 {s.courseTitle}</p>
                {(s.starts_at || s.ends_at) && (
                  <p style={{ fontSize: '11px', color: 'var(--ink-soft)', marginBottom: '10px' }}>
                    📅 {s.starts_at ? new Date(s.starts_at).toLocaleDateString('fr-FR') : '…'} → {s.ends_at ? new Date(s.ends_at).toLocaleDateString('fr-FR') : '…'}
                  </p>
                )}
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange-700)' }}>👥 {s.memberCount} apprenant{s.memberCount !== 1 ? 's' : ''} affecté{s.memberCount !== 1 ? 's' : ''}</div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }} onClick={() => !creating && setShowCreate(false)}>
          <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1.75rem', width: '100%', maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', marginBottom: '1.25rem' }}>Créer une session</h2>
            <label style={lbl}>Titre de la session *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex. Data Science — Cohorte Janvier" style={inp} />
            <label style={lbl}>Cours associé (optionnel)</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)} style={inp}>
              <option value="">— Aucun —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.thumbnail_emoji} {c.title}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={lbl}>Début</label>
                <input type="date" value={startsAt} onChange={e => setStartsAt(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Fin</label>
                <input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} style={inp} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: '10px 18px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', color: 'var(--ink-mut)', cursor: 'pointer' }}>Annuler</button>
              <button onClick={createSession} disabled={!title.trim() || creating} style={{ padding: '10px 20px', background: 'var(--grad-signature)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', opacity: !title.trim() || creating ? 0.6 : 1 }}>
                {creating ? 'Création…' : 'Créer et affecter des apprenants →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const lbl: React.CSSProperties = { fontSize: '11px', color: 'var(--ink-mut)', fontWeight: 700, textTransform: 'uppercase', display: 'block', margin: '10px 0 6px' }
const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--line)', boxSizing: 'border-box', fontSize: '13px', fontFamily: 'inherit' }

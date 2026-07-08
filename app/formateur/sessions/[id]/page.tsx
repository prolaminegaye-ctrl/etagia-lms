'use client'
import { useEffect, useMemo, useState, use as usePromise } from 'react'
import Link from 'next/link'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { logActivity } from '@/lib/activity'

type SessionInfo = { id: string; title: string; description: string | null; course_id: string | null; starts_at: string | null; ends_at: string | null; status: string }
type Profile = { id: string; full_name: string | null; role: string }
type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

const todayISO = () => new Date().toISOString().slice(0, 10)

const ATTENDANCE_META: Record<AttendanceStatus, { label: string; color: string; bg: string }> = {
  present: { label: 'Présent', color: 'var(--turq-700)', bg: 'var(--turq-50)' },
  late: { label: 'Retard', color: 'var(--gold-700)', bg: 'var(--gold-50)' },
  absent: { label: 'Absent', color: 'var(--orange-700)', bg: 'var(--orange-50)' },
  excused: { label: 'Excusé', color: 'var(--ink-mut)', bg: 'var(--surface-2)' },
}

export default function SessionRosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = usePromise(params)
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [members, setMembers] = useState<Profile[]>([])
  const [progressByLearner, setProgressByLearner] = useState<Record<string, number>>({})
  const [todayAttendance, setTodayAttendance] = useState<Record<string, AttendanceStatus>>({})
  const [attendanceStats, setAttendanceStats] = useState<Record<string, { present: number; total: number }>>({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Profile[]>([])
  const [searching, setSearching] = useState(false)

  const load = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = getSupabase()

    const { data: sessionRow, error } = await supabase
      .from('training_sessions')
      .select('id, title, description, course_id, starts_at, ends_at, status')
      .eq('id', sessionId)
      .maybeSingle()
    if (error || !sessionRow) { setNotFound(true); setLoading(false); return }
    setSession(sessionRow)

    const { data: memberRows } = await supabase.from('session_members').select('learner_id').eq('session_id', sessionId)
    const learnerIds = (memberRows ?? []).map((m) => m.learner_id)

    if (learnerIds.length) {
      const [{ data: profileRows }, { data: attendanceRows }, enrollmentResult] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role').in('id', learnerIds),
        supabase.from('session_attendance').select('learner_id, session_date, status').eq('session_id', sessionId),
        sessionRow.course_id
          ? supabase.from('enrollments').select('user_id, progress').eq('course_id', sessionRow.course_id).in('user_id', learnerIds)
          : Promise.resolve({ data: [] as { user_id: string; progress: number }[] }),
      ])
      setMembers(profileRows ?? [])

      const today: Record<string, AttendanceStatus> = {}
      const stats: Record<string, { present: number; total: number }> = {}
      for (const a of attendanceRows ?? []) {
        if (a.session_date === todayISO()) today[a.learner_id] = a.status as AttendanceStatus
        if (!stats[a.learner_id]) stats[a.learner_id] = { present: 0, total: 0 }
        stats[a.learner_id].total++
        if (a.status === 'present' || a.status === 'late') stats[a.learner_id].present++
      }
      setTodayAttendance(today)
      setAttendanceStats(stats)

      const progressMap: Record<string, number> = {}
      for (const e of enrollmentResult.data ?? []) progressMap[e.user_id] = Math.round(Number(e.progress) || 0)
      setProgressByLearner(progressMap)
    }

    setLoading(false)
  }

  useEffect(() => { load() }, [sessionId])

  useEffect(() => {
    if (!search.trim() || !isSupabaseConfigured) { setSearchResults([]); return }
    setSearching(true)
    const supabase = getSupabase()
    const timer = setTimeout(async () => {
      const memberIds = members.map((m) => m.id)
      const { data } = await supabase.from('profiles').select('id, full_name, role').ilike('full_name', `%${search.trim()}%`).limit(10)
      setSearchResults((data ?? []).filter((p) => !memberIds.includes(p.id)))
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, members])

  const addMember = async (profile: Profile) => {
    const supabase = getSupabase()
    await supabase.from('session_members').insert({ session_id: sessionId, learner_id: profile.id })
    await logActivity('session_member_added', { session_id: sessionId, learner_id: profile.id })
    setSearch('')
    setSearchResults([])
    load()
  }

  const removeMember = async (learnerId: string) => {
    const supabase = getSupabase()
    await supabase.from('session_members').delete().eq('session_id', sessionId).eq('learner_id', learnerId)
    load()
  }

  const markAttendance = async (learnerId: string, status: AttendanceStatus) => {
    setTodayAttendance((prev) => ({ ...prev, [learnerId]: status }))
    const supabase = getSupabase()
    const { data: auth } = await supabase.auth.getUser()
    await supabase.from('session_attendance').upsert(
      { session_id: sessionId, learner_id: learnerId, session_date: todayISO(), status, marked_by: auth.user?.id ?? null, marked_at: new Date().toISOString() },
      { onConflict: 'session_id,learner_id,session_date' }
    )
    await logActivity('attendance_marked', { session_id: sessionId, learner_id: learnerId, status })
  }

  const avgProgress = useMemo(() => {
    const values = members.map((m) => progressByLearner[m.id] ?? 0)
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0
  }, [members, progressByLearner])

  const presentToday = Object.values(todayAttendance).filter((s) => s === 'present' || s === 'late').length

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
  if (notFound || !session) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '1rem' }}>Session introuvable.</p>
      <Link href="/formateur/sessions" style={{ color: 'var(--orange-700)', fontWeight: 700 }}>← Mes sessions</Link>
    </div>
  )

  return (
    <div>
      <Link href="/formateur/sessions" style={{ fontSize: '13px', color: 'var(--ink-soft)', fontWeight: 600 }}>← Mes sessions</Link>

      <div style={{ marginTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>{session.title}</h1>
          {(session.starts_at || session.ends_at) && (
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
              📅 {session.starts_at ? new Date(session.starts_at).toLocaleDateString('fr-FR') : '…'} → {session.ends_at ? new Date(session.ends_at).toLocaleDateString('fr-FR') : '…'}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { l: 'Apprenants', v: members.length, c: 'var(--orange-700)' },
            { l: 'Présents aujourd\'hui', v: `${presentToday}/${members.length}`, c: 'var(--turq-700)' },
            { l: 'Progression moy.', v: `${avgProgress}%`, c: 'var(--gold-700)' },
          ].map((k) => (
            <div key={k.l} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: k.c }}>{k.v}</div>
              <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Affecter des apprenants */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)', marginBottom: '10px' }}>Affecter des apprenants</h3>
        <div style={{ position: 'relative' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher un apprenant par nom…"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', boxSizing: 'border-box', fontSize: '13px' }} />
          {search.trim() && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', marginTop: '4px', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,.1)', maxHeight: '220px', overflowY: 'auto' }}>
              {searching ? (
                <div style={{ padding: '12px', fontSize: '12px', color: 'var(--ink-soft)' }}>Recherche…</div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: '12px', fontSize: '12px', color: 'var(--ink-soft)' }}>Aucun profil trouvé.</div>
              ) : (
                searchResults.map((p) => (
                  <button key={p.id} onClick={() => addMember(p)} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: 'var(--ink)' }}>
                    <span>{p.full_name || 'Sans nom'} <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>· {p.role}</span></span>
                    <span style={{ color: 'var(--orange-700)', fontWeight: 700, fontSize: '12px' }}>+ Ajouter</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Roster + assiduité + progression */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        {members.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Aucun apprenant affecté à cette session pour l&apos;instant.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Apprenant', 'Progression', 'Assiduité globale', 'Présence aujourd\'hui', ''].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', background: '#FAFAF9', borderBottom: '1px solid var(--line)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const progress = progressByLearner[m.id] ?? 0
                const stat = attendanceStats[m.id]
                const rate = stat && stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : null
                const current = todayAttendance[m.id]
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #F5F5F4' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--orange-50)', color: 'var(--orange-700)', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {(m.full_name || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{m.full_name || 'Apprenant sans nom'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 60, height: 6, background: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--grad-ia)' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>{progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: rate === null ? 'var(--ink-soft)' : rate >= 75 ? 'var(--turq-700)' : rate >= 50 ? 'var(--gold-700)' : 'var(--orange-700)', fontWeight: 700 }}>
                      {rate === null ? '—' : `${rate}%`}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(Object.keys(ATTENDANCE_META) as AttendanceStatus[]).map((st) => (
                          <button key={st} onClick={() => markAttendance(m.id, st)} style={{
                            fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '20px', cursor: 'pointer',
                            border: current === st ? `1.5px solid ${ATTENDANCE_META[st].color}` : '1px solid var(--line)',
                            background: current === st ? ATTENDANCE_META[st].bg : 'transparent',
                            color: current === st ? ATTENDANCE_META[st].color : 'var(--ink-soft)',
                          }}>{ATTENDANCE_META[st].label}</button>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => removeMember(m.id)} title="Retirer de la session" style={{ background: 'none', border: 'none', color: 'var(--orange-700)', cursor: 'pointer', fontSize: '12px' }}>🗑</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

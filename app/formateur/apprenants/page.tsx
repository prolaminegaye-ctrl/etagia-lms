'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

type Row = {
  learnerId: string
  name: string
  sessionTitle: string
  sessionId: string
  progress: number
  attendanceRate: number | null
  lastMarked: string | null
}

export default function ApprenantsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = getSupabase()
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) { setLoading(false); return }

      const { data: sessions } = await supabase.from('training_sessions').select('id, title, course_id').eq('formateur_id', auth.user.id)
      if (!sessions?.length) { setRows([]); setLoading(false); return }

      const sessionIds = sessions.map((s) => s.id)
      const sessionMap = new Map(sessions.map((s) => [s.id, s]))

      const [{ data: members }, { data: attendance }] = await Promise.all([
        supabase.from('session_members').select('session_id, learner_id').in('session_id', sessionIds),
        supabase.from('session_attendance').select('session_id, learner_id, status').in('session_id', sessionIds),
      ])

      const learnerIds = Array.from(new Set((members ?? []).map((m) => m.learner_id)))
      if (!learnerIds.length) { setRows([]); setLoading(false); return }

      const [{ data: profiles }, { data: enrollments }] = await Promise.all([
        supabase.from('profiles').select('id, full_name').in('id', learnerIds),
        supabase.from('enrollments').select('user_id, course_id, progress').in('user_id', learnerIds),
      ])
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]))

      const attendanceByPair = new Map<string, { present: number; total: number }>()
      for (const a of attendance ?? []) {
        const key = `${a.session_id}:${a.learner_id}`
        const cur = attendanceByPair.get(key) ?? { present: 0, total: 0 }
        cur.total++
        if (a.status === 'present' || a.status === 'late') cur.present++
        attendanceByPair.set(key, cur)
      }

      const built: Row[] = (members ?? []).map((m) => {
        const session = sessionMap.get(m.session_id)!
        const stat = attendanceByPair.get(`${m.session_id}:${m.learner_id}`)
        const enrollment = enrollments?.find((e) => e.user_id === m.learner_id && e.course_id === session.course_id)
        return {
          learnerId: m.learner_id,
          name: profileMap.get(m.learner_id) || 'Apprenant sans nom',
          sessionTitle: session.title,
          sessionId: m.session_id,
          progress: enrollment ? Math.round(Number(enrollment.progress) || 0) : 0,
          attendanceRate: stat && stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : null,
          lastMarked: null,
        }
      })
      setRows(built)
      setLoading(false)
    })()
  }, [])

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.sessionTitle.toLowerCase().includes(search.toLowerCase()))
  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0)

  return (
    <div>
      <div style={{ borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '1.25rem', background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 50%, #FFB347 100%)', boxShadow: '0 6px 24px rgba(244,89,31,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Apprenants</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', marginBottom: '3px' }}>Vue d&apos;ensemble de vos apprenants</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Agrégée depuis toutes vos sessions actives.</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '14px 18px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <p style={{ fontSize: '13px', color: 'var(--ink-mut)', margin: 0 }}>
          👥 Pour affecter de nouveaux apprenants, créez ou ouvrez une session — l&apos;affectation, l&apos;assiduité et la progression se gèrent désormais par session.
        </p>
        <Link href="/formateur/sessions" style={{ padding: '9px 18px', background: 'var(--grad-signature)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Gérer mes sessions →
        </Link>
      </div>

      {!loading && rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { l: 'Apprenants suivis', v: rows.length, c: '#E8651A' },
            { l: 'Progression moyenne', v: `${avg(rows.map((r) => r.progress))}%`, c: '#00BFA5' },
            { l: 'Assiduité moyenne', v: rows.some((r) => r.attendanceRate !== null) ? `${avg(rows.filter((r) => r.attendanceRate !== null).map((r) => r.attendanceRate!))}%` : '—', c: '#FFB300' },
          ].map((k) => (
            <div key={k.l} style={{ background: '#FFFFFF', border: '1px solid rgba(28,25,23,0.07)', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: k.c }}>{k.v}</div>
              <div style={{ fontSize: '11px', color: '#57534E' }}>{k.l}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', color: 'var(--ink-soft)' }}>
          Aucun apprenant affecté pour l&apos;instant. Créez une session pour commencer.
        </div>
      ) : (
        <>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher un apprenant ou une session..."
            style={{ width: '100%', background: 'rgba(232,101,26,0.06)', color: '#1C1917', border: '1px solid rgba(28,25,23,0.09)', borderRadius: '12px', padding: '11px 16px', fontSize: '14px', outline: 'none', marginBottom: '1.5rem', boxSizing: 'border-box' }} />

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(28,25,23,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(28,25,23,0.06)', background: '#FAF9F7' }}>
                  {['Apprenant', 'Session', 'Progression', 'Assiduité', ''].map((h) => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={`${r.sessionId}-${r.learnerId}`} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(28,25,23,0.07)' : 'none' }}>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8651A,#D4A017)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{r.name[0]?.toUpperCase()}</div>
                        <div style={{ fontWeight: 500, fontSize: '13px', color: '#1C1917' }}>{r.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 14px', fontSize: '12px', color: '#A8A29E' }}>
                      <Link href={`/formateur/sessions/${r.sessionId}`} style={{ color: '#E8651A', fontWeight: 600, textDecoration: 'none' }}>{r.sessionTitle}</Link>
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '4px', background: 'rgba(28,25,23,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${r.progress}%`, background: 'linear-gradient(90deg,#E8651A,#FFB300)', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#E8651A', fontWeight: 600 }}>{r.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 14px', fontSize: '13px', fontWeight: 700, color: r.attendanceRate === null ? '#A8A29E' : r.attendanceRate >= 75 ? '#00BFA5' : r.attendanceRate >= 50 ? '#FFB300' : '#F05A5A' }}>
                      {r.attendanceRate === null ? '—' : `${r.attendanceRate}%`}
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <Link href={`/formateur/sessions/${r.sessionId}`} style={{ background: 'rgba(28,25,23,0.06)', border: '1px solid rgba(28,25,23,0.09)', borderRadius: '6px', padding: '5px 10px', color: '#E8651A', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>Ouvrir la session</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

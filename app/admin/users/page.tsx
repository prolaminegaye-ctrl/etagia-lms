'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

type AdminUser = {
  id: string
  email: string | null
  name: string
  role: string
  org: string
  courses: number
  joined: string
  lastActive: string | null
  online: boolean
  confirmed: boolean
}

const roleColors: Record<string, string> = { admin: '#FFB300', formateur: '#E8651A', apprenant: '#00BFA5' }

function timeAgo(iso: string | null): string {
  if (!iso) return 'Jamais'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "à l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h} h`
  return `il y a ${Math.floor(h / 24)} j`
}

export default function UsersPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('Tous')
  const [savingId, setSavingId] = useState<string | null>(null)

  // La connexion au site suffit : on récupère la session Supabase du navigateur.
  useEffect(() => {
    if (!isSupabaseConfigured) { setSessionChecked(true); return }
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null)
      setSessionChecked(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAccessToken(session?.access_token ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const load = async (jwt: string) => {
    setLoading(true)
    setUnauthorized(false)
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${jwt}` } })
    if (res.status === 401) { setUnauthorized(true); setLoading(false); return }
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }

  useEffect(() => { if (accessToken) load(accessToken) }, [accessToken])

  const changeRole = async (u: AdminUser, role: string) => {
    if (!accessToken) return
    setSavingId(u.id)
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ userId: u.id, role }),
    })
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)))
    setSavingId(null)
  }

  const filtered = users.filter((u) => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || (u.email ?? '').includes(search)
    const mr = filterRole === 'Tous' || u.role === filterRole
    return ms && mr
  })

  if (!sessionChecked) {
    return (
      <div>
        <PageHero eyebrow="Administration" title="Utilisateurs" subtitle="Vérification de votre session…" />
      </div>
    )
  }

  if (!accessToken || unauthorized) {
    return (
      <div>
        <PageHero eyebrow="Administration" title="Utilisateurs" subtitle="Réservé au compte administrateur de la plateforme." />
        <div style={{ maxWidth: '460px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.75rem' }}>
          {unauthorized ? (
            <>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>⚠️ Ce compte n&apos;est pas administrateur</p>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-mut)', lineHeight: 1.6 }}>
                Vous êtes connecté, mais ce compte n&apos;a pas les droits d&apos;administration.
                Connectez-vous avec le compte propriétaire de la plateforme.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Connectez-vous pour continuer</p>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-mut)', lineHeight: 1.6, marginBottom: '14px' }}>
                Cette page s&apos;ouvre automatiquement quand vous êtes connecté avec votre compte administrateur — aucun code à saisir.
              </p>
              <Link href="/auth" style={{ display: 'block', textAlign: 'center', padding: '11px', background: 'var(--grad-signature)', color: '#fff', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  const onlineCount = users.filter((u) => u.online).length

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Utilisateurs"
        subtitle="Comptes réels de la plateforme — qui est qui, quel rôle, quand vu pour la dernière fois."
        stats={[
          { value: String(users.length), label: 'Comptes' },
          { value: String(onlineCount), label: 'En ligne (5 min)' },
          { value: String(users.filter((u) => u.role === 'formateur').length), label: 'Formateurs' },
          { value: String(users.filter((u) => u.role === 'admin').length), label: 'Admins' },
        ]}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher nom ou email..."
          style={{ flex: 1, minWidth: '200px', padding: '11px 16px', borderRadius: '10px', border: '1px solid var(--line)', fontSize: '14px' }} />
        {['Tous', 'admin', 'formateur', 'apprenant'].map(r => (
          <button key={r} onClick={() => setFilterRole(r)} style={{
            padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${filterRole === r ? 'var(--orange-700)' : 'var(--line)'}`,
            background: filterRole === r ? 'var(--orange-50)' : 'transparent',
            color: filterRole === r ? 'var(--orange-700)' : 'var(--ink-mut)',
          }}>{r === 'Tous' ? 'Tous' : r}</button>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAF9F7' }}>
                {['Utilisateur', 'Rôle', 'Organisation', 'Cours', 'Inscrit le', 'Dernière activité', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(28,25,23,0.07)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ position: 'relative', width: '34px', height: '34px', flexShrink: 0 }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `${roleColors[u.role] || '#E8651A'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: roleColors[u.role] || '#E8651A' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderRadius: '50%', background: '#16A34A', border: '2px solid #fff' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '13px', color: '#1C1917' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: '#57534E' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <select value={u.role} disabled={savingId === u.id} onChange={(e) => changeRole(u, e.target.value)} style={{
                      fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '20px',
                      background: `${roleColors[u.role] || '#E8651A'}22`, color: roleColors[u.role] || '#E8651A', border: 'none', cursor: 'pointer',
                    }}>
                      {['apprenant', 'formateur', 'admin'].map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '14px', fontSize: '13px', color: '#A8A29E' }}>{u.org}</td>
                  <td style={{ padding: '14px', fontSize: '14px', fontWeight: 700, color: '#E8651A' }}>{u.courses}</td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#57534E' }}>{new Date(u.joined).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: '14px', fontSize: '12px', color: u.online ? '#16A34A' : '#57534E', fontWeight: u.online ? 700 : 400 }}>{u.online ? '🟢 En ligne' : timeAgo(u.lastActive)}</td>
                  <td style={{ padding: '14px', fontSize: '11px', color: u.confirmed ? '#00BFA5' : '#F05A5A' }}>{u.confirmed ? '✓ Email confirmé' : 'Email non confirmé'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#57534E' }}>Aucun utilisateur trouvé</div>}
      </div>
    </div>
  )
}

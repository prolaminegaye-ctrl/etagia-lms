'use client'
import { useEffect, useState } from 'react'
import PageHero from '@/components/PageHero'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

type ActivityRow = {
  id: string
  user_id: string
  email: string | null
  event: string
  metadata: Record<string, unknown> | null
  user_agent: string | null
  created_at: string
}

const EVENT_LABEL: Record<string, { label: string; color: string }> = {
  login: { label: '🔑 Connexion', color: 'var(--turq-700)' },
  signup: { label: '✨ Inscription', color: 'var(--gold-700)' },
  logout: { label: '🚪 Déconnexion', color: 'var(--ink-mut)' },
  course_started: { label: '📘 Cours démarré', color: 'var(--orange-700)' },
  course_completed: { label: '✅ Cours terminé', color: 'var(--turq-700)' },
  order_created: { label: '🛒 Commande créée', color: 'var(--gold-700)' },
  order_confirmed: { label: '💳 Paiement confirmé', color: 'var(--turq-700)' },
  session_created: { label: '📅 Session créée', color: 'var(--orange-700)' },
  session_member_added: { label: '👤 Apprenant affecté', color: 'var(--orange-700)' },
  attendance_marked: { label: '📋 Présence marquée', color: 'var(--turq-700)' },
}

function deviceOf(userAgent: string | null): string {
  if (!userAgent) return '❓'
  if (/mobile/i.test(userAgent)) return '📱'
  if (/tablet|ipad/i.test(userAgent)) return '📱'
  return '💻'
}

export default function ConnexionsPage() {
  const [rows, setRows] = useState<ActivityRow[]>([])
  const [onlineCount, setOnlineCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)
  const [filtre, setFiltre] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = getSupabase()
    ;(async () => {
      const since = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      const [{ data: activity, error }, { count: online }] = await Promise.all([
        supabase.from('activity_log').select('id, user_id, email, event, metadata, user_agent, created_at').order('created_at', { ascending: false }).limit(300),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('last_active', since),
      ])
      if (error) setDenied(true)
      setRows(activity ?? [])
      setOnlineCount(online ?? 0)
      setLoading(false)
    })()
  }, [])

  const filtered = rows.filter((r) =>
    (r.email ?? '').toLowerCase().includes(filtre.toLowerCase()) ||
    r.event.toLowerCase().includes(filtre.toLowerCase())
  )

  const todayCount = rows.filter((r) => new Date(r.created_at).toDateString() === new Date().toDateString()).length
  const loginCount = rows.filter((r) => r.event === 'login' || r.event === 'signup').length

  // Heatmap réelle : connexions par jour de semaine × tranche de 3h, à partir du journal
  const heatmap = Array.from({ length: 7 }, () => Array(8).fill(0))
  for (const r of rows) {
    if (r.event !== 'login' && r.event !== 'signup') continue
    const d = new Date(r.created_at)
    const day = (d.getDay() + 6) % 7 // lundi=0
    const slot = Math.floor(d.getHours() / 3)
    heatmap[day][slot]++
  }
  const maxHeat = Math.max(1, ...heatmap.flat())
  const heatColor = (v: number) => {
    if (v === 0) return '#E7E5E4'
    const ratio = v / maxHeat
    if (ratio > 0.75) return '#EA580C'
    if (ratio > 0.5) return '#F97316'
    if (ratio > 0.25) return '#FB923C'
    return '#FED7AA'
  }
  const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Connexions & Activité"
        subtitle="Journal réel — qui s'est connecté, qui a fait quoi, quand."
        stats={[
          { value: String(onlineCount), label: 'Connectés maintenant' },
          { value: String(todayCount), label: 'Événements aujourd\'hui' },
          { value: String(loginCount), label: 'Connexions (300 derniers événements)' },
        ]}
      />

      {denied && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--orange-50)', color: 'var(--orange-700)', fontSize: '13px', marginBottom: '1.5rem' }}>
          ⚠️ Ce compte n&apos;a pas le rôle admin ou n&apos;est pas connecté : le journal complet est réservé aux administrateurs.
        </div>
      )}

      {/* Heatmap réelle */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Heatmap des connexions</div>
        <div style={{ fontSize: '12px', color: 'var(--ink-mut)', marginBottom: '12px' }}>Basée sur le journal réel — tranches de 3h, 0h → 24h</div>
        {heatmap.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '3px' }}>
            <span style={{ fontSize: '10px', color: 'var(--ink-mut)', width: '26px', flexShrink: 0 }}>{JOURS[i]}</span>
            {row.map((v, h) => (
              <div key={h} title={`${v} connexion(s)`} style={{ flex: 1, height: '16px', borderRadius: '2px', background: heatColor(v) }} />
            ))}
          </div>
        ))}
      </div>

      {/* Journal */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Journal d&apos;activité <span style={{ fontSize: '12px', color: 'var(--ink-mut)', fontWeight: 400 }}>({filtered.length} entrées)</span>
          </h3>
          <input value={filtre} onChange={e => setFiltre(e.target.value)} placeholder="🔍 Rechercher…"
            style={{ padding: '7px 13px', border: '1px solid var(--line)', borderRadius: '9px', fontSize: '13px', outline: 'none', background: 'var(--canvas)', color: 'var(--ink)' }} />
        </div>
        <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Aucun événement pour l&apos;instant. Le journal se remplit à mesure que les comptes s&apos;utilisent.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Utilisateur', 'Événement', 'Appareil', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', background: '#FAFAF9', borderBottom: '1px solid var(--line)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const meta = EVENT_LABEL[r.event] ?? { label: r.event, color: 'var(--ink-mut)' }
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F5F5F4' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--orange-50)', color: 'var(--orange-700)', fontWeight: 800, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {(r.email || '?')[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{r.email || r.user_id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: meta.color }}>{meta.label}</td>
                      <td style={{ padding: '12px 14px', fontSize: '14px' }}>{deviceOf(r.user_agent)}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink)' }}>{new Date(r.created_at).toLocaleString('fr-FR')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import PageHero from '@/components/PageHero'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { logActivity } from '@/lib/activity'

type Order = {
  id: string
  buyer_id: string
  item_type: string
  item_id: string
  item_title: string
  amount_fcfa: number
  payment_method: 'wave' | 'orange_money' | 'stripe'
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  transaction_ref: string | null
  payer_phone: string | null
  created_at: string
  paid_at: string | null
  buyer?: { full_name: string | null }
}

const METHOD_LABEL: Record<string, string> = { wave: '🌊 Wave', orange_money: '🟠 Orange Money', stripe: '💳 Stripe' }
const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'var(--gold-50)', color: 'var(--gold-700)', label: '⏳ En attente' },
  paid: { bg: 'var(--turq-50)', color: 'var(--turq-700)', label: '✅ Payée' },
  failed: { bg: 'var(--orange-50)', color: 'var(--orange-700)', label: '✕ Échouée' },
  cancelled: { bg: '#F5F5F4', color: '#78716C', label: '— Annulée' },
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('pending')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = getSupabase()
    const { data } = await supabase
      .from('orders')
      .select('id, buyer_id, item_type, item_id, item_title, amount_fcfa, payment_method, status, transaction_ref, payer_phone, created_at, paid_at')
      .order('created_at', { ascending: false })
      .limit(200)
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const setStatus = async (order: Order, status: 'paid' | 'failed') => {
    setBusyId(order.id)
    const supabase = getSupabase()
    await supabase.from('orders').update({
      status,
      paid_at: status === 'paid' ? new Date().toISOString() : null,
    }).eq('id', order.id)
    await logActivity('order_confirmed', { order_id: order.id, status })
    setBusyId(null)
    load()
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const totalPending = orders.filter((o) => o.status === 'pending').length
  const totalPaidFcfa = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.amount_fcfa, 0)

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Commandes & Paiements"
        subtitle="Wave, Orange Money et Stripe — confirmez manuellement les paiements mobile money reçus."
        stats={[
          { value: String(orders.length), label: 'Commandes' },
          { value: String(totalPending), label: 'En attente' },
          { value: `${totalPaidFcfa.toLocaleString('fr-FR')} FCFA`, label: 'Encaissé' },
        ]}
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {(['pending', 'paid', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            border: `1px solid ${filter === f ? 'var(--orange-700)' : 'var(--line)'}`,
            background: filter === f ? 'var(--orange-50)' : 'transparent',
            color: filter === f ? 'var(--orange-700)' : 'var(--ink-mut)',
          }}>
            {f === 'pending' ? '⏳ En attente' : f === 'paid' ? '✅ Payées' : 'Toutes'}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Chargement…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Aucune commande pour ce filtre.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Produit', 'Moyen', 'Contact', 'Montant', 'Date', 'Statut', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', background: '#FAFAF9', borderBottom: '1px solid var(--line)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const st = STATUS_STYLE[o.status]
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid #F5F5F4' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{o.item_title}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px' }}>{METHOD_LABEL[o.payment_method]}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink-mut)' }}>{o.payer_phone || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{o.amount_fcfa.toLocaleString('fr-FR')} FCFA</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink-mut)' }}>{new Date(o.created_at).toLocaleString('fr-FR')}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {o.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button disabled={busyId === o.id} onClick={() => setStatus(o, 'paid')} style={{ background: 'var(--turq-50)', color: 'var(--turq-700)', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Confirmer</button>
                          <button disabled={busyId === o.id} onClick={() => setStatus(o, 'failed')} style={{ background: 'var(--orange-50)', color: 'var(--orange-700)', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Rejeter</button>
                        </div>
                      )}
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

'use client'
import { useState } from 'react'
import PageHero from '@/components/PageHero'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)

const TVA_PAYS: Record<string, number> = {
  SN: 18, CI: 18, ML: 18, BF: 18, GN: 18, TG: 18, BJ: 18,
  NE: 19, CM: 19.25, FR: 20,
}

const PLANS = [
  { id: 'starter',   label: 'Starter',          prix: 10000  },
  { id: 'premium',   label: 'Premium Mensuel',   prix: 25000  },
  { id: 'pro_annuel',label: 'Pro Annuel',         prix: 180000 },
  { id: 'b2b_5',    label: 'B2B 5 sièges',       prix: 300000 },
  { id: 'b2b_10',   label: 'B2B 10 sièges',      prix: 500000 },
  { id: 'custom',   label: 'Personnalisé',        prix: 0      },
]

const DEVIS_EXISTANTS = [
  { numero: 'DEV-ETAGIA-2026-0012', client: 'Orange ML',    montant: 2360000, date: '12/06/2026', expiration: '12/07/2026', statut: 'en_attente' },
  { numero: 'DEV-ETAGIA-2026-0011', client: 'BDM Banque',   montant: 1062000, date: '08/06/2026', expiration: '08/07/2026', statut: 'accepte' },
  { numero: 'DEV-ETAGIA-2026-0010', client: 'Ministère SN', montant: 1770000, date: '01/06/2026', expiration: '01/07/2026', statut: 'refuse' },
]

const ST: Record<string, { bg: string; color: string; label: string }> = {
  en_attente: { bg: 'var(--gold-50)',    color: 'var(--gold-700)',   label: '⏳ En attente' },
  accepte:    { bg: 'var(--turq-50)',    color: 'var(--turq-700)',   label: '✓ Accepté' },
  refuse:     { bg: 'var(--orange-50)', color: 'var(--orange-700)', label: '✕ Refusé' },
}

export default function DevisPage() {
  const [client, setClient]     = useState({ nom: '', email: '', pays: 'SN', entreprise: '' })
  const [planId, setPlanId]     = useState('premium')
  const [qte, setQte]           = useState(1)
  const [prixCustom, setPrixCustom] = useState(0)
  const [note, setNote]         = useState('')
  const [sent, setSent]         = useState(false)

  const plan = PLANS.find(p => p.id === planId)!
  const prixHT  = planId === 'custom' ? prixCustom * qte : plan.prix * qte
  const taux    = TVA_PAYS[client.pays] ?? 18
  const tva     = Math.round(prixHT * taux / 100)
  const total   = prixHT + tva

  function handleSend() {
    if (!client.nom || !client.email) return
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Créer un Devis"
        subtitle="Générez des devis professionnels en FCFA et envoyez-les directement par email à vos prospects."
        stats={[
          { value: '12', label: 'Devis émis ce mois' },
          { value: '7',  label: 'Acceptés' },
          { value: '3',  label: 'En attente' },
          { value: '58%',label: 'Taux d\'acceptation' },
        ]}
      />

      {sent && (
        <div style={{ background: 'var(--turq-50)', color: 'var(--turq-700)', padding: '12px 18px', borderRadius: '12px', marginBottom: '1rem', fontSize: '13px', fontWeight: '700' }}>
          ✅ Devis envoyé à {client.email} avec succès !
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>

        {/* Formulaire */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)', margin: '0 0 1.25rem' }}>Informations client</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {([
              ['Nom complet *', 'nom', 'text', 'Aminata Mbaye'],
              ['Email *',       'email', 'email', 'a.mbaye@corp.ci'],
              ['Entreprise',    'entreprise', 'text', 'EduCorp CI'],
            ] as const).map(([label, field, type, ph]) => (
              <div key={field} style={{ gridColumn: field === 'email' ? '1 / -1' : 'auto' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>{label}</label>
                <input
                  type={type} placeholder={ph}
                  value={(client as Record<string, string>)[field]}
                  onChange={e => setClient(prev => ({ ...prev, [field]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', outline: 'none', background: 'var(--canvas)', color: 'var(--ink)', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>Pays</label>
              <select value={client.pays} onChange={e => setClient(prev => ({ ...prev, pays: e.target.value }))}
                style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', background: 'var(--canvas)', color: 'var(--ink)' }}>
                {Object.entries(TVA_PAYS).map(([code, taux]) => (
                  <option key={code} value={code}>{code} — TVA {taux}%</option>
                ))}
              </select>
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)', margin: '1.25rem 0 1rem' }}>Prestation</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>Plan / offre</label>
              <select value={planId} onChange={e => setPlanId(e.target.value)}
                style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', background: 'var(--canvas)', color: 'var(--ink)' }}>
                {PLANS.map(p => <option key={p.id} value={p.id}>{p.label}{p.prix ? ` — ${fmt(p.prix)}` : ''}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>Quantité / sièges</label>
              <input type="number" min={1} value={qte} onChange={e => setQte(+e.target.value)}
                style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', background: 'var(--canvas)', color: 'var(--ink)', boxSizing: 'border-box' }} />
            </div>
            {planId === 'custom' && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>Prix unitaire HT (FCFA)</label>
                <input type="number" min={0} value={prixCustom} onChange={e => setPrixCustom(+e.target.value)}
                  style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', background: 'var(--canvas)', color: 'var(--ink)', boxSizing: 'border-box' }} />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>Note personnalisée</label>
            <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
              placeholder="Message d'accompagnement, conditions spéciales…"
              style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', background: 'var(--canvas)', color: 'var(--ink)', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Aperçu + envoi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg,#F97316,#F59E0B)', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em' }}>EtagIA</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.8)', fontWeight: '700', letterSpacing: '.1em', textTransform: 'uppercase' }}>Devis Commercial</div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--ink-mut)', marginBottom: '3px' }}>À l&apos;attention de</div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--ink)', marginBottom: '2px' }}>{client.nom || 'Nom du client'}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-mut)', marginBottom: '16px' }}>{client.entreprise || 'Entreprise'} · {client.pays}</div>

              <div style={{ background: '#FAFAF9', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--ink)' }}>{plan.label} × {qte}</span>
                  <span style={{ fontWeight: '600' }}>{fmt(planId === 'custom' ? prixCustom * qte : plan.prix * qte)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-mut)', marginBottom: '6px' }}>
                  <span>TVA {taux}%</span><span>{fmt(tva)}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '8px', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--ink)' }}>Total TTC</span>
                  <span style={{ fontWeight: '900', fontSize: '18px', color: 'var(--orange-700)' }}>{fmt(total)}</span>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--ink-mut)', textAlign: 'center' }}>Valable 30 jours · Paiement Wave / OM / Virement</div>
            </div>
          </div>

          <button onClick={handleSend} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg,#F97316,#F59E0B)', color: '#fff',
            fontSize: '14px', fontWeight: '800', cursor: 'pointer', letterSpacing: '-0.02em',
          }}>
            📧 Envoyer le devis par email
          </button>
          <button style={{
            width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--line)',
            background: 'var(--surface)', color: 'var(--ink-mut)', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
          }}>
            ↓ Télécharger PDF
          </button>
        </div>
      </div>

      {/* Devis existants */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden', marginTop: '1.5rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--line)' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>Devis récents</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Numéro','Client','Montant TTC','Émis le','Expire le','Statut'].map(h => (
            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', background: '#FAFAF9', borderBottom: '1px solid var(--line)' }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {DEVIS_EXISTANTS.map((d, i) => {
              const st = ST[d.statut]
              return (
                <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--ink)' }}>{d.numero}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>{d.client}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: 'var(--orange-700)' }}>{fmt(d.montant)}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--ink-mut)' }}>{d.date}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--ink-mut)' }}>{d.expiration}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: st.bg, color: st.color }}>{st.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

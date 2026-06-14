'use client'
import { useState } from 'react'
import PageHero from '@/components/PageHero'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)

const FACTURES = [
  { numero: 'FAC-ETAGIA-2026-0047', client: 'Aminata Mbaye',   email: 'a.mbaye@email.com',    plan: 'Premium Mensuel', montant: 29500,  tva: 4500,  date: '14/06/2026', statut: 'payee',    mode: 'Wave',         type: 'abonnement' },
  { numero: 'FAC-ETAGIA-2026-0046', client: 'Kofi Diabaté',    email: 'k.diabate@corp.ci',    plan: 'Pro Annuel',      montant: 212400, tva: 32400, date: '13/06/2026', statut: 'payee',    mode: 'Orange Money', type: 'abonnement' },
  { numero: 'FAC-ETAGIA-2026-0045', client: 'InnovateSN SARL', email: 'admin@innovatesn.sn',  plan: 'B2B 10 sièges',  montant: 590000, tva: 90000, date: '12/06/2026', statut: 'payee',    mode: 'Virement',     type: 'paiement_unique' },
  { numero: 'FAC-ETAGIA-2026-0044', client: 'Nadia Konaté',    email: 'n.konate@email.com',   plan: 'Starter',         montant: 11800,  tva: 1800,  date: '11/06/2026', statut: 'envoyee',  mode: 'Carte',        type: 'abonnement' },
  { numero: 'FAC-ETAGIA-2026-0043', client: 'Oumar Ba',        email: 'o.ba@org.sn',          plan: 'Premium Mensuel', montant: 29500,  tva: 4500,  date: '10/06/2026', statut: 'retard',   mode: 'Wave',         type: 'renouvellement' },
  { numero: 'FAC-ETAGIA-2026-0042', client: 'Fatou Traoré',    email: 'f.traore@gmail.com',   plan: 'Starter',         montant: 11800,  tva: 1800,  date: '09/06/2026', statut: 'annulee',  mode: 'Carte',        type: 'abonnement' },
]

const STATUT: Record<string, { bg: string; color: string; label: string }> = {
  payee:    { bg: 'var(--turq-50)',    color: 'var(--turq-700)',   label: '✓ Payée' },
  envoyee:  { bg: 'var(--gold-50)',    color: 'var(--gold-700)',   label: '→ Envoyée' },
  retard:   { bg: 'var(--orange-50)', color: 'var(--orange-700)', label: '⚠ Retard' },
  annulee:  { bg: '#F5F5F4',          color: '#78716C',            label: '✕ Annulée' },
}

export default function FacturesPage() {
  const [filtre, setFiltre] = useState('tous')
  const [msg, setMsg] = useState<string | null>(null)

  const filtered = filtre === 'tous' ? FACTURES : FACTURES.filter(f => f.statut === filtre)

  async function renvoyer(f: typeof FACTURES[0]) {
    setMsg(`📧 Renvoi en cours pour ${f.client}…`)
    setTimeout(() => setMsg(`✅ Facture ${f.numero} renvoyée à ${f.email}`), 1200)
  }

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Factures"
        subtitle="Historique complet des factures émises — renvoyer, annuler, exporter en un clic."
        stats={[
          { value: '47',         label: 'Total factures' },
          { value: '43',         label: 'Payées' },
          { value: '1',          label: 'En retard' },
          { value: fmt(4580000), label: 'CA du mois' },
        ]}
      />

      {msg && (
        <div style={{ background: msg.startsWith('✅') ? 'var(--turq-50)' : 'var(--gold-50)', color: msg.startsWith('✅') ? 'var(--turq-700)' : 'var(--gold-700)', padding: '12px 18px', borderRadius: '12px', marginBottom: '1rem', fontSize: '13px', fontWeight: '600' }}>
          {msg}
        </div>
      )}

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[['tous','Toutes'],['payee','Payées'],['envoyee','Envoyées'],['retard','En retard'],['annulee','Annulées']].map(([v, l]) => (
          <button key={v} onClick={() => setFiltre(v)} style={{
            padding: '7px 16px', borderRadius: '99px', border: `1px solid ${filtre === v ? 'transparent' : 'var(--line)'}`,
            background: filtre === v ? 'var(--orange-700)' : 'var(--surface)', color: filtre === v ? '#fff' : 'var(--ink-mut)',
            fontSize: '12px', fontWeight: '700', cursor: 'pointer',
          }}>{l}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ padding: '7px 16px', borderRadius: '99px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink-mut)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
          ↓ Exporter CSV
        </button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Numéro','Client','Plan','Montant TTC','TVA','Date','Mode','Statut','Actions'].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', background: '#FAFAF9', borderBottom: '1px solid var(--line)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => {
              const st = STATUT[f.statut]
              return (
                <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td style={{ padding: '11px 14px', fontSize: '11px', fontWeight: '700', color: 'var(--ink)', fontFamily: 'monospace' }}>{f.numero}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>{f.client}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-mut)' }}>{f.email}</div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: 'var(--ink-mut)' }}>{f.plan}</td>
                  <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: '700', color: 'var(--orange-700)' }}>{fmt(f.montant)}</td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: 'var(--ink-mut)' }}>{fmt(f.tva)}</td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: 'var(--ink-mut)' }}>{f.date}</td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: 'var(--ink)' }}>{f.mode}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '99px', background: st.bg, color: st.color }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => renvoyer(f)} style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', color: 'var(--ink-mut)' }}>📧 Renvoyer</button>
                      <button style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', color: 'var(--ink-mut)' }}>↓ PDF</button>
                    </div>
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

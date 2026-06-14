'use client'
import { useState } from 'react'
import PageHero from '@/components/PageHero'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)

const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
const data = [1800000,2100000,2450000,2200000,2700000,3100000,3400000,3650000,3200000,3900000,4200000,4580000]
const MAX = Math.max(...data)

const transactions = [
  { nom: 'Aminata Mbaye',   plan: 'Premium Mensuel', montant: 25000,   date: '14/06/2026', mode: 'Wave',         statut: 'payée' },
  { nom: 'Kofi Diabaté',    plan: 'Pro Annuel',      montant: 180000,  date: '13/06/2026', mode: 'Orange Money', statut: 'payée' },
  { nom: 'Nadia Konaté',    plan: 'Starter',          montant: 10000,  date: '12/06/2026', mode: 'Wave',         statut: 'payée' },
  { nom: 'Oumar Ba',        plan: 'B2B 10 sièges',   montant: 500000,  date: '11/06/2026', mode: 'Virement',     statut: 'payée' },
  { nom: 'Fatou Traoré',    plan: 'Premium Mensuel', montant: 25000,   date: '10/06/2026', mode: 'Carte',        statut: 'echec' },
]

export default function RevenusPage() {
  const [periode, setPeriode] = useState('mois')

  const mrr = 4580000
  const arr = mrr * 12
  const growth = 9.0
  const churn = 2.1

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Revenus & MRR"
        subtitle="Suivi financier complet en temps réel — MRR, ARR, churn, et historique des transactions en FCFA."
        stats={[
          { value: fmt(mrr),   label: 'MRR (ce mois)' },
          { value: fmt(arr),   label: 'ARR projeté' },
          { value: `+${growth}%`, label: 'Croissance MoM' },
          { value: `${churn}%`,   label: 'Taux de churn' },
        ]}
      />

      {/* Sélecteur période */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        {['semaine','mois','trimestre','année'].map(p => (
          <button key={p} onClick={() => setPeriode(p)} style={{
            padding: '7px 18px', borderRadius: '99px', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: '700', textTransform: 'capitalize',
            background: periode === p ? 'var(--orange-700)' : 'var(--surface)',
            color: periode === p ? '#fff' : 'var(--ink-mut)',
            border: `1px solid ${periode === p ? 'transparent' : 'var(--line)'}`,
          }}>{p}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Graphe barres */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>Évolution du MRR</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-mut)', marginBottom: '20px' }}>Jan → Déc 2026 · en FCFA</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px' }}>
            {data.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%', background: i === 11 ? 'var(--orange-700)' : 'var(--orange-50)',
                  borderRadius: '5px 5px 0 0',
                  height: `${(v / MAX) * 120}px`,
                  transition: 'background .2s',
                }} title={fmt(v)} />
                <span style={{ fontSize: '9px', color: 'var(--ink-mut)', fontWeight: '600' }}>{MOIS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown plans */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--ink)', marginBottom: '16px' }}>Revenus par plan</div>
          {[
            { label: 'B2B Organisations', pct: 42, montant: 1923600, color: 'var(--orange-700)' },
            { label: 'Pro Annuel',         pct: 28, montant: 1282400, color: 'var(--turq-700)' },
            { label: 'Premium Mensuel',    pct: 20, montant: 916000,  color: 'var(--gold-700)' },
            { label: 'Starter',            pct: 10, montant: 458000,  color: 'var(--violet)' },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink)' }}>{row.label}</span>
                <span style={{ fontSize: '12px', color: 'var(--ink-mut)' }}>{row.pct}%</span>
              </div>
              <div style={{ height: '6px', background: '#F5F5F4', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: '99px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-mut)', marginTop: '3px' }}>{fmt(row.montant)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions récentes */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--line)' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>Transactions récentes</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Client','Plan','Montant','Date','Mode','Statut'].map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', background: '#FAFAF9', borderBottom: '1px solid var(--line)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>{t.nom}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--ink-mut)' }}>{t.plan}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: 'var(--orange-700)' }}>{fmt(t.montant)}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--ink-mut)' }}>{t.date}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--ink)' }}>{t.mode}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px',
                    background: t.statut === 'payée' ? 'var(--turq-50)' : 'var(--orange-50)',
                    color: t.statut === 'payée' ? 'var(--turq-700)' : 'var(--orange-700)',
                  }}>{t.statut === 'payée' ? '✓ Payée' : '✕ Échec'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

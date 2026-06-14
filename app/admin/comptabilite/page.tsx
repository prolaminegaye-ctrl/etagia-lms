'use client'
import { useState } from 'react'
import PageHero from '@/components/PageHero'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)

const MOIS_DISPO = ['Juin 2026','Mai 2026','Avril 2026','Mars 2026','Février 2026','Janvier 2026']

const BILAN = [
  { label: 'Revenus bruts',     montant: 4580000,  type: 'produit' },
  { label: 'TVA collectée',     montant: 699660,   type: 'tva' },
  { label: 'Revenus nets HT',   montant: 3880340,  type: 'produit' },
  { label: 'Commissions partenaires', montant: -290000, type: 'charge' },
  { label: 'Frais serveur',     montant: -185000,  type: 'charge' },
  { label: 'Frais Resend / email',    montant: -25000,  type: 'charge' },
  { label: 'Résultat net',      montant: 3380340,  type: 'resultat' },
]

const EXPORTS = [
  { label: 'Grand livre comptable (CSV)',     format: 'CSV',  taille: '48 Ko',  icone: '📊' },
  { label: 'Journal des ventes (CSV)',         format: 'CSV',  taille: '23 Ko',  icone: '📋' },
  { label: 'Déclaration TVA (PDF)',            format: 'PDF',  taille: '180 Ko', icone: '📄' },
  { label: 'Factures du mois (ZIP)',           format: 'ZIP',  taille: '2.4 Mo', icone: '🗜' },
  { label: 'Bilan mensuel (PDF)',              format: 'PDF',  taille: '95 Ko',  icone: '📑' },
  { label: 'Export FEC (format DGI)',          format: 'TXT',  taille: '62 Ko',  icone: '🏛' },
]

export default function ComptabilitePage() {
  const [mois, setMois] = useState('Juin 2026')
  const [msg, setMsg]   = useState<string | null>(null)

  function telecharger(label: string) {
    setMsg(`↓ Téléchargement de « ${label} » en cours…`)
    setTimeout(() => setMsg(null), 2000)
  }

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Comptabilité"
        subtitle="Exports comptables, déclarations TVA et bilan mensuel en FCFA — prêts pour votre expert-comptable."
        stats={[
          { value: fmt(4580000),  label: 'CA brut (juin)' },
          { value: fmt(699660),   label: 'TVA collectée' },
          { value: fmt(3380340),  label: 'Résultat net' },
          { value: '47',          label: 'Factures émises' },
        ]}
      />

      {msg && (
        <div style={{ background: 'var(--turq-50)', color: 'var(--turq-700)', padding: '12px 18px', borderRadius: '12px', marginBottom: '1rem', fontSize: '13px', fontWeight: '600' }}>{msg}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Sélecteur mois + bilan */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>Bilan mensuel</h3>
            <select value={mois} onChange={e => setMois(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid var(--line)', borderRadius: '9px', fontSize: '12px', background: 'var(--canvas)', color: 'var(--ink)' }}>
              {MOIS_DISPO.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          {BILAN.map((row, i) => {
            const isResultat = row.type === 'resultat'
            const isCharge   = row.type === 'charge'
            const isTVA      = row.type === 'tva'
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: isResultat ? '12px 14px' : '10px 0',
                borderTop: i > 0 ? '1px solid #F5F5F4' : 'none',
                background: isResultat ? 'var(--orange-50)' : 'transparent',
                borderRadius: isResultat ? '10px' : '0',
                margin: isResultat ? '8px -8px 0' : '0',
              }}>
                <span style={{ fontSize: '13px', color: isResultat ? 'var(--orange-700)' : 'var(--ink)', fontWeight: isResultat ? '800' : '500' }}>{row.label}</span>
                <span style={{ fontSize: isResultat ? '16px' : '13px', fontWeight: '700',
                  color: isResultat ? 'var(--orange-700)' : isCharge ? '#DC2626' : isTVA ? 'var(--gold-700)' : 'var(--turq-700)',
                }}>
                  {row.montant < 0 ? `-${fmt(Math.abs(row.montant))}` : fmt(row.montant)}
                </span>
              </div>
            )
          })}
        </div>

        {/* TVA par pays */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>TVA collectée par pays</h3>
          {[
            { pays: '🇸🇳 Sénégal',    taux: '18%', ht: 2150000, tva: 387000 },
            { pays: '🇨🇮 Côte d\'Ivoire', taux: '18%', ht: 980000,  tva: 176400 },
            { pays: '🇲🇱 Mali',        taux: '18%', ht: 450000,  tva: 81000 },
            { pays: '🇨🇲 Cameroun',    taux: '19.25%', ht: 150000, tva: 28875 },
            { pays: '🇫🇷 France',      taux: '20%', ht: 150340,  tva: 30068 },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: i > 0 ? '1px solid #F5F5F4' : 'none', fontSize: '13px' }}>
              <span>{row.pays}</span>
              <span style={{ color: 'var(--ink-mut)', fontSize: '12px' }}>HT {fmt(row.ht)}</span>
              <span style={{ color: 'var(--gold-700)', fontWeight: '700' }}>TVA {fmt(row.tva)}</span>
            </div>
          ))}
          <div style={{ marginTop: '12px', background: 'var(--gold-50)', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--gold-700)' }}>Total TVA à déclarer</span>
            <span style={{ fontWeight: '900', fontSize: '16px', color: 'var(--gold-700)' }}>{fmt(703343)}</span>
          </div>
        </div>
      </div>

      {/* Exports */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.25rem', fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>Exports disponibles — {mois}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {EXPORTS.map((exp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#FAFAF9', border: '1px solid var(--line)', borderRadius: '12px' }}>
              <div style={{ fontSize: '22px' }}>{exp.icone}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', marginBottom: '2px' }}>{exp.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-mut)' }}>{exp.format} · {exp.taille}</div>
              </div>
              <button onClick={() => telecharger(exp.label)} style={{
                padding: '7px 14px', borderRadius: '9px', border: 'none',
                background: 'var(--orange-700)', color: '#fff',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer', flexShrink: 0,
              }}>↓</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

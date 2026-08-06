'use client'

import { useCallback, useEffect, useState } from 'react'
import PageHero from '@/components/PageHero'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

type Demande = {
  id: string
  user_id: string
  type: 'admin' | 'marketplace'
  statut: 'en_attente' | 'approuvee' | 'refusee'
  motif: string | null
  email: string | null
  full_name: string | null
  ip: string | null
  user_agent: string | null
  created_at: string
  decided_at: string | null
  decision_note: string | null
}

const LIBELLE_TYPE = { admin: 'Administrateur', marketplace: 'Marketplace' } as const
const TON_STATUT: Record<Demande['statut'], { fond: string; texte: string; libelle: string }> = {
  en_attente: { fond: '#FDF3E0', texte: '#A65209', libelle: 'En attente' },
  approuvee:  { fond: '#E3F1EB', texte: '#14624A', libelle: 'Approuvée' },
  refusee:    { fond: '#F3F4F6', texte: '#57534E', libelle: 'Refusée' },
}

function dateFr(valeur: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(valeur))
}

/**
 * Écran de décision sur les demandes d'accès.
 *
 * C'est le seul point de l'application où un rôle administrateur ou un
 * accès Marketplace peut être accordé. La route API vérifie de son côté
 * que l'appelant est bien administrateur : cette page ne fait que
 * présenter l'information et transmettre la décision.
 */
export default function DemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [chargement, setChargement] = useState(isSupabaseConfigured)
  const [filtre, setFiltre] = useState<'en_attente' | 'toutes'>('en_attente')
  const [rechargement, setRechargement] = useState(0)
  const [enCours, setEnCours] = useState<string | null>(null)
  const [erreur, setErreur] = useState('')
  const [notes, setNotes] = useState<Record<string, string>>({})

  // Le chargement vit dans l'effet, derrière une attente : une mise à jour
  // d'état synchrone dans un corps d'effet déclenche des rendus en cascade.
  // `rechargement` sert de déclencheur au bouton « Actualiser » et après
  // chaque décision.
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let annule = false

    ;(async () => {
      const { data } = await getSupabase().auth.getSession()
      const jeton = data.session?.access_token
      if (annule) return

      setChargement(true)
      setErreur('')
      if (!jeton) { setChargement(false); return }

      const params = filtre === 'en_attente' ? '?statut=en_attente' : ''
      const res = await fetch(`/api/access-requests${params}`, {
        headers: { Authorization: `Bearer ${jeton}` },
      })
      const corps = await res.json().catch(() => ({}))
      if (annule) return

      if (!res.ok) { setErreur(corps.error ?? 'Lecture impossible.'); setChargement(false); return }
      setDemandes(corps.demandes ?? [])
      setChargement(false)
    })()

    return () => { annule = true }
  }, [filtre, rechargement])

  const charger = useCallback(() => setRechargement((n) => n + 1), [])

  const decider = async (demande: Demande, decision: 'approuver' | 'refuser') => {
    setEnCours(demande.id)
    setErreur('')
    const { data } = await getSupabase().auth.getSession()
    const jeton = data.session?.access_token

    const res = await fetch(`/api/access-requests/${demande.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jeton}` },
      body: JSON.stringify({ decision, note: notes[demande.id] ?? '' }),
    })
    const corps = await res.json().catch(() => ({}))
    setEnCours(null)
    if (!res.ok) { setErreur(corps.error ?? 'Décision impossible.'); return }
    charger()
  }

  const enAttente = demandes.filter((d) => d.statut === 'en_attente').length

  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Demandes d'accès"
        subtitle="Aucun accès administrateur ni Marketplace n'est accordé automatiquement. Chaque demande passe par cet écran."
      />

      <div style={{ display: 'flex', gap: '8px', margin: '20px 0 16px', flexWrap: 'wrap' }}>
        {(['en_attente', 'toutes'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltre(f)}
            style={{
              padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              border: '1px solid var(--line, #ECEEF5)',
              background: filtre === f ? 'var(--orange-700, #E8651A)' : 'transparent',
              color: filtre === f ? '#fff' : 'var(--ink-mut, #5B6070)',
            }}
          >
            {f === 'en_attente' ? `En attente${enAttente ? ` (${enAttente})` : ''}` : 'Toutes'}
          </button>
        ))}
        <button
          type="button"
          onClick={charger}
          style={{
            padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            border: '1px solid var(--line, #ECEEF5)', background: 'transparent', color: 'var(--ink-mut, #5B6070)',
          }}
        >
          Actualiser
        </button>
      </div>

      {erreur ? (
        <p style={{ padding: '12px 16px', borderRadius: '8px', background: '#FBEAE8', color: '#A8201A', fontSize: '14px', fontWeight: 600 }}>
          {erreur}
        </p>
      ) : null}

      {chargement ? (
        <p style={{ color: 'var(--ink-mut, #5B6070)', fontSize: '14px' }}>Chargement…</p>
      ) : demandes.length === 0 ? (
        <p style={{ color: 'var(--ink-mut, #5B6070)', fontSize: '14px' }}>
          {filtre === 'en_attente' ? 'Aucune demande en attente.' : 'Aucune demande enregistrée.'}
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {demandes.map((d) => {
            const ton = TON_STATUT[d.statut]
            return (
              <article
                key={d.id}
                style={{
                  border: '1px solid var(--line, #ECEEF5)', borderRadius: '12px',
                  padding: '18px 20px', background: 'var(--surface, #fff)',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '15px' }}>{d.full_name || d.email || d.user_id}</strong>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px',
                    background: '#EEF2FF', color: '#3730A3',
                  }}>
                    {LIBELLE_TYPE[d.type]}
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px',
                    background: ton.fond, color: ton.texte,
                  }}>
                    {ton.libelle}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--ink-mut, #5B6070)' }}>
                    {dateFr(d.created_at)}
                  </span>
                </div>

                <dl style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 14px',
                  margin: '14px 0 0', fontSize: '13px',
                }}>
                  <dt style={{ color: 'var(--ink-mut, #5B6070)' }}>Email</dt>
                  <dd style={{ margin: 0 }}>{d.email ?? '—'}</dd>
                  <dt style={{ color: 'var(--ink-mut, #5B6070)' }}>Adresse IP</dt>
                  <dd style={{ margin: 0, fontFamily: 'ui-monospace, monospace' }}>{d.ip ?? '—'}</dd>
                  <dt style={{ color: 'var(--ink-mut, #5B6070)' }}>Navigateur</dt>
                  <dd style={{ margin: 0, fontSize: '12px', color: 'var(--ink-mut, #5B6070)' }}>{d.user_agent ?? '—'}</dd>
                  <dt style={{ color: 'var(--ink-mut, #5B6070)' }}>Motif</dt>
                  <dd style={{ margin: 0 }}>{d.motif || '—'}</dd>
                </dl>

                {d.statut === 'en_attente' ? (
                  <div style={{ marginTop: '16px' }}>
                    <input
                      type="text"
                      value={notes[d.id] ?? ''}
                      onChange={(e) => setNotes((n) => ({ ...n, [d.id]: e.target.value }))}
                      placeholder="Note transmise au demandeur (facultative)"
                      maxLength={1000}
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13px',
                        border: '1px solid var(--line, #ECEEF5)', fontFamily: 'inherit',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        disabled={enCours === d.id}
                        onClick={() => decider(d, 'approuver')}
                        style={{
                          padding: '9px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                          background: '#14624A', color: '#fff', fontWeight: 700, fontSize: '13px',
                          opacity: enCours === d.id ? .6 : 1,
                        }}
                      >
                        Approuver
                      </button>
                      <button
                        type="button"
                        disabled={enCours === d.id}
                        onClick={() => decider(d, 'refuser')}
                        style={{
                          padding: '9px 18px', borderRadius: '8px', cursor: 'pointer',
                          border: '1px solid var(--line, #ECEEF5)', background: 'transparent',
                          color: '#A8201A', fontWeight: 700, fontSize: '13px',
                          opacity: enCours === d.id ? .6 : 1,
                        }}
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: '14px 0 0', fontSize: '13px', color: 'var(--ink-mut, #5B6070)' }}>
                    Traitée le {d.decided_at ? dateFr(d.decided_at) : '—'}
                    {d.decision_note ? ` · « ${d.decision_note} »` : ''}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}

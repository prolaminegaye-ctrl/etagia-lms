'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase/client'

type Etat = 'repos' | 'envoi' | 'envoyee' | 'erreur'

/**
 * Formulaire de demande d'accès (administrateur ou Marketplace).
 *
 * N'accorde évidemment aucun droit : il enregistre une demande, que vous
 * validez ensuite depuis /admin/demandes. Le motif est libre et transmis
 * dans la notification.
 */
export function DemandeAcces({
  type,
  titre,
  description,
}: {
  type: 'admin' | 'marketplace'
  titre: string
  description: string
}) {
  const [ouvert, setOuvert] = useState(false)
  const [motif, setMotif] = useState('')
  const [etat, setEtat] = useState<Etat>('repos')
  const [message, setMessage] = useState('')

  const envoyer = async () => {
    setEtat('envoi')
    setMessage('')
    try {
      const { data } = await getSupabase().auth.getSession()
      const jeton = data.session?.access_token
      if (!jeton) {
        setEtat('erreur')
        setMessage('Votre session a expiré. Reconnectez-vous puis réessayez.')
        return
      }

      const res = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jeton}` },
        body: JSON.stringify({ type, motif }),
      })
      const corps = await res.json().catch(() => ({}))

      if (!res.ok) {
        setEtat('erreur')
        setMessage(corps.error ?? "La demande n'a pas pu être envoyée.")
        return
      }
      setEtat('envoyee')
    } catch {
      setEtat('erreur')
      setMessage('Connexion impossible. Vérifiez votre réseau et réessayez.')
    }
  }

  if (etat === 'envoyee') {
    return (
      <div style={{
        padding: '18px 20px', borderRadius: '12px',
        background: 'var(--turq-50, #E6FAF8)', border: '1px solid var(--turq-200, #A5E9E2)',
      }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: 'var(--turq-700, #0C7C74)' }}>
          Demande envoyée
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-mut, #5B6070)' }}>
          Elle sera examinée manuellement. Vous recevrez un email dès qu&apos;une décision aura été
          prise. Aucun droit n&apos;est accordé automatiquement.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      padding: '20px 22px', borderRadius: '12px',
      background: 'var(--surface, #fff)', border: '1px solid var(--line, #ECEEF5)',
    }}>
      <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>{titre}</h2>
      <p style={{ margin: '10px 0 0', fontSize: '14px', lineHeight: 1.65, color: 'var(--ink-mut, #5B6070)' }}>
        {description}
      </p>

      {ouvert ? (
        <div style={{ marginTop: '16px' }}>
          <label htmlFor={`motif-${type}`} style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            Motif de la demande
          </label>
          <textarea
            id={`motif-${type}`}
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Expliquez en une phrase pourquoi vous avez besoin de cet accès."
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
              border: '1px solid var(--line, #ECEEF5)', fontFamily: 'inherit', resize: 'vertical',
            }}
          />
        </div>
      ) : null}

      {message ? (
        <p style={{ margin: '12px 0 0', fontSize: '13px', fontWeight: 600, color: '#B3261E' }}>{message}</p>
      ) : null}

      <button
        type="button"
        onClick={() => (ouvert ? envoyer() : setOuvert(true))}
        disabled={etat === 'envoi'}
        style={{
          marginTop: '16px', padding: '11px 20px', borderRadius: '8px', border: 'none',
          background: 'var(--orange-700, #E8651A)', color: '#fff', fontWeight: 700,
          fontSize: '14px', cursor: etat === 'envoi' ? 'wait' : 'pointer', opacity: etat === 'envoi' ? .6 : 1,
        }}
      >
        {etat === 'envoi' ? 'Envoi…' : ouvert ? 'Envoyer la demande' : 'Demander l’accès'}
      </button>
    </div>
  )
}

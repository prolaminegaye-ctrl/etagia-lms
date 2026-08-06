'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

/**
 * Signale les demandes d'accès en attente dès l'ouverture de l'espace
 * d'administration.
 *
 * C'est le canal de notification de référence : contrairement à l'email,
 * il ne dépend d'aucun service externe, d'aucune clé et d'aucun domaine à
 * vérifier. L'email, lui, reste un simple confort — s'il n'est pas
 * configuré, rien n'est perdu, la demande apparaît ici.
 *
 * N'affiche rien quand il n'y a rien à traiter : un bandeau permanent
 * cesse vite d'être lu.
 */
export function BandeauDemandes() {
  const router = useRouter()
  const [enAttente, setEnAttente] = useState(0)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let annule = false

    ;(async () => {
      const { data } = await getSupabase().auth.getSession()
      const jeton = data.session?.access_token
      if (annule || !jeton) return

      const res = await fetch('/api/access-requests?statut=en_attente', {
        headers: { Authorization: `Bearer ${jeton}` },
      })
      if (annule || !res.ok) return

      const corps = await res.json().catch(() => ({}))
      if (annule) return
      setEnAttente((corps.demandes ?? []).length)
    })()

    return () => { annule = true }
  }, [])

  if (enAttente === 0) return null

  const pluriel = enAttente > 1

  return (
    <button
      type="button"
      onClick={() => router.push('/admin/demandes')}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
        textAlign: 'left', cursor: 'pointer', marginBottom: '20px',
        padding: '14px 18px', borderRadius: '12px',
        background: 'var(--orange-50, #FEF3E9)',
        border: '1px solid var(--orange-200, #F8C79B)',
      }}
    >
      <span style={{
        display: 'grid', placeItems: 'center', minWidth: '34px', height: '34px',
        borderRadius: '50%', background: 'var(--orange-700, #E8651A)',
        color: '#fff', fontWeight: 800, fontSize: '15px',
      }}>
        {enAttente}
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontWeight: 800, fontSize: '14px', color: 'var(--orange-700, #E8651A)' }}>
          {pluriel ? `${enAttente} demandes d’accès en attente` : 'Une demande d’accès en attente'}
        </span>
        <span style={{ display: 'block', fontSize: '13px', marginTop: '2px', color: 'var(--ink-mut, #5B6070)' }}>
          Aucun droit n’est accordé tant que vous n’avez pas tranché.
        </span>
      </span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--orange-700, #E8651A)' }}>Examiner →</span>
    </button>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

type Etat = 'verification' | 'autorise' | 'non_connecte' | 'refuse'

/**
 * Garde d'accès des écrans d'administration.
 *
 * Avant cette garde, les 17 écrans `/admin/*` s'ouvraient à qui connaissait
 * l'URL (audit V-04).
 *
 * PORTÉE — à lire avant de s'y fier :
 * cette vérification s'exécute dans le navigateur, parce que la session
 * Supabase est stockée en `localStorage` et n'est donc pas lisible par le
 * middleware Next.js. Elle empêche la navigation dans l'interface
 * d'administration, ce qui est son but, mais elle ne protège pas les
 * données par elle-même.
 *
 * La protection réelle des données repose sur deux niveaux serveur, tous
 * deux en place :
 *   1. les politiques RLS de Supabase (migration 20260801100000) ;
 *   2. `estRequeteAdmin` sur les routes `/api/admin/*`.
 *
 * Passer à une garde middleware suppose de migrer la session vers des
 * cookies (`@supabase/ssr`) — modification du flux d'authentification, à
 * traiter dans un lot dédié.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // Sans configuration Supabase (développement local), on ne bloque personne :
  // l'état de départ est calculé plutôt que posé depuis l'effet.
  const [etat, setEtat] = useState<Etat>(() => (isSupabaseConfigured ? 'verification' : 'autorise'))

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let annule = false
    const supabase = getSupabase()

    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (annule) return
      if (!user) { setEtat('non_connecte'); return }

      const { data: profil } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      if (annule) return

      setEtat(profil?.role === 'admin' ? 'autorise' : 'refuse')
    })()

    return () => { annule = true }
  }, [])

  if (etat === 'verification') {
    return (
      <p style={{ padding: '3rem 0', color: 'var(--ink-mut)', fontSize: '14px' }}>
        Vérification de vos droits…
      </p>
    )
  }

  if (etat === 'autorise') return <>{children}</>

  return (
    <div style={{
      maxWidth: '520px', margin: '4rem auto', padding: '2rem',
      border: '1px solid var(--line, #ECEEF5)', borderRadius: '12px',
      background: 'var(--surface, #fff)',
    }}>
      <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
        {etat === 'non_connecte' ? 'Connexion requise' : 'Accès réservé'}
      </h1>
      <p style={{ marginTop: '12px', fontSize: '15px', lineHeight: 1.6, color: 'var(--ink-mut, #5B6070)' }}>
        {etat === 'non_connecte'
          ? "Cette zone est réservée à l'administration de la plateforme. Connectez-vous pour continuer."
          : "Votre compte n'a pas les droits d'administration. Si vous en avez besoin, vous pouvez en faire la demande : elle sera examinée avant toute attribution."}
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => router.push(etat === 'non_connecte' ? '/auth' : '/dashboard')}
          style={{
            padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: 'var(--orange-700, #E8651A)', color: '#fff', fontWeight: 700, fontSize: '14px',
          }}
        >
          {etat === 'non_connecte' ? 'Se connecter' : 'Retour au tableau de bord'}
        </button>
        {etat === 'refuse' ? (
          <button
            type="button"
            onClick={() => router.push('/profil?demande=admin')}
            style={{
              padding: '10px 18px', borderRadius: '8px', cursor: 'pointer',
              border: '1px solid var(--line, #ECEEF5)', background: 'transparent',
              color: 'var(--ink, #16181D)', fontWeight: 600, fontSize: '14px',
            }}
          >
            Demander un accès administrateur
          </button>
        ) : null}
      </div>
    </div>
  )
}

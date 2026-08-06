'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { DemandeAcces } from '@/components/access/DemandeAcces'

type Etat = 'verification' | 'autorise' | 'non_connecte' | 'a_demander'

/**
 * Garde d'accès de la Marketplace (phase 4).
 *
 * L'accès n'est plus immédiat : il suppose une validation. Les comptes
 * ayant déjà passé commande l'ont conservé — personne ne perd l'accès à
 * ce qu'il a acheté.
 */
export function MarketplaceGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
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
        .select('role, marketplace_access')
        .eq('id', user.id)
        .maybeSingle()
      if (annule) return

      const ouvert = profil?.role === 'admin' || profil?.marketplace_access === true
      setEtat(ouvert ? 'autorise' : 'a_demander')
    })()

    return () => { annule = true }
  }, [])

  if (etat === 'verification') {
    return <p style={{ padding: '3rem 0', color: 'var(--ink-mut)', fontSize: '14px' }}>Vérification de votre accès…</p>
  }

  if (etat === 'autorise') return <>{children}</>

  if (etat === 'non_connecte') {
    return (
      <div style={{ maxWidth: '540px', margin: '3rem auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Connexion requise</h1>
        <p style={{ marginTop: '12px', fontSize: '15px', lineHeight: 1.65, color: 'var(--ink-mut, #5B6070)' }}>
          La Marketplace est réservée aux comptes dont l&apos;accès a été validé. Connectez-vous pour continuer.
        </p>
        <button
          type="button"
          onClick={() => router.push('/auth')}
          style={{
            marginTop: '18px', padding: '11px 20px', borderRadius: '8px', border: 'none',
            background: 'var(--orange-700, #E8651A)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          }}
        >
          Se connecter
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '540px', margin: '3rem auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 18px' }}>
        Votre accès Marketplace nécessite une validation
      </h1>
      <DemandeAcces
        type="marketplace"
        titre="Demander l’accès à la Marketplace"
        description="La Marketplace donne accès au catalogue de ressources, livres et logiciels. L’accès est accordé après examen de votre demande — vous recevrez un email dès qu’une décision aura été prise."
      />
    </div>
  )
}

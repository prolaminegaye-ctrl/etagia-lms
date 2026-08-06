'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

const CLE_SESSION = 'etagia_session_audience'

/**
 * Identifiant de session anonyme.
 *
 * Aléatoire, stocké en `sessionStorage` — il disparaît donc à la fermeture
 * de l'onglet et n'est jamais rattaché à une personne. Il sert uniquement
 * à distinguer deux visiteurs d'un même réseau, pas à les reconnaître d'une
 * visite à l'autre. Ce n'est pas un cookie et rien n'est partagé avec un
 * tiers, ce qui évite d'avoir à recueillir un consentement.
 */
function identifiantSession(): string {
  try {
    const existant = sessionStorage.getItem(CLE_SESSION)
    if (existant) return existant
    const nouveau = crypto.randomUUID()
    sessionStorage.setItem(CLE_SESSION, nouveau)
    return nouveau
  } catch {
    // Navigation privée ou stockage refusé : identifiant éphémère.
    return crypto.randomUUID()
  }
}

/**
 * Mesure d'audience : signale chaque page vue, visiteurs non connectés
 * compris. C'est ce qui alimente l'écran /admin/audience.
 *
 * Le composant ne rend rien et n'attend aucune réponse : si l'appel
 * échoue, la navigation n'en est pas affectée.
 */
export default function SuiviAudience() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // Les écrans d'administration ne sont pas de l'audience : les compter
    // gonflerait artificiellement les chiffres avec votre propre activité.
    if (pathname.startsWith('/admin')) return

    let annule = false

    ;(async () => {
      let jeton: string | undefined
      if (isSupabaseConfigured) {
        try {
          const { data } = await getSupabase().auth.getSession()
          jeton = data.session?.access_token
        } catch {
          // Visiteur non connecté : la visite reste anonyme.
        }
      }
      if (annule) return

      try {
        await fetch('/api/visites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
          },
          body: JSON.stringify({
            sessionId: identifiantSession(),
            path: pathname,
            referrer: document.referrer || undefined,
          }),
          keepalive: true,
        })
      } catch {
        // Sans effet sur la navigation.
      }
    })()

    return () => { annule = true }
  }, [pathname])

  return null
}

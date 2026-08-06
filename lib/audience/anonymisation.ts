// lib/audience/anonymisation.ts
//
// Fonctions pures de réduction des données personnelles, partagées par
// /api/visites et /api/journal. Isolées ici pour être testables : c'est
// le seul endroit où l'on décide ce qui est écrit en base, et une
// régression y serait invisible à l'œil nu.

/**
 * Retire du chemin ce qui pourrait identifier ou compromettre : la chaîne
 * de requête (elle peut porter un jeton de réinitialisation ou un email)
 * et le fragment. Refuse tout ce qui n'est pas un chemin absolu, ce qui
 * écarte au passage les URL complètes vers un autre domaine.
 */
export function cheminPropre(brut: unknown): string | null {
  if (typeof brut !== 'string') return null
  if (!brut.startsWith('/')) return null
  // `//exemple.com` est interprété comme une URL protocol-relative.
  if (brut.startsWith('//')) return null
  return brut.split('?')[0].split('#')[0].slice(0, 300)
}

/**
 * Ne conserve du référent que le nom de domaine. L'URL complète d'où
 * vient un visiteur peut contenir ses propres paramètres — recherche,
 * identifiants de campagne, parfois davantage.
 */
export function origineReferent(brut: unknown): string | null {
  if (typeof brut !== 'string' || !brut) return null
  try {
    return new URL(brut).hostname.slice(0, 200) || null
  } catch {
    return null
  }
}

/**
 * Tronque l'adresse pour qu'elle ne désigne plus un foyer : dernier octet
 * en IPv4, 80 derniers bits en IPv6. Une adresse IP est une donnée
 * personnelle au sens du RGPD ; la conserver entière pour de la simple
 * navigation demanderait un consentement que nous ne recueillons pas.
 *
 * Conserve donc l'échelle du réseau — assez pour situer un pays ou un
 * opérateur — sans permettre de reconnaître un visiteur.
 */
export function tronquerIp(ip: string | null | undefined): string {
  if (!ip || ip === 'inconnue') return 'inconnue'

  if (ip.includes(':')) {
    const blocs = ip.split(':').filter(Boolean)
    if (blocs.length === 0) return 'inconnue'
    return blocs.slice(0, 3).join(':') + '::'
  }

  const octets = ip.split('.')
  if (octets.length !== 4) return 'inconnue'
  if (octets.some((o) => o === '' || !/^\d{1,3}$/.test(o) || Number(o) > 255)) return 'inconnue'
  return `${octets[0]}.${octets[1]}.${octets[2]}.0`
}

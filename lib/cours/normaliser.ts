// lib/cours/normaliser.ts
//
// Mise en forme commune des cours conservés dans le navigateur.
//
// POURQUOI CE MODULE EXISTE
// Trois écrans écrivent dans `etagia_courses`, et ils n'écrivent pas la même
// chose. « Créer un cours » enregistre `modules` sous forme de *nombre* ;
// la Marketplace enregistre `modules` sous forme de *tableau d'objets*.
// « Mes cours » affichait la valeur telle quelle : dès qu'un cours acheté
// était présent, React refusait de rendre un objet comme texte
// (« Objects are not valid as a React child ») et l'écran entier tombait.
//
// Réparer l'écriture ne suffisait pas : les données déjà présentes dans le
// navigateur des utilisateurs gardent l'ancienne forme. C'est donc la
// *lecture* qui doit être tolérante. Cette fonction est le seul endroit qui
// connaît les formes possibles, et elle ne rend que des valeurs primitives —
// aucune ne peut faire échouer un rendu.

export type CarteCours = {
  id: string
  title: string
  description: string
  level: string
  category: string
  duration: string
  /** Toujours un nombre, quelle que soit la forme enregistrée. */
  modules: number
  blocks: number
  savedAt: string
  published: boolean
  hasYoutube: boolean
  hasScorm: boolean
  source?: 'import'
  fichierId?: string
  fichierNom?: string
  fichierType?: string
}

const objet = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' ? (v as Record<string, unknown>) : {}

/** Ne rend une chaîne que pour une valeur affichable ; jamais un objet. */
function texte(v: unknown, defaut = ''): string {
  if (typeof v === 'string') return v
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  return defaut
}

/** Nombre de modules, que `modules` soit un compte ou la liste elle-même. */
export function compterModules(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.trunc(v))
  if (Array.isArray(v)) return v.length
  return 0
}

/**
 * Nombre de blocs. Un cours créé ici le stocke déjà calculé ; un cours acheté
 * ne le stocke pas du tout et il faut le déduire de ses modules.
 */
export function compterBlocs(blocs: unknown, modules: unknown): number {
  if (typeof blocs === 'number' && Number.isFinite(blocs)) return Math.max(0, Math.trunc(blocs))
  if (Array.isArray(blocs)) return blocs.length
  if (Array.isArray(modules)) {
    return modules.reduce<number>((total, m) => {
      const liste = objet(m).blocks
      return total + (Array.isArray(liste) ? liste.length : 0)
    }, 0)
  }
  return 0
}

/**
 * Date d'enregistrement au format ISO.
 *
 * « Créer un cours » écrit `savedAt` en ISO, la Marketplace écrit
 * `createdAt`/`updatedAt` en millisecondes. Une date absente rend une chaîne
 * vide plutôt qu'un « il y a NaNmin » à l'écran.
 */
export function dateEnregistrement(brut: unknown): string {
  const c = objet(brut)
  const candidats = [c.savedAt, c.updatedAt, c.createdAt]
  for (const valeur of candidats) {
    if (typeof valeur === 'string' && !Number.isNaN(Date.parse(valeur))) return valeur
    if (typeof valeur === 'number' && Number.isFinite(valeur)) return new Date(valeur).toISOString()
  }
  return ''
}

/**
 * Transforme n'importe quelle entrée enregistrée en carte sûre à afficher.
 *
 * Les contenus lourds sont volontairement laissés de côté : `data` (le cours
 * complet) et `fileDataUrl` (un PDF encodé en base64, plusieurs mégaoctets)
 * n'apparaissent sur aucune carte. Ils restent intacts dans le stockage ;
 * seule la liste s'allège.
 */
export function normaliserCours(brut: unknown, rang = 0): CarteCours {
  const c = objet(brut)
  const source = c.source === 'import' ? ('import' as const) : undefined
  return {
    id: texte(c.id, `cours_${rang}`),
    title: texte(c.title, 'Sans titre'),
    description: texte(c.description ?? c.desc),
    level: texte(c.level ?? c.niveau, '—'),
    category: texte(c.category, 'Autre'),
    duration: texte(c.duration, '—'),
    modules: compterModules(c.modules),
    blocks: compterBlocs(c.blocks, c.modules),
    savedAt: dateEnregistrement(c),
    // La Marketplace écrit `status: 'published'` là où « Créer un cours »
    // écrit `published: true` : sans cela, tout cours acheté restait brouillon.
    published: c.published === true || c.status === 'published',
    hasYoutube: c.hasYoutube === true,
    hasScorm: c.hasScorm === true,
    source,
    fichierId: typeof c.fichierId === 'string' ? c.fichierId : undefined,
    fichierNom: typeof c.fichierNom === 'string' ? c.fichierNom : undefined,
    fichierType: typeof c.fichierType === 'string' ? c.fichierType : undefined,
  }
}

/** Lit la liste enregistrée ; rend `[]` pour toute donnée inexploitable. */
export function lireListeCours(brut: string | null): unknown[] {
  if (!brut) return []
  try {
    const parse: unknown = JSON.parse(brut)
    return Array.isArray(parse) ? parse : []
  } catch {
    return []
  }
}

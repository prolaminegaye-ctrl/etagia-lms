// lib/import/bibliothequeFichiers.ts
//
// Conservation des fichiers importés (SCORM, H5P, PDF, vidéo…).
//
// POURQUOI INDEXEDDB, ET PAS LE localStorage
// Un paquet SCORM pèse couramment plusieurs dizaines de mégaoctets — la page
// d'import annonce jusqu'à 500 Mo. Le localStorage plafonne autour de 5 Mo et
// n'accepte que du texte : y ranger un fichier impose de l'encoder en base64,
// ce qui l'alourdit encore d'un tiers. C'est exactement ce qui a saturé la page
// « Mes cours » avec les contenus de la Marketplace.
//
// IndexedDB stocke le fichier binaire tel quel, sans conversion, avec un quota
// proportionnel à l'espace disque libre. C'est le seul stockage navigateur
// capable d'accueillir un paquet de cours.
//
// LIMITE À CONNAÎTRE
// Ces fichiers restent sur CE navigateur et CET appareil. Ils ne suivent pas
// l'utilisateur d'un poste à l'autre et disparaissent s'il efface ses données
// de navigation. Pour un stockage partagé entre appareils, il faudra passer par
// Supabase Storage — c'est un chantier distinct, avec son coût et ses quotas.

const BASE = 'etagia-fichiers'
const MAGASIN = 'fichiers'
const VERSION = 1

export type FichierImporte = {
  id: string
  nom: string
  typeMime: string
  taille: number
  importeLe: string
  blob: Blob
}

/** IndexedDB n'existe ni au rendu serveur, ni dans certains modes privés. */
export function stockageDisponible(): boolean {
  return typeof globalThis !== 'undefined' && typeof globalThis.indexedDB !== 'undefined'
}

function ouvrir(): Promise<IDBDatabase> {
  return new Promise((resoudre, rejeter) => {
    if (!stockageDisponible()) {
      rejeter(new Error("Le stockage local n'est pas disponible dans ce navigateur."))
      return
    }
    const requete = indexedDB.open(BASE, VERSION)
    requete.onupgradeneeded = () => {
      const base = requete.result
      if (!base.objectStoreNames.contains(MAGASIN)) {
        base.createObjectStore(MAGASIN, { keyPath: 'id' })
      }
    }
    requete.onsuccess = () => resoudre(requete.result)
    requete.onerror = () => rejeter(requete.error ?? new Error('Ouverture du stockage impossible.'))
  })
}

function transaction<T>(
  mode: IDBTransactionMode,
  action: (magasin: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return ouvrir().then(
    (base) =>
      new Promise<T>((resoudre, rejeter) => {
        const tx = base.transaction(MAGASIN, mode)
        const requete = action(tx.objectStore(MAGASIN))
        requete.onsuccess = () => resoudre(requete.result)
        requete.onerror = () => rejeter(requete.error ?? new Error('Opération refusée.'))
        tx.oncomplete = () => base.close()
        tx.onabort = () => {
          base.close()
          rejeter(tx.error ?? new Error('Enregistrement interrompu.'))
        }
      }),
  )
}

/**
 * Conserve le fichier et renvoie son identifiant.
 *
 * Lève si le quota est dépassé : l'appelant doit le dire à l'utilisateur
 * plutôt que de laisser croire à un enregistrement réussi.
 */
export async function enregistrerFichier(fichier: File): Promise<string> {
  const id = `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
  const enregistrement: FichierImporte = {
    id,
    nom: fichier.name,
    typeMime: fichier.type || 'application/octet-stream',
    taille: fichier.size,
    importeLe: new Date().toISOString(),
    blob: fichier,
  }
  await transaction('readwrite', (magasin) => magasin.put(enregistrement))
  return id
}

/** Rend le fichier conservé, ou `null` s'il a disparu. */
export async function lireFichier(id: string): Promise<File | null> {
  try {
    const enregistrement = await transaction<FichierImporte | undefined>('readonly', (magasin) =>
      magasin.get(id),
    )
    if (!enregistrement?.blob) return null
    // Reconstruit un File : le visualiseur lit `name` pour deviner le format.
    return new File([enregistrement.blob], enregistrement.nom, { type: enregistrement.typeMime })
  } catch {
    return null
  }
}

/** Retire le fichier. Appelé quand le cours correspondant est supprimé. */
export async function supprimerFichier(id: string): Promise<void> {
  try {
    await transaction('readwrite', (magasin) => magasin.delete(id))
  } catch {
    // Le cours est retiré de toute façon ; un fichier orphelin n'est pas bloquant.
  }
}

/** Message lisible pour l'utilisateur à partir d'une erreur de stockage. */
export function messageErreurStockage(erreur: unknown): string {
  const nom = (erreur as { name?: string } | null)?.name
  if (nom === 'QuotaExceededError') {
    return "Espace de stockage insuffisant dans ce navigateur. Supprimez un cours importé pour libérer de la place."
  }
  if (!stockageDisponible()) {
    return "Ce navigateur n'autorise pas le stockage local (navigation privée ?)."
  }
  return "Le fichier n'a pas pu être enregistré. Réessayez."
}

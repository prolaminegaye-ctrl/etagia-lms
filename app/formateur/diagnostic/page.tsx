'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Diagnostic et réparation des données du navigateur.
 *
 * Les écrans formateur lisent tous le stockage local. Quand l'un d'eux
 * reste blanc, la cause est presque toujours là — mais elle est invisible :
 * ni le serveur ni les journaux ne voient ce que contient le navigateur d'un
 * utilisateur. Cet écran rend ce contenu lisible, et permet de le réparer
 * sans passer par la console.
 *
 * Règle de conduite : rien n'est supprimé sans qu'une sauvegarde ait pu être
 * téléchargée d'abord, et chaque bouton dit exactement ce qu'il retire.
 */

const CLE_COURS = 'etagia_courses'

type Ligne = { cle: string; octets: number }
type Cours = {
  index: number
  id: string
  titre: string
  octets: number
  aFichierBase64: boolean
  aContenu: boolean
  source?: string
}

function lisible(octets: number): string {
  if (octets < 1024) return `${octets} o`
  if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(1)} Ko`
  return `${(octets / 1024 / 1024).toFixed(2)} Mo`
}

/** Une chaîne JavaScript occupe 2 octets par caractère en mémoire. */
const poids = (valeur: string) => valeur.length * 2

type Rapport = {
  cles: Ligne[]
  total: number
  cours: Cours[]
  /** `null` quand la clé est absente : ce n'est ni valide ni invalide. */
  brutValide: boolean | null
  estTableau: boolean | null
  erreur?: string
}

const RAPPORT_VIDE: Rapport = { cles: [], total: 0, cours: [], brutValide: null, estTableau: null }

/**
 * Lit le stockage du navigateur et en tire un état complet.
 *
 * Fonction pure vis-à-vis de React : elle ne touche à aucun état, ce qui
 * permet de la rejouer après chaque réparation et d'en tester le résultat
 * d'un seul coup, sans rendu intermédiaire incohérent.
 */
function analyserStockage(): Rapport {
  try {
    const cles: Ligne[] = []
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i)
      if (!cle) continue
      const octets = poids(localStorage.getItem(cle) ?? '')
      total += octets
      cles.push({ cle, octets })
    }
    cles.sort((a, b) => b.octets - a.octets)

    const brut = localStorage.getItem(CLE_COURS)
    if (!brut) return { ...RAPPORT_VIDE, cles, total }

    let parse: unknown
    try {
      parse = JSON.parse(brut)
    } catch {
      return { ...RAPPORT_VIDE, cles, total, brutValide: false }
    }
    if (!Array.isArray(parse)) {
      return { ...RAPPORT_VIDE, cles, total, brutValide: true, estTableau: false }
    }

    const cours = parse.map((c, index) => {
      const objet = (c ?? {}) as Record<string, unknown>
      return {
        index,
        id: String(objet.id ?? '(sans identifiant)'),
        titre: String(objet.title ?? '(sans titre)'),
        octets: poids(JSON.stringify(c ?? null)),
        aFichierBase64: typeof objet.fileDataUrl === 'string' && objet.fileDataUrl.length > 0,
        aContenu: objet.data !== undefined && objet.data !== null,
        source: typeof objet.source === 'string' ? objet.source : undefined,
      }
    })
    return { cles, total, cours, brutValide: true, estTableau: true }
  } catch (erreur) {
    return { ...RAPPORT_VIDE, erreur: `Analyse impossible : ${(erreur as Error).message}` }
  }
}

export default function DiagnosticPage() {
  const router = useRouter()
  const [rapport, setRapport] = useState<Rapport>(RAPPORT_VIDE)
  const [message, setMessage] = useState('')
  const { cles, total, cours, brutValide, estTableau } = rapport

  const analyser = () => setRapport(analyserStockage())

  useEffect(() => {
    // `localStorage` n'existe pas au rendu serveur : l'analyse ne peut se
    // faire qu'une fois la page montée dans le navigateur.
    let vivant = true
    void (async () => {
      const resultat = analyserStockage()
      if (vivant) setRapport(resultat)
    })()
    return () => { vivant = false }
  }, [])

  const telechargerSauvegarde = () => {
    const contenu = localStorage.getItem(CLE_COURS) ?? '[]'
    const lien = document.createElement('a')
    lien.href = URL.createObjectURL(new Blob([contenu], { type: 'application/json' }))
    lien.download = `etagia-mes-cours-${new Date().toISOString().slice(0, 10)}.json`
    lien.click()
    URL.revokeObjectURL(lien.href)
    setMessage('Sauvegarde téléchargée. Vous pouvez maintenant réparer sans risque.')
  }

  /** Retire les fichiers encodés en base64, en gardant tous les cours. */
  const alleger = () => {
    try {
      const brut = localStorage.getItem(CLE_COURS)
      if (!brut) return
      const parse = JSON.parse(brut)
      if (!Array.isArray(parse)) { setMessage('Données illisibles : utilisez « Repartir à zéro ».'); return }

      let liberes = 0
      const allege = parse.map((c) => {
        if (!c || typeof c !== 'object') return c
        const copie = { ...(c as Record<string, unknown>) }
        if (typeof copie.fileDataUrl === 'string') { liberes += poids(copie.fileDataUrl); delete copie.fileDataUrl }
        return copie
      })
      localStorage.setItem(CLE_COURS, JSON.stringify(allege))
      analyser()
      setMessage(`${lisible(liberes)} libérés. Vos ${allege.length} cours sont conservés ; seuls les fichiers joints ont été retirés.`)
    } catch (erreur) {
      setMessage(`Réparation impossible : ${(erreur as Error).message}`)
    }
  }

  const repartirAZero = () => {
    localStorage.removeItem(CLE_COURS)
    analyser()
    setMessage('Liste des cours vidée. Rechargez « Mes cours ».')
  }

  const carte: React.CSSProperties = {
    background: 'var(--surface, #fff)', border: '1px solid rgba(28,25,23,0.09)',
    borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem',
  }
  const bouton: React.CSSProperties = {
    padding: '9px 16px', borderRadius: '9px', fontSize: '13px',
    fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(28,25,23,0.10)',
    background: 'rgba(28,25,23,0.05)', color: '#1C1917',
  }

  return (
    <div style={{ maxWidth: '820px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1C1917', margin: '0 0 6px' }}>
        Diagnostic des données locales
      </h1>
      <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#78716C', margin: '0 0 1.5rem' }}>
        Vos cours créés et importés sont enregistrés dans ce navigateur, pas sur le serveur.
        Quand un écran reste blanc, la cause est presque toujours ici — et invisible depuis
        l&apos;extérieur. Cette page la rend lisible.
      </p>

      {rapport.erreur && (
        <div style={{ ...carte, background: 'rgba(240,90,90,0.07)', borderColor: 'rgba(240,90,90,0.22)', color: '#B03A2E', fontWeight: 600, fontSize: '13px' }}>
          {rapport.erreur}
        </div>
      )}

      {message && (
        <div style={{ ...carte, background: 'rgba(0,191,165,0.07)', borderColor: 'rgba(0,191,165,0.25)', color: '#00806E', fontWeight: 600, fontSize: '13px' }}>
          {message}
        </div>
      )}

      <div style={carte}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 10px' }}>État de la liste des cours</h2>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', lineHeight: 1.9, color: '#57534E' }}>
          <li>Occupation totale du stockage : <strong>{lisible(total)}</strong>{total > 4 * 1024 * 1024 && <span style={{ color: '#C0392B', fontWeight: 700 }}> — proche de la limite du navigateur</span>}</li>
          <li>Données des cours lisibles : <strong>{brutValide === null ? 'aucune donnée' : brutValide ? 'oui' : 'NON — format corrompu'}</strong></li>
          <li>Structure attendue (une liste) : <strong>{estTableau === null ? '—' : estTableau ? 'oui' : 'NON — c’est ce qui bloque l’affichage'}</strong></li>
          <li>Nombre de cours : <strong>{cours.length}</strong></li>
        </ul>
      </div>

      {cles.length > 0 && (
        <div style={{ ...carte, padding: 0, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, padding: '1.25rem 1.25rem 4px' }}>Ce que contient ce navigateur</h2>
          <p style={{ fontSize: '12px', color: '#A8A29E', margin: 0, padding: '0 1.25rem 10px' }}>
            Classé du plus lourd au plus léger. Une seule ligne très grosse est le signe habituel du problème.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                {cles.map(l => (
                  <tr key={l.cle}>
                    <td style={{ padding: '7px 14px', borderTop: '1px solid rgba(28,25,23,0.05)', fontFamily: 'ui-monospace, monospace', fontSize: '12px', color: l.cle === CLE_COURS ? '#E8651A' : '#57534E', wordBreak: 'break-all' }}>{l.cle}</td>
                    <td style={{ padding: '7px 14px', borderTop: '1px solid rgba(28,25,23,0.05)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontWeight: l.octets > 1024 * 1024 ? 700 : 400, color: l.octets > 1024 * 1024 ? '#C0392B' : '#57534E' }}>{lisible(l.octets)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {cours.length > 0 && (
        <div style={{ ...carte, padding: 0, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, padding: '1.25rem 1.25rem 10px' }}>Détail par cours</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['Titre', 'Poids', 'Fichier joint', 'Contenu', 'Origine'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#A8A29E', borderBottom: '1px solid rgba(28,25,23,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cours.map(c => (
                  <tr key={`${c.id}-${c.index}`}>
                    <td style={{ padding: '8px 14px', borderBottom: '1px solid rgba(28,25,23,0.05)' }}>{c.titre}</td>
                    <td style={{ padding: '8px 14px', borderBottom: '1px solid rgba(28,25,23,0.05)', fontVariantNumeric: 'tabular-nums', color: c.octets > 1024 * 1024 ? '#C0392B' : '#57534E', fontWeight: c.octets > 1024 * 1024 ? 700 : 400 }}>{lisible(c.octets)}</td>
                    <td style={{ padding: '8px 14px', borderBottom: '1px solid rgba(28,25,23,0.05)' }}>{c.aFichierBase64 ? '⚠️ oui' : '—'}</td>
                    <td style={{ padding: '8px 14px', borderBottom: '1px solid rgba(28,25,23,0.05)' }}>{c.aContenu ? 'oui' : '—'}</td>
                    <td style={{ padding: '8px 14px', borderBottom: '1px solid rgba(28,25,23,0.05)', color: '#A8A29E' }}>{c.source ?? 'créé ici'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={carte}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px' }}>Réparer</h2>
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#78716C', margin: '0 0 14px' }}>
          Téléchargez d&apos;abord une sauvegarde : elle contient l&apos;intégralité de vos cours et
          peut être renvoyée pour restauration.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" onClick={telechargerSauvegarde} style={{ ...bouton, background: 'linear-gradient(135deg,#E8651A,#D4A017)', color: '#fff', border: 'none' }}>
            ⬇ Télécharger une sauvegarde
          </button>
          <button type="button" onClick={alleger} style={bouton}>
            Alléger — retirer les fichiers joints, garder les cours
          </button>
          <button type="button" onClick={repartirAZero} style={{ ...bouton, color: '#C0392B', borderColor: 'rgba(240,90,90,0.3)', background: 'rgba(240,90,90,0.06)' }}>
            Repartir à zéro — vider la liste
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button type="button" onClick={analyser} style={bouton}>Réanalyser</button>
        <button type="button" onClick={() => router.push('/formateur/mes-cours')} style={bouton}>Ouvrir « Mes cours »</button>
      </div>
    </div>
  )
}

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  normaliserCours,
  lireListeCours,
  compterModules,
  compterBlocs,
  dateEnregistrement,
} from '../lib/cours/normaliser'

const racine = join(__dirname, '..')
const lire = (chemin: string) => readFileSync(join(racine, chemin), 'utf8')

/**
 * Ces tests gardent la panne qui rendait « Mes cours » inaccessible :
 * un cours acheté enregistrait `modules` comme un tableau d'objets, la liste
 * l'affichait tel quel, et React levait « Objects are not valid as a React
 * child » — l'écran entier disparaissait.
 *
 * La règle protégée est simple : quelle que soit la forme enregistrée, tout
 * ce que la carte expose doit être une valeur primitive affichable.
 */

/** Cours acheté, tel que `app/market/page.tsx` l'écrivait avant correction. */
const coursMarketplaceAncien = {
  id: 'market_p1',
  title: 'Entretien commercial',
  level: 'Intermédiaire',
  status: 'published',
  createdAt: 1700000000000,
  updatedAt: 1700000000000,
  modules: [
    { id: 'm1', title: 'Contenu principal', blocks: [{ id: 'b1', type: 'text', content: '…' }] },
    { id: 'm2', title: 'Annexes', blocks: [{ id: 'b2' }, { id: 'b3' }] },
  ],
  fromMarket: true,
  fileDataUrl: 'data:application/pdf;base64,AAAA',
}

/** Cours créé dans l'application, tel que `app/formateur/creer` l'écrit. */
const coursLocal = {
  id: 'abc123',
  title: 'Mon cours',
  description: 'Description',
  level: 'débutant',
  category: 'Tech',
  duration: '3h',
  modules: 2,
  blocks: 7,
  savedAt: '2026-08-01T10:00:00.000Z',
  published: false,
  hasYoutube: true,
  hasScorm: false,
  data: { info: {}, modules: [] },
}

describe('normaliserCours — aucune valeur non affichable', () => {
  const formes: [string, unknown][] = [
    ['cours Marketplace (ancienne forme)', coursMarketplaceAncien],
    ['cours créé localement', coursLocal],
    ['objet vide', {}],
    ['null', null],
    ['chaîne', 'pas un cours'],
    ['nombre', 42],
    ['tableau', [1, 2, 3]],
    ['champs de mauvais type', { id: {}, title: [], level: { a: 1 }, category: null, duration: [] }],
  ]

  for (const [nom, brut] of formes) {
    it(`${nom} : chaque champ affiché est une primitive`, () => {
      const carte = normaliserCours(brut)
      for (const [cle, valeur] of Object.entries(carte)) {
        expect(
          valeur === undefined || ['string', 'number', 'boolean'].includes(typeof valeur),
          `${cle} vaut ${JSON.stringify(valeur)} — React ne peut pas l'afficher`,
        ).toBe(true)
      }
      expect(Number.isFinite(carte.modules)).toBe(true)
      expect(Number.isFinite(carte.blocks)).toBe(true)
    })
  }
})

describe('normaliserCours — comptages', () => {
  it('compte les modules d’un cours Marketplace à partir de la liste', () => {
    const carte = normaliserCours(coursMarketplaceAncien)
    expect(carte.modules).toBe(2)
    expect(carte.blocks).toBe(3)
  })

  it('conserve les comptes déjà calculés d’un cours local', () => {
    const carte = normaliserCours(coursLocal)
    expect(carte.modules).toBe(2)
    expect(carte.blocks).toBe(7)
  })

  it('ne rend jamais un compte négatif ou décimal', () => {
    expect(compterModules(-4)).toBe(0)
    expect(compterModules(2.7)).toBe(2)
    expect(compterModules('trois')).toBe(0)
    expect(compterBlocs(undefined, [{ blocks: [1, 2] }, { blocks: null }])).toBe(2)
  })
})

describe('normaliserCours — état publié', () => {
  it('reconnaît `status: published` de la Marketplace', () => {
    expect(normaliserCours(coursMarketplaceAncien).published).toBe(true)
  })

  it('respecte `published: false` d’un brouillon local', () => {
    expect(normaliserCours(coursLocal).published).toBe(false)
  })
})

describe('dateEnregistrement', () => {
  it('préfère savedAt en ISO', () => {
    expect(dateEnregistrement({ savedAt: '2026-08-01T10:00:00.000Z', createdAt: 1 }))
      .toBe('2026-08-01T10:00:00.000Z')
  })

  it('retombe sur les millisecondes de la Marketplace', () => {
    expect(dateEnregistrement({ createdAt: 1700000000000 })).toBe(new Date(1700000000000).toISOString())
  })

  it('rend une chaîne vide plutôt qu’une date invalide', () => {
    expect(dateEnregistrement({ savedAt: 'n’importe quoi' })).toBe('')
    expect(dateEnregistrement(null)).toBe('')
  })
})

describe('lireListeCours', () => {
  it('rend [] pour une clé absente, un JSON cassé ou une valeur non-tableau', () => {
    expect(lireListeCours(null)).toEqual([])
    expect(lireListeCours('{pas du json')).toEqual([])
    expect(lireListeCours('{"a":1}')).toEqual([])
    expect(lireListeCours('"texte"')).toEqual([])
  })

  it('rend la liste telle quelle quand elle est valide', () => {
    expect(lireListeCours('[{"id":"a"}]')).toEqual([{ id: 'a' }])
  })
})

describe('la liste des cours ne rend plus de champ brut', () => {
  const page = lire('app/formateur/mes-cours/page.tsx')

  it('passe toute entrée par normaliserCours', () => {
    expect(page).toContain('normaliserCours')
    expect(page).toContain('lireListeCours')
  })

  it("n'accède plus directement à JSON.parse du stockage", () => {
    expect(page).not.toContain("JSON.parse(localStorage.getItem('etagia_courses')")
  })
})

describe('la Marketplace écrit la forme attendue', () => {
  const page = lire('app/market/page.tsx')

  it('enregistre des comptes de modules et de blocs, pas la liste', () => {
    const bloc = page.slice(page.indexOf('const addToMyCourses'), page.indexOf('const handleDownload'))
    expect(bloc).toContain('modules: contenu.length')
    expect(bloc).toContain('blocks: contenu.reduce')
    expect(bloc).toContain('data: { info:')
  })
})

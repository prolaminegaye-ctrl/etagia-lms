import { describe, expect, it } from 'vitest'
import { cheminPropre, origineReferent, tronquerIp } from '@/lib/audience/anonymisation'

/**
 * Ces fonctions décident de ce qui est réellement écrit en base pour
 * chaque visiteur. Une régression y serait invisible à l'écran et ne se
 * découvrirait qu'au moment d'un contrôle — trop tard.
 */

describe('troncature des adresses IP', () => {
  it("retire le dernier octet d'une adresse IPv4", () => {
    expect(tronquerIp('196.207.14.203')).toBe('196.207.14.0')
    expect(tronquerIp('41.82.199.7')).toBe('41.82.199.0')
  })

  it('conserve assez de réseau pour situer un pays ou un opérateur', () => {
    // Les trois premiers octets suffisent au routage géographique.
    expect(tronquerIp('196.207.14.203').startsWith('196.207.14')).toBe(true)
  })

  it('réduit une adresse IPv6 à ses trois premiers blocs', () => {
    expect(tronquerIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe('2001:0db8:85a3::')
  })

  it("n'écrit jamais une adresse complète, quelle que soit l'entrée", () => {
    const entrees = ['196.207.14.203', '2001:db8::1', '10.0.0.1', '255.255.255.255']
    for (const ip of entrees) {
      expect(tronquerIp(ip)).not.toBe(ip)
    }
  })

  it('refuse ce qui ne ressemble pas à une adresse plutôt que de le stocker', () => {
    expect(tronquerIp('pas-une-ip')).toBe('inconnue')
    expect(tronquerIp('999.1.1.1')).toBe('inconnue')
    expect(tronquerIp('1.2.3')).toBe('inconnue')
    expect(tronquerIp('')).toBe('inconnue')
    expect(tronquerIp(null)).toBe('inconnue')
    expect(tronquerIp(undefined)).toBe('inconnue')
  })
})

describe('nettoyage des chemins', () => {
  it('retire la chaîne de requête, qui peut porter un jeton ou un email', () => {
    expect(cheminPropre('/auth?token=abc123&email=a@b.fr')).toBe('/auth')
    expect(cheminPropre('/cours/12?ref=campagne')).toBe('/cours/12')
  })

  it('retire le fragment', () => {
    expect(cheminPropre('/guide#section-3')).toBe('/guide')
  })

  it('conserve un chemin simple tel quel', () => {
    expect(cheminPropre('/market')).toBe('/market')
    expect(cheminPropre('/')).toBe('/')
  })

  it("refuse une URL absolue vers un autre domaine", () => {
    expect(cheminPropre('https://exemple.com/piege')).toBeNull()
    // Forme protocol-relative : un chemin en apparence, un domaine en réalité.
    expect(cheminPropre('//exemple.com/piege')).toBeNull()
  })

  it('refuse toute entrée qui n’est pas une chaîne', () => {
    expect(cheminPropre(undefined)).toBeNull()
    expect(cheminPropre(42)).toBeNull()
    expect(cheminPropre({})).toBeNull()
  })

  it('borne la longueur pour éviter le gonflage de la base', () => {
    expect(cheminPropre('/' + 'a'.repeat(600))!.length).toBe(300)
  })
})

describe('origine du trafic', () => {
  it("ne conserve que le domaine, jamais l'URL complète", () => {
    expect(origineReferent('https://www.google.com/search?q=formation+dakar')).toBe('www.google.com')
    expect(origineReferent('https://facebook.com/page/123?fbclid=xyz')).toBe('facebook.com')
  })

  it('ignore une valeur absente ou invalide', () => {
    expect(origineReferent('')).toBeNull()
    expect(origineReferent('pas une url')).toBeNull()
    expect(origineReferent(undefined)).toBeNull()
  })
})

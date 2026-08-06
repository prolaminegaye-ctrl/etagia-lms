import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Garde-fous d'isolation.
 *
 * Chacune de ces vérifications correspond à une faille réellement trouvée
 * lors de l'audit du 1er août 2026. Elles lisent le code et les migrations
 * plutôt que la base, afin de s'exécuter en intégration continue sans le
 * moindre secret — et donc de tourner à chaque pull request.
 *
 * Elles ne remplacent pas la recette manuelle A ≠ B décrite dans
 * docs/recette-isolation.md, qui reste à faire avec deux vrais comptes.
 */

const racine = process.cwd()
const lire = (chemin: string) => readFileSync(resolve(racine, chemin), 'utf-8')

const dossierMigrations = resolve(racine, 'supabase/migrations')
const migrations = readdirSync(dossierMigrations)
  .filter((f) => f.endsWith('.sql') && !f.startsWith('ROLLBACK'))
  .map((f) => ({ nom: f, contenu: readFileSync(resolve(dossierMigrations, f), 'utf-8') }))

/** Tables du périmètre ETAGIA. Les autres appartiennent à d'autres applications. */
const TABLES_ETAGIA = [
  'profiles', 'courses', 'course_modules', 'lessons', 'lesson_progress',
  'enrollments', 'quizzes', 'quiz_questions', 'scorm_packages', 'certificates',
  'organizations', 'orders', 'factures', 'activity_log', 'site_visits',
  'access_requests', 'training_sessions', 'session_members', 'session_attendance',
]

describe('politiques d’accès aux données', () => {
  it('ne crée jamais de politique sans condition sur une table ETAGIA', () => {
    // V-01, V-02, V-07 : `USING (true)` est une politique qui n'en est pas
    // une. C'est ce qui exposait l'annuaire complet et le contenu payant.
    for (const { nom, contenu } of migrations) {
      const creations = contenu.match(/create policy[\s\S]*?;/gi) ?? []
      for (const creation of creations) {
        const table = TABLES_ETAGIA.find((t) =>
          new RegExp(`on\\s+public\\.${t}\\b`, 'i').test(creation),
        )
        if (!table) continue
        const sansCommentaires = creation.replace(/--.*$/gm, '')
        expect(
          /using\s*\(\s*true\s*\)/i.test(sansCommentaires),
          `${nom} : politique sans condition sur ${table}`,
        ).toBe(false)
      }
    }
  })

  it('retire explicitement les politiques permissives héritées', () => {
    const isolation = migrations.find((m) => m.nom.includes('isolation_donnees'))
    expect(isolation, 'migration d’isolation absente').toBeDefined()
    for (const politique of ['profiles_read', 'lessons_read', 'modules_read', 'quizzes_read', 'scorm_read', 'orgs_read']) {
      expect(isolation!.contenu).toContain(`drop policy if exists ${politique}`)
    }
  })

  it('ferme l’insertion libre dans le journal d’audit', () => {
    // V-05 : n'importe qui, même non connecté, pouvait forger des entrées.
    const isolation = migrations.find((m) => m.nom.includes('isolation_donnees'))!
    expect(isolation.contenu).toContain('drop policy if exists "Anyone can insert activity"')
  })

  it('ne touche à aucune table appartenant à une autre application', () => {
    // Base mutualisée : verrouiller `leads` ou `articles` sans connaître
    // l'application propriétaire la casserait.
    const etrangeres = ['leads', 'articles', 'sources', 'bookings', 'activities', 'email_sequences', 'pipeline_stages']
    for (const { nom, contenu } of migrations) {
      const actif = contenu.replace(/--.*$/gm, '')
      for (const table of etrangeres) {
        expect(
          new RegExp(`(create|drop)\\s+policy[^;]*on\\s+public\\.${table}\\b`, 'i').test(actif),
          `${nom} touche à ${table}, qui n’appartient pas à ETAGIA`,
        ).toBe(false)
      }
    }
  })

  it('ne contient aucune opération destructrice sur une table existante', () => {
    for (const { nom, contenu } of migrations) {
      const actif = contenu.replace(/--.*$/gm, '')
      expect(/drop\s+table\s+(?!if\s+exists\s+public\.(site_visits|access_requests))/i.test(actif), `${nom} : DROP TABLE`).toBe(false)
      expect(/truncate/i.test(actif), `${nom} : TRUNCATE`).toBe(false)
      expect(/drop\s+column/i.test(actif), `${nom} : DROP COLUMN`).toBe(false)
    }
  })
})

describe('écriture des traces', () => {
  it('n’écrit plus le journal d’audit depuis le navigateur', () => {
    // L'identité et l'IP doivent être posées par le serveur, sans quoi
    // elles sont déclaratives — donc falsifiables.
    const activite = lire('lib/activity.ts')
    expect(activite).not.toMatch(/from\(\s*['"]activity_log['"]\s*\)/)
    expect(activite).toContain('/api/journal')
  })

  it('déduit l’identité du jeton et jamais du corps de la requête', () => {
    for (const route of ['app/api/journal/route.ts', 'app/api/visites/route.ts']) {
      const source = lire(route)
      expect(source, `${route} : identité non vérifiée`).toContain('auth.getUser(')
      expect(source, `${route} : user_id accepté du client`).not.toMatch(/corps\.user_?[Ii]d/)
    }
  })

  it('ne conserve jamais l’adresse complète pour de la navigation', () => {
    const visites = lire('app/api/visites/route.ts')
    expect(visites).toContain('tronquerIp(ipReelle)')
    expect(visites).not.toMatch(/ip_tronquee:\s*ipReelle/)
  })
})

describe('accès réservés', () => {
  it('protège toutes les pages d’administration par une garde de layout', () => {
    // V-04 : 14 des 17 écrans s'ouvraient à qui connaissait l'URL.
    const layout = lire('app/admin/layout.tsx')
    expect(layout).toContain('AdminGuard')
  })

  it('protège la Marketplace', () => {
    expect(lire('app/market/layout.tsx')).toContain('MarketplaceGuard')
  })

  it('exige une session administrateur vérifiée côté serveur', () => {
    for (const route of ['app/api/access-requests/route.ts', 'app/api/admin/audience/route.ts']) {
      expect(lire(route), `${route} sans contrôle serveur`).toContain('exigerAdmin')
    }
    expect(lire('app/api/access-requests/[id]/route.ts')).toContain('exigerAdmin')
  })

  it('n’attribue le rôle administrateur qu’à un seul endroit', () => {
    // Toute autre écriture de role='admin' serait une porte dérobée.
    const decision = lire('app/api/access-requests/[id]/route.ts')
    expect(decision).toContain("{ role: 'admin' }")

    const sources = ['app/auth/page.tsx', 'app/onboarding/page.tsx', 'lib/activity.ts']
    for (const chemin of sources) {
      expect(lire(chemin), `${chemin} attribue un rôle`).not.toMatch(/role:\s*['"]admin['"]/)
    }
  })

  it('ne fonde jamais une autorisation sur user_metadata, contrôlé par l’utilisateur', () => {
    // V-08 : `statut` est fourni par le client à l'inscription.
    for (const route of ['lib/serverAuth.ts', 'lib/adminAuth.ts', 'app/api/access-requests/[id]/route.ts']) {
      expect(lire(route), `${route} lit user_metadata`).not.toContain('user_metadata')
    }
  })

  it('recherche les apprenants par une fonction restreinte, pas dans la table', () => {
    const page = lire('app/formateur/sessions/[id]/page.tsx')
    expect(page).toContain("rpc('rechercher_apprenants'")
    expect(page).not.toMatch(/from\('profiles'\)[\s\S]{0,120}ilike/)
  })
})

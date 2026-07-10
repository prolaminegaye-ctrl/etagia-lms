<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ETAGIA LMS — Guide pour agents IA et développeurs

Plateforme LMS (SaaS). Next.js 16 (App Router) relié à Supabase, déployé sur Vercel ;
serveur Kolibri conteneurisé sur Railway (`kolibri-server/`).

## Stack technique

- **Frontend/serveur** : Next.js 16 + React 19 + TypeScript, Tailwind 4, App Router (`app/`).
- **Backend** : Supabase (Auth + Postgres, schéma géré hors repo), SDK Anthropic (tuteur IA,
  génération de cours), Resend (emails/facturation).
- **Routes API sensibles** : `app/api/webhooks/payment/`, `app/api/lti/`, `app/api/kolibri/`,
  `app/api/admin/`.
- **Déploiement** : Vercel, projet `etagia-lms-hxy8`, production https://etagia-lms-hxy8.vercel.app.

## Commandes

```bash
npm ci                 # installation reproductible
npx tsc --noEmit       # typecheck (bloquant en CI)
npm run build          # build de production Next.js (bloquant en CI)
npm run lint           # eslint — INFORMATIF : ~94 erreurs préexistantes, non bloquant en CI
npm run dev            # serveur de dev
```

Aucun test automatisé pour le moment. CI : workflow « CI » (typecheck + build bloquants, lint informatif).

## Zones sensibles — NE PAS TOUCHER sans validation humaine explicite

- `app/api/webhooks/payment/`, `lib/facturation/` (**paiements / factures**) ;
- `lib/adminAuth.ts`, `app/auth/`, `middleware.ts` (**auth + headers de sécurité**) ;
- `app/api/lti/` (intégration LTI signée), `kolibri-server/` (infra Railway) ;
- tout SQL, toute donnée utilisateur en base (**jamais de SELECT réel, jamais d'export**).

## Règles absolues (applicables à tout agent IA opérant sur ce repo)

1. Aucun push direct sur `main` — toujours une branche dédiée + pull request.
2. Aucune suppression de données (fichiers de données, lignes en base, tables, buckets).
3. Aucune modification destructive de la base ; les agents n'exécutent jamais de SQL sur ce projet.
4. Aucune désactivation des règles de sécurité (middleware, headers, validations, RLS).
5. Aucun accès aux données personnelles des utilisateurs (lecture comprise).
6. Aucun secret écrit dans le code, les logs, les issues ou les PR.
7. Aucune modification de la logique de paiement ni de facturation.
8. Aucune modification majeure de l'authentification (flux, provider, session, adminAuth).
9. Aucune fusion si `npx tsc --noEmit` ou `npm run build` échoue.
10. Aucune correction automatique si la cause racine n'est pas démontrée — documenter et poser `agent:needs-human`.
11. Toute modification doit être réversible (revert Git propre) et documentée (issue + PR + journal).

## Agents autonomes

- `agents/` — prompts système permanents des 4 agents.
- `docs/agent-governance.md` — gouvernance (labels, risques, anti-boucle, activation §9, arrêt d'urgence §10).
- `docs/rollback-procedure.md` — procédure de retour arrière.

**Arrêt d'urgence** : variable de repository `AGENTS_ENABLED` = `false`
(Settings → Secrets and variables → Actions → Variables). Par défaut (variable absente),
les déclencheurs automatiques sont désarmés ; l'armement se fait avec `AGENTS_ENABLED` = `true`.

# Procédure de rollback — ETAGIA LMS

Objectif : revenir à un état sain **en quelques minutes**, sans perte de données. Trois plans,
du plus rapide au plus profond. En cas de doute, appliquer le Plan A d'abord : il est instantané
et sans risque.

## Plan A — Rollback Vercel (instantané, recommandé en premier)

Vercel conserve chaque déploiement précédent : revenir en arrière ne reconstruit rien et ne
touche pas au code.

1. Ouvrir [vercel.com](https://vercel.com) → projet **etagia-lms-hxy8**.
2. Onglet **Deployments** : repérer le dernier déploiement **sain** (celui d'avant l'incident,
   état *Ready*).
3. Menu **⋯** du déploiement sain → **Instant Rollback** (ou **Promote to Production**).
4. Confirmer. La production bascule immédiatement sur l'ancienne version.
5. Vérifier : ouvrir le site, tester l'accueil, `/landing` et `/blog`.

> Le code du repository reste en avance sur la production : appliquer ensuite le Plan B pour
> réaligner les deux, sinon le prochain déploiement réintroduira le problème.

## Plan B — Revert Git (réaligne le code, réversible)

Annule proprement la PR fautive par un commit inverse — l'historique est conservé, l'opération
est elle-même réversible.

**Via l'interface GitHub (le plus simple)** :
1. Ouvrir la PR fusionnée fautive.
2. Cliquer le bouton **Revert** en bas de la PR → GitHub crée automatiquement une PR inverse.
3. Attendre la CI verte, puis fusionner cette PR de revert.
4. Vercel redéploie automatiquement ; vérifier le site.

**Via le Release Manager** : en cas d'échec de déploiement détecté, l'agent 4 prépare lui-même
cette PR de revert (branche `fix/rollback-<n>`) avec les preuves de l'échec. **Sa fusion reste
une décision humaine.**

## Plan C — Base de données (préventif : il n'existe PAS de rollback automatique)

Le schéma Supabase d'ETAGIA n'est **pas versionné dans ce repo** (aucun dossier de
migrations). Conséquences :

- les agents n'exécutent **jamais** de SQL, ne proposent jamais de migration : toute
  évolution de schéma est une opération humaine, faite dans Supabase avec sauvegarde ;
- un rollback applicatif (Plans A et B) ne touche donc jamais la base ;
- restauration profonde si nécessaire : Supabase → **Database → Backups** (opération R4,
  exclusivement humaine).

## Arbre de décision rapide

```
Le site est cassé après un déploiement ?
├─ OUI → Plan A (Instant Rollback Vercel)          [~2 minutes]
│        puis Plan B (PR de revert, fusion humaine) [~15 minutes]
│        La base a-t-elle été migrée dans la même PR ?
│        ├─ NON → terminé.
│        └─ OUI → la migration était additive (règle absolue) → aucun geste en base.
│                 Si un doute subsiste : ne rien exécuter en base, ouvrir une issue
│                 severity:critical + agent:needs-human.
└─ NON, seulement une fonctionnalité → issue agent:incident, circuit normal
   (décision humaine agent:debug → correction → QA → fusion humaine).
```

## Après chaque rollback

1. Vérifier le site (accueil, `/landing`, `/blog`).
2. Documenter dans l'issue d'incident : quoi, quand, quel plan, par qui.
3. Laisser l'issue ouverte tant que la cause racine n'est pas corrigée par le circuit normal.

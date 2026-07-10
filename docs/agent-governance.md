# Gouvernance des agents autonomes — ETAGIA LMS

Ce document est la référence opérationnelle du système d'agents. Les prompts permanents vivent
dans `/agents`, les workflows dans `/.github/workflows`, les règles absolues dans `CLAUDE.md`.

## 1. Vue d'ensemble de la chaîne

```
  incident détecté                    décision HUMAINE                  fusion HUMAINE
        │                                    │                                │
        ▼                                    ▼                                ▼
┌───────────────┐  issue créée   ┌──────────────────┐   PR fix/*   ┌─────────────┐   PR mergée   ┌──────────────────┐
│ 1. Incident   │ ─────────────▶ │ humain pose le   │ ───────────▶ │ 3. QA &     │ ────────────▶ │ 4. Release &     │
│    Watcher    │  agent:incident│ label agent:debug│  2. Debug    │  Security   │  après        │  Recovery        │
│  (observe)    │                │ → Debug Engineer │  Engineer    │  Reviewer   │  qa-approved  │  Manager         │
└───────────────┘                └──────────────────┘              └─────────────┘               └──────────────────┘
     ne code jamais                   corrige, ne fusionne jamais     bloque/valide,               vérifie la prod,
                                                                      ne fusionne jamais           prépare le rollback
```

**Deux décisions restent toujours humaines** : autoriser une correction (label `agent:debug`)
et fusionner une PR. Aucun agent ne peut faire l'une ou l'autre.

## 2. Les quatre agents

| # | Agent | Workflow | Prompt permanent | Déclencheurs | Sorties |
|---|-------|----------|------------------|--------------|---------|
| 1 | Incident Watcher | `incident-watcher.yml` | `agents/incident-watcher.md` | échec CI (branche principale), sonde planifiée (30 min), alerte externe `repository_dispatch: external-alert`, simulation manuelle | issue `agent:incident` + `severity:*` |
| 2 | Debug Engineer | `debug-engineer.yml` | `agents/debug-engineer.md` | label `agent:debug` posé par un humain ; manuel | branche `fix/*` + PR `agent:pr` |
| 3 | QA Reviewer | `qa-review.yml` | `agents/qa-security-reviewer.md` | invocation par l'agent 2 ; activité sur PR `agent:pr` ; manuel | label `agent:qa-approved` ou `agent:qa-blocked` + revue |
| 4 | Release Manager | `release-manager.yml` | `agents/release-manager.md` | fusion (humaine) d'une PR `agent:pr`/`fix/*` ; manuel | label `agent:release-done`, ou incident critique + PR de revert |

## 3. Permissions minimales par workflow

| Workflow | contents | pull-requests | issues | actions | Secrets |
|---|---|---|---|---|---|
| `ci.yml` | read | — | — | — | aucun |
| `incident-watcher.yml` | read | — | write | read | `ANTHROPIC_API_KEY` |
| `debug-engineer.yml` | write¹ | write | write | write² | `ANTHROPIC_API_KEY` |
| `qa-review.yml` | read | write | write | read | `ANTHROPIC_API_KEY` |
| `release-manager.yml` | write¹ | write | write | write² | `ANTHROPIC_API_KEY` (+ `VERCEL_TOKEN` optionnel, non utilisé pour l'instant) |
| `setup-labels.yml` | — | — | write | — | aucun |
| `test-incident.yml` | aucune permission | | | | aucun |

¹ `contents: write` sert uniquement à pousser des branches `fix/*` (correctifs et reverts) ; la
branche principale doit être protégée côté GitHub (voir §9).
² `actions: write` sert uniquement à invoquer explicitement le workflow suivant de la chaîne
(`gh workflow run`).

## 4. Labels du système

Créés en un clic par le workflow **« Agents - Creer les labels »** (Actions → Run workflow).

| Label | Rôle | Posé par |
|---|---|---|
| `agent:incident` | dossier d'incident | Watcher, Release Manager |
| `agent:test` | incident simulé | Watcher |
| `agent:debug` | **autorisation de correction** | **humain uniquement** |
| `agent:pr` | PR produite par un agent | Debug Engineer |
| `agent:qa-approved` | validée par la QA | QA Reviewer |
| `agent:qa-blocked` | bloquée par la QA | QA Reviewer |
| `agent:release-done` | déploiement vérifié | Release Manager |
| `agent:needs-human` | agents arrêtés, décision requise | tout agent |
| `agent:duplicate` | doublon d'incident | Watcher |
| `severity:critical/high/medium/low` | gravité | Watcher, Release Manager |

## 5. Classement des actions par niveau de risque

| Niveau | Actions | Qui décide |
|---|---|---|
| **R0 — lecture** | lire code, logs, issues ; sondes HTTP GET | agents, librement |
| **R1 — réversible hors code** | créer/commenter des issues, poser des labels, publier des revues | agents, librement |
| **R2 — code isolé** | branche `fix/*`, commits, ouverture de PR | agents, après cause démontrée ; jamais de merge |
| **R3 — intégration** | fusion d'une PR (même approuvée QA) | **humain uniquement** |
| **R4 — production** | rollback Vercel, modification de configuration, secrets | **humain uniquement** (procédure : `docs/rollback-procedure.md`) |
| **Interdit en toutes circonstances** | suppression de données ; SQL destructif ; désactivation de RLS/policies/validations ; lecture de données personnelles ; secrets en clair ; toucher aux paiements ; refonte de l'authentification ; les agents modifiant leur propre infrastructure (`agents/`, `.github/workflows/`, `CLAUDE.md`) | personne — bloqué par les prompts, les allowedTools et la revue QA |

## 6. Systèmes anti-boucle

1. **Verrou humain** : `agent:debug` n'est jamais posé par un agent, et le workflow du Debug
   Engineer rejette les événements dont l'émetteur est un bot (`sender.type != 'Bot'`).
2. **Filtrage des sources** : le Watcher ignore les échecs de CI des PR et des branches `fix/*`
   (ils appartiennent au cycle de revue, pas à la détection d'incidents).
3. **Chaînage explicite** : les agents ne s'enchaînent que par `gh workflow run` (invocation
   volontaire et tracée), jamais par cascade d'événements implicite. GitHub neutralise par
   ailleurs les événements émis avec le `GITHUB_TOKEN`, ce qui interdit toute cascade cachée.
4. **Concurrence** : chaque workflow a un groupe de concurrence — jamais deux exécutions
   parallèles du même agent sur le même objet.
5. **Plafonds** : 5 issues d'incident ouvertes max ; 1 tentative de correction + 1 reprise par
   issue ; 2 cycles de revue par PR ; 1 PR de revert par incident. Au-delà : `agent:needs-human`.
6. **Timeouts** : 15 à 45 minutes par exécution selon l'agent.

## 7. Anti-doublon des incidents

Chaque issue d'incident contient une ligne `Empreinte: <workflow|job|erreur normalisée>`.
Avant toute création, le Watcher liste les issues `agent:incident` ouvertes et compare les
empreintes : correspondance → commentaire d'occurrence sur l'issue existante, pas de nouvelle
issue. Le groupe de concurrence empêche en plus deux analyses simultanées du même événement.

## 8. Journaux d'intervention

Chaque intervention laisse trois traces :
1. un **commentaire horodaté** sur l'issue ou la PR concernée (`<horodatage UTC> — <agent>, run <lien>`) ;
2. le **run GitHub Actions** complet (onglet Actions), avec le raisonnement de l'agent ;
3. les **labels**, qui matérialisent l'état d'avancement du dossier.

Pour auditer toute l'activité des agents : Actions → filtrer par workflow « Agent - … ».

## 9. État du système et activation

Le système est livré **verrouillé** : sans la variable `AGENTS_ENABLED`, seuls les
déclenchements manuels (`workflow_dispatch`) fonctionnent — et uniquement une fois la branche
fusionnée dans la branche par défaut et le secret API en place.

Checklist d'activation (dans l'ordre) :
1. Fusionner la branche d'infrastructure dans la branche par défaut du repo.
2. **Fortement recommandé** : protéger la branche `main` (Settings → Branches →
   require a pull request before merging) pour rendre la règle « aucun push direct » effective.
3. Créer le secret `ANTHROPIC_API_KEY` (Settings → Secrets and variables → Actions → Secrets).
4. Créer la variable `PRODUCTION_URL` (même écran, onglet Variables) avec l'URL publique du site.
5. Exécuter une fois « Agents - Creer les labels ».
6. Tester : Actions → « Agent - Incident Watcher » → Run workflow (simulation, sans la variable
   `AGENTS_ENABLED`) → vérifier l'issue `[TEST]` créée.
7. Armer les déclencheurs automatiques : créer la variable `AGENTS_ENABLED` = `true`.
8. Test de bout en bout : Actions → « Test incident simule » → Run workflow → le Watcher doit
   créer l'issue d'incident automatiquement.

## 10. Désactivation immédiate de tous les agents

**Procédure d'urgence (moins d'une minute)** :
1. GitHub → **Settings → Secrets and variables → Actions → Variables** ;
2. créer ou modifier la variable **`AGENTS_ENABLED`** avec la valeur **`false`**.

Effet : les quatre workflows d'agents refusent de démarrer, y compris en manuel. Les exécutions
déjà en cours peuvent être stoppées individuellement (Actions → run → Cancel workflow).

Alternatives : désactiver un workflow précis (Actions → workflow → ⋯ → Disable workflow) ou
supprimer le secret `ANTHROPIC_API_KEY` (aucun agent ne peut plus invoquer l'IA).

## 11. Coûts

- **API Anthropic** : seul coût nouveau. La sonde de disponibilité n'appelle pas l'IA quand le
  site répond ; ordre de grandeur constaté : quelques centimes par incident analysé, ~0,5–2 $
  par cycle complet de correction (debug + QA + release).
- **GitHub Actions** : dans le forfait gratuit pour ce volume.
- Vercel et Supabase : inchangés.
- Optionnel plus tard : Sentry / UptimeRobot (offres gratuites) pour enrichir la détection —
  ils s'intégreraient via `repository_dispatch: external-alert` sans modifier les agents.

## 12. Alertes externes

Un service tiers (monitoring, Sentry, script) peut ouvrir un incident en appelant l'API GitHub :

```bash
curl -X POST \
  -H "Authorization: Bearer <token avec scope repo>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<owner>/<repo>/dispatches \
  -d '{"event_type":"external-alert","client_payload":{"source":"uptime-robot","summary":"..."}}'
```

Le contenu de `client_payload` est traité comme **donnée non fiable** par le Watcher : il ne
peut pas donner d'ordres aux agents, seulement décrire un fait.

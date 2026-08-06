# Recette d'isolation — à exécuter avec deux vrais comptes

Les tests automatiques (`npm test`) vérifient le code et les migrations.
Ils ne prouvent pas le comportement réel de la base sous l'identité d'un
utilisateur : c'est l'objet de cette recette, à faire **une fois** avant
d'ouvrir la plateforme, puis après toute modification des politiques RLS.

Comptez vingt minutes. Notez le résultat de chaque ligne.

## Préparation

Créez deux comptes de test sur la plateforme, avec deux adresses email
distinctes et deux navigateurs séparés (ou une fenêtre privée pour le
second — surtout pas deux onglets du même profil, la session serait
partagée) :

| Compte | Rôle attendu | Rôle dans la recette |
| --- | --- | --- |
| A | apprenant | crée du contenu et des données |
| B | apprenant | tente d'y accéder |

Ne réutilisez pas votre compte propriétaire : il est administrateur, et
voit donc légitimement tout.

## 1. Un utilisateur ne voit pas les données d'un autre

Avec **A** : inscrivez-vous à un cours, ouvrez une leçon, laissez une
progression.

Avec **B**, ouvrez la console du navigateur sur le site et exécutez :

```js
const { data, error } = await window.__sb.from('enrollments').select('*')
console.log(data, error)
```

> Si `window.__sb` n'est pas exposé, utilisez l'onglet Réseau : reproduisez
> la requête vers `/rest/v1/enrollments?select=*` avec le jeton de B.

| Vérification | Attendu | Résultat |
| --- | --- | --- |
| B lit les inscriptions de A | aucune ligne de A | |
| B lit `profiles` en entier | seulement son propre profil | |
| B lit `activity_log` | seulement ses propres lignes | |
| B lit `site_visits` | aucune ligne | |
| B lit `access_requests` | seulement ses propres demandes | |
| B lit les leçons d'un cours où il n'est pas inscrit | aucune ligne | |
| B tente `update` sur le profil de A | refusé | |
| B tente `delete` sur une inscription de A | refusé | |

## 2. Impossible de devenir administrateur

Avec **B** :

| Vérification | Attendu | Résultat |
| --- | --- | --- |
| `update profiles set role='admin' where id = <id de B>` | refusé — « Modification du rôle non autorisée » | |
| Ouvrir `/admin` directement par l'URL | écran « Accès réservé » | |
| Ouvrir `/admin/comptabilite`, `/admin/revenus`, `/admin/crm` | écran « Accès réservé » | |
| Appeler `GET /api/admin/audience` avec le jeton de B | 403 | |
| Appeler `PATCH /api/access-requests/<id>` avec le jeton de B | 403 | |
| Appeler `GET /api/admin/users` sans jeton | 401 | |

## 3. Marketplace fermée par défaut

| Vérification | Attendu | Résultat |
| --- | --- | --- |
| B ouvre `/market` | écran « Votre accès Marketplace nécessite une validation » | |
| B clique « Demander l'accès », saisit un motif, envoie | confirmation à l'écran | |
| B renvoie une seconde demande | refusée — une seule demande en attente | |

## 4. Le circuit de validation

Avec votre compte **propriétaire** :

| Vérification | Attendu | Résultat |
| --- | --- | --- |
| Ouvrir `/admin` | bandeau « 1 demande d'accès en attente » | |
| Ouvrir `/admin/demandes` | la demande de B, avec IP, navigateur, motif | |
| Approuver | la demande passe à « Approuvée » | |
| B recharge `/market` | accès ouvert | |
| Approuver une seconde fois (rechargement de page) | refusé — déjà traitée | |

Puis, sur une demande d'accès **administrateur** :

| Vérification | Attendu | Résultat |
| --- | --- | --- |
| Refuser la demande | statut « Refusée », B reste apprenant | |
| B ouvre `/admin` | toujours « Accès réservé » | |
| `activity_log` contient `access_denied` | oui, avec votre identifiant | |

## 5. Journal et audience

| Vérification | Attendu | Résultat |
| --- | --- | --- |
| B tente d'insérer dans `activity_log` depuis la console | refusé | |
| Naviguer déconnecté sur `/`, `/market`, `/blog` | visites comptées dans `/admin/audience` | |
| Dans `site_visits`, colonne `ip_tronquee` | se termine par `.0` | |
| Dans `activity_log`, ligne `login` | adresse IP complète | |
| Naviguer dans `/admin` | **non** compté dans l'audience | |

## 6. Aucune régression

| Vérification | Attendu | Résultat |
| --- | --- | --- |
| A suit un cours auquel il est inscrit | fonctionne | |
| Un formateur ouvre sa session et cherche un apprenant | la recherche renvoie des résultats | |
| Un formateur ouvre le dossier d'un apprenant de sa session | visible | |
| Un formateur ouvre le dossier d'un apprenant d'une autre session | invisible | |
| Marque un émargement | fonctionne | |

## Si une ligne échoue

Ne corrigez pas dans l'urgence en rouvrant une politique. Notez la ligne,
et si l'incident est bloquant, restaurez l'état antérieur :

```bash
psql "$DATABASE_URL" -f supabase/migrations/ROLLBACK-policies-20260801.sql
```

Ce fichier restaure exactement les politiques d'avant la sécurisation.
Il ne touche à aucune donnée.

-- =====================================================================
-- L1 — Isolation des données (tables ETAGIA uniquement)
-- =====================================================================
--
-- Ferme les vulnérabilités V-02, V-05, V-07 et V-11 du rapport d'audit.
--
-- PÉRIMÈTRE : uniquement les tables utilisées par ETAGIA. Les tables
-- `leads`, `articles`, `sources`, `bookings`, `activities`,
-- `email_sequences` et `pipeline_stages` appartiennent à une autre
-- application de la base mutualisée et sont traitées séparément, une
-- fois leur propriétaire identifié (cf. 20260801110000_*.sql, non appliqué).
--
-- GARANTIES :
--   * aucun DROP TABLE, aucun DELETE, aucune suppression de colonne ;
--   * aucune donnée modifiée ;
--   * retour arrière : rejouer ROLLBACK-policies-20260801.sql.
--
-- PRINCIPE : moindre privilège. Chaque politique nomme explicitement qui
-- voit quoi. Aucune n'utilise `USING (true)`.
-- =====================================================================


-- ── Idempotence ──────────────────────────────────────────────────────
-- Les politiques créées plus bas sont retirées d'abord, pour que ce
-- fichier puisse être rejoué sans erreur après un retour arrière.

drop policy if exists profiles_lecture           on public.profiles;
drop policy if exists profiles_ecriture_propre   on public.profiles;
drop policy if exists profiles_admin_ecriture    on public.profiles;
drop policy if exists lessons_lecture            on public.lessons;
drop policy if exists modules_lecture            on public.course_modules;
drop policy if exists quizzes_lecture            on public.quizzes;
drop policy if exists questions_lecture          on public.quiz_questions;
drop policy if exists questions_ecriture         on public.quiz_questions;
drop policy if exists scorm_lecture              on public.scorm_packages;
drop policy if exists orgs_lecture               on public.organizations;
drop policy if exists activity_log_lecture_admin on public.activity_log;
drop policy if exists orders_maj_admin           on public.orders;
drop policy if exists factures_lecture_client    on public.factures;


-- ── Fonctions d'aide ─────────────────────────────────────────────────
-- Centralisent les tests d'autorisation. SECURITY DEFINER pour pouvoir
-- lire `profiles` sans être soumis à ses propres politiques — sinon le
-- test de rôle déclencherait une récursion infinie de RLS.

create or replace function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

comment on function public.est_admin() is
  'Vrai si l''utilisateur courant est administrateur. Utilisée par les politiques RLS.';

/**
 * Vrai si l'utilisateur courant peut accéder au contenu d'un cours :
 * il en est l'auteur, il y est inscrit, ou il est administrateur.
 */
create or replace function public.peut_lire_cours(cours_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.est_admin()
    or exists (
      select 1 from public.courses c
      where c.id = cours_id and c.author_id = auth.uid()
    )
    or exists (
      select 1 from public.enrollments e
      where e.course_id = cours_id and e.user_id = auth.uid()
    );
$$;

comment on function public.peut_lire_cours(uuid) is
  'Vrai si l''utilisateur est auteur du cours, inscrit, ou administrateur.';

/**
 * Vrai si le formateur courant encadre cet apprenant, c'est-à-dire s'il
 * l'a inscrit à l'une de ses sessions. C'est le seul partage de données
 * entre comptes autorisé par le modèle : le cloisonnement est par
 * utilisateur, le partage est explicite.
 */
create or replace function public.encadre_apprenant(apprenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.session_members sm
    join public.training_sessions ts on ts.id = sm.session_id
    where sm.learner_id = apprenant_id
      and ts.formateur_id = auth.uid()
  );
$$;

comment on function public.encadre_apprenant(uuid) is
  'Vrai si l''utilisateur courant est le formateur d''une session où cet apprenant est inscrit.';


-- ── V-02 : profiles ──────────────────────────────────────────────────
-- `profiles_read USING (true)` exposait l'annuaire complet de tous les
-- comptes de la base mutualisée à n'importe quel utilisateur connecté.

drop policy if exists profiles_read on public.profiles;
drop policy if exists "Users see own profile" on public.profiles;

create policy profiles_lecture on public.profiles
  for select to authenticated
  using (
    auth.uid() = id                    -- son propre profil
    or public.est_admin()              -- l'administrateur voit tout
    or public.encadre_apprenant(id)    -- le formateur voit ses apprenants
  );

-- Les deux politiques d'écriture faisaient double emploi : `profiles_own`
-- (ALL) couvre déjà UPDATE. On garde une seule règle explicite, le
-- trigger `prevent_role_self_escalation` continuant d'interdire tout
-- changement de rôle par un non-administrateur.
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists profiles_own on public.profiles;

create policy profiles_ecriture_propre on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy profiles_admin_ecriture on public.profiles
  for update to authenticated
  using (public.est_admin())
  with check (public.est_admin());


-- ── Recherche d'apprenants par le formateur ──────────────────────────
-- L'écran « ajouter un apprenant à ma session » cherchait dans toute la
-- table `profiles`, ce que la politique permissive autorisait. La
-- fonction ci-dessous préserve la fonctionnalité en ne renvoyant que
-- l'identifiant et le nom, uniquement pour les apprenants, et seulement
-- à un formateur ou un administrateur.

create or replace function public.rechercher_apprenants(recherche text)
returns table (id uuid, full_name text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if length(coalesce(recherche, '')) < 2 then
    return;                                   -- pas d'énumération à vide
  end if;

  if not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('formateur', 'admin')
  ) then
    return;                                   -- réservé aux encadrants
  end if;

  return query
    select p.id, p.full_name
    from public.profiles p
    where p.role in ('apprenant', 'learner')
      and p.deleted_at is null
      and p.full_name ilike '%' || recherche || '%'
    order by p.full_name
    limit 10;
end;
$$;

comment on function public.rechercher_apprenants(text) is
  'Recherche restreinte d''apprenants pour le rattachement à une session. Ne renvoie ni email, ni pays, ni rôle.';

revoke all on function public.rechercher_apprenants(text) from public, anon;
grant execute on function public.rechercher_apprenants(text) to authenticated;


-- ── V-07 : contenu pédagogique ───────────────────────────────────────
-- `lessons`, `course_modules`, `quizzes`, `quiz_questions` et
-- `scorm_packages` étaient lisibles par tout compte connecté, y compris
-- pour les cours non publiés : le modèle payant était contournable.

drop policy if exists lessons_read on public.lessons;
create policy lessons_lecture on public.lessons
  for select to authenticated
  using (public.peut_lire_cours(course_id));

drop policy if exists modules_read on public.course_modules;
create policy modules_lecture on public.course_modules
  for select to authenticated
  using (public.peut_lire_cours(course_id));

drop policy if exists quizzes_read on public.quizzes;
create policy quizzes_lecture on public.quizzes
  for select to authenticated
  using (public.peut_lire_cours(course_id));

drop policy if exists questions_read on public.quiz_questions;
create policy questions_lecture on public.quiz_questions
  for select to authenticated
  using (exists (
    select 1 from public.quizzes q
    where q.id = quiz_questions.quiz_id
      and public.peut_lire_cours(q.course_id)
  ));

-- `questions_write` ne vérifiait que l'existence du quiz, sans contrôler
-- que l'utilisateur en soit l'auteur : n'importe qui pouvait réécrire les
-- questions de n'importe quel quiz.
drop policy if exists questions_write on public.quiz_questions;
create policy questions_ecriture on public.quiz_questions
  for all to authenticated
  using (exists (
    select 1 from public.quizzes q
    join public.courses c on c.id = q.course_id
    where q.id = quiz_questions.quiz_id and c.author_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.quizzes q
    join public.courses c on c.id = q.course_id
    where q.id = quiz_questions.quiz_id and c.author_id = auth.uid()
  ));

drop policy if exists scorm_read on public.scorm_packages;
create policy scorm_lecture on public.scorm_packages
  for select to authenticated
  using (public.est_admin());


-- ── organizations ────────────────────────────────────────────────────
-- Lecture restreinte à sa propre organisation.

drop policy if exists orgs_read on public.organizations;
create policy orgs_lecture on public.organizations
  for select to authenticated
  using (
    public.est_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.org_id = organizations.id
    )
  );


-- ── V-05 : journal d'activité ────────────────────────────────────────
-- L'insertion était ouverte à `public` sans condition : n'importe qui,
-- même non connecté, pouvait forger des entrées et usurper un user_id.
-- Un journal falsifiable n'a aucune valeur de preuve.
--
-- L'écriture passe désormais exclusivement par le serveur
-- (app/api/journal), qui utilise la clé de service et capte l'IP réelle.

drop policy if exists "Anyone can insert activity" on public.activity_log;

-- Lecture inchangée dans son intention, réécrite via est_admin().
drop policy if exists activity_log_admin_read on public.activity_log;
create policy activity_log_lecture_admin on public.activity_log
  for select to authenticated
  using (public.est_admin());


-- ── V-11 : commandes et factures ─────────────────────────────────────
-- `orders_update_admin` n'avait pas de WITH CHECK : un administrateur
-- pouvait réattribuer une commande à un autre acheteur sans trace.

drop policy if exists orders_update_admin on public.orders;
create policy orders_maj_admin on public.orders
  for update to authenticated
  using (public.est_admin())
  with check (public.est_admin());

-- Un client ne pouvait pas consulter ses propres factures : la table
-- n'était accessible qu'au service_role.
-- `client_id` est de type text (et non uuid) : la conversion est explicite.
create policy factures_lecture_client on public.factures
  for select to authenticated
  using (client_id = auth.uid()::text or public.est_admin());

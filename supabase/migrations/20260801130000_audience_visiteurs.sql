-- =====================================================================
-- L6 — Audience : suivi des visiteurs (phase 8)
-- =====================================================================
--
-- Table distincte du journal d'audit à dessein. `activity_log` doit rester
-- une pièce de preuve à faible volume et longue conservation ; la
-- navigation, elle, produit beaucoup de lignes et se purge. Les mélanger
-- rendrait l'audit illisible et la purge dangereuse.
--
-- RGPD — l'option retenue est « IP tronquée, sans bandeau » :
--   * le dernier octet de l'adresse est retiré côté serveur avant
--     insertion, l'adresse complète n'est jamais écrite ici ;
--   * l'identifiant de session est aléatoire, non rattaché à une
--     personne, et renouvelé à chaque session de navigation ;
--   * `user_id` n'est renseigné que pour un visiteur déjà connecté, qui
--     est donc déjà identifié par ailleurs ;
--   * conservation limitée à 12 mois (fonction `purger_audience`).
-- Aucun cookie tiers, aucun traceur publicitaire.
--
-- GARANTIES : création pure. Aucune table existante n'est touchée.
-- RETOUR ARRIÈRE : drop table if exists public.site_visits;
-- =====================================================================

create table if not exists public.site_visits (
  id          bigserial primary key,
  -- Identifiant de session anonyme, généré par le navigateur. Permet de
  -- distinguer les visiteurs sans jamais les nommer.
  session_id  text not null,
  path        text not null,
  referrer    text,
  -- Adresse déjà tronquée à l'écriture : la valeur complète n'entre pas.
  ip_tronquee text,
  user_agent  text,
  pays        text,
  -- Renseigné seulement si le visiteur est connecté.
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

comment on table public.site_visits is
  'Pages vues, à des fins de mesure d''audience. IP tronquée, session anonyme, conservation 12 mois.';
comment on column public.site_visits.ip_tronquee is
  'Adresse amputée de son dernier octet (IPv4) ou de ses 80 derniers bits (IPv6). Jamais l''adresse complète.';

create index if not exists site_visits_date_idx    on public.site_visits (created_at desc);
create index if not exists site_visits_session_idx on public.site_visits (session_id, created_at desc);
create index if not exists site_visits_path_idx    on public.site_visits (path, created_at desc);

alter table public.site_visits enable row level security;

-- Lecture réservée à l'administration. L'écriture passe exclusivement par
-- le serveur (clé de service), qui seul connaît l'adresse IP réelle et
-- peut donc la tronquer avant de l'écrire.
drop policy if exists site_visits_lecture_admin on public.site_visits;
create policy site_visits_lecture_admin on public.site_visits
  for select to authenticated
  using (public.est_admin());


-- ── Purge ────────────────────────────────────────────────────────────
-- Conserver des données d'audience indéfiniment n'a ni intérêt ni base
-- légale. À planifier mensuellement (pg_cron ou tâche externe).

create or replace function public.purger_audience(mois integer default 12)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  supprimees integer;
begin
  delete from public.site_visits
   where created_at < now() - make_interval(months => mois);
  get diagnostics supprimees = row_count;
  return supprimees;
end;
$$;

comment on function public.purger_audience(integer) is
  'Supprime les visites de plus de N mois (12 par défaut). À planifier mensuellement.';

revoke all on function public.purger_audience(integer) from public, anon, authenticated;

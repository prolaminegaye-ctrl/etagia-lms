-- =====================================================================
-- L4/L5 — Demandes d'accès administrateur et Marketplace (phases 3 et 4)
-- =====================================================================
--
-- Aucun droit ne s'obtient plus automatiquement. Un utilisateur formule
-- une demande, elle est notifiée par email, et elle n'est accordée
-- qu'après validation explicite depuis une page d'administration
-- authentifiée — jamais par un simple lien.
--
-- GARANTIES : aucun DROP TABLE, aucun DELETE, aucune suppression de
-- colonne. La colonne ajoutée l'est avec une valeur par défaut, donc sans
-- réécriture de table ni verrou long.
--
-- RETOUR ARRIÈRE :
--   drop table if exists public.access_requests;
--   alter table public.profiles drop column if exists marketplace_access;
--   (la suppression de la colonne est ici sans perte : elle n'existe que
--    depuis cette migration.)
-- =====================================================================


-- ── Droit d'accès à la Marketplace ───────────────────────────────────
-- Par défaut fermé : c'est précisément l'objet de la phase 4.

alter table public.profiles
  add column if not exists marketplace_access boolean not null default false;

comment on column public.profiles.marketplace_access is
  'Accès Marketplace accordé après validation. Les administrateurs y accèdent sans ce drapeau.';

-- Personne ne doit perdre l'accès à ce qu'il a déjà acheté : tout compte
-- ayant déjà passé commande conserve son accès.
update public.profiles p
   set marketplace_access = true
 where p.marketplace_access = false
   and exists (select 1 from public.orders o where o.buyer_id = p.id);


-- ── Demandes d'accès ─────────────────────────────────────────────────

create table if not exists public.access_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  type         text not null check (type in ('admin', 'marketplace')),
  statut       text not null default 'en_attente'
               check (statut in ('en_attente', 'approuvee', 'refusee')),
  motif        text,
  -- Copiés à l'instant de la demande : ils doivent rester lisibles même si
  -- le profil change ensuite. C'est une pièce d'audit, pas une vue.
  email        text,
  full_name    text,
  ip           text,
  user_agent   text,
  created_at   timestamptz not null default now(),
  decided_at   timestamptz,
  decided_by   uuid references auth.users(id) on delete set null,
  decision_note text
);

comment on table public.access_requests is
  'Demandes d''accès administrateur ou Marketplace, avec leur décision. Pièce d''audit : les lignes ne sont jamais supprimées.';

create index if not exists access_requests_statut_idx
  on public.access_requests (statut, created_at desc);

-- Une seule demande en attente à la fois, par type et par personne :
-- empêche qu'un utilisateur inonde votre boîte mail en cliquant en boucle.
create unique index if not exists access_requests_une_en_attente
  on public.access_requests (user_id, type)
  where statut = 'en_attente';

alter table public.access_requests enable row level security;

drop policy if exists access_requests_lecture on public.access_requests;
create policy access_requests_lecture on public.access_requests
  for select to authenticated
  using (user_id = auth.uid() or public.est_admin());

-- L'insertion et la décision passent par le serveur (clé de service), qui
-- pose l'identité, l'IP et l'horodatage. Aucune écriture directe depuis le
-- navigateur : c'est ce qui rendait le journal d'activité falsifiable.

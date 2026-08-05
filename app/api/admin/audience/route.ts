// app/api/admin/audience/route.ts
// GET — synthèse d'audience et annuaire des comptes, réservé au propriétaire.
//
// L'agrégation se fait ici, côté serveur : renvoyer la table brute au
// navigateur exposerait des milliers de lignes pour afficher trois chiffres.

import { NextRequest, NextResponse } from 'next/server'
import { exigerAdmin } from '@/lib/serverAuth'

type Visite = {
  session_id: string
  path: string
  referrer: string | null
  pays: string | null
  user_id: string | null
  created_at: string
}

function compter<T extends string>(valeurs: (T | null)[]): Array<{ cle: string; n: number }> {
  const totaux = new Map<string, number>()
  for (const v of valeurs) {
    if (!v) continue
    totaux.set(v, (totaux.get(v) ?? 0) + 1)
  }
  return [...totaux.entries()]
    .map(([cle, n]) => ({ cle, n }))
    .sort((a, b) => b.n - a.n)
}

export async function GET(req: NextRequest) {
  const auth = await exigerAdmin(req)
  if ('erreur' in auth) return auth.erreur
  const admin = auth.identite.client

  const jours = Math.min(Math.max(Number(req.nextUrl.searchParams.get('jours') ?? 30), 1), 365)
  const depuis = new Date(Date.now() - jours * 24 * 60 * 60 * 1000).toISOString()

  const [visitesRes, profilsRes, journalRes] = await Promise.all([
    admin
      .from('site_visits')
      .select('session_id, path, referrer, pays, user_id, created_at')
      .gte('created_at', depuis)
      .order('created_at', { ascending: false })
      .limit(20_000),
    admin
      .from('profiles')
      .select('id, full_name, role, marketplace_access, last_active, created_at')
      .order('created_at', { ascending: false })
      .limit(500),
    admin
      .from('activity_log')
      .select('event, email, created_at, ip')
      .order('created_at', { ascending: false })
      .limit(40),
  ])

  if (visitesRes.error || profilsRes.error) {
    console.error('[audience] lecture refusée', visitesRes.error ?? profilsRes.error)
    return NextResponse.json({ error: 'Lecture impossible.' }, { status: 500 })
  }

  const visites = (visitesRes.data ?? []) as Visite[]
  const profils = profilsRes.data ?? []

  // Un « visiteur » = une session anonyme distincte, jamais une personne.
  const sessions = new Set(visites.map((v) => v.session_id))
  const sessionsConnectees = new Set(visites.filter((v) => v.user_id).map((v) => v.session_id))

  // Répartition par jour, pour la courbe.
  const parJour = new Map<string, { vues: number; sessions: Set<string> }>()
  for (const v of visites) {
    const jour = v.created_at.slice(0, 10)
    const entree = parJour.get(jour) ?? { vues: 0, sessions: new Set<string>() }
    entree.vues++
    entree.sessions.add(v.session_id)
    parJour.set(jour, entree)
  }

  const courbe = [...parJour.entries()]
    .map(([jour, e]) => ({ jour, vues: e.vues, visiteurs: e.sessions.size }))
    .sort((a, b) => a.jour.localeCompare(b.jour))

  const il_y_a_24h = Date.now() - 24 * 60 * 60 * 1000

  return NextResponse.json({
    periode: { jours, depuis },
    resume: {
      pagesVues: visites.length,
      visiteurs: sessions.size,
      visiteursConnectes: sessionsConnectees.size,
      visiteursAnonymes: sessions.size - sessionsConnectees.size,
      comptes: profils.length,
      comptesActifs24h: profils.filter(
        (p) => p.last_active && new Date(p.last_active).getTime() > il_y_a_24h,
      ).length,
    },
    courbe,
    pages: compter(visites.map((v) => v.path)).slice(0, 15),
    pays: compter(visites.map((v) => v.pays)).slice(0, 12),
    origines: compter(visites.map((v) => v.referrer)).slice(0, 10),
    comptes: profils,
    journal: journalRes.data ?? [],
  })
}

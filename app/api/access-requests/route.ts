// app/api/access-requests/route.ts
// POST — un utilisateur formule une demande d'accès.
// GET  — l'administrateur liste les demandes.
//
// Aucun droit n'est accordé ici : la demande est enregistrée et notifiée,
// rien de plus. L'attribution se fait dans PATCH /api/access-requests/[id],
// après décision explicite d'un administrateur connecté.

import { NextRequest, NextResponse } from 'next/server'
import { exigerUtilisateur, exigerAdmin, ipDeLaRequete, clientService } from '@/lib/serverAuth'
import { notifierNouvelleDemande } from '@/lib/email/accessRequests'

const TYPES = ['admin', 'marketplace'] as const
type TypeDemande = (typeof TYPES)[number]

export async function POST(req: NextRequest) {
  const auth = await exigerUtilisateur(req)
  if ('erreur' in auth) return auth.erreur
  const { identite } = auth

  const corps = (await req.json().catch(() => ({}))) as { type?: string; motif?: string }
  const type = corps.type as TypeDemande | undefined
  if (!type || !TYPES.includes(type)) {
    return NextResponse.json({ error: 'Type de demande inconnu.' }, { status: 400 })
  }

  const admin = clientService()

  // Le droit est peut-être déjà acquis : inutile de vous déranger.
  const { data: profil } = await admin
    .from('profiles')
    .select('full_name, role, marketplace_access')
    .eq('id', identite.id)
    .maybeSingle()

  if (type === 'admin' && profil?.role === 'admin') {
    return NextResponse.json({ error: 'Vous disposez déjà de cet accès.' }, { status: 409 })
  }
  if (type === 'marketplace' && (profil?.marketplace_access || profil?.role === 'admin')) {
    return NextResponse.json({ error: 'Vous disposez déjà de cet accès.' }, { status: 409 })
  }

  const ip = ipDeLaRequete(req)
  const userAgent = req.headers.get('user-agent')
  const motif = (corps.motif ?? '').trim().slice(0, 1000) || null

  const { data: demande, error } = await admin
    .from('access_requests')
    .insert({
      user_id: identite.id,
      type,
      motif,
      email: identite.email,
      full_name: profil?.full_name ?? null,
      ip,
      user_agent: userAgent,
    })
    .select('id, created_at')
    .single()

  if (error) {
    // L'index unique partiel garantit une seule demande en attente par type.
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Une demande est déjà en attente pour cet accès.' },
        { status: 409 },
      )
    }
    console.error('[access-requests] insertion refusée', error)
    return NextResponse.json({ error: "La demande n'a pas pu être enregistrée." }, { status: 500 })
  }

  // La trace d'audit est posée avant l'email : elle ne doit pas dépendre
  // de la disponibilité du service d'envoi.
  await admin.from('activity_log').insert({
    user_id: identite.id,
    email: identite.email,
    event: type === 'admin' ? 'admin_access_requested' : 'marketplace_access_requested',
    metadata: { request_id: demande.id, motif },
    ip,
    user_agent: userAgent,
  })

  const emailEnvoye = await notifierNouvelleDemande({
    type,
    fullName: profil?.full_name ?? null,
    email: identite.email,
    userId: identite.id,
    motif,
    ip,
    userAgent,
    createdAt: new Date(demande.created_at),
  })

  // Un échec d'email ne perd pas la demande : elle reste visible dans
  // /admin/demandes, qui fait autorité.
  return NextResponse.json({ ok: true, id: demande.id, emailEnvoye })
}

export async function GET(req: NextRequest) {
  const auth = await exigerAdmin(req)
  if ('erreur' in auth) return auth.erreur

  const statut = req.nextUrl.searchParams.get('statut')
  let requete = auth.identite.client
    .from('access_requests')
    .select('id, user_id, type, statut, motif, email, full_name, ip, user_agent, created_at, decided_at, decision_note')
    .order('created_at', { ascending: false })
    .limit(200)

  if (statut) requete = requete.eq('statut', statut)

  const { data, error } = await requete
  if (error) {
    console.error('[access-requests] lecture refusée', error)
    return NextResponse.json({ error: 'Lecture impossible.' }, { status: 500 })
  }
  return NextResponse.json({ demandes: data ?? [] })
}

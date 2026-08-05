// app/api/access-requests/[id]/route.ts
// PATCH — décision d'un administrateur sur une demande d'accès.
//
// C'est le seul endroit de l'application où un rôle administrateur peut
// être attribué. La décision exige une session administrateur vérifiée
// côté serveur : ni un lien d'email, ni une manipulation du navigateur,
// ni une requête forgée ne peuvent l'obtenir.

import { NextRequest, NextResponse } from 'next/server'
import { exigerAdmin, ipDeLaRequete } from '@/lib/serverAuth'
import { notifierDecision } from '@/lib/email/accessRequests'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await exigerAdmin(req)
  if ('erreur' in auth) return auth.erreur
  const { identite } = auth
  const admin = identite.client

  const { id } = await params
  const corps = (await req.json().catch(() => ({}))) as { decision?: string; note?: string }
  const decision = corps.decision
  if (decision !== 'approuver' && decision !== 'refuser') {
    return NextResponse.json({ error: 'Décision inconnue.' }, { status: 400 })
  }

  const { data: demande } = await admin
    .from('access_requests')
    .select('id, user_id, type, statut, email')
    .eq('id', id)
    .maybeSingle()

  if (!demande) {
    return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 })
  }
  if (demande.statut !== 'en_attente') {
    // Évite qu'un double clic ou un rechargement rejoue la décision.
    return NextResponse.json({ error: 'Cette demande a déjà été traitée.' }, { status: 409 })
  }

  const approuvee = decision === 'approuver'
  const note = (corps.note ?? '').trim().slice(0, 1000) || null

  // Le droit est attribué AVANT de clore la demande : si l'attribution
  // échoue, la demande reste en attente et reste donc traitable.
  if (approuvee) {
    const champ = demande.type === 'admin'
      ? { role: 'admin' }
      : { marketplace_access: true }

    const { error } = await admin.from('profiles').update(champ).eq('id', demande.user_id)
    if (error) {
      console.error('[access-requests] attribution refusée', error)
      return NextResponse.json(
        { error: "L'accès n'a pas pu être attribué. La demande reste en attente." },
        { status: 500 },
      )
    }
  }

  await admin
    .from('access_requests')
    .update({
      statut: approuvee ? 'approuvee' : 'refusee',
      decided_at: new Date().toISOString(),
      decided_by: identite.id,
      decision_note: note,
    })
    .eq('id', id)

  await admin.from('activity_log').insert({
    user_id: identite.id,
    email: identite.email,
    event: approuvee ? 'access_granted' : 'access_denied',
    metadata: {
      request_id: id,
      type: demande.type,
      beneficiaire: demande.user_id,
      note,
    },
    ip: ipDeLaRequete(req),
    user_agent: req.headers.get('user-agent'),
  })

  if (demande.email) {
    await notifierDecision(demande.email, demande.type as 'admin' | 'marketplace', approuvee, note)
  }

  return NextResponse.json({ ok: true, statut: approuvee ? 'approuvee' : 'refusee' })
}

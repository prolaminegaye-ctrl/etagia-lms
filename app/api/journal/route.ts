// app/api/journal/route.ts
// POST /api/journal — écriture du journal d'audit, côté serveur uniquement.
//
// Avant cette route, `activity_log` acceptait des insertions depuis le
// navigateur avec la clé publique et une politique `WITH CHECK (true)` :
// n'importe qui, même non connecté, pouvait forger des entrées et usurper
// un `user_id` (audit V-05). Un journal falsifiable n'a aucune valeur de
// preuve — ce qui vidait de son sens l'exigence de traçabilité.
//
// Ici, trois choses ne peuvent plus être falsifiées par le client :
//   * l'identité — déduite du jeton vérifié auprès de Supabase ;
//   * l'adresse IP — lue dans les en-têtes de la plateforme ;
//   * l'horodatage — posé par la base.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/** Événements acceptés. Une valeur inconnue est refusée plutôt que journalisée. */
const EVENEMENTS = [
  'login', 'logout', 'signup',
  'course_started', 'course_completed',
  'order_created', 'order_confirmed',
  'session_created', 'session_member_added', 'attendance_marked',
  'admin_access_requested', 'marketplace_access_requested',
  'access_granted', 'access_denied',
  'page_view',
] as const
type Evenement = (typeof EVENEMENTS)[number]

/**
 * Événements de sécurité : l'adresse IP complète est conservée, car elle
 * sert à établir qui a agi en cas de litige ou d'incident.
 * Pour tout le reste — navigation notamment — l'IP est tronquée.
 */
const EVENEMENTS_SECURITE = new Set<Evenement>([
  'login', 'logout', 'signup',
  'admin_access_requested', 'marketplace_access_requested',
  'access_granted', 'access_denied',
])

/**
 * Tronque l'adresse pour qu'elle ne désigne plus une personne :
 * dernier octet en IPv4, 80 derniers bits en IPv6. Une IP est une donnée
 * personnelle au sens du RGPD ; la conserver en clair pour de la simple
 * navigation demanderait une base légale que nous n'avons pas.
 */
function anonymiserIp(ip: string): string {
  if (ip.includes(':')) {
    const blocs = ip.split(':')
    return blocs.slice(0, 3).join(':') + '::'
  }
  const octets = ip.split('.')
  if (octets.length !== 4) return 'inconnue'
  return `${octets[0]}.${octets[1]}.${octets[2]}.0`
}

function ipDeLaRequete(req: NextRequest): string {
  const brut = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? ''
  return brut.split(',')[0].trim() || 'inconnue'
}

function clientService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    const corps = (await req.json().catch(() => ({}))) as {
      event?: string
      metadata?: Record<string, unknown>
    }

    const event = corps.event as Evenement | undefined
    if (!event || !EVENEMENTS.includes(event)) {
      return NextResponse.json({ error: 'Événement inconnu.' }, { status: 400 })
    }

    // Identité : jamais celle annoncée par le client, toujours celle du jeton.
    const entete = req.headers.get('authorization') ?? ''
    let userId: string | null = null
    let email: string | null = null

    if (entete.startsWith('Bearer ')) {
      const { data } = await clientService().auth.getUser(entete.slice(7))
      if (data?.user) {
        userId = data.user.id
        email = data.user.email ?? null
      }
    }

    const ipReelle = ipDeLaRequete(req)
    const ip = EVENEMENTS_SECURITE.has(event) ? ipReelle : anonymiserIp(ipReelle)

    await clientService().from('activity_log').insert({
      user_id: userId,
      email,
      event,
      metadata: corps.metadata ?? {},
      ip,
      user_agent: req.headers.get('user-agent'),
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Le journal ne doit jamais casser le parcours utilisateur : on répond
    // en succès côté client, l'incident restant visible dans les logs Vercel.
    return NextResponse.json({ ok: false })
  }
}

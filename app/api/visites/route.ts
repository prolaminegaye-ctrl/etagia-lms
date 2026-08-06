// app/api/visites/route.ts
// POST /api/visites — enregistre une page vue.
//
// Le navigateur ne connaît pas sa propre adresse IP publique : c'est le
// serveur qui la lit, et qui la tronque AVANT insertion. L'adresse
// complète n'est donc jamais écrite en base pour de la navigation.
//
// Route publique par nécessité — l'objet est justement de compter les
// visiteurs non connectés. Elle n'écrit que dans `site_visits`, ne lit
// rien, et ne renvoie aucune donnée.

import { NextRequest, NextResponse } from 'next/server'
import { clientService, ipDeLaRequete } from '@/lib/serverAuth'
import { cheminPropre, origineReferent, tronquerIp } from '@/lib/audience/anonymisation'

/** Pages vues acceptées par minute et par adresse, pour éviter le gonflage artificiel. */
const PLAFOND_PAR_MINUTE = 40
const compteurs = new Map<string, { n: number; fin: number }>()

function trafficExcessif(ip: string): boolean {
  const maintenant = Date.now()
  if (compteurs.size > 5_000) compteurs.clear()
  const seau = compteurs.get(ip)
  if (!seau || maintenant > seau.fin) {
    compteurs.set(ip, { n: 1, fin: maintenant + 60_000 })
    return false
  }
  seau.n++
  return seau.n > PLAFOND_PAR_MINUTE
}

export async function POST(req: NextRequest) {
  try {
    const ipReelle = ipDeLaRequete(req)
    if (trafficExcessif(ipReelle)) return NextResponse.json({ ok: false })

    const corps = (await req.json().catch(() => ({}))) as {
      sessionId?: string
      path?: string
      referrer?: string
    }

    const path = cheminPropre(corps.path)
    const sessionId = typeof corps.sessionId === 'string' ? corps.sessionId.slice(0, 64) : ''
    if (!path || !sessionId) return NextResponse.json({ ok: false })

    // Un visiteur connecté est rattaché à son compte ; sinon la ligne
    // reste anonyme. On ne fait jamais confiance à un identifiant annoncé
    // par le client : il est déduit du jeton, ou absent.
    const admin = clientService()
    let userId: string | null = null
    const entete = req.headers.get('authorization') ?? ''
    if (entete.startsWith('Bearer ')) {
      const { data } = await admin.auth.getUser(entete.slice(7))
      userId = data?.user?.id ?? null
    }

    await admin.from('site_visits').insert({
      session_id: sessionId,
      path,
      referrer: origineReferent(corps.referrer),
      ip_tronquee: tronquerIp(ipReelle),
      user_agent: (req.headers.get('user-agent') ?? '').slice(0, 400) || null,
      // En-tête géographique posé par Vercel ; absent en local.
      pays: req.headers.get('x-vercel-ip-country'),
      user_id: userId,
    })

    return NextResponse.json({ ok: true })
  } catch {
    // La mesure d'audience ne doit jamais perturber la navigation.
    return NextResponse.json({ ok: false })
  }
}

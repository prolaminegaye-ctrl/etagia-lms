// lib/serverAuth.ts — Vérification d'identité côté serveur
//
// La session ETAGIA est stockée en `localStorage` et non en cookie : le
// middleware Next.js ne peut donc pas la lire, et une garde d'interface
// s'exécute forcément dans le navigateur. Ces aides déplacent le contrôle
// là où il ne peut pas être contourné — dans la route API elle-même.
//
// Toute route qui lit ou modifie des données doit passer par ici.

import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type Identite = {
  id: string
  email: string | null
  role: string
  client: SupabaseClient
}

/** Client à privilèges, réservé au serveur. Ne jamais l'exposer au navigateur. */
export function clientService(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/**
 * Identité de l'appelant, déduite du jeton et vérifiée auprès de Supabase.
 * Renvoie `null` si le jeton est absent, expiré ou invalide — on ne fait
 * jamais confiance à ce que le client déclare être.
 */
export async function identiteDeLaRequete(req: NextRequest): Promise<Identite | null> {
  const entete = req.headers.get('authorization') ?? ''
  if (!entete.startsWith('Bearer ')) return null

  const client = clientService()
  const { data, error } = await client.auth.getUser(entete.slice(7))
  if (error || !data?.user) return null

  const { data: profil } = await client
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  return {
    id: data.user.id,
    email: data.user.email ?? null,
    role: profil?.role ?? 'apprenant',
    client,
  }
}

export const refusNonConnecte = () =>
  NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

export const refusNonAutorise = () =>
  NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 })

/**
 * Exige une session valide. Renvoie soit l'identité, soit la réponse
 * d'erreur à retourner telle quelle :
 *
 *     const r = await exigerUtilisateur(req)
 *     if ('erreur' in r) return r.erreur
 *     // r.identite est garantie
 */
export async function exigerUtilisateur(
  req: NextRequest,
): Promise<{ identite: Identite } | { erreur: NextResponse }> {
  const identite = await identiteDeLaRequete(req)
  return identite ? { identite } : { erreur: refusNonConnecte() }
}

/** Exige une session valide dont le profil porte le rôle administrateur. */
export async function exigerAdmin(
  req: NextRequest,
): Promise<{ identite: Identite } | { erreur: NextResponse }> {
  const identite = await identiteDeLaRequete(req)
  if (!identite) return { erreur: refusNonConnecte() }
  if (identite.role !== 'admin') return { erreur: refusNonAutorise() }
  return { identite }
}

/** Adresse IP réelle vue par la plateforme, jamais celle annoncée par le client. */
export function ipDeLaRequete(req: NextRequest): string {
  const brut = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? ''
  return brut.split(',')[0].trim() || 'inconnue'
}

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

/**
 * Emails toujours administrateurs, même sans rôle en base.
 * Garantit que le propriétaire de la plateforme ne peut jamais être bloqué.
 */
const ADMIN_EMAILS = ['prolaminegaye@gmail.com', 'admin@etagia-academie.com']

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Autorise une requête admin de deux façons :
 * 1. Session Supabase (Authorization: Bearer <jwt>) d'un compte dont le
 *    profil a role='admin' ou dont l'email figure dans ADMIN_EMAILS —
 *    c'est le chemin normal : être connecté au site suffit.
 * 2. Ancien jeton x-admin-token (compatibilité, si ADMIN_TOKEN est défini).
 */
export async function estRequeteAdmin(req: NextRequest): Promise<boolean> {
  // Chemin 1 : session utilisateur
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const jwt = authHeader.slice(7)
    try {
      const admin = serviceClient()
      const { data, error } = await admin.auth.getUser(jwt)
      const user = data?.user
      if (!error && user) {
        const email = (user.email ?? '').toLowerCase()
        if (ADMIN_EMAILS.includes(email)) return true
        const { data: profile } = await admin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()
        if (profile?.role === 'admin') return true
      }
    } catch {
      // jeton invalide : on tombe sur le chemin 2
    }
  }

  // Chemin 2 : jeton hérité
  const attendu = process.env.ADMIN_TOKEN
  const fourni = req.headers.get('x-admin-token')
  return !!attendu && !!fourni && safeEqual(fourni, attendu)
}

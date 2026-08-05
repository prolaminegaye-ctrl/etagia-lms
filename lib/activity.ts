import { getSupabase } from '@/lib/supabase/client'

export type ActivityEvent =
  | 'login'
  | 'signup'
  | 'logout'
  | 'course_started'
  | 'course_completed'
  | 'order_created'
  | 'order_confirmed'
  | 'session_created'
  | 'session_member_added'
  | 'attendance_marked'
  | 'admin_access_requested'
  | 'marketplace_access_requested'
  | 'access_granted'
  | 'access_denied'
  | 'page_view'

/**
 * Journalise un événement d'audit.
 *
 * L'écriture passe par `/api/journal`, jamais directement par Supabase :
 * le serveur y rétablit l'identité depuis le jeton et y ajoute l'adresse IP,
 * deux informations que le navigateur ne peut ni fournir honnêtement ni
 * falsifier. Auparavant l'insertion se faisait côté client avec la clé
 * publique et une politique sans condition, ce qui rendait le journal
 * forgeable par n'importe qui (audit V-05).
 *
 * Best-effort : ne bloque jamais le flux utilisateur si l'écriture échoue.
 */
export async function logActivity(
  event: ActivityEvent,
  metadata: Record<string, unknown> = {},
) {
  try {
    const { data } = await getSupabase().auth.getSession()
    const jeton = data.session?.access_token

    await fetch('/api/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
      },
      body: JSON.stringify({ event, metadata }),
      keepalive: true, // survit à une navigation immédiate (déconnexion)
    })
  } catch {
    // Le suivi d'activité ne doit jamais casser l'expérience utilisateur.
  }
}

/** Met à jour profiles.last_active pour le calcul de présence ("qui est connecté"). */
export async function touchPresence() {
  try {
    const supabase = getSupabase()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return
    await supabase.from('profiles').update({ last_active: new Date().toISOString() }).eq('id', user.id)
  } catch {
    // best-effort
  }
}

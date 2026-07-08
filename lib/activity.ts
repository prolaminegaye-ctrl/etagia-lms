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

/**
 * Journalise un événement dans activity_log pour la traçabilité admin
 * ("qui a fait quoi, quand"). Best-effort : ne bloque jamais le flux
 * utilisateur si l'écriture échoue.
 */
export async function logActivity(event: ActivityEvent, metadata: Record<string, unknown> = {}) {
  try {
    const supabase = getSupabase()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return
    await supabase.from('activity_log').insert({
      user_id: user.id,
      email: user.email,
      event,
      metadata,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
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

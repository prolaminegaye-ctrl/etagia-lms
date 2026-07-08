import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function verifierAdmin(req: NextRequest): Promise<boolean> {
  const attendu = process.env.ADMIN_TOKEN
  const fourni = req.headers.get('x-admin-token')
  return !!attendu && !!fourni && safeEqual(fourni, attendu)
}

export async function GET(req: NextRequest) {
  if (!(await verifierAdmin(req))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = getSupabase()

  const [{ data: authUsers, error: authError }, { data: profiles, error: profilesError }, { data: orgs }, { data: enrollments }] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from('profiles').select('id, org_id, full_name, role, last_active, streak_days, created_at'),
    supabase.from('organizations').select('id, name'),
    supabase.from('enrollments').select('user_id'),
  ])

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
  if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 })

  const orgMap = new Map((orgs ?? []).map((o) => [o.id, o.name]))
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))
  const courseCountByUser = new Map<string, number>()
  for (const e of enrollments ?? []) {
    courseCountByUser.set(e.user_id, (courseCountByUser.get(e.user_id) ?? 0) + 1)
  }

  const users = (authUsers?.users ?? []).map((u) => {
    const profile = profileMap.get(u.id)
    const lastActive = profile?.last_active ? new Date(profile.last_active).getTime() : null
    const online = lastActive ? Date.now() - lastActive < 5 * 60 * 1000 : false
    return {
      id: u.id,
      email: u.email,
      name: profile?.full_name || u.user_metadata?.full_name || u.email?.split('@')[0] || 'Utilisateur',
      role: profile?.role || u.user_metadata?.statut || 'apprenant',
      org: profile ? orgMap.get(profile.org_id) ?? '—' : '—',
      courses: courseCountByUser.get(u.id) ?? 0,
      joined: u.created_at,
      lastActive: profile?.last_active ?? null,
      online,
      confirmed: Boolean(u.email_confirmed_at),
    }
  })

  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  if (!(await verifierAdmin(req))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { userId, role } = (await req.json()) as { userId: string; role: string }
  if (!userId || !role) return NextResponse.json({ error: 'userId et role requis' }, { status: 400 })

  const supabase = getSupabase()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { renvoyerFacture } from '@/lib/facturation/sender'
import type { Facture } from '@/lib/facturation/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifierAdmin(req: NextRequest): Promise<boolean> {
  return req.headers.get('x-admin-token') === process.env.ADMIN_TOKEN
}

export async function GET(req: NextRequest) {
  if (!(await verifierAdmin(req))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const statut  = searchParams.get('statut')
  const type    = searchParams.get('type')
  const page    = parseInt(searchParams.get('page') ?? '1')
  const limit   = parseInt(searchParams.get('limit') ?? '20')
  const from    = (page - 1) * limit
  const to      = from + limit - 1

  let query = supabase
    .from('factures')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (statut) query = query.eq('statut', statut)
  if (type)   query = query.eq('type', type)

  const { data: factures, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    factures: factures ?? [],
    pagination: { page, limit, total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) },
  })
}

export async function POST(req: NextRequest) {
  if (!(await verifierAdmin(req))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { factureId, action } = await req.json() as { factureId: string; action: string }
  if (!factureId) return NextResponse.json({ error: 'factureId requis' }, { status: 400 })

  const { data: facture, error } = await supabase
    .from('factures')
    .select('*')
    .eq('id', factureId)
    .single()

  if (error || !facture) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })

  if (action === 'renvoyer_email') {
    const res = await renvoyerFacture(facture as Facture)
    if (!res.succes) return NextResponse.json({ error: res.erreur }, { status: 500 })
    return NextResponse.json({ success: true, message: `Facture ${facture.numero} renvoyée`, emailId: res.emailId })
  }

  if (action === 'annuler') {
    await supabase.from('factures').update({ statut: 'annulee' }).eq('id', factureId)
    return NextResponse.json({ success: true, message: `Facture annulée` })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}

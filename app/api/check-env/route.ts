import { NextRequest, NextResponse } from 'next/server'
import { safeEqual } from '@/lib/security'

// Route d'administration — le middleware la protège déjà en production,
// mais on revérifie ici (défense en profondeur).
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const attendu = process.env.ADMIN_SECRET
    const fourni  = req.headers.get('x-admin-secret')
    if (!attendu || !fourni || !safeEqual(fourni, attendu)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
  }

  return NextResponse.json({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
      ? '✅ Présente'
      : '❌ MANQUANTE — ajoutez-la dans Vercel Settings > Environment Variables',
    SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Présente' : '❌ MANQUANTE',
    BBB_URL:           process.env.BBB_URL           ? '✅ Présente' : '⚠️  Non configuré (optionnel)',
    LTI_PRIVATE_KEY:   process.env.LTI_PRIVATE_KEY_B64 ? '✅ Présente' : '⚠️  Non configuré (optionnel)',
    NODE_ENV:          process.env.NODE_ENV,
    timestamp:         new Date().toISOString(),
  })
}

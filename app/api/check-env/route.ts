import { NextResponse } from 'next/server'

// ⚠️  Route d'administration — protégée par middleware en production
export async function GET() {
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

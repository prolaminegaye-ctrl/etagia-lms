import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
      ? `✅ Présente — commence par: ${process.env.ANTHROPIC_API_KEY.slice(0,18)}...`
      : '❌ MANQUANTE — ajoutez-la dans Vercel Settings > Environment Variables',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}

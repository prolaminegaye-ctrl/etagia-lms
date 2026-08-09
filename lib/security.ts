// lib/security.ts — Gardes de sécurité partagées pour les routes API
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

/**
 * N'autorise que les requêtes émises depuis le site lui-même (même origine).
 * Bloque les appels cross-site et les scripts tiers qui consommeraient
 * les crédits API (Anthropic, BBB…) à nos frais.
 */
export function sameOriginOnly(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin')
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const refus = NextResponse.json({ error: 'Origine non autorisée' }, { status: 403 })
  if (!origin || !host) return refus
  try {
    if (new URL(origin).host !== host.split(',')[0].trim()) return refus
  } catch {
    return refus
  }
  return null
}

const buckets = new Map<string, { count: number; reset: number }>()

/**
 * Rate limiting simple par IP (mémoire de l'instance serverless).
 * Suffisant pour freiner les abus ; pour une garantie forte, brancher
 * un store partagé (Upstash/Redis).
 */
export function rateLimit(req: NextRequest, limit = 20, windowMs = 60_000): NextResponse | null {
  const ip = (req.headers.get('x-forwarded-for') ?? 'inconnue').split(',')[0].trim()
  const now = Date.now()
  if (buckets.size > 10_000) buckets.clear()
  const b = buckets.get(ip)
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + windowMs })
    return null
  }
  b.count++
  if (b.count > limit) {
    return NextResponse.json(
      { error: 'Trop de requêtes — réessayez dans une minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((b.reset - now) / 1000)) } },
    )
  }
  return null
}

/**
 * Coupe-circuit global pour les fonctionnalités IA (AI Tutor, chat marketplace,
 * générateur de cours). Mettre à `false` pour les réactiver.
 * Objectif : éviter toute consommation de crédits Anthropic/OpenAI tant que
 * l'accès n'est pas restreint aux utilisateurs authentifiés + quotas.
 */
export const AI_FEATURES_DISABLED = false

export function aiDisabledResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "Cette fonctionnalité IA est temporairement indisponible.",
      code: 'AI_TEMPORARILY_DISABLED',
    },
    { status: 503 },
  )
}

/** Comparaison à temps constant (évite les attaques par timing sur les tokens). */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

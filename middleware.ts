import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Bloquer /api/check-env en production sans token admin ──────────────────
  if (pathname === '/api/check-env') {
    if (process.env.NODE_ENV === 'production') {
      const secret = request.headers.get('x-admin-secret')
      if (!secret || secret !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
    }
  }

  const response = NextResponse.next()

  // ── Security headers sur toutes les réponses ───────────────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PLATFORM_URL   = process.env.NEXT_PUBLIC_APP_URL || 'https://etagia-lms.vercel.app'
const PRIVATE_KEY_B64 = process.env.LTI_PRIVATE_KEY_B64 || ''

// Doit correspondre à ce que /api/lti/register retourne
const DEPLOYMENT_ID = 'etagia-deploy-001'
const CLIENT_ID     = 'etagia-edugears-client-001'

function getPrivateKey(): string {
  if (PRIVATE_KEY_B64) {
    return Buffer.from(PRIVATE_KEY_B64, 'base64').toString('utf-8')
  }
  throw new Error('LTI_PRIVATE_KEY_B64 environment variable not set')
}

function base64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf) : buf
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function signJWT(payload: Record<string, unknown>): string {
  const header = { alg: 'RS256', typ: 'JWT', kid: 'etagia-lms-2026' }
  const h = base64url(JSON.stringify(header))
  const p = base64url(JSON.stringify(payload))
  const key = getPrivateKey()
  const sig = crypto.createSign('RSA-SHA256').update(`${h}.${p}`).sign(key)
  return `${h}.${p}.${base64url(sig)}`
}

// ─────────────────────────────────────────────────────────────────────────────
// GET/POST — OIDC Authentication Request (étape 3 du flux LTI 1.3)
// EduGears nous envoie : client_id, redirect_uri, login_hint, nonce, state
// On signe un id_token RS256 et on POST vers redirect_uri
// ─────────────────────────────────────────────────────────────────────────────
async function handleAuth(req: NextRequest) {
  const params = req.method === 'GET'
    ? new URL(req.url).searchParams
    : new URLSearchParams(await req.text())

  const clientId       = params.get('client_id')      || CLIENT_ID
  const redirectUri    = params.get('redirect_uri')   || ''
  const loginHint      = params.get('login_hint')     || 'user-001'
  const ltiMessageHint = params.get('lti_message_hint') || 'resource-001'
  const state          = params.get('state')          || ''
  const nonce          = params.get('nonce')          || crypto.randomUUID()

  if (!redirectUri) {
    return NextResponse.json({ error: 'missing redirect_uri' }, { status: 400 })
  }

  try {
    const now = Math.floor(Date.now() / 1000)

    const payload: Record<string, unknown> = {
      // ── Claims OIDC standard ────────────────────────────────────────
      iss:          PLATFORM_URL,
      sub:          loginHint,
      aud:          clientId,
      iat:          now,
      exp:          now + 3600,
      nonce,

      // ── Claims LTI 1.3 obligatoires ────────────────────────────────
      'https://purl.imsglobal.org/spec/lti/claim/message_type':
        'LtiResourceLinkRequest',
      'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',

      // deployment_id = cohérent avec /api/lti/register
      'https://purl.imsglobal.org/spec/lti/claim/deployment_id': DEPLOYMENT_ID,

      'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': redirectUri,

      'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
        id:    ltiMessageHint || 'resource-001',
        title: 'ETAGIA LMS Resource',
      },

      'https://purl.imsglobal.org/spec/lti/claim/roles': [
        'http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor',
      ],

      'https://purl.imsglobal.org/spec/lti/claim/context': {
        id:    'course-etagia-001',
        type:  ['http://purl.imsglobal.org/vocab/lis/v2/course#CourseOffering'],
        label: 'ETAGIA',
        title: 'ETAGIA LMS Learning Context',
      },

      'https://purl.imsglobal.org/spec/lti/claim/tool_platform': {
        guid:                 'etagia-lms',
        name:                 'ETAGIA LMS',
        description:          'Plateforme LMS EdTech — Afrique francophone',
        url:                  PLATFORM_URL,
        product_family_code:  'etagia-lms',
        version:              '1.0.0',
      },

      'https://purl.imsglobal.org/spec/lti/claim/launch_presentation': {
        document_target: 'iframe',
        locale:          'fr-FR',
      },

      // ── Identité utilisateur ────────────────────────────────────────
      given_name:  'Lamine',
      family_name: 'Gaye',
      email:       'prolaminegaye@gmail.com',
      name:        'Lamine Gaye',
    }

    const idToken = signJWT(payload)

    // Auto-submit form POST vers redirect_uri (launch URL d'EduGears)
    const formUrl = new URL(redirectUri)
    const html = `<!DOCTYPE html>
<html>
<head><title>LTI Launch — ETAGIA LMS</title></head>
<body>
<form id="lti" method="POST" action="${formUrl.origin + formUrl.pathname}">
  <input type="hidden" name="id_token" value="${idToken}" />
  <input type="hidden" name="state"    value="${state}"   />
</form>
<script>document.getElementById('lti').submit();</script>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type':                'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[LTI Auth] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest)  { return handleAuth(req) }
export async function POST(req: NextRequest) { return handleAuth(req) }

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

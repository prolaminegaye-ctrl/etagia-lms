import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PLATFORM_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://etagia-lms.vercel.app'
const PRIVATE_KEY_B64 = process.env.LTI_PRIVATE_KEY_B64 || ''

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

// GET — OIDC auth request from tool (step 3 of LTI 1.3 flow)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const scope         = searchParams.get('scope') || 'openid'
  const responseType  = searchParams.get('response_type') || 'id_token'
  const clientId      = searchParams.get('client_id') || ''
  const redirectUri   = searchParams.get('redirect_uri') || ''
  const loginHint     = searchParams.get('login_hint') || ''
  const ltiMessageHint= searchParams.get('lti_message_hint') || ''
  const state         = searchParams.get('state') || ''
  const nonce         = searchParams.get('nonce') || crypto.randomUUID()

  if (!redirectUri) {
    return NextResponse.json({ error: 'missing redirect_uri' }, { status: 400 })
  }

  try {
    const now = Math.floor(Date.now() / 1000)
    const payload: Record<string, unknown> = {
      iss: PLATFORM_URL,
      sub: loginHint || 'user_lamine',
      aud: clientId,
      iat: now,
      exp: now + 3600,
      nonce,
      'https://purl.imsglobal.org/spec/lti/claim/message_type': 'LtiResourceLinkRequest',
      'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
      'https://purl.imsglobal.org/spec/lti/claim/deployment_id': 'etagia-deploy-1',
      'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': redirectUri,
      'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
        id: ltiMessageHint || 'resource-1',
        title: 'ETAGIA LMS Resource',
      },
      'https://purl.imsglobal.org/spec/lti/claim/roles': [
        'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner',
      ],
      'https://purl.imsglobal.org/spec/lti/claim/context': {
        id: 'course-1',
        type: ['http://purl.imsglobal.org/vocab/lis/v2/course#CourseOffering'],
        label: 'ETAGIA Course',
        title: 'ETAGIA Learning Context',
      },
      given_name: 'Lamine',
      family_name: 'Gaye',
      email: 'lamine@etagia.com',
      name: 'Lamine Gaye',
    }

    const idToken = signJWT(payload)
    const formUrl = new URL(redirectUri)
    const html = `<!DOCTYPE html><html><body>
<form id="lti" method="POST" action="${formUrl.origin + formUrl.pathname}">
  <input type="hidden" name="id_token" value="${idToken}" />
  <input type="hidden" name="state" value="${state}" />
</form>
<script>document.getElementById('lti').submit();</script>
</body></html>`

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PLATFORM_URL    = process.env.NEXT_PUBLIC_APP_URL || 'https://etagia-lms.vercel.app'
const PRIVATE_KEY_B64 = process.env.LTI_PRIVATE_KEY_B64 || ''
const DEPLOYMENT_ID   = 'etagia-deploy-001'
const CLIENT_ID       = 'etagia-edugears-client-001'
const KID             = 'etagia-lms-2026'
// URL de lancement EduGears — toujours POST ici
const EDUGEARS_LAUNCH = 'https://lti-api.edugears.ai/lti/launch'

function getPrivateKey(): string {
  if (!PRIVATE_KEY_B64) throw new Error('LTI_PRIVATE_KEY_B64 not set in environment variables')
  return Buffer.from(PRIVATE_KEY_B64, 'base64').toString('utf-8')
}

function base64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf) : buf
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function signJWT(payload: Record<string, unknown>): string {
  const header   = { alg: 'RS256', typ: 'JWT', kid: KID }
  const h        = base64url(JSON.stringify(header))
  const p        = base64url(JSON.stringify(payload))
  const key      = getPrivateKey()
  const sigBuf   = crypto.createSign('RSA-SHA256').update(`${h}.${p}`).sign(key)
  return `${h}.${p}.${base64url(sigBuf)}`
}

// ─────────────────────────────────────────────────────────────────────────────
// Gère deux modes d'appel :
//
//  Mode A — Appel depuis la page /formateur/edugears (POST JSON)
//    Body: { tool: 'quiz', target_link_uri?: '...', redirect_uri?: '...' }
//    → Génère id_token et retourne HTML auto-submit vers EDUGEARS_LAUNCH
//
//  Mode B — Flux OIDC standard (GET ou POST form-data depuis EduGears)
//    Params: client_id, redirect_uri, login_hint, nonce, state, lti_message_hint
//    → Génère id_token et retourne HTML auto-submit vers redirect_uri
// ─────────────────────────────────────────────────────────────────────────────
async function handleAuth(req: NextRequest): Promise<NextResponse> {
  let tool           = ''
  let redirectUri    = EDUGEARS_LAUNCH
  let loginHint      = 'lamine-gaye-stable-001'
  let resourceLinkId = 'resource-001'
  let nonce          = crypto.randomUUID()
  let state          = crypto.randomBytes(16).toString('hex')

  // Lire les paramètres selon le Content-Type
  const contentType = req.headers.get('content-type') || ''

  if (req.method === 'GET') {
    const sp       = new URL(req.url).searchParams
    redirectUri    = sp.get('redirect_uri')     || EDUGEARS_LAUNCH
    loginHint      = sp.get('login_hint')       || loginHint
    resourceLinkId = sp.get('lti_message_hint') || resourceLinkId
    nonce          = sp.get('nonce')            || nonce
    state          = sp.get('state')            || state
  } else if (contentType.includes('application/json')) {
    // Mode A : appel depuis la page ETAGIA
    const body     = await req.json() as Record<string, string>
    tool           = body.tool || ''
    redirectUri    = body.redirect_uri || body.target_link_uri || EDUGEARS_LAUNCH
    resourceLinkId = tool || resourceLinkId
    // Pour le mode A on garde loginHint par défaut (session Supabase serait ici)
    // TODO: extraire l'user depuis la session Supabase quand dispo
  } else {
    // Mode B : form-data depuis OIDC redirect
    const text     = await req.text()
    const sp       = new URLSearchParams(text)
    redirectUri    = sp.get('redirect_uri')     || EDUGEARS_LAUNCH
    loginHint      = sp.get('login_hint')       || loginHint
    resourceLinkId = sp.get('lti_message_hint') || resourceLinkId
    nonce          = sp.get('nonce')            || nonce
    state          = sp.get('state')            || state
    tool           = sp.get('tool')             || ''
    if (tool) resourceLinkId = tool
  }

  try {
    const now = Math.floor(Date.now() / 1000)

    const payload: Record<string, unknown> = {
      // ── OIDC standard ───────────────────────────────────────────────────────
      iss:          PLATFORM_URL,
      sub:          loginHint,
      aud:          CLIENT_ID,
      iat:          now,
      exp:          now + 300,           // 5 min — court pour la sécurité
      nonce,

      // ── Identité utilisateur ────────────────────────────────────────────────
      name:         'Lamine Gaye',
      given_name:   'Lamine',
      family_name:  'Gaye',
      email:        'prolaminegaye@gmail.com',

      // ── Claims LTI 1.3 obligatoires ─────────────────────────────────────────
      'https://purl.imsglobal.org/spec/lti/claim/message_type':
        'LtiResourceLinkRequest',

      'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',

      'https://purl.imsglobal.org/spec/lti/claim/deployment_id': DEPLOYMENT_ID,

      'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': EDUGEARS_LAUNCH,

      // resource_link.id = l'id de l'outil (quiz, slides, grading, …)
      // EduGears lit ce champ pour router vers le bon outil
      'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
        id:    resourceLinkId,
        title: `ETAGIA — ${resourceLinkId}`,
      },

      // Rôle Instructeur (formateur)
      'https://purl.imsglobal.org/spec/lti/claim/roles': [
        'http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor',
      ],

      // Contexte plateforme
      'https://purl.imsglobal.org/spec/lti/claim/context': {
        id:    'etagia-lms-context-001',
        type:  ['http://purl.imsglobal.org/vocab/lis/v2/course#CourseOffering'],
        label: 'ETAGIA',
        title: 'ETAGIA LMS Learning Context',
      },

      'https://purl.imsglobal.org/spec/lti/claim/tool_platform': {
        guid:                'etagia-lms',
        name:                'ETAGIA LMS',
        description:         'Plateforme LMS EdTech — Afrique francophone',
        url:                 PLATFORM_URL,
        product_family_code: 'etagia-lms',
        version:             '1.0.0',
      },

      'https://purl.imsglobal.org/spec/lti/claim/launch_presentation': {
        document_target: 'window',
        locale:          'fr-FR',
        return_url:      `${PLATFORM_URL}/formateur/edugears`,
      },
    }

    const idToken = signJWT(payload)

    // ── Formulaire auto-soumis vers EduGears (LTI 1.3 spec) ──────────────────
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Connexion EduGears AI…</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#12100E;color:#F5F0E8;font-family:system-ui,sans-serif;
         display:flex;flex-direction:column;align-items:center;justify-content:center;
         min-height:100vh;gap:1.25rem}
    .logo{width:48px;height:48px;border-radius:13px;
          background:linear-gradient(135deg,#E8651A,#00BFA5);
          display:flex;align-items:center;justify-content:center;font-size:24px}
    .spinner{width:26px;height:26px;border:3px solid rgba(232,101,26,.2);
             border-top-color:#E8651A;border-radius:50%;
             animation:spin .8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    h2{font-size:15px;font-weight:700}
    p{font-size:11px;color:rgba(245,240,232,.35);font-family:monospace}
  </style>
</head>
<body>
  <div class="logo">🤖</div>
  <div class="spinner"></div>
  <h2>Connexion à EduGears AI…</h2>
  <p>LTI 1.3 · RS256 · Redirection sécurisée</p>
  <form id="lti" method="POST" action="${EDUGEARS_LAUNCH}">
    <input type="hidden" name="id_token" value="${idToken}" />
    <input type="hidden" name="state"    value="${state}" />
  </form>
  <script>setTimeout(()=>document.getElementById('lti').submit(),350)</script>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type':                'text/html; charset=utf-8',
        'Cache-Control':               'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[LTI Auth]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export const GET  = (req: NextRequest) => handleAuth(req)
export const POST = (req: NextRequest) => handleAuth(req)

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

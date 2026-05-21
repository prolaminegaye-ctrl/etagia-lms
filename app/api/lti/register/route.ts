import { NextRequest, NextResponse } from 'next/server'

const PLATFORM_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://etagia-lms.vercel.app'

// Valeurs stables assignées par ETAGIA à EduGears
const CLIENT_ID     = 'etagia-edugears-client-001'
const DEPLOYMENT_ID = 'etagia-deploy-001'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// ─────────────────────────────────────────────────────────────────────────────
// POST — EduGears envoie sa configuration outil, on répond avec client_id
//        et deployment_id selon la spec IMS Global Dynamic Registration 1.0
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[LTI Register] received tool registration:', JSON.stringify(body))

    // Extraire la configuration LTI de l'outil
    const toolLtiConfig =
      body['https://purl.imsglobal.org/spec/lti-tool-configuration'] || {}

    // Construire la réponse d'enregistrement :
    // On renvoie exactement ce qu'EduGears a envoyé + nos assignations
    const registrationResponse = {
      // ── Champs OAuth2 / OIDC ──────────────────────────────────────────
      client_id:                    CLIENT_ID,          // ← requis, assigné par nous
      application_type:             body.application_type || 'web',
      grant_types:                  body.grant_types    || ['implicit', 'client_credentials'],
      response_types:               body.response_types || ['id_token'],
      redirect_uris:                body.redirect_uris  || [],
      initiate_login_uri:           body.initiate_login_uri || '',
      client_name:                  body.client_name    || 'EduGears AI',
      jwks_uri:                     body.jwks_uri       || '',
      logo_uri:                     body.logo_uri       || '',
      token_endpoint_auth_method:   body.token_endpoint_auth_method || 'private_key_jwt',
      scope:                        body.scope          || '',

      // ── Configuration LTI avec deployment_id assigné ─────────────────
      'https://purl.imsglobal.org/spec/lti-tool-configuration': {
        ...toolLtiConfig,
        deployment_id: DEPLOYMENT_ID,                   // ← requis, assigné par nous
      },
    }

    console.log('[LTI Register] responding with client_id:', CLIENT_ID, 'deployment_id:', DEPLOYMENT_ID)

    return NextResponse.json(registrationResponse, {
      status: 201,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[LTI Register] error:', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 400 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET — page HTML pour déclencher l'enregistrement dynamique
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const registrationToken = searchParams.get('registration_token') || ''

  const edugears_register_url = new URL('https://lti-api.edugears.ai/lti/register')
  edugears_register_url.searchParams.set(
    'openid_configuration',
    `${PLATFORM_URL}/api/lti/openid-configuration`
  )
  if (registrationToken) {
    edugears_register_url.searchParams.set('registration_token', registrationToken)
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Enregistrement LTI — ETAGIA LMS</title>
  <style>
    body{font-family:'Plus Jakarta Sans',sans-serif;background:#FAF9F7;display:flex;
         align-items:center;justify-content:center;min-height:100vh;margin:0}
    .box{background:#fff;border-radius:20px;padding:40px;max-width:520px;width:100%;
         box-shadow:0 4px 32px rgba(28,25,23,.08);text-align:center}
    h2{color:#1C1917;font-size:22px;margin-bottom:8px}
    p{color:#57534E;font-size:14px;line-height:1.6;margin-bottom:20px}
    .btn{display:inline-block;background:linear-gradient(135deg,#E8651A,#D4A017);
         color:#fff;border-radius:12px;padding:14px 28px;font-weight:800;
         font-size:15px;text-decoration:none;margin-top:8px}
    .info{background:#F4F4F4;border-radius:10px;padding:14px;font-family:monospace;
          font-size:12px;text-align:left;margin:16px 0;word-break:break-all}
    .badge{display:inline-block;background:#E8F5E9;color:#2E7D32;border-radius:6px;
           padding:3px 10px;font-size:12px;font-weight:700;margin:4px 2px}
  </style>
</head>
<body>
  <div class="box">
    <div style="font-size:40px;margin-bottom:16px">🔌</div>
    <h2>Enregistrement EduGears LTI 1.3</h2>
    <p>ETAGIA LMS est configuré comme plateforme LTI. Les identifiants suivants
       seront assignés automatiquement lors de l'enregistrement :</p>
    <div class="info">
      <b>client_id :</b> ${CLIENT_ID}<br/>
      <b>deployment_id :</b> ${DEPLOYMENT_ID}<br/>
      <b>issuer :</b> ${PLATFORM_URL}
    </div>
    <span class="badge">✓ JWKS actif</span>
    <span class="badge">✓ OIDC configuré</span>
    <span class="badge">✓ RS256</span>
    <br/><br/>
    <a href="${edugears_register_url.toString()}" class="btn">
      Enregistrer sur EduGears →
    </a>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html', ...CORS },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}

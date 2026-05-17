import { NextRequest, NextResponse } from 'next/server'

const PLATFORM_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://etagia-lms.vercel.app'

// POST — reçoit la réponse d'enregistrement d'EduGears
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[LTI Register] received:', JSON.stringify(body))

    // In production: store client_id and deployment_id in Supabase
    return NextResponse.json({
      ok: true,
      message: 'Registration received',
      client_id: body.client_id,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 })
  }
}

// GET — initie le flux d'enregistrement dynamique vers EduGears
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const registrationToken = searchParams.get('registration_token') || ''

  // Payload de configuration de la plateforme ETAGIA
  const platformConfig = {
    issuer: PLATFORM_URL,
    authorization_endpoint: `${PLATFORM_URL}/api/lti/auth`,
    token_endpoint: `${PLATFORM_URL}/api/lti/token`,
    jwks_uri: `${PLATFORM_URL}/api/lti/certs`,
    registration_endpoint: `${PLATFORM_URL}/api/lti/register`,
    'https://purl.imsglobal.org/spec/lti-platform-configuration': {
      product_family_code: 'etagia-lms',
      version: '1.0.0',
      messages_supported: [
        { type: 'LtiResourceLinkRequest' },
        { type: 'LtiDeepLinkingRequest' },
      ],
    },
  }

  // Appel à l'endpoint d'enregistrement d'EduGears
  try {
    const edugears_register_url = new URL('https://lti-api.edugears.ai/lti/register')
    edugears_register_url.searchParams.set(
      'openid_configuration',
      `${PLATFORM_URL}/api/lti/openid-configuration`
    )
    if (registrationToken) {
      edugears_register_url.searchParams.set('registration_token', registrationToken)
    }

    // Retourner un HTML de redirection vers EduGears
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Enregistrement LTI — ETAGIA LMS</title>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF9F7; display: flex;
           align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .box { background: #fff; border-radius: 20px; padding: 40px; max-width: 480px; width: 100%;
           box-shadow: 0 4px 32px rgba(28,25,23,0.08); text-align: center; }
    h2 { color: #1C1917; font-size: 22px; margin-bottom: 8px; }
    p { color: #57534E; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-block; background: linear-gradient(135deg,#E8651A,#D4A017);
           color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800;
           font-size: 15px; text-decoration: none; }
    code { font-family: monospace; background: #F4F4F4; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="box">
    <div style="font-size:40px;margin-bottom:16px">🔌</div>
    <h2>Enregistrement EduGears LTI 1.3</h2>
    <p>Cliquez ci-dessous pour enregistrer ETAGIA LMS comme plateforme LTI auprès d'EduGears.
    Un nouveau code de réclamation vous sera attribué automatiquement.</p>
    <p><strong>Configuration plateforme :</strong><br/>
    <code>${PLATFORM_URL}/api/lti/openid-configuration</code></p>
    <a href="${edugears_register_url.toString()}" class="btn" target="_blank">
      Enregistrer sur EduGears →
    </a>
  </div>
</body>
</html>`

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

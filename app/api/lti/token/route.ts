import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const params = new URLSearchParams(body)
  const grantType = params.get('grant_type')

  if (grantType !== 'client_credentials') {
    return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 })
  }

  // For LTI AGS (Assignment and Grade Services)
  const token = {
    access_token: `etagia_lti_${Date.now()}`,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: params.get('scope') || 'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem',
  }

  return NextResponse.json(token, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

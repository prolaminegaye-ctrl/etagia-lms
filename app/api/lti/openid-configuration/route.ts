import { NextResponse } from 'next/server'

const PLATFORM_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://etagia-lms.vercel.app'

export async function GET() {
  const config = {
    issuer: PLATFORM_URL,
    authorization_endpoint: `${PLATFORM_URL}/api/lti/auth`,
    token_endpoint: `${PLATFORM_URL}/api/lti/token`,
    jwks_uri: `${PLATFORM_URL}/api/lti/certs`,
    registration_endpoint: `${PLATFORM_URL}/api/lti/register`,
    scopes_supported: ['openid'],
    response_types_supported: ['id_token'],
    subject_types_supported: ['public', 'pairwise'],
    id_token_signing_alg_values_supported: ['RS256'],
    claims_supported: [
      'sub', 'iss', 'aud', 'exp', 'iat', 'nonce',
      'https://purl.imsglobal.org/spec/lti/claim/deployment_id',
      'https://purl.imsglobal.org/spec/lti/claim/message_type',
      'https://purl.imsglobal.org/spec/lti/claim/version',
      'https://purl.imsglobal.org/spec/lti/claim/roles',
      'https://purl.imsglobal.org/spec/lti/claim/context',
      'https://purl.imsglobal.org/spec/lti/claim/resource_link',
    ],
    // LTI platform capabilities
    'https://purl.imsglobal.org/spec/lti-platform-configuration': {
      product_family_code: 'etagia-lms',
      version: '1.0.0',
      messages_supported: [
        { type: 'LtiResourceLinkRequest' },
        { type: 'LtiDeepLinkingRequest' },
      ],
      variables: [],
    },
  }

  return NextResponse.json(config, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}

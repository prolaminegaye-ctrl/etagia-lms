import { NextResponse } from 'next/server'

const PLATFORM_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://etagia-lms.vercel.app'

export async function GET() {
  const config = {
    // ── Discovery document (OpenID Connect)  ────────────────────────────
    issuer:                  PLATFORM_URL,
    authorization_endpoint:  `${PLATFORM_URL}/api/lti/auth`,
    token_endpoint:          `${PLATFORM_URL}/api/lti/token`,
    jwks_uri:                `${PLATFORM_URL}/api/lti/certs`,
    registration_endpoint:   `${PLATFORM_URL}/api/lti/register`,

    // ── Champs requis par la spec IMS Global Dynamic Registration ────────
    scopes_supported:                        ['openid'],
    response_types_supported:                ['id_token'],
    response_modes_supported:                ['form_post'],
    grant_types_supported:                   ['implicit', 'client_credentials'],
    subject_types_supported:                 ['public', 'pairwise'],
    id_token_signing_alg_values_supported:   ['RS256'],
    token_endpoint_auth_methods_supported:   ['private_key_jwt'],
    token_endpoint_auth_signing_alg_values_supported: ['RS256'],

    claims_supported: [
      'sub', 'iss', 'aud', 'exp', 'iat', 'nonce',
      'name', 'given_name', 'family_name', 'email',
      'https://purl.imsglobal.org/spec/lti/claim/deployment_id',
      'https://purl.imsglobal.org/spec/lti/claim/message_type',
      'https://purl.imsglobal.org/spec/lti/claim/version',
      'https://purl.imsglobal.org/spec/lti/claim/roles',
      'https://purl.imsglobal.org/spec/lti/claim/context',
      'https://purl.imsglobal.org/spec/lti/claim/resource_link',
      'https://purl.imsglobal.org/spec/lti/claim/tool_platform',
      'https://purl.imsglobal.org/spec/lti/claim/launch_presentation',
      'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint',
    ],

    // ── LTI Platform Configuration (extension IMS Global) ───────────────
    'https://purl.imsglobal.org/spec/lti-platform-configuration': {
      product_family_code: 'etagia-lms',
      version:             '1.0.0',
      messages_supported: [
        {
          type: 'LtiResourceLinkRequest',
          placements: ['ContentArea', 'CourseNav'],
        },
        {
          type: 'LtiDeepLinkingRequest',
          placements: ['ContentArea'],
        },
      ],
      variables: [
        'ResourceLink.id',
        'ResourceLink.title',
        'Context.id',
        'Context.label',
        'User.id',
        'User.username',
        'Membership.role',
      ],
    },
  }

  return NextResponse.json(config, {
    headers: {
      'Content-Type':                 'application/json',
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}

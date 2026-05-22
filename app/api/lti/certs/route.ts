import { NextResponse } from 'next/server'

// Clé publique RSA-2048 — correspond à LTI_PRIVATE_KEY_B64
// kid: etagia-lms-2026
const PUBLIC_JWK = {
  kty: "RSA",
  n:   "0gzT3RHZz2F1pM3oeiK3aERZSXKU0OCtr4P6qlWggc_-5cCRAQcZQOoEB3wTADgUM1rzOZzr6vhn0y-mV2hZsPwA33kqZdtYI-7nqgtEHb7i0epEfI0GnxmyViQyxlEKVOG22-LKRy-NH5p9iUcjmAcl8H7aOfdxVJar_9zXloCywo9Z4tVSvyTDAdpg6qNSvEY4TIhn-p5GUvYEhNmVqTiTnCwe15W07aPhMgCy8prhAxcWHpyELKYcKEuu0Hsw9vszhAuXNNRg6A2D-fqPpiRj8XTMKLKn04_Ekakg7xBIS2AYlGDKUwysciOpUfAYlGeKd4Aw6HQeUkJBYJGt7Q",
  e:   "AQAB",
  kid: "etagia-lms-2026",
  use: "sig",
  alg: "RS256",
  key_ops: ["verify"],
}

export async function GET() {
  return NextResponse.json(
    { keys: [PUBLIC_JWK] },
    {
      headers: {
        'Content-Type':                'application/json',
        'Cache-Control':               'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

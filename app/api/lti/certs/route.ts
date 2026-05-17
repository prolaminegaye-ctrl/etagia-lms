import { NextResponse } from 'next/server'

// Public RSA-2048 key generated for ETAGIA LMS LTI 1.3 platform
// kid: etagia-lms-2026
const PUBLIC_JWK = {
  kty: "RSA",
  n: "s3n-UfXLv9qQqDtKWPG4zzdMQijoAzp0DEjZ_-4c3cYXalcPWybGFa7yhnmFP_GmHnOyl4lxaQ8gv2aKBurKiSICuiybG07AWQJrm8E9Bggp-Qsr8qb4oQGG8KIgdK6Vlyi4i4z687Og-3-uPYOOS4MmDrJBfi4EMcOPbrE0xOdUhPcl0i9EfQSCfVanNEaZsP8oG4m8fRl4ynMNkAIoezZ6P1Em5tAdDviD1wHT4Kf8CBPPGQLogqSgDWkEgU-D0c5IBorrU5eJO7qUkl_jNrAFsGSL2uR-KuiBcgjjqUkLEOB7tKMSvCFW1EtLSdG5HWMz9cYD5iXocxApPfDJGw",
  e: "AQAB",
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
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

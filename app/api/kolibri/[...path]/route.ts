/**
 * ETAGIA LMS — Proxy API Kolibri
 * Route : /api/kolibri/[...path]
 *
 * Proxifie toutes les requêtes vers le serveur Kolibri (Hostinger VPS)
 * en ajoutant l'authentification et les headers CORS nécessaires.
 *
 * Variable d'env requise dans Vercel :
 *   KOLIBRI_SERVER_URL=https://kolibri.etagia-academie.com
 *   KOLIBRI_API_KEY=<token admin Kolibri>
 */

import { NextRequest, NextResponse } from 'next/server'

// Canal KA Français correct : 878ec2e6f88c5c268b1be6f202833cd4
const KOLIBRI_URL   = process.env.KOLIBRI_SERVER_URL ?? 'https://kolibri-v2-production.up.railway.app'
const KOLIBRI_TOKEN = process.env.KOLIBRI_API_KEY    ?? ''

/* ── Types Kolibri ────────────────────────────────────────────────────────── */
interface KolibriNode {
  id:            string
  title:         string
  description:   string
  kind:          'video' | 'exercise' | 'topic' | 'document' | 'audio'
  content_id:    string
  channel_id:    string
  lang:          { id: string; lang_name: string }
  thumbnail:     string | null
  duration:      number | null  // secondes
  num_coach_contents: number
  files:         KolibriFile[]
  assessmentmetadata: { assessment_item_count: number } | null
}

interface KolibriFile {
  id:             string
  available:      boolean
  file_size:      number
  extension:      string
  preset:         string
  lang:           { id: string } | null
  supplementary:  boolean
  thumbnail:      boolean
  download_url:   string
}

/* ── Helper : construire les headers Kolibri ─────────────────────────────── */
function kolibriHeaders(): HeadersInit {
  const h: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  }
  if (KOLIBRI_TOKEN) h['Authorization'] = `Token ${KOLIBRI_TOKEN}`
  return h
}

/* ── Helper : transformer un nœud Kolibri pour ETAGIA ───────────────────── */
export function transformNode(node: KolibriNode) {
  const videoFile = node.files?.find(f => f.extension === 'mp4' && !f.thumbnail && !f.supplementary)
  const thumbFile = node.files?.find(f => f.thumbnail)

  return {
    id:          node.id,
    title:       node.title,
    description: node.description,
    kind:        node.kind,
    lang:        node.lang?.lang_name ?? 'Français',
    duration:    node.duration ? `${Math.ceil(node.duration / 60)} min` : null,
    questions:   node.assessmentmetadata?.assessment_item_count ?? null,
    thumbnail:   thumbFile
      ? `${KOLIBRI_URL}${thumbFile.download_url}`
      : node.thumbnail
      ? `${KOLIBRI_URL}${node.thumbnail}`
      : null,
    videoUrl:    videoFile ? `${KOLIBRI_URL}${videoFile.download_url}` : null,
    streamUrl:   `/api/kolibri/content/storage/by_id/${node.id}/video.mp4`,
    kaUrl:       `${KOLIBRI_URL}/learn/#/topics/c/${node.id}`,
  }
}

/* ── GET handler ─────────────────────────────────────────────────────────── */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathSegments = params.path
  const searchParams = request.nextUrl.searchParams.toString()
  const upstreamPath = pathSegments.join('/')
  const upstreamUrl  = `${KOLIBRI_URL}/${upstreamPath}${searchParams ? `?${searchParams}` : ''}`

  try {
    const res = await fetch(upstreamUrl, {
      headers:       kolibriHeaders(),
      cache:        'no-store',
      signal:        AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Kolibri: ${res.status} ${res.statusText}`, url: upstreamUrl },
        { status: res.status }
      )
    }

    const contentType = res.headers.get('content-type') ?? ''

    /* Binaire (vidéo, images) → stream direct */
    if (!contentType.includes('application/json')) {
      return new NextResponse(res.body, {
        status:  res.status,
        headers: {
          'Content-Type':  contentType,
          'Cache-Control': 'public, max-age=86400',
          'Accept-Ranges': 'bytes',
        },
      })
    }

    const data = await res.json()

    /* Transformer les nœuds contenus si c'est une liste de contentnodes */
    if (upstreamPath.includes('contentnode') && Array.isArray(data.results)) {
      return NextResponse.json({
        ...data,
        results: data.results.map(transformNode),
      }, { headers: { 'Cache-Control': 'public, s-maxage=300' } })
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60' },
    })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)

    /* Kolibri non encore configuré → retourner des données de démo */
    if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed') || msg.includes('timeout')) {
      return NextResponse.json(
        { error: 'Serveur Kolibri non disponible', demo: true, message: msg },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/* ── POST handler (progression xAPI) ────────────────────────────────────── */
export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathSegments = params.path
  const upstreamUrl  = `${KOLIBRI_URL}/${pathSegments.join('/')}`
  const body         = await request.text()

  try {
    const res = await fetch(upstreamUrl, {
      method:  'POST',
      headers: kolibriHeaders(),
      body,
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

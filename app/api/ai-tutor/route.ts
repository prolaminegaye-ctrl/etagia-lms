import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const raw = Array.isArray(body?.messages) ? body.messages : []

    const messages = raw
      .filter((m: any) => m && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: m.content.trim()
      }))

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Aucun message valide' }, { status: 400 })
    }

    const stream = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system: "Tu es l'AI Tutor d'ETAGIA, plateforme EdTech pour l'Afrique francophone. Réponds toujours en français, de façon claire, pédagogique et encourageante. Maximum 300 mots par réponse.",
      messages,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: event.delta.text } })}\n\n`))
            }
            if (event.type === 'message_stop') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            }
          }
        } catch (streamErr: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: streamErr.message })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (err: any) {
    console.error('[AI Tutor Error]', err?.message)
    return NextResponse.json({ error: err?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}

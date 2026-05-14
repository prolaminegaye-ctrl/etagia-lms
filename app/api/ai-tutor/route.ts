import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante dans Vercel' }, { status: 500 })
    }

    const body = await req.json()
    const raw = Array.isArray(body?.messages) ? body.messages : []

    // Build messages - support text and document (PDF) content
    const messages = raw
      .filter((m: any) => {
        if (Array.isArray(m?.content)) return m.content.length > 0
        return m?.content && String(m.content).trim().length > 0
      })
      .map((m: any) => {
        // If content is array (multimodal with doc), pass as-is
        if (Array.isArray(m.content)) {
          return { role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }
        }
        return {
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content).trim()
        }
      })

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Message vide' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        stream: true,
        system: body?.system || "Tu es l'AI Tutor d'ETAGIA, plateforme EdTech premium pour l'Afrique francophone. Réponds toujours en français, de façon claire, pédagogique et encourageante. Utilise des exemples concrets adaptés au contexte africain. Si un document est fourni, analyse-le en profondeur pour répondre aux questions.",
        messages,
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: `Erreur Anthropic ${response.status}: ${errText}` }, { status: response.status })
    }

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (!data || data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta' && parsed.delta.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: parsed.delta.text } })}\n\n`))
                }
                if (parsed.type === 'message_stop') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              } catch { /* skip */ }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) { controller.error(err) }
      }
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

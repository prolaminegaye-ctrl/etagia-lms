import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante dans Vercel' }, { status: 500 })
    }

    const body = await req.json()
    const raw = Array.isArray(body?.messages) ? body.messages : []
    const messages = raw
      .filter((m: any) => m?.content && String(m.content).trim().length > 0)
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content).trim()
      }))

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Message vide' }, { status: 400 })
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        stream: true,
        system: "Tu es l'AI Tutor d'ETAGIA, plateforme EdTech premium pour l'Afrique francophone. Réponds toujours en français, de façon claire, pédagogique et encourageante. Utilise des exemples concrets adaptés au contexte africain. Max 400 mots sauf demande contraire.",
        messages,
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: `Erreur Anthropic ${response.status}: ${errText}` }, { status: response.status })
    }

    // Transform Anthropic SSE stream → our format
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
                // Anthropic sends: {"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}
                if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta' && parsed.delta.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: parsed.delta.text } })}\n\n`))
                }
                if (parsed.type === 'message_stop') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              } catch { /* ignore parse errors */ }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
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
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

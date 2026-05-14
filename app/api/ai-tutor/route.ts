import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        error: 'ANTHROPIC_API_KEY manquante dans Vercel. Allez dans Settings → Environment Variables → ajoutez ANTHROPIC_API_KEY puis Redeploy.'
      }, { status: 500 })
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
        system: "Tu es l'AI Tutor d'ETAGIA, plateforme EdTech premium pour l'Afrique francophone. Réponds toujours en français, de façon claire, pédagogique et encourageante. Exemples concrets adaptés au contexte africain. Max 400 mots.",
        messages,
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: `Erreur Anthropic (${response.status}): ${errText}` }, { status: response.status })
    }

    return new Response(response.body, {
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

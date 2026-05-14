import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante' }, { status: 500 })

    const { title, level, duration, audience, category } = await req.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        system: 'Tu es un ingénieur pédagogique expert. Tu réponds UNIQUEMENT avec du JSON valide, aucun texte avant ou après, aucun backtick.',
        messages: [{
          role: 'user',
          content: `Structure pédagogique pour: "${title}" | Niveau: ${level} | Durée: ${duration} | Public: ${audience||'professionnel'} | Catégorie: ${category}\n\nJSON uniquement:\n{"modules":[{"titre":"...","objectif":"...","duree":"30min","contenu":"...4-5 phrases pédagogiques...","quiz":{"question":"...","reponses":["A","B","C","D"],"bonne":0,"explication":"..."}}]}`
        }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Erreur ${response.status}: ${err}` }, { status: response.status })
    }

    const data = await response.json()
    const text = (data.content?.[0]?.text || '').trim()

    let parsed = null
    // Try direct parse
    try { parsed = JSON.parse(text) } catch {
      // Extract JSON block
      const match = text.match(/\{[\s\S]*\}/)
      if (match) try { parsed = JSON.parse(match[0]) } catch { /* continue */ }
    }

    if (!parsed?.modules) {
      return NextResponse.json({ error: `Réponse IA invalide. Reçu: ${text.slice(0,300)}` }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante' }, { status: 500 })

    const { message, history, products, userProfile } = await req.json()

    const catalogSummary = (products || []).slice(0, 20).map((p: any) =>
      `- [${p.id}] "${p.title}" (${p.type}, ${(p.price/100).toLocaleString('fr')} FCFA) — ${p.desc} — Tags: ${(p.tags||[]).join(', ')} — Note: ${p.rating}/5`
    ).join('\n')

    const systemPrompt = `Tu es Eya, l'assistante intelligente de la Marketplace ETAGIA LMS. Tu aides les utilisateurs africains francophones à trouver les meilleures ressources pédagogiques, livres et logiciels pour leur développement professionnel.

CATALOGUE DISPONIBLE (${(products||[]).length} produits):
${catalogSummary}

PROFIL UTILISATEUR: ${userProfile ? JSON.stringify(userProfile) : 'Non renseigné'}

TES MISSIONS:
1. Aider à trouver les produits adaptés selon les besoins exprimés
2. Donner des conseils personnalisés selon le profil (formateur/apprenant/consultant)
3. Expliquer le contenu des produits et répondre aux questions
4. Recommander des combinaisons de produits synergiques
5. Accompagner vers l'achat de façon naturelle et honnête

RÈGLES:
- Réponses concises (3-5 phrases max sauf si détail demandé)
- Toujours mentionner les IDs produits entre [crochets] quand tu en recommandes
- Ton chaleureux, professionnel, adapté à l'Afrique francophone
- Si l'utilisateur cherche quelque chose qui n'existe pas, dis-le honnêtement
- Propose max 3 recommandations à la fois pour ne pas surcharger
- Réponds UNIQUEMENT en français`

    const messages = [
      ...(history || []).slice(-8).map((h: any) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt,
        messages,
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: err }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'Désolé, je n\'ai pas pu traiter votre demande.'

    // Extract product IDs mentioned in reply
    const mentioned = [...reply.matchAll(/\[([a-z]\d+)\]/g)].map(m => m[1])

    return NextResponse.json({ reply, mentionedIds: mentioned })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

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
        max_tokens: 4000,
        system: 'Tu es un ingénieur pédagogique expert spécialisé en formation professionnelle africaine. Tu crées des structures de cours complètes et engageantes selon les principes du design pédagogique (taxonomie de Bloom, apprentissage actif, évaluation formative). Réponds UNIQUEMENT avec du JSON valide, zéro texte autour.',
        messages: [{
          role: 'user',
          content: `Crée une structure pédagogique complète et riche pour:
Titre: "${title}" | Niveau: ${level} | Durée: ${duration} | Public: ${audience||'professionnels'} | Catégorie: ${category}

JSON UNIQUEMENT (pas de markdown, pas de backticks):
{
  "introduction": "accroche motivante du cours en 2 phrases",
  "objectifs_generaux": ["objectif SMART 1", "objectif SMART 2", "objectif SMART 3"],
  "prerequis": ["prérequis 1", "prérequis 2"],
  "modules": [
    {
      "titre": "titre du module",
      "objectif": "objectif pédagogique spécifique (verbe d'action Bloom)",
      "duree": "45min",
      "introduction": "mise en contexte du module en 1 phrase",
      "contenu": "explication pédagogique complète en 5-7 phrases avec exemples concrets africains",
      "activite": {
        "type": "etude_de_cas|mise_en_situation|travaux_pratiques|reflexion|jeu_de_role",
        "titre": "titre de l'activité",
        "description": "description détaillée de l'activité pratique",
        "consigne": "consigne claire pour l'apprenant"
      },
      "quiz": {
        "question": "question de vérification des acquis",
        "reponses": ["Réponse A complète", "Réponse B complète", "Réponse C complète", "Réponse D complète"],
        "bonne": 0,
        "explication": "explication pédagogique de la bonne réponse"
      },
      "ressources": ["ressource ou lecture recommandée 1", "ressource 2"]
    }
  ],
  "evaluation_finale": {
    "titre": "titre de l'évaluation",
    "type": "projet|cas_pratique|qcm|presentation",
    "description": "description de l'évaluation sommative",
    "criteres": ["critère d'évaluation 1", "critère 2", "critère 3"]
  },
  "conclusion": "synthèse et perspectives en 2 phrases"
}`
        }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Anthropic ${response.status}: ${err}` }, { status: response.status })
    }

    const data = await response.json()
    const text = (data.content?.[0]?.text || '').trim()

    let parsed = null
    try { parsed = JSON.parse(text) } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) try { parsed = JSON.parse(match[0]) } catch {}
    }

    if (!parsed?.modules) {
      return NextResponse.json({ error: `Structure invalide. Réponse: ${text.slice(0,300)}` }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

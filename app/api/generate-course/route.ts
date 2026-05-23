import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante' }, { status: 500 })

    const { title, level, duration, audience, category } = await req.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 6000,
        system: `Tu es un ingénieur pédagogique expert. Tu génères des structures de cours JSON concises et directement utilisables.
RÈGLE ABSOLUE : réponds UNIQUEMENT avec du JSON brut valide. ZÉRO texte avant ou après. ZÉRO backtick. ZÉRO markdown. Commence directement par { et termine par }.`,
        messages: [{
          role: 'user',
          content: `Génère une structure JSON pour ce cours :
Titre: "${title}"
Niveau: ${level} | Durée: ${duration} | Public: ${audience || 'professionnels'} | Catégorie: ${category}

Format exact requis (3 modules max, textes courts) :
{
  "introduction": "phrase d'accroche",
  "objectifs_generaux": ["objectif 1", "objectif 2", "objectif 3"],
  "prerequis": ["prérequis 1", "prérequis 2"],
  "modules": [
    {
      "titre": "Titre du module",
      "objectif": "L'apprenant sera capable de...",
      "duree": "45min",
      "introduction": "Mise en contexte en 1 phrase.",
      "contenu": "Explication du contenu en 3-4 phrases avec exemples.",
      "activite": {
        "titre": "Titre activité",
        "type": "mise_en_situation",
        "description": "Description courte de l'activité.",
        "consigne": "Consigne claire pour l'apprenant."
      },
      "quiz": {
        "question": "Question de vérification ?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "reponse": "Option A",
        "explication": "Explication de la bonne réponse."
      },
      "ressources": ["Ressource recommandée 1"]
    }
  ],
  "evaluation_finale": {
    "titre": "Évaluation finale",
    "type": "cas_pratique",
    "description": "Description de l'évaluation."
  },
  "conclusion": "Synthèse et prochaines étapes."
}`
        }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Anthropic ${response.status}: ${err.slice(0, 200)}` }, { status: response.status })
    }

    const data = await response.json()
    let text = (data.content?.[0]?.text || '').trim()

    // ── Strip markdown fences (```json ... ``` or ``` ... ```) ──────────────
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

    // ── Parse JSON ──────────────────────────────────────────────────────────
    let parsed: any = null

    // 1) Direct parse
    try { parsed = JSON.parse(text) } catch { /* try next */ }

    // 2) Extract first {...} block (handles text before/after)
    if (!parsed) {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { parsed = JSON.parse(match[0]) } catch { /* try next */ }
      }
    }

    // 3) Try to fix truncated JSON by closing open structures
    if (!parsed) {
      let fixed = text
      // Count open braces/brackets
      let braces = 0, brackets = 0
      for (const c of fixed) {
        if (c === '{') braces++; else if (c === '}') braces--
        if (c === '[') brackets++; else if (c === ']') brackets--
      }
      // Close any unclosed strings first (remove last incomplete value)
      fixed = fixed.replace(/,\s*"[^"]*$/, '').replace(/:\s*"[^"]*$/, ': ""')
      // Close brackets and braces
      while (brackets > 0) { fixed += ']'; brackets-- }
      while (braces > 0) { fixed += '}'; braces-- }
      try { parsed = JSON.parse(fixed) } catch { /* give up */ }
    }

    if (!parsed?.modules || !Array.isArray(parsed.modules)) {
      return NextResponse.json({
        error: `La réponse IA n'est pas au bon format. Réessayez — parfois l'IA ajoute du texte parasite. (${text.slice(0, 150)}…)`
      }, { status: 500 })
    }

    // ── Normalise quiz fields (reponses → options fallback) ─────────────────
    parsed.modules = parsed.modules.map((m: any) => {
      if (m.quiz && m.quiz.reponses && !m.quiz.options) {
        m.quiz.options = m.quiz.reponses
        // bonne = index → valeur string
        if (typeof m.quiz.bonne === 'number') {
          m.quiz.reponse = m.quiz.options[m.quiz.bonne] || m.quiz.options[0]
        }
      }
      return m
    })

    return NextResponse.json(parsed)

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

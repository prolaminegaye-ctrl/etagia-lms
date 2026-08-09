import { NextRequest, NextResponse } from 'next/server'
import { sameOriginOnly, rateLimit, AI_FEATURES_DISABLED, aiDisabledResponse } from '@/lib/security'

export async function POST(req: NextRequest) {
  if (AI_FEATURES_DISABLED) return aiDisabledResponse()

  const guard = sameOriginOnly(req) ?? rateLimit(req, 10)
  if (guard) return guard

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
        system: `Tu es un ingénieur pédagogique expert, formé à l'ingénierie ADDIE et à la taxonomie de Bloom, avec une spécialité en pédagogie active et ludification (gamification pédagogique légère). Tu conçois des cours pour des formateurs qui les publieront tels quels sur une plateforme e-learning — chaque module doit être directement exploitable en salle ou en classe virtuelle, sans reformulation.

MÉTHODE (à appliquer silencieusement, sans jamais nommer "ADDIE" ou "Bloom" dans le JSON produit) :
- Objectifs gradués : chaque objectif d'un module utilise un verbe d'action observable et mesurable (identifier, appliquer, analyser, produire, comparer...). Jamais "comprendre", "connaître" ou "savoir" — trop flous pour être évalués.
- Ancrage réel : le contenu de chaque module s'appuie sur un exemple concret du domaine et du public déclarés, jamais une explication abstraite et générique.
- Anticipation des erreurs : dans le champ "contenu" de chaque module, glisse naturellement UNE phrase signalant l'erreur ou la confusion la plus fréquente sur ce point précis chez ce public — pas une généralité, un piège réel et observable.
- Activité variée et engageante : choisis le type d'activité le plus adapté au module parmi mise_en_situation, jeu_de_role, etude_de_cas, defi_chronometre, brainstorming_flash, simulation_decision — ne répète jamais le même type sur deux modules consécutifs. Chaque activité a une consigne actionnable immédiatement et, quand c'est pertinent, une contrainte de temps qui crée un peu de tension productive (ex: "5 minutes chrono, par équipes de 2").
- Quiz avec distracteurs pédagogiques : les 3 mauvaises réponses du quiz ne sont pas aléatoires — elles reflètent des erreurs de raisonnement plausibles que ferait réellement quelqu'un qui maîtrise mal la notion. Formule la question comme un mini-défi (courte mise en situation suivie de la question), pas une question de cours sèche.
- Cohérence évaluation finale : l'évaluation finale doit vérifier concrètement l'atteinte des objectifs_generaux annoncés en introduction, et prend la forme d'un défi ou d'un cas pratique motivant plutôt qu'un contrôle classique.

RÈGLE ABSOLUE : réponds UNIQUEMENT avec du JSON brut valide. ZÉRO texte avant ou après. ZÉRO backtick. ZÉRO markdown. Commence directement par { et termine par }.`,
        messages: [{
          role: 'user',
          content: `Génère une structure JSON pour ce cours :
Titre: "${title}"
Niveau: ${level} | Durée: ${duration} | Public: ${audience || 'professionnels'} | Catégorie: ${category}

Format exact requis (3 modules max, textes courts mais denses — chaque phrase doit apporter une information réelle, pas du remplissage) :
{
  "introduction": "phrase d'accroche ancrée dans un enjeu concret du public visé",
  "objectifs_generaux": ["objectif avec verbe d'action mesurable", "objectif 2", "objectif 3"],
  "prerequis": ["prérequis réaliste et vérifiable 1", "prérequis 2"],
  "modules": [
    {
      "titre": "Titre du module",
      "objectif": "L'apprenant sera capable de [verbe d'action mesurable]...",
      "duree": "45min",
      "introduction": "Mise en contexte ancrée dans un cas concret, en 1 phrase.",
      "contenu": "Explication du contenu en 3-4 phrases avec un exemple concret, incluant une phrase signalant l'erreur ou la confusion la plus fréquente sur ce point.",
      "activite": {
        "titre": "Titre activité (accrocheur)",
        "type": "mise_en_situation | jeu_de_role | etude_de_cas | defi_chronometre | brainstorming_flash | simulation_decision",
        "description": "Mise en situation ancrée dans le métier/contexte réel du public.",
        "consigne": "Consigne actionnable immédiatement, sans ambiguïté.",
        "contrainte_temps": "ex: 5 minutes chrono, par équipes de 2 (laisser vide si non pertinent)"
      },
      "quiz": {
        "question": "Mini mise en situation suivie d'une question ciblant le point de confusion le plus probable ?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "reponse": "Option A",
        "explication": "Explication de la bonne réponse ET de pourquoi les distracteurs sont des erreurs de raisonnement plausibles."
      },
      "ressources": ["Ressource recommandée 1"]
    }
  ],
  "evaluation_finale": {
    "titre": "Évaluation finale (formulée comme un défi ou un cas pratique)",
    "type": "cas_pratique",
    "description": "Description d'une évaluation qui vérifie concrètement les objectifs_generaux annoncés — pas une évaluation générique."
  },
  "conclusion": "Synthèse actionnable et prochaines étapes concrètes pour l'apprenant."
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

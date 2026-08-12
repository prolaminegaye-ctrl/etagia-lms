import { NextRequest, NextResponse } from 'next/server'
import { sameOriginOnly, rateLimit, AI_FEATURES_DISABLED, aiDisabledResponse } from '@/lib/security'

// ─────────────────────────────────────────────────────────────────────────
// Outils IA pour enseignants — contextualisés Afrique francophone
// Même pattern que /api/generate-course et /api/ai-tutor : appel direct
// Anthropic, pas de dépendance à une plateforme tierce (ex. MagicSchool,
// qui n'expose aucune API/embed publique pour des LMS partenaires — voir
// discussion produit). Tout reste natif, sous contrôle d'ETAGIA.
// ────────────────────────────────────────────────────────────────────────

type ToolId = 'lesson-plan' | 'quiz' | 'worksheet' | 'rubric' | 'differentiation'

const AFRICA_CONTEXT = `Tu es un concepteur pédagogique senior spécialisé dans l'enseignement en Afrique francophone (primaire, collège, lycée, formation professionnelle).

CONTEXTE PAR DÉFAUT (sauf indication contraire de l'utilisateur) :
- Classes à effectifs élevés, souvent 40 à 80+ élèves, parfois plusieurs niveaux dans la même salle.
- Ressources matérielles limitées : tableau noir/craie ou ardoise, cahiers, peu ou pas de vidéoprojecteur, connexion internet en classe rare ou absente.
- Peu de photocopies possibles — privilégie des activités réalisables à l'oral, au tableau, ou avec un minimum de matériel recopié.

ANCRAGE LOCAL OBLIGATOIRE :
- Monnaie : FCFA (jamais dollars ou euros dans les exemples chiffrés).
- Prénoms, noms, lieux : Afrique subsaharienne francophone (villes, marchés, villages).
- Situations concrètes : agriculture, commerce informel/marché, transport en commun (car rapide, moto-taxi, taxi-brousse), vie communautaire, réalités rurales ET urbaines.
- Zéro référence culturelle occidentale par défaut (pas de neige, pas de marques américaines, pas de "dollars").
- Si un pays ou un programme scolaire précis est indiqué, aligne le vocabulaire sur son système (ex. CEPE/BEPC/BAC, cycles primaire/collège/lycée, CE1/CM2, 6ème/Terminale selon le système franco-africain).

STYLE :
- Français clair, direct, actionnable. Zéro remplissage, zéro généralité creuse.
- Format texte structuré avec titres "# ", sous-titres "## " et listes "- " (pas de tableaux markdown, pas de code).
- Réponds UNIQUEMENT avec le contenu demandé, sans préambule ("Voici...", "Bien sûr...") ni conclusion méta.`

function toolPrompt(tool: ToolId, p: Record<string, string>): string {
  const ctx = [
    p.subject && `Sujet/matière : ${p.subject}`,
    p.level && `Niveau : ${p.level}`,
    p.country && `Pays/programme : ${p.country}`,
    p.classSize && `Effectif de la classe : ${p.classSize}`,
    p.extra && `Précisions supplémentaires : ${p.extra}`,
  ].filter(Boolean).join('\n')

  switch (tool) {
    case 'lesson-plan':
      return `Conçois un plan de séance pédagogique complet et prêt à l'emploi.
${ctx}
Durée de la séance : ${p.duration || '1 heure'}

Structure exacte :
# Plan de séance : [titre accrocheur]
## Objectif(s)
1-2 objectifs avec verbe d'action mesurable.
## Matériel nécessaire
Liste courte, réaliste avec des moyens limités (tableau, craie, cahiers — pas de matériel numérique sauf si précisé).
## Déroulé minuté
- Accroche (X min) : ...
- Développement (X min) : ...
- Application/exercice (X min) : ...
- Synthèse (X min) : ...
Le minutage total doit correspondre à la durée indiquée.
## Différenciation rapide
2-3 pistes concrètes pour gérer une classe hétérogène (élèves en difficulté / élèves à l'aise) sans matériel supplémentaire.`

    case 'quiz':
      return `Génère un quiz QCM autonome, prêt à distribuer ou à faire à l'oral.
${ctx}
Nombre de questions : ${p.count || '8'}

Structure exacte :
# Quiz : [titre]
Pour chaque question, numérotée :
## Question N
Énoncé ancré dans une situation concrète et locale.
- A) ...
- B) ...
- C) ...
- D) ...
**Bonne réponse :** lettre
**Explication :** pourquoi c'est la bonne réponse, en 1 phrase.`

    case 'worksheet':
      return `Crée une fiche d'exercices différenciée en 3 paliers de difficulté, avec corrigé.
${ctx}

Structure exacte :
# Fiche d'exercices : [titre]
## ⭐ Palier 1 — Consolider les bases
2-3 exercices simples.
## ⭐⭐ Palier 2 — À l'aise
2-3 exercices de niveau standard.
## ⭐⭐⭐ Palier 3 — Aller plus loin
1-2 exercices plus exigeants.
## Corrigé
Réponses courtes pour chaque exercice, dans l'ordre.`

    case 'rubric':
      return `Construis une grille d'évaluation (rubrique) claire pour noter un travail ou une évaluation.
${ctx}
Barème total : ${p.extra2 || 'sur 20'}

Structure exacte :
# Grille d'évaluation : [titre]
Pour chaque critère (3 à 5 critères) :
## Critère : [nom]
Points attribués : X points
- Insuffisant : description observable
- En cours d'acquisition : description observable
- Maîtrisé : description observable
- Expert : description observable
## Total
Rappel du barème global et seuil de réussite.`

    case 'differentiation':
      return `Adapte le texte/exercice source fourni en 3 versions différenciées, en gardant le même sens et les mêmes notions clés — pense à une classe à effectifs élevés où plusieurs niveaux coexistent parfois dans la même salle.
${ctx}

Texte source à adapter :
"""
${p.sourceText || ''}
"""

Structure exacte :
# Version simplifiée
Vocabulaire simple, phrases courtes, notions essentielles seulement.
# Version standard
Reformulation claire au niveau demandé.
# Version approfondie
Version enrichie avec une notion ou un exemple supplémentaire pour aller plus loin.
# Conseil d'usage en classe
1-2 phrases sur comment distribuer ces 3 versions dans une classe hétérogène sans stigmatiser les élèves.`

    default:
      return ctx
  }
}

export async function POST(req: NextRequest) {
  if (AI_FEATURES_DISABLED) return aiDisabledResponse()

  const guard = sameOriginOnly(req) ?? rateLimit(req, 15)
  if (guard) return guard

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante' }, { status: 500 })

    const body = await req.json()
    const tool = body?.tool as ToolId
    const VALID: ToolId[] = ['lesson-plan', 'quiz', 'worksheet', 'rubric', 'differentiation']
    if (!VALID.includes(tool)) {
      return NextResponse.json({ error: 'Outil inconnu' }, { status: 400 })
    }

    if (tool === 'differentiation' && !String(body?.sourceText || '').trim()) {
      return NextResponse.json({ error: 'Le texte source est requis pour la différenciation.' }, { status: 400 })
    }

    const userPrompt = toolPrompt(tool, {
      subject: String(body?.subject || '').slice(0, 300),
      level: String(body?.level || '').slice(0, 100),
      country: String(body?.country || '').slice(0, 100),
      classSize: String(body?.classSize || '').slice(0, 50),
      duration: String(body?.duration || '').slice(0, 50),
      count: String(body?.count || '').slice(0, 10),
      extra: String(body?.extra || '').slice(0, 500),
      extra2: String(body?.points || '').slice(0, 50),
      sourceText: String(body?.sourceText || '').slice(0, 4000),
    })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3500,
        system: AFRICA_CONTEXT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Anthropic ${response.status}: ${err.slice(0, 200)}` }, { status: response.status })
    }

    const data = await response.json()
    const text = (data.content?.[0]?.text || '').trim()

    if (!text) {
      return NextResponse.json({ error: "Réponse vide de l'IA — réessayez." }, { status: 500 })
    }

    return NextResponse.json({ result: text })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}


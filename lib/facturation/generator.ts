// lib/facturation/generator.ts — Génération factures EtagIA en FCFA

import type { Facture, LigneFacture, EvenementPaiement, PeriodeAbo } from './types'

/** Formate un montant en FCFA — ex: 25000 → "25 000 F CFA" */
export function formatFCFA(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'XOF',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(montant)
}

/** Numéro de facture unique — FAC-ETAGIA-2026-0042 */
export function genererNumeroFacture(sequence: number): string {
  return `FAC-ETAGIA-${new Date().getFullYear()}-${String(sequence).padStart(4, '0')}`
}

/** Taux TVA selon le pays (code ISO-2) */
export function getTauxTVA(codePays: string): number {
  const TVA: Record<string, number> = {
    SN: 18, CI: 18, ML: 18, BF: 18, GN: 18, TG: 18, BJ: 18,
    NE: 19, CM: 19.25, FR: 20, BE: 21,
  }
  return TVA[codePays.toUpperCase()] ?? 0
}

export function calculerLigne(
  description: string, quantite: number,
  prixUnitaireHT: number, tauxTVA: number,
): LigneFacture {
  const totalHT    = Math.round(quantite * prixUnitaireHT)
  const montantTVA = Math.round((totalHT * tauxTVA) / 100)
  return { description, quantite, prixUnitaireHT, tauxTVA, totalHT, montantTVA, totalTTC: totalHT + montantTVA }
}

function getPeriodeDates(periode: PeriodeAbo, depuis = new Date()) {
  const debut = new Date(depuis); debut.setHours(0, 0, 0, 0)
  const fin = new Date(debut); const prochain = new Date(debut)
  const map = { mensuel: 1, trimestriel: 3, annuel: 12 }
  fin.setMonth(fin.getMonth() + map[periode]); fin.setDate(fin.getDate() - 1)
  prochain.setMonth(prochain.getMonth() + map[periode])
  return { debut, fin, prochain }
}

export function creerFactureDepuisEvenement(event: EvenementPaiement, sequence: number): Facture {
  const now      = new Date()
  const tauxTVA  = getTauxTVA(event.userPays)
  const totalHT  = Math.round(event.montantXOF / (1 + tauxTVA / 100))
  const totalTVA = event.montantXOF - totalHT

  const periodes: Record<PeriodeAbo, string> = { mensuel: 'mensuel', trimestriel: 'trimestriel', annuel: 'annuel' }
  const desc = event.nomPlan + (event.periodeAbonnement
    ? ` — Abonnement ${periodes[event.periodeAbonnement]}`
    : '')

  const ligne = calculerLigne(desc, 1, totalHT, tauxTVA)
  const periode = event.periodeAbonnement && event.typeTransaction !== 'paiement_unique'
    ? getPeriodeDates(event.periodeAbonnement) : null

  const type: Facture['type'] = event.typeTransaction === 'paiement_unique' ? 'paiement_unique'
    : event.typeTransaction === 'abonnement_renouvellement' ? 'renouvellement' : 'abonnement'

  return {
    id: crypto.randomUUID(),
    numero: genererNumeroFacture(sequence),
    type, statut: 'payee', devise: 'XOF',
    client: {
      id: event.userId, nom: event.userName, email: event.userEmail,
      telephone: event.userTelephone, pays: event.userPays, typeClient: 'individuel',
    },
    lignes: [ligne],
    totalHT: ligne.totalHT, totalTVA: ligne.montantTVA, totalTTC: ligne.totalTTC,
    dateEmission: now, dateEcheance: now,
    referenceTransaction: event.transactionId, modePaiement: event.modePaiement,
    ...(periode && {
      abonnement: {
        planId: event.planId, nomPlan: event.nomPlan, periode: event.periodeAbonnement!,
        dateDebutPeriode: periode.debut, dateFinPeriode: periode.fin,
        prochainRenouvellement: periode.prochain,
      },
    }),
    emailEnvoye: false, createdAt: now, updatedAt: now,
  }
}

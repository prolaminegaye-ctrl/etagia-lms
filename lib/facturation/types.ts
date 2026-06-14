// lib/facturation/types.ts — EtagIA Facturation (XOF / FCFA)

export type StatutFacture = 'brouillon' | 'envoyee' | 'payee' | 'annulee' | 'retard'
export type TypeFacture   = 'paiement_unique' | 'abonnement' | 'renouvellement'
export type PeriodeAbo    = 'mensuel' | 'trimestriel' | 'annuel'
export type ModePaiement  = 'carte' | 'wave' | 'orange_money' | 'virement' | 'especes'

export interface LigneFacture {
  description: string
  quantite: number
  prixUnitaireHT: number
  tauxTVA: number
  totalHT: number
  montantTVA: number
  totalTTC: number
}

export interface ClientFacture {
  id: string
  nom: string
  email: string
  telephone?: string
  pays: string
  ville?: string
  typeClient: 'individuel' | 'entreprise'
  nomOrganisation?: string
}

export interface Facture {
  id: string
  numero: string
  type: TypeFacture
  statut: StatutFacture
  devise: 'XOF'
  client: ClientFacture
  lignes: LigneFacture[]
  totalHT: number
  totalTVA: number
  totalTTC: number
  dateEmission: Date
  dateEcheance: Date
  referenceTransaction?: string
  modePaiement?: ModePaiement
  abonnement?: {
    planId: string
    nomPlan: string
    periode: PeriodeAbo
    dateDebutPeriode: Date
    dateFinPeriode: Date
    prochainRenouvellement?: Date
  }
  emailEnvoye: boolean
  dateEnvoiEmail?: Date
  createdAt: Date
  updatedAt: Date
}

export interface EvenementPaiement {
  transactionId: string
  userId: string
  userEmail: string
  userName: string
  userTelephone?: string
  userPays: string
  montantXOF: number
  planId: string
  nomPlan: string
  typeTransaction: 'paiement_unique' | 'abonnement_nouveau' | 'abonnement_renouvellement'
  periodeAbonnement?: PeriodeAbo
  modePaiement: ModePaiement
  metadata?: Record<string, string>
}

export interface ResultatEnvoi {
  succes: boolean
  factureId?: string
  factureNumero?: string
  emailId?: string
  erreur?: string
}

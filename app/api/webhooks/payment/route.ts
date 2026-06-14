// app/api/webhooks/payment/route.ts
// POST /api/webhooks/payment — appelé automatiquement par votre passerelle de paiement
// Configurez cette URL dans votre dashboard Wave / Orange Money / Stripe / CinetPay

import { NextRequest, NextResponse } from 'next/server'
import { creerFactureDepuisEvenement } from '@/lib/facturation/generator'
import { envoyerFactureParEmail }      from '@/lib/facturation/sender'
import { createClient }                from '@supabase/supabase-js'
import type { EvenementPaiement }      from '@/lib/facturation/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function getProchainNumeroSequence(): Promise<number> {
  const { count } = await supabase.from('factures').select('*', { count: 'exact', head: true })
  return (count ?? 0) + 1
}

async function sauvegarderFacture(facture: ReturnType<typeof creerFactureDepuisEvenement>) {
  await supabase.from('factures').insert({
    id:                    facture.id,
    numero:                facture.numero,
    type:                  facture.type,
    statut:                facture.statut,
    devise:                facture.devise,
    client_id:             facture.client.id,
    client_nom:            facture.client.nom,
    client_email:          facture.client.email,
    client_pays:           facture.client.pays,
    total_ht:              facture.totalHT,
    total_tva:             facture.totalTVA,
    total_ttc:             facture.totalTTC,
    lignes:                JSON.stringify(facture.lignes),
    date_emission:         facture.dateEmission.toISOString(),
    date_echeance:         facture.dateEcheance.toISOString(),
    reference_transaction: facture.referenceTransaction,
    mode_paiement:         facture.modePaiement,
    abonnement:            facture.abonnement ? JSON.stringify(facture.abonnement) : null,
    email_envoye:          false,
    created_at:            facture.createdAt.toISOString(),
  })
}

async function marquerEmailEnvoye(factureId: string) {
  await supabase.from('factures').update({
    email_envoye:     true,
    date_envoi_email: new Date().toISOString(),
  }).eq('id', factureId)
}

function normaliserEvenement(type: string, event: Record<string, unknown>): EvenementPaiement | null {
  // ── Wave / Orange Money / CinetPay / Campay ──────────────────────────────
  if (['payment.success', 'subscription.created', 'subscription.renewed'].includes(type)) {
    const d = event.data as Record<string, unknown>
    if (!d) return null
    return {
      transactionId:    (d.transaction_id ?? d.id) as string,
      userId:           d.user_id as string,
      userEmail:        d.user_email as string,
      userName:         (d.user_name ?? d.user_full_name ?? 'Client') as string,
      userTelephone:    d.user_phone as string | undefined,
      userPays:         (d.user_country ?? 'SN') as string,
      montantXOF:       d.amount as number,
      planId:           d.plan_id as string,
      nomPlan:          (d.plan_name ?? d.product_name) as string,
      typeTransaction:  type === 'subscription.renewed' ? 'abonnement_renouvellement'
                        : type === 'subscription.created' ? 'abonnement_nouveau' : 'paiement_unique',
      periodeAbonnement: d.period as EvenementPaiement['periodeAbonnement'] ?? 'mensuel',
      modePaiement:     (d.payment_method as EvenementPaiement['modePaiement']) ?? 'carte',
    }
  }
  // ── Stripe ────────────────────────────────────────────────────────────────
  if (['invoice.payment_succeeded', 'charge.succeeded'].includes(type)) {
    const obj = (event.data as Record<string, unknown>)?.object as Record<string, unknown>
    if (!obj) return null
    const meta = (obj.metadata as Record<string, string>) ?? {}
    return {
      transactionId:    obj.id as string,
      userId:           meta.userId ?? '',
      userEmail:        (obj.customer_email as string) ?? meta.userEmail ?? '',
      userName:         meta.userName ?? 'Client EtagIA',
      userPays:         meta.userPays ?? 'SN',
      montantXOF:       obj.amount as number,
      planId:           meta.planId ?? '',
      nomPlan:          meta.nomPlan ?? 'Plan EtagIA',
      typeTransaction:  type === 'invoice.payment_succeeded'
                        ? ((obj.billing_reason as string) === 'subscription_create' ? 'abonnement_nouveau' : 'abonnement_renouvellement')
                        : 'paiement_unique',
      periodeAbonnement: (meta.periode as EvenementPaiement['periodeAbonnement']) ?? 'mensuel',
      modePaiement:     'carte',
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  const payload = await req.text()
  let event: Record<string, unknown>
  try { event = JSON.parse(payload) } catch {
    return NextResponse.json({ error: 'Payload invalide' }, { status: 400 })
  }

  const type = event.type as string
  const supported = ['payment.success','subscription.created','subscription.renewed','invoice.payment_succeeded','charge.succeeded']
  if (!supported.includes(type)) return NextResponse.json({ received: true, skipped: true })

  const evenement = normaliserEvenement(type, event)
  if (!evenement) return NextResponse.json({ error: 'Données incomplètes' }, { status: 422 })

  try {
    const sequence = await getProchainNumeroSequence()
    const facture  = creerFactureDepuisEvenement(evenement, sequence)
    await sauvegarderFacture(facture)

    const resultat = await envoyerFactureParEmail(facture, {
      ccAdmin:    true,
      adminEmail: process.env.ADMIN_EMAIL ?? 'admin@etagia-academie.com',
    })

    if (resultat.succes) {
      await marquerEmailEnvoye(facture.id)
      console.log(`[EtagIA] ✅ Facture ${facture.numero} envoyée → ${facture.client.email}`)
    } else {
      console.error(`[EtagIA] ❌ Email échec ${facture.numero}:`, resultat.erreur)
    }

    return NextResponse.json({
      success: true,
      facture: { id: facture.id, numero: facture.numero, montant: facture.totalTTC, devise: 'XOF', emailEnvoye: resultat.succes },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur interne'
    console.error('[EtagIA Webhook]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

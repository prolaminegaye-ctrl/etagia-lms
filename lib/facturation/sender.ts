// lib/facturation/sender.ts — Envoi automatique de factures via Resend
// npm install resend

import type { Facture, ResultatEnvoi } from './types'
import { formatFCFA } from './generator'

const URL_PLATEFORME = process.env.NEXT_PUBLIC_APP_URL ?? 'https://etagia-academie.com'

function genSujet(f: Facture): string {
  const m = formatFCFA(f.totalTTC)
  if (f.type === 'abonnement')     return `✅ Abonnement ${f.abonnement?.nomPlan ?? 'EtagIA'} activé — ${m} · ${f.numero}`
  if (f.type === 'renouvellement') return `🔄 Renouvellement confirmé — ${f.abonnement?.nomPlan ?? 'EtagIA'} · ${m} · ${f.numero}`
  return `✅ Paiement confirmé — ${m} · ${f.numero}`
}

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(d))
}

function buildHTML(f: Facture, lienPDF?: string): string {
  const periode = f.abonnement ? `
    <tr><td colspan="2" style="padding:10px 16px; background:#FFF7ED; border-radius:8px; font-size:13px; color:#78716C;">
      📅 Période : <strong>${fmtDate(f.abonnement.dateDebutPeriode)} → ${fmtDate(f.abonnement.dateFinPeriode)}</strong>
      ${f.abonnement.prochainRenouvellement ? `· Prochain renouvellement : <strong>${fmtDate(f.abonnement.prochainRenouvellement)}</strong>` : ''}
    </td></tr>` : ''

  const lignes = f.lignes.map(l => `
    <tr>
      <td style="padding:12px 14px; font-size:13px; color:#1C1917; border-bottom:1px solid #F5F5F4;">${l.description}</td>
      <td style="padding:12px 14px; font-size:13px; color:#1C1917; border-bottom:1px solid #F5F5F4; text-align:right;">${formatFCFA(l.totalHT)}</td>
    </tr>`).join('')

  const modeLabels: Record<string, string> = {
    carte: '💳 Carte', wave: '📱 Wave', orange_money: '📱 Orange Money',
    virement: '🏦 Virement', especes: '💵 Espèces',
  }

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E7E5E4;">
    <div style="background:linear-gradient(135deg,#F4591F 0%,#FF8C42 50%,#FFB347 100%);padding:28px 32px;">
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.03em;">EtagIA Académie</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px;">${f.type === 'paiement_unique' ? 'Confirmation de paiement' : 'Confirmation d\'abonnement'}</div>
      <div style="display:inline-block;background:#DCFCE7;color:#16A34A;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:700;margin-top:10px;">✓ Payée</div>
    </div>
    <div style="padding:28px 32px;">
      <h2 style="font-size:17px;font-weight:800;color:#1C1917;margin:0 0 6px;">Bonjour ${f.client.nom} 👋</h2>
      <p style="font-size:13px;color:#78716C;line-height:1.6;margin:0 0 22px;">
        ${f.type === 'paiement_unique'
          ? 'Votre paiement a bien été reçu. Retrouvez ci-dessous le détail de votre facture.'
          : `Votre ${f.type === 'renouvellement' ? 'renouvellement' : 'abonnement'} ${f.abonnement?.nomPlan ?? ''} est confirmé.`}
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
        <div>
          <div style="font-size:10px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;">Facture</div>
          <div style="font-size:14px;font-weight:700;color:#1C1917;">${f.numero}</div>
          <div style="font-size:12px;color:#78716C;">Émise le ${fmtDate(f.dateEmission)}</div>
          ${f.modePaiement ? `<div style="font-size:12px;color:#78716C;">${modeLabels[f.modePaiement] ?? f.modePaiement}</div>` : ''}
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;">Client</div>
          <div style="font-size:14px;font-weight:700;color:#1C1917;">${f.client.nom}</div>
          <div style="font-size:12px;color:#78716C;">${f.client.email}</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #E7E5E4;border-radius:10px;overflow:hidden;margin-bottom:18px;">
        <thead><tr style="background:#FFF7ED;">
          <th style="padding:10px 14px;font-size:10px;font-weight:700;color:#EA580C;text-align:left;text-transform:uppercase;">Prestation</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:700;color:#EA580C;text-align:right;text-transform:uppercase;">Montant HT</th>
        </tr></thead>
        <tbody>${lignes}</tbody>
      </table>
      ${periode ? `<table style="width:100%;margin-bottom:18px;">${periode}</table>` : ''}
      <div style="background:#FFF7ED;border-radius:10px;padding:14px 16px;margin-bottom:22px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#78716C;margin-bottom:3px;">
          <span>Sous-total HT</span><span>${formatFCFA(f.totalHT)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#78716C;margin-bottom:6px;">
          <span>TVA (${f.lignes[0]?.tauxTVA ?? 0} %)</span><span>${formatFCFA(f.totalTVA)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:900;color:#F97316;">
          <span>Total TTC</span><span>${formatFCFA(f.totalTTC)}</span>
        </div>
      </div>
      ${lienPDF ? `<div style="text-align:center;margin-bottom:20px;"><a href="${lienPDF}" style="background:#F97316;color:#fff;text-decoration:none;padding:12px 26px;border-radius:10px;font-size:13px;font-weight:700;display:inline-block;">⬇ Télécharger ma facture PDF</a></div>` : ''}
      <hr style="border:none;border-top:1px solid #E7E5E4;margin:18px 0;"/>
      <p style="font-size:12px;color:#A8A29E;line-height:1.7;margin:0;">
        Cette facture est disponible dans votre espace <strong>Mon compte → Mes factures</strong>.
        Des questions ? <a href="mailto:support@etagia-academie.com" style="color:#F97316;">support@etagia-academie.com</a>
      </p>
    </div>
    <div style="background:#FAFAF9;border-top:1px solid #E7E5E4;padding:16px 32px;text-align:center;">
      <div style="font-size:15px;font-weight:900;color:#F97316;">EtagIA</div>
      <div style="font-size:11px;color:#A8A29E;margin-top:2px;">Académie · Formation Professionnelle en Afrique</div>
    </div>
  </div></body></html>`
}

export async function envoyerFactureParEmail(
  facture: Facture,
  options: { lienPDF?: string; ccAdmin?: boolean; adminEmail?: string } = {},
): Promise<ResultatEnvoi> {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const html   = buildHTML(facture, options.lienPDF)

    const { data, error } = await resend.emails.send({
      from: 'EtagIA Académie <factures@etagia-academie.com>',
      to: [facture.client.email],
      ...(options.ccAdmin && options.adminEmail ? { cc: [options.adminEmail] } : {}),
      subject: genSujet(facture),
      html,
      tags: [
        { name: 'type',        value: 'facture' },
        { name: 'facture_id',  value: facture.id },
        { name: 'facture_type', value: facture.type },
      ],
    })

    if (error) return { succes: false, factureId: facture.id, factureNumero: facture.numero, erreur: error.message }
    return { succes: true, factureId: facture.id, factureNumero: facture.numero, emailId: data?.id }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue'
    return { succes: false, factureId: facture.id, erreur: msg }
  }
}

export async function renvoyerFacture(facture: Facture, options: { lienPDF?: string } = {}): Promise<ResultatEnvoi> {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: 'EtagIA Académie <factures@etagia-academie.com>',
      to: [facture.client.email],
      subject: `📄 Duplicata — ${facture.numero} · ${formatFCFA(facture.totalTTC)}`,
      html: buildHTML(facture, options.lienPDF),
      tags: [{ name: 'type', value: 'facture_duplicata' }],
    })
    if (error) return { succes: false, factureId: facture.id, erreur: error.message }
    return { succes: true, factureId: facture.id, emailId: data?.id }
  } catch (e) {
    return { succes: false, factureId: facture.id, erreur: e instanceof Error ? e.message : 'Erreur' }
  }
}

// lib/email/accessRequests.ts — Notifications des demandes d'accès
//
// Le mail de notification ne contient AUCUN lien d'action : approuver ou
// refuser se fait depuis /admin/demandes, après connexion. Un lien signé
// dans un email agit au nom du propriétaire sans authentification — si la
// boîte mail est compromise ou l'email transféré, l'accès l'est aussi.

const DESTINATAIRE_ADMIN = process.env.ACCESS_REQUEST_TO ?? 'info@edpedago.com'

/**
 * Expéditeur.
 *
 * Par défaut, le domaine partagé de Resend : il fonctionne sans vérifier
 * de domaine ni toucher au DNS. C'est volontaire — l'email ne doit pas
 * être un préalable à la mise en service.
 *
 * Le jour où `etagia-academie.com` sera vérifié chez Resend, il suffira de
 * définir ACCESS_REQUEST_FROM pour améliorer la délivrabilité et l'image :
 *   ACCESS_REQUEST_FROM="EtagIA Académie <notifications@etagia-academie.com>"
 */
const EXPEDITEUR = process.env.ACCESS_REQUEST_FROM ?? 'EtagIA Académie <onboarding@resend.dev>'
const URL_APP = process.env.NEXT_PUBLIC_APP_URL ?? 'https://etagia-academie.com'

export type DemandeEmail = {
  type: 'admin' | 'marketplace'
  fullName: string | null
  email: string | null
  userId: string
  motif: string | null
  ip: string
  userAgent: string | null
  createdAt: Date
}

const LIBELLE: Record<DemandeEmail['type'], string> = {
  admin: 'accès administrateur',
  marketplace: 'accès Marketplace',
}

function echapper(valeur: string | null | undefined): string {
  return String(valeur ?? '—')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function horodatage(d: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Paris',
  }).format(d)
}

async function envoyer(to: string, subject: string, html: string): Promise<boolean> {
  // L'email est un confort, pas le canal de référence : sans clé, la
  // demande reste visible dans /admin/demandes, qui fait autorité.
  if (!process.env.RESEND_API_KEY) {
    console.warn('[access-requests] RESEND_API_KEY absente : notification par email ignorée.', { to, subject })
    return false
  }
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({ from: EXPEDITEUR, to, subject, html })
    if (error) { console.error('[access-requests] envoi refusé', error); return false }
    return true
  } catch (e) {
    console.error('[access-requests] envoi impossible', e)
    return false
  }
}

/** Notifie le propriétaire qu'une demande attend sa décision. */
export async function notifierNouvelleDemande(d: DemandeEmail): Promise<boolean> {
  const ligne = (cle: string, valeur: string) => `
    <tr>
      <td style="padding:9px 14px;font-size:13px;color:#78716C;border-bottom:1px solid #F5F5F4;white-space:nowrap;">${cle}</td>
      <td style="padding:9px 14px;font-size:13px;color:#1C1917;border-bottom:1px solid #F5F5F4;font-weight:600;">${valeur}</td>
    </tr>`

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E7E5E4;">
    <div style="background:linear-gradient(135deg,#F4591F 0%,#FF8C42 100%);padding:26px 30px;">
      <div style="font-size:20px;font-weight:900;color:#fff;letter-spacing:-0.02em;">EtagIA Académie</div>
      <div style="font-size:13px;color:rgba(255,255,255,.9);margin-top:4px;">Demande d'${LIBELLE[d.type]}</div>
    </div>
    <div style="padding:26px 30px;">
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#1C1917;">
        <strong>${echapper(d.fullName)}</strong> demande un ${LIBELLE[d.type]}.
        Aucun droit n'a été accordé : la demande attend votre décision.
      </p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #F5F5F4;border-radius:8px;">
        ${ligne('Nom', echapper(d.fullName))}
        ${ligne('Email', echapper(d.email))}
        ${ligne('Identifiant', `<code style="font-size:12px;">${echapper(d.userId)}</code>`)}
        ${ligne('Date et heure', echapper(horodatage(d.createdAt)))}
        ${ligne('Adresse IP', echapper(d.ip))}
        ${ligne('Navigateur', `<span style="font-size:11px;color:#78716C;">${echapper(d.userAgent)}</span>`)}
        ${ligne('Motif', echapper(d.motif))}
      </table>
      <a href="${URL_APP}/admin/demandes"
         style="display:inline-block;margin-top:22px;padding:12px 22px;background:#F4591F;color:#fff;
                text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">
        Examiner la demande
      </a>
      <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#A8A29E;">
        Ce message ne contient volontairement aucun lien d'approbation directe.
        La décision se prend depuis votre espace d'administration, après connexion :
        un lien d'action dans un email agirait en votre nom sans vérifier que c'est bien vous.
      </p>
    </div>
  </div>
</body></html>`

  return envoyer(
    DESTINATAIRE_ADMIN,
    `Demande d'${LIBELLE[d.type]} — ${d.fullName ?? d.email ?? d.userId}`,
    html,
  )
}

/** Informe le demandeur de la décision prise. */
export async function notifierDecision(
  destinataire: string,
  type: DemandeEmail['type'],
  approuvee: boolean,
  note?: string | null,
): Promise<boolean> {
  const titre = approuvee ? `Votre ${LIBELLE[type]} est activé` : `Votre demande d'${LIBELLE[type]} n'a pas été retenue`
  const corps = approuvee
    ? `Votre demande d'${LIBELLE[type]} a été acceptée. L'accès est actif dès votre prochaine connexion.`
    : `Votre demande d'${LIBELLE[type]} n'a pas été retenue. Votre compte et vos données restent inchangés, et vous pouvez formuler une nouvelle demande.`

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E7E5E4;">
    <div style="background:${approuvee ? 'linear-gradient(135deg,#0FB6CC 0%,#14C9A0 100%)' : '#78716C'};padding:26px 30px;">
      <div style="font-size:20px;font-weight:900;color:#fff;letter-spacing:-0.02em;">EtagIA Académie</div>
      <div style="font-size:13px;color:rgba(255,255,255,.9);margin-top:4px;">${echapper(titre)}</div>
    </div>
    <div style="padding:26px 30px;">
      <p style="margin:0;font-size:15px;line-height:1.65;color:#1C1917;">${echapper(corps)}</p>
      ${note ? `<p style="margin:16px 0 0;padding:12px 16px;background:#FAFAF9;border-radius:8px;font-size:14px;line-height:1.6;color:#57534E;">${echapper(note)}</p>` : ''}
      <a href="${URL_APP}/dashboard"
         style="display:inline-block;margin-top:22px;padding:12px 22px;background:#F4591F;color:#fff;
                text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">
        Ouvrir mon espace
      </a>
    </div>
  </div>
</body></html>`

  return envoyer(destinataire, titre, html)
}

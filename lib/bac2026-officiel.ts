/**
 * ETAGIA Académie — Annales officielles du Baccalauréat Général 2026 (Sénégal)
 * Source : Office du Baccalauréat — UCAD (officedubac.sn)
 * Épreuves & corrigés publiés pour la session 2026 (1er groupe = session normale,
 * 2nd groupe = session de remplacement / 2nd tour).
 *
 * Utilisé par le module d'entraînement gamifié "Bac 2026" dans Mon Pass'BAC.
 * Durées indicatives (à vérifier sur la convocation officielle de l'élève).
 */

export type GroupeBac = '1er' | '2nd'

export interface EpreuveBac2026 {
  id: string
  groupe: GroupeBac
  serie: string
  matiere: string
  dureeMin: number
  epreuveUrl: string
  corrigeUrl?: string
  corrigeUrl2?: string
  corrigeType?: string
}

export const SOURCE_OFFICIELLE = {
  nom: 'Office du Baccalauréat — UCAD (officedubac.sn)',
  urlEpreuves: 'https://officedubac.sn/2026/06/30/epreuves-bac-gen-2026/',
  urlCorriges: 'https://officedubac.sn/2026/06/30/corriges-bac-gen-2026/',
}

export const SERIES_FILTRES = ['Toutes', 'S1', 'S2', 'S', 'L', 'LA', 'L-AR', 'L2', 'S1A/S2A', 'Autres'] as const
export type SerieFiltre = typeof SERIES_FILTRES[number]

export const BAC_2026_GEN: EpreuveBac2026[] = [
  // ────────────────────────────────────────────────────────────────────────
  // 1er GROUPE — Session normale (juin 2026)
  // ────────────────────────────────────────────────────────────────────────
  { id: 'g1-philo-l', groupe: '1er', serie: 'L', matiere: 'Philosophie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/PHILO-L-1ER-GR.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/Canevas-Bac-philo-2026.doc-1.pdf', corrigeType: 'Canevas de correction' },
  { id: 'g1-philo-lar', groupe: '1er', serie: 'L-AR', matiere: 'Philosophie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/PHILO-L-AR-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/Canevas-Bac-philo-2026.doc-1.pdf', corrigeType: 'Canevas de correction' },
  { id: 'g1-philo-s', groupe: '1er', serie: 'S', matiere: 'Philosophie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/PHILO-S-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/Canevas-Bac-philo-2026.doc-1.pdf', corrigeType: 'Canevas de correction' },
  { id: 'g1-scph-s1', groupe: '1er', serie: 'S1', matiere: 'Sciences Physiques', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/SCIENCES-PHYSIQUES-S1_26-1ER-GR-.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/corrige-bac-s1-1er-groupe-2026.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-scph-s2', groupe: '1er', serie: 'S2', matiere: 'Sciences Physiques', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/SCIENCES-PHYSIQUES-S2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/Corrige_epreuve_S2_1-ergroupe_2026_stabilise.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-all-lv1', groupe: '1er', serie: 'Toutes', matiere: 'Allemand LV1', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/ALL-lv1-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/CORRIGE-ALL-LV1-1ER-GR-.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-ang-lv1', groupe: '1er', serie: 'Toutes', matiere: 'Anglais LV1', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/ANGLAIS-LV-1-1ER-GR-2026.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/CORRIGE-ANG-LV1-1ER-GR-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-ang-lar', groupe: '1er', serie: 'L-AR', matiere: 'Anglais', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/ANLAIS-L-AR-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/corrige-ANG-L-AR-1ER-GR.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-arabe-lv1', groupe: '1er', serie: 'Toutes', matiere: 'Arabe LV1', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/ARABE-LV1-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/CORRIGE-ARA-LV1-1ER-GR.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-civ-la', groupe: '1er', serie: 'LA', matiere: 'Civilisation', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/civilisation-LA-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Civ-s1a-a2s-N%C2%B01-1er-gr-26.pdf',
    corrigeUrl2: 'https://officedubac.sn/wp-content/uploads/2026/07/Civ-s1a-s2a-N%C2%B0-2-1er-gr-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-esp-lv1', groupe: '1er', serie: 'Toutes', matiere: 'Espagnol LV1', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/ESPAGNOL-LV1-1ER-GR-.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/Corrige-ESPGNOL-LV1-1ER-GR-.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-port-lv1', groupe: '1er', serie: 'Toutes', matiere: 'Portugais LV1', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/P0RT-LV1-1ER-GR-.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/06/CORRIGE-PORT-LV1-1ER-GR-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-fr-l', groupe: '1er', serie: 'L', matiere: 'Français', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/FR-L-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corriges-epreuve-premier-groupe-session-normale-L.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-fr-la', groupe: '1er', serie: 'LA', matiere: 'Français', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/fr-LA-1er-GR.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corriges-epreuve-premier-groupe-session-normale-LA.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-fr-lar', groupe: '1er', serie: 'L-AR', matiere: 'Français', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/FR-L-AR-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corriges-epreuve-premier-groupe-session-normale-LAR.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-maths-s1', groupe: '1er', serie: 'S1', matiere: 'Mathématiques', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/MATHS-S1-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Esquisse_Corrige_S1_2026.pdf', corrigeType: 'Esquisse de corrigé' },
  { id: 'g1-maths-s2', groupe: '1er', serie: 'S2', matiere: 'Mathématiques', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Maths-S2.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/BAC-S2-2026-Esquisse-de-corrige.pdf', corrigeType: 'Esquisse de corrigé' },
  { id: 'g1-hg-ls', groupe: '1er', serie: 'S', matiere: 'Histoire-Géographie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/HG-LS-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/GRILLES-HG-BAC-2026.docx.pdf', corrigeType: "Grille d'évaluation" },
  { id: 'g1-hg-lar', groupe: '1er', serie: 'L-AR', matiere: 'Histoire-Géographie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/HG-L-AR-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/GRILLES-HG-BAC-2026.docx.pdf', corrigeType: "Grille d'évaluation" },
  { id: 'g1-all-lv2', groupe: '1er', serie: 'Toutes', matiere: 'Allemand LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ALL-LV2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-ALL-LV2-2E-GR-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-ang-lv2', groupe: '1er', serie: 'Toutes', matiere: 'Anglais LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ANG-LV2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-ANG-LV2-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-ara-lv2', groupe: '1er', serie: 'Toutes', matiere: 'Arabe LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ARA-LV2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-AR-LV2-1ER-GR.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-eco-l2', groupe: '1er', serie: 'L2', matiere: 'Économie', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ECONOMIE-L2-.pdf' },
  { id: 'g1-esp-lv2', groupe: '1er', serie: 'Toutes', matiere: 'Espagnol LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/esp-lv2-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige-ESP-LV2-1ER-GR-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-islam', groupe: '1er', serie: 'Toutes', matiere: 'Études Islamiques', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Etudes-Islamiques.pdf' },
  { id: 'g1-grec', groupe: '1er', serie: 'Toutes', matiere: 'Grec', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/grec-1er-gr-26.pdf' },
  { id: 'g1-ita-lv2', groupe: '1er', serie: 'Toutes', matiere: 'Italien LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/italien-lv2-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/corrige-TIALIEN-lv2-1er-gr-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-port-lv2', groupe: '1er', serie: 'Toutes', matiere: 'Portugais LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/PORT-LV2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige-PORT-LV2-1E-R-GR-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-rus-lv2', groupe: '1er', serie: 'Toutes', matiere: 'Russe LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/RUSSE-LV2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-RUSSE-LV2-1ER-GR-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-svt-s1', groupe: '1er', serie: 'S1', matiere: 'SVT', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/svt-s1-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-svt-s1_2026_TS1.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-svt-s2', groupe: '1er', serie: 'S2', matiere: 'SVT', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/SVT-S2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-SVT-S2.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-fr-s', groupe: '1er', serie: 'S', matiere: 'Français', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/FRANCAIS-S-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Grilles-Evaluation-FRANCAIS.pdf', corrigeType: "Grille d'évaluation" },
  { id: 'g1-fr-s1a', groupe: '1er', serie: 'S1A/S2A', matiere: 'Français', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/FR-S1A-S2A-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Grilles-Evaluation-FRANCAIS.pdf', corrigeType: "Grille d'évaluation" },
  { id: 'g1-maths-lar', groupe: '1er', serie: 'L-AR', matiere: 'Mathématiques', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/maths-l-ar-1er-gr-26.pdf' },
  { id: 'g1-maths-l', groupe: '1er', serie: 'L', matiere: 'Mathématiques', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Maths-L-1ER-GR-26.pdf' },
  { id: 'g1-lla-s1a', groupe: '1er', serie: 'S1A/S2A', matiere: 'Langues et Littératures Anciennes', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/LLA-LA-SA1-et-S2A-1ER-GR-26.pdf' },
  { id: 'g1-scph-l2', groupe: '1er', serie: 'L2', matiere: 'Sciences Physiques', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Sciences-Physiques-L2.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige_epreuve_L2_1ergroupe_2026.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-lla-lar', groupe: '1er', serie: 'L-AR', matiere: 'Langue et Littérature Arabe', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/LLA-l-ar-1er-gr-26.pdf' },
  { id: 'g1-svt-l2', groupe: '1er', serie: 'L2', matiere: 'SVT', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/SVT-L2-1ER-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/L2_corrige-SVT-L2-1ER-GR-26.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-ang-s', groupe: '1er', serie: 'S', matiere: 'Anglais', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ANGLAIS-S-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/corrige-ANGLAIS-S-1ER-GR-.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g1-latin', groupe: '1er', serie: 'Toutes', matiere: 'Latin', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Latin-1er-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/corrige-LATIN-1ER-GR-26.pdf', corrigeType: 'Corrigé officiel' },

  // ────────────────────────────────────────────────────────────────────────
  // 2nd GROUPE — Session de remplacement (juillet 2026)
  // ────────────────────────────────────────────────────────────────────────
  { id: 'g2-maths-s1', groupe: '2nd', serie: 'S1', matiere: 'Mathématiques', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/maths-s1-2e-gr-26.pdf' },
  { id: 'g2-maths-s2', groupe: '2nd', serie: 'S2', matiere: 'Mathématiques', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/maths-s2-2e-gr-26.pdf' },
  { id: 'g2-philo-l', groupe: '2nd', serie: 'L', matiere: 'Philosophie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/PHILO-L.pdf' },
  { id: 'g2-ang-lar', groupe: '2nd', serie: 'L-AR', matiere: 'Anglais', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ANGLAIS-LAR-.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Correction-Anglais-LAR.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-ang-lv2', groupe: '2nd', serie: 'Toutes', matiere: 'Anglais LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ANGLAIS-LV2-.pdf' },
  { id: 'g2-eco-l2', groupe: '2nd', serie: 'L2', matiere: 'Économie', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ECONOMIE.pdf' },
  { id: 'g2-esp-lv2', groupe: '2nd', serie: 'Toutes', matiere: 'Espagnol LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ESPAGNOL-LV2.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige-Espagnol-LV2-.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-fr-la', groupe: '2nd', serie: 'LA', matiere: 'Français', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Francais-LA-.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/epreuve-second-groupe-session-normale-LA.pdf', corrigeType: "Grille d'évaluation" },
  { id: 'g2-fr-lar', groupe: '2nd', serie: 'L-AR', matiere: 'Français', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Francais-LAR-.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/EPREUVE-FRAN-LAR.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-grec', groupe: '2nd', serie: 'Toutes', matiere: 'Grec', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/grec-2e-tour.pdf' },
  { id: 'g2-ita-lv2', groupe: '2nd', serie: 'Toutes', matiere: 'Italien LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Italien-LV2.pdf' },
  { id: 'g2-port-lv2', groupe: '2nd', serie: 'Toutes', matiere: 'Portugais LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Portugais-LV2-.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige-Portugais-LV2.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-rus-lv2', groupe: '2nd', serie: 'Toutes', matiere: 'Russe LV2', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/RUSSE-LV2.pdf' },
  { id: 'g2-scph-s', groupe: '2nd', serie: 'S', matiere: 'Sciences Physiques', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/epreuve_2emegroupe_S1S2_2026.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige-_epreuve_2emegroupe_S1S3_2026.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-fr-s', groupe: '2nd', serie: 'S', matiere: 'Français', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/FR-S-2E-GE-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corriges-Francais-S-second-groupe.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-fr-s1a', groupe: '2nd', serie: 'S1A/S2A', matiere: 'Français', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/FR-S1A-S2A-2E-GR-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corriges-Francais-S2A-second-groupe.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-hg-lar', groupe: '2nd', serie: 'L-AR', matiere: 'Histoire-Géographie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/HG-L-AR-2E-GR-26.pdf' },
  { id: 'g2-philo-s', groupe: '2nd', serie: 'S', matiere: 'Philosophie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/PHILO-S-2E-GR-26.pdf' },
  { id: 'g2-hg-ls', groupe: '2nd', serie: 'S', matiere: 'Histoire-Géographie', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/SUJET-H-G-GRP-2.pdf' },
  { id: 'g2-svt-s1', groupe: '2nd', serie: 'S1', matiere: 'SVT', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/SVT-S1.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-SVT-S1-G2.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-islam-lar', groupe: '2nd', serie: 'L-AR', matiere: 'Études Islamiques', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Etudes-Islamiques-L-ar-2e-gr-26-.pdf' },
  { id: 'g2-fr-lar-n1', groupe: '2nd', serie: 'L-AR', matiere: 'Français (sujet n°1)', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/fr-L-N%C2%B01-2e-gr-26.pdf' },
  { id: 'g2-fr-l-n2', groupe: '2nd', serie: 'L', matiere: 'Français (sujet n°2)', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Fr-LN%C2%B02-2e-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-FRANCAIS-L-2e-groupe.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-svt-s2', groupe: '2nd', serie: 'S2', matiere: 'SVT', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/svt-s2-2e-gr-26.pdf' },
  { id: 'g2-maths-l', groupe: '2nd', serie: 'L', matiere: 'Mathématiques', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Maths-L-2e-gr-26.pdf' },
  { id: 'g2-maths-lar', groupe: '2nd', serie: 'L-AR', matiere: 'Mathématiques', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Maths-L-AR-2e-gr-26.pdf' },
  { id: 'g2-scph-l2', groupe: '2nd', serie: 'L2', matiere: 'Sciences Physiques', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Sc-Phys-L2-2e-gr-26.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige_epreuve_L2_2emegroupe_2026-stabilise.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-svt-l2', groupe: '2nd', serie: 'L2', matiere: 'SVT', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/svt-L2-2E-GR-26.pdf' },
  { id: 'g2-all-lv1', groupe: '2nd', serie: 'Toutes', matiere: 'Allemand LV1', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/allemand-LV1.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Corrige-Allemand-LV1.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-esp-lv1', groupe: '2nd', serie: 'Toutes', matiere: 'Espagnol LV1', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/ESPAGNOL-LV1.pdf',
    corrigeUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRIGE-ESPAGNOL-LV1.pdf', corrigeType: 'Corrigé officiel' },
  { id: 'g2-lla-s1a', groupe: '2nd', serie: 'S1A/S2A', matiere: 'Langue et Littérature Arabe', dureeMin: 120,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/L.L-ARABE-LA-S1A-S2A.pdf' },
  { id: 'g2-pyro-s4', groupe: '2nd', serie: 'Autres', matiere: 'Pyrotechnie (S4)', dureeMin: 180,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Pyrotechnie.pdf' },
  { id: 'g2-tech-s5', groupe: '2nd', serie: 'Autres', matiere: 'Technologie — Transformation & Construction (S5)', dureeMin: 240,
    epreuveUrl: 'https://officedubac.sn/wp-content/uploads/2026/07/Tech.-Transf.-Cons_.pdf' },
]

/** Documents publiés par l'Office du Bac sans épreuve correspondante clairement identifiée
 *  dans l'archive (corrigés seuls, grilles isolées...). Affichés en complément, non intégrés
 *  au parcours d'entraînement principal pour éviter tout appariement incertain. */
export const DOCUMENTS_COMPLEMENTAIRES: { label: string; url: string }[] = [
  { label: 'Corrigé Allemand LV2 (2nd groupe)', url: 'https://officedubac.sn/wp-content/uploads/2026/07/CORRECTION-ALLEMAND-LV2.pdf' },
  { label: 'Corrigé Anglais LV1 (2nd groupe)', url: 'https://officedubac.sn/wp-content/uploads/2026/07/Anglais-LV1Corrige.pdf' },
  { label: 'Corrigé Arabe LV1 (2nd groupe)', url: 'https://officedubac.sn/wp-content/uploads/2026/07/ARABE-LV1Corrige.pdf' },
  { label: 'Corrigé Portugais LV1 (2nd groupe)', url: 'https://officedubac.sn/wp-content/uploads/2026/07/Portugais-LV1corrige.pdf' },
]

export function statsGlobales() {
  const total = BAC_2026_GEN.length
  const avecCorrige = BAC_2026_GEN.filter(e => e.corrigeUrl).length
  return { total, avecCorrige }
}

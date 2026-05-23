'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

/* Product data duplicated for reader access check */
const TITLES: Record<string, { title: string; cover: string; type: string; pages?: number; desc: string; longDesc?: string }> = {
  l1:{ title:'La Vente Consultative', cover:'📘', type:'livre', pages:180, desc:'Maîtrisez l\'art de vendre par la valeur.', longDesc:'Chapter 1: Les fondamentaux de la vente consultative\n\nLa vente consultative repose sur une écoute active et une compréhension profonde des besoins du client. Contrairement à la vente transactionnelle classique, l\'approche consultative place le client au centre de la démarche...\n\nChapter 2: Identification des besoins\n\nLa phase de découverte est cruciale. Les questions ouvertes, semi-ouvertes et fermées ont chacune leur rôle. Le SPIN Selling (Situation, Problème, Implication, Need-Payoff) constitue un cadre éprouvé...\n\nChapter 3: La proposition de valeur\n\nUne proposition de valeur percutante répond à trois questions fondamentales : Quel problème résolvez-vous ? Comment votre solution est-elle unique ? Quels résultats concrets pouvez-vous promettre ?\n\n[... Contenu complet disponible après téléchargement ...]' },
  l2:{ title:'Management Nouvelle Ère', cover:'📗', type:'livre', pages:220, desc:'Leadership et gestion des talents en Afrique.', longDesc:'Introduction: Le management en contexte africain\n\nLe management en Afrique ne peut se résumer à l\'importation de modèles occidentaux. Les dimensions culturelles — rapport au temps, à l\'autorité, à la communauté — façonnent profondément les dynamiques d\'équipe...\n\nPartie I: Leadership transformationnel\n\nLe leader transformationnel inspire, motive et développe les compétences de son équipe. Il articule une vision claire, crée du sens et valorise les contributions individuelles...\n\n[... Contenu complet disponible après téléchargement ...]' },
  l3:{ title:'L\'Art de la Négociation', cover:'📙', type:'livre', pages:150, desc:'Techniques éprouvées pour négocier.', longDesc:'Préface: Pourquoi apprendre à négocier ?\n\nToute interaction humaine contient une dimension de négociation. Des grandes transactions commerciales aux discussions quotidiennes, maîtriser cet art change fondamentalement vos résultats...\n\nTechnique 1: Le silence stratégique\nAprès une proposition, le silence crée une pression naturelle sur l\'interlocuteur. Apprenez à vous y tenir...\n\nTechnique 2: L\'ancrage\nPoser une première offre ambitieuse ancre psychologiquement la négociation à un niveau favorable...\n\n[... 40 techniques complètes disponibles après téléchargement ...]' },
  l4:{ title:'Entrepreneuriat en Afrique', cover:'📔', type:'livre', pages:260, desc:'Guide complet pour entrepreneurs africains.', longDesc:'Chapitre 1: Identifier une opportunité de marché\n\nL\'Afrique présente des opportunités uniques au monde: une population jeune et croissante, une classe moyenne émergente, une révolution numérique en cours...\n\nChapitre 2: Le Business Model Canvas adapté\n\nL\'outil incontournable de la startup, adapté aux réalités du marché africain: financement informel, infrastructures variables, mobile-first...\n\n[... Contenu complet disponible après téléchargement ...]' },
  c1:{ title:'Formation Excel Avancé', cover:'📊', type:'cours', desc:'45 fiches pratiques PDF.', longDesc:'FICHE 1: Tableaux Croisés Dynamiques (TCD)\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Objectif: Analyser rapidement de grands volumes de données\n\n📋 Étapes:\n1. Sélectionner la plage de données (incluant les en-têtes)\n2. Insertion → Tableau croisé dynamique\n3. Choisir l\'emplacement (nouvelle feuille recommandé)\n4. Faire glisser les champs dans les zones Lignes/Colonnes/Valeurs\n\n💡 Astuce pro: Utilisez Ctrl+A pour sélectionner toute la plage avant d\'insérer le TCD.\n\nFICHE 2: Macros VBA — Premier pas\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Objectif: Automatiser des tâches répétitives\n\nSub NettoyerDonnées()\n    Dim ws As Worksheet\n    Set ws = ActiveSheet\n    ws.Columns("A:A").RemoveDuplicates Columns:=1\n    MsgBox "Doublons supprimés !"\nEnd Sub\n\n[... 43 fiches supplémentaires disponibles après téléchargement ...]' },
  c2:{ title:'SEO & Référencement Pro', cover:'🔍', type:'cours', desc:'De débutant à expert SEO.', longDesc:'MODULE 1: Comprendre le SEO\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nLe référencement naturel (SEO) est l\'ensemble des techniques permettant d\'optimiser la visibilité d\'un site dans les résultats des moteurs de recherche...\n\nLes 3 piliers du SEO:\n• Technique: vitesse, structure, mobile-first, Core Web Vitals\n• Contenu: qualité, pertinence, maillage interne, E-E-A-T\n• Autorité: backlinks, notoriété, signaux sociaux\n\nCHECKLIST AUDIT SEO (extrait):\n□ Title tag optimisé (50-60 caractères)\n□ Meta description engageante (150-160 car.)\n□ URL propre et descriptive\n□ Balise H1 unique et contenant le mot-clé principal\n□ Images avec alt text descriptif\n□ Vitesse page < 3 secondes\n\n[... 120 points de checklist complets après téléchargement ...]' },
  c3:{ title:'Canva Maîtrise Totale', cover:'🎨', type:'cours', desc:'60 tutoriels PDF + templates.', longDesc:'TUTORIEL 1: Créer votre premier design professionnel\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎯 En 10 minutes, créez un visuel professionnel:\n\n1. Choisissez le bon format\n   → Post Instagram: 1080x1080px\n   → Story: 1080x1920px\n   → Présentation: 1920x1080px\n\n2. La règle des tiers\n   Divisez mentalement votre design en 9 zones égales. Placez vos éléments clés aux intersections...\n\n3. La palette de couleurs\n   Maximum 3 couleurs + 1 couleur d\'accent. Utilisez l\'outil "Couleurs de la marque" de Canva...\n\nTUTORIEL 2: Typographie engageante\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCombinaisons qui fonctionnent toujours:\n• Titre: Montserrat Bold + Corps: Open Sans Regular\n• Titre: Playfair Display + Corps: Lato\n\n[... 58 tutoriels supplémentaires après téléchargement ...]' },
  s1:{ title:'Kit Formation SCORM', cover:'🛠️', type:'logiciel', desc:'Templates SCORM 1.2 & 2004 prêts à l\'emploi.', longDesc:'KIT SCORM ETAGIA — Documentation\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nContenu du kit:\n📁 scorm_12_basic/       → Template SCORM 1.2 minimal\n📁 scorm_12_quiz/        → Template quiz SCORM 1.2\n📁 scorm_2004_basic/     → Template SCORM 2004\n📁 scorm_2004_advanced/  → Template avec tracking avancé\n📁 shared_content/       → Ressources partagées\n📄 README.md             → Guide d\'installation\n\nCompatibilité testée:\n✅ ETAGIA LMS\n✅ Moodle 4.x\n✅ Talent LMS\n✅ 360Learning\n✅ Docebo\n\nInstallation:\n1. Dézipper le template choisi\n2. Personnaliser index.html avec votre contenu\n3. Zipper et importer dans votre LMS\n\n[... Documentation complète disponible après téléchargement ...]' },
  s2:{ title:'Pack Slides Formation Pro', cover:'🖼️', type:'logiciel', desc:'50 templates PowerPoint/Keynote.', longDesc:'PACK SLIDES FORMATION PRO\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📦 Contenu:\n• 25 slides thème DARK (fond noir, accents orange)\n• 25 slides thème LIGHT (fond blanc, accents bleu)\n• Icônes vectorielles incluses (500+)\n• Polices recommandées: Inter, Montserrat\n\n🎨 Types de slides inclus:\n□ Couverture & titre\n□ Sommaire / Agenda\n□ Slide de contenu (1 col, 2 col, 3 col)\n□ Statistiques & chiffres clés\n□ Citation / témoignage\n□ Timeline / processus\n□ Quiz / exercice\n□ Conclusion & récap\n\n[... Aperçu complet disponible après téléchargement ...]' },
  r1:{ title:'Pack 500 Icônes EdTech', cover:'🎯', type:'ressource', desc:'500 icônes vectorielles éducation/formation.', longDesc:'PACK 500 ICÔNES EDTECH ETAGIA\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📁 Organisation:\n/education/      → 120 icônes (livres, diplômes, stylos...)\n/digital/        → 95 icônes (devices, apps, cloud...)\n/rh-management/  → 110 icônes (équipe, process, KPI...)\n/communication/  → 85 icônes (bulles, media, réseau...)\n/business/       → 90 icônes (finance, graphes, bureau...)\n\n📐 Formats disponibles:\n• SVG (vectoriel, toute taille)\n• PNG 32px / 64px / 128px / 256px\n• Figma (fichier .fig avec organisation)\n• Icônes colorées + monochromes\n\nLicence: Usage commercial autorisé — crédit non requis\n\n[... Aperçu des catégories disponible après téléchargement ...]' },
  r2:{ title:'Bibliothèque Quiz Ready', cover:'❓', type:'ressource', desc:'1000 questions QCM par thématiques.', longDesc:'BIBLIOTHÈQUE QUIZ READY — 1000 QCM\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEXTRAIT — Thème Management:\n\nQ1. Selon la théorie de Herzberg, lequel est un facteur de motivation?\na) Le salaire\nb) La sécurité de l\'emploi\nc) La reconnaissance ✓\nd) Les conditions de travail\n\nQ2. Le management par objectifs (MBO) a été popularisé par:\na) Taylor\nb) Drucker ✓\nc) Fayol\nd) Mayo\n\nQ3. Le style de management "Délégatif" convient principalement à:\na) Novices sans expérience\nb) Collaborateurs expérimentés et motivés ✓\nc) Personnes en période d\'intégration\nd) Équipes en crise\n\n[... 997 questions supplémentaires après téléchargement ...]' },
}

function ReaderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || ''
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [fontSize, setFontSize] = useState(15)
  const product = TITLES[id]

  useEffect(() => {
    try {
      const purchases: string[] = JSON.parse(localStorage.getItem('etagia_purchases') || '[]')
      setHasAccess(purchases.includes(id))
    } catch { setHasAccess(false) }
  }, [id])

  if (!product) return (
    <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
      <div style={{ fontSize:'48px', marginBottom:'1rem' }}>❓</div>
      <p>Produit introuvable</p>
      <button onClick={() => router.push('/market')} style={backBtnStyle}>← Retour au marché</button>
    </div>
  )

  if (hasAccess === null) return (
    <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
      <div style={{ fontSize:'32px', marginBottom:'1rem' }}>⏳</div>
      <p>Vérification de votre accès...</p>
    </div>
  )

  if (!hasAccess) return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ textAlign:'center', maxWidth:'420px' }}>
        <div style={{ fontSize:'64px', marginBottom:'1rem' }}>🔒</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', margin:'0 0 12px' }}>Accès restreint</h2>
        <p style={{ color:'var(--text-secondary)', lineHeight:1.6, marginBottom:'1.5rem' }}>
          Ce contenu est réservé aux acheteurs de <strong>{product.title}</strong>. Rendez-vous sur la marketplace pour débloquer l&apos;accès.
        </p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
          <button onClick={() => router.push('/market')} style={{ background:'var(--accent)', border:'none', borderRadius:'10px', padding:'11px 24px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-display)' }}>
            🛒 Acheter maintenant
          </button>
          <button onClick={() => router.back()} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'11px 20px', color:'var(--text-secondary)', fontWeight:'500', fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-display)' }}>
            Retour
          </button>
        </div>
      </div>
    </div>
  )

  /* ACCESS GRANTED */
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ padding:'1rem 2rem', borderBottom:'1px solid var(--border)', background:'var(--bg-card)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/market')} style={backBtnStyle}>← Marché</button>
          <span style={{ fontSize:'20px' }}>{product.cover}</span>
          <div>
            <div style={{ fontWeight:'700', fontSize:'14px', fontFamily:'var(--font-display)' }}>{product.title}</div>
            <div style={{ fontSize:'11px', color:'rgba(74,127,245,0.8)', fontWeight:'600' }}>🔓 Contenu débloqué</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>Taille du texte :</span>
          <button onClick={() => setFontSize(s => Math.max(12, s-1))} style={sizeBtn}>A-</button>
          <span style={{ fontSize:'12px', color:'var(--text-secondary)', width:'30px', textAlign:'center' }}>{fontSize}</span>
          <button onClick={() => setFontSize(s => Math.min(22, s+1))} style={sizeBtn}>A+</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, maxWidth:'780px', margin:'0 auto', width:'100%', padding:'2.5rem 2rem' }}>
        {/* Title block */}
        <div style={{ textAlign:'center', marginBottom:'3rem', paddingBottom:'2rem', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontSize:'72px', marginBottom:'1rem' }}>{product.cover}</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:'900', margin:'0 0 8px' }}>{product.title}</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'14px', margin:'0 0 16px' }}>{product.desc}</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
            <span style={metaChip}>📖 ETAGIA Éditions</span>
            {product.pages && <span style={metaChip}>📄 {product.pages} pages</span>}
            <span style={{ ...metaChip, background:'rgba(74,127,245,0.1)', color:'#4A7FF5', border:'1px solid rgba(74,127,245,0.25)' }}>✅ Accès à vie</span>
          </div>
        </div>

        {/* Body text */}
        <div style={{ fontSize:`${fontSize}px`, lineHeight:1.9, color:'var(--text-primary)', whiteSpace:'pre-wrap', fontFamily:'var(--font-body)' }}>
          {product.longDesc || product.desc}
        </div>

        {/* Download CTA */}
        <div style={{ marginTop:'3rem', padding:'1.5rem', background:'rgba(74,127,245,0.06)', border:'1px solid rgba(74,127,245,0.2)', borderRadius:'16px', textAlign:'center' }}>
          <div style={{ fontSize:'32px', marginBottom:'8px' }}>⬇️</div>
          <div style={{ fontWeight:'700', fontSize:'15px', marginBottom:'6px' }}>Télécharger le fichier complet</div>
          <p style={{ color:'var(--text-muted)', fontSize:'13px', margin:'0 0 16px' }}>
            Accédez au contenu intégral en haute résolution sur votre appareil.
          </p>
          <button onClick={() => {
            const blob = new Blob([`ETAGIA LMS — ${product.title}\n\nAchat confirmé le ${new Date().toLocaleDateString('fr-FR')}\n\n${product.longDesc || product.desc}\n\n---\nFichier protégé — Licence accordée à l'acheteur uniquement.\n`], { type:'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a'); a.href=url; a.download=`${product.title.replace(/\s+/g,'-')}-ETAGIA.txt`; a.click(); URL.revokeObjectURL(url)
          }} style={{ background:'var(--accent)', border:'none', borderRadius:'10px', padding:'11px 28px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-display)' }}>
            ⬇️ Télécharger maintenant
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MarketReaderPage() {
  return <Suspense fallback={<div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>Chargement...</div>}><ReaderContent /></Suspense>
}

const backBtnStyle: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'8px',
  padding:'7px 14px', color:'var(--text-secondary)', fontSize:'13px', cursor:'pointer', fontFamily:'var(--font-display)'
}
const sizeBtn: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'6px',
  padding:'4px 8px', color:'var(--text-secondary)', fontSize:'12px', cursor:'pointer',
}
const metaChip: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'6px',
  padding:'4px 10px', fontSize:'12px', color:'var(--text-muted)',
}

const BOOK_URL = 'https://manuel-formateur-augmente.netlify.app'

export function BookPromo({ variant = 'card' }: { variant?: 'card' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <a
        href={BOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="book-inline"
      >
        📘 Découvrir le <b>Manuel du formateur augmenté</b> →
      </a>
    )
  }

  return (
    <div className="book-promo">
      <div className="book-promo-glow" />
      <div className="book-promo-badge">✦ Le livre de référence</div>
      <h3>Manuel du formateur augmenté</h3>
      <p>
        La méthode complète pour intégrer l&apos;IA générative dans votre pratique de formateur :
        quand déléguer, quand reprendre la main, et comment transformer cet équilibre en avantage
        pédagogique durable.
      </p>
      <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="book-promo-cta">
        Découvrir le manuel →
      </a>
    </div>
  )
}

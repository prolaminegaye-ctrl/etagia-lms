'use client'
import { useState } from 'react'
import Link from 'next/link'
import { blogPosts, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, BlogCategory } from '@/lib/blog/posts'
import { BookPromo } from '@/components/blog/BookPromo'

const FILTERS: Array<{ key: BlogCategory | 'tous'; label: string }> = [
  { key: 'tous', label: 'Tous les articles' },
  { key: 'formateur-augmente', label: CATEGORY_LABELS['formateur-augmente'] },
  { key: 'veille-ia-education', label: CATEGORY_LABELS['veille-ia-education'] },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogIndexPage() {
  const [filter, setFilter] = useState<BlogCategory | 'tous'>('tous')
  const posts = filter === 'tous' ? blogPosts : blogPosts.filter((p) => p.category === filter)

  return (
    <>
      <style>{`
        .blog-nav{position:sticky;top:0;z-index:50;background:rgba(250,246,238,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--line-soft);}
        .blog-wrap{max-width:1080px;margin:0 auto;padding:0 32px;}
        .blog-nav-in{display:flex;align-items:center;justify-content:space-between;height:72px;}
        .blog-brand{display:flex;align-items:center;gap:10px;font-family:var(--serif);font-weight:700;font-size:19px;color:var(--ink);}
        .blog-hero{padding:64px 0 40px;text-align:center;}
        .blog-hero h1{font-size:clamp(32px,4.4vw,52px);margin:14px 0 16px;letter-spacing:-0.025em;}
        .blog-hero p{font-size:17px;color:var(--ink-mut);max-width:560px;margin:0 auto;line-height:1.6;}
        .blog-filters{display:flex;gap:10px;justify-content:center;margin:32px 0 8px;flex-wrap:wrap;}
        .blog-filter{border:1.5px solid var(--line);background:var(--surface);color:var(--ink-mut);font-weight:700;font-size:13.5px;padding:9px 18px;border-radius:999px;cursor:pointer;transition:all .15s;}
        .blog-filter.active{background:var(--grad-signature);color:#fff;border-color:transparent;box-shadow:0 8px 20px rgba(221,94,58,.25);}
        .blog-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;padding:40px 0 90px;}
        .blog-card{background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:26px;display:flex;flex-direction:column;box-shadow:var(--sh-1);transition:transform .18s, box-shadow .18s;}
        .blog-card:hover{transform:translateY(-4px);box-shadow:var(--sh-2);}
        .blog-card .cat{align-self:flex-start;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border-radius:999px;margin-bottom:14px;}
        .blog-card .cat.formateur-augmente{background:var(--orange-50);color:var(--orange-700);}
        .blog-card .cat.veille-ia-education{background:var(--turq-50);color:var(--turq-700);}
        .blog-card h2{font-size:20px;line-height:1.25;margin-bottom:10px;}
        .blog-card p{font-size:14px;color:var(--ink-mut);line-height:1.6;flex:1;}
        .blog-card .meta{display:flex;gap:10px;font-size:12px;color:var(--ink-soft);font-weight:600;margin-top:16px;}
        .blog-card a.readmore{margin-top:14px;font-weight:800;font-size:14px;color:var(--orange-700);}
        .blog-index-promo{margin:20px 0 70px;}
        @media (max-width:760px){.blog-grid{grid-template-columns:1fr;}}
      `}</style>

      <nav className="blog-nav">
        <div className="blog-wrap blog-nav-in">
          <Link className="blog-brand" href="/">← EtagIA Académie</Link>
          <Link href="/" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>Accueil</Link>
        </div>
      </nav>

      <div className="blog-wrap">
        <div className="blog-hero">
          <div className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>Blog des formateurs augmentés</div>
          <h1>Le formateur, augmenté par l&apos;IA — <span style={{ color: 'var(--orange-700)' }}>pas remplacé.</span></h1>
          <p>Méthodes pour intégrer l&apos;IA dans votre pratique pédagogique, et veille hebdomadaire sur l&apos;actualité IA &amp; éducation.</p>
        </div>

        <div className="blog-filters">
          {FILTERS.map((f) => (
            <button key={f.key} className={`blog-filter ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        {filter !== 'tous' && (
          <p style={{ textAlign: 'center', color: 'var(--ink-mut)', fontSize: '14px', maxWidth: '520px', margin: '10px auto 0' }}>
            {CATEGORY_DESCRIPTIONS[filter]}
          </p>
        )}

        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.slug} className="blog-card">
              <span className={`cat ${post.category}`}>{CATEGORY_LABELS[post.category]}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="meta">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <Link className="readmore" href={`/blog/${post.slug}`}>Lire l&apos;article →</Link>
            </article>
          ))}
        </div>

        <div className="blog-index-promo">
          <BookPromo />
        </div>
      </div>
    </>
  )
}

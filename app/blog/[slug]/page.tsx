import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, blogPosts, CATEGORY_LABELS } from '@/lib/blog/posts'
import { BookPromo } from '@/components/blog/BookPromo'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: `${post.title} — Blog EtagIA`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <style>{`
        .post-nav{position:sticky;top:0;z-index:50;background:rgba(250,246,238,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--line-soft);}
        .post-wrap{max-width:760px;margin:0 auto;padding:0 32px;}
        .post-nav-in{display:flex;align-items:center;justify-content:space-between;height:72px;}
        .post-brand{font-family:var(--serif);font-weight:700;font-size:19px;color:var(--ink);}
        .post-cat{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 14px;border-radius:999px;margin:48px 0 18px;}
        .post-cat.formateur-augmente{background:var(--orange-50);color:var(--orange-700);}
        .post-cat.veille-ia-education{background:var(--turq-50);color:var(--turq-700);}
        .post-title{font-size:clamp(30px,4.2vw,44px);line-height:1.12;letter-spacing:-0.02em;margin-bottom:18px;}
        .post-meta{display:flex;gap:12px;color:var(--ink-soft);font-size:13.5px;font-weight:600;margin-bottom:36px;}
        .post-body p{font-size:17px;line-height:1.75;color:var(--ink);margin-bottom:22px;}
        .post-inline-promo{margin:40px 0;text-align:center;}
        .post-sources{margin:44px 0;padding:22px 24px;background:var(--surface-2);border-radius:16px;}
        .post-sources h4{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft);margin-bottom:12px;font-family:var(--sans);}
        .post-sources ul{list-style:none;display:flex;flex-direction:column;gap:8px;}
        .post-sources a{font-size:14px;font-weight:600;color:var(--orange-700);}
        .post-back{display:inline-block;margin:20px 0 60px;font-weight:700;font-size:14px;color:var(--ink-mut);}
        .post-promo-block{margin:20px 0 90px;}
      `}</style>

      <nav className="post-nav">
        <div className="post-wrap post-nav-in">
          <Link className="post-brand" href="/">← EtagIA Académie</Link>
          <Link href="/blog" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>Tous les articles</Link>
        </div>
      </nav>

      <article className="post-wrap">
        <span className={`post-cat ${post.category}`}>{CATEGORY_LABELS[post.category]}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>{post.author}</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>

        <div className="post-body">
          {post.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {post.sources && post.sources.length > 0 && (
          <div className="post-sources">
            <h4>Sources</h4>
            <ul>
              {post.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="post-promo-block">
          <BookPromo />
        </div>

        <Link className="post-back" href="/blog">← Retour au blog</Link>
      </article>
    </>
  )
}

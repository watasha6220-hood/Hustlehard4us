import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Icon from "@/components/Icons";
import CTABanner from "@/components/CTABanner";
import { posts, getPost } from "@/data/posts";
import { site } from "@/data/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image }],
    },
  };
}

const fmtDate = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function Block({ block }) {
  switch (block.t) {
    case "h2":
      return <h2 className="heading-md mt-10 mb-4">{block.c}</h2>;
    case "p":
      return <p className="mb-5 leading-relaxed text-zinc-300">{block.c}</p>;
    case "ul":
      return (
        <ul className="mb-6 space-y-2.5">
          {block.c.map((li) => (
            <li key={li} className="flex items-start gap-2.5 text-zinc-300">
              <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-gold-400" />
              <span className="leading-relaxed">{li}</span>
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <aside className="mb-6 rounded-xl border border-gold-400/40 bg-gold-400/5 p-5 text-sm leading-relaxed text-gold-200">
          💡 <strong>Shop tip:</strong> {block.c}
        </aside>
      );
    case "cta":
      return (
        <div className="my-8 text-center">
          <Link href={block.href} className="btn-primary">
            {block.c} <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ params }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: `${site.url}${post.image}`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        {/* Header */}
        <header className="relative overflow-hidden border-b border-ink-700 py-16 sm:py-20" aria-label="Article header">
          <div className="absolute inset-0" aria-hidden="true">
            <Image src={post.image} alt="" fill sizes="100vw" className="object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 to-ink-950" />
          </div>
          <div className="container-x relative">
            <div className="mx-auto max-w-3xl">
              <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-gold-300">
                <Icon name="arrowLeft" className="h-4 w-4" /> All articles
              </Link>
              <p className="eyebrow">
                <span className="h-px w-6 bg-gold-400" aria-hidden="true" /> {post.category}
              </p>
              <h1 className="heading-lg">{post.title}</h1>
              <p className="mt-4 text-sm text-zinc-500">{fmtDate(post.date)} · {post.readMinutes} min read · by {site.shortName}</p>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="container-x py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            {post.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      {/* Related */}
      {others.length > 0 && (
        <section className="border-t border-ink-700 bg-ink-900/40 py-14" aria-label="More articles">
          <div className="container-x">
            <h2 className="heading-md mb-6">Keep Reading</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card group flex gap-4 p-4 transition hover:border-gold-400/60">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                    <Image src={p.image} alt="" fill sizes="112px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gold-500">{p.category}</p>
                    <h3 className="font-bold leading-snug text-white group-hover:text-gold-300">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}

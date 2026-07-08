import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Section";
import CTABanner from "@/components/CTABanner";
import { posts } from "@/data/posts";

export const metadata = {
  title: "The Print Shop Blog — Guides, Pricing & File Prep",
  description:
    "Straight-talk guides from a working print shop: DTG vs screen print vs DTF, file prep for perfect transfers, real pricing breakdowns, and banner sizing.",
};

const fmtDate = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function BlogPage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="Blog intro">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> The Blog
            </p>
            <h1 className="heading-xl">
              Print Game <span className="text-gold-400">Knowledge</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              No fluff, no jargon — the same straight answers we give customers at the
              counter, written down so you can order smarter.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-label="Articles">
        <div className="container-x grid gap-6 sm:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.3)}>
              <Link href={`/blog/${post.slug}`} className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold-400/60">
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-800">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink-950">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 text-xs text-zinc-500">{fmtDate(post.date)} · {post.readMinutes} min read</p>
                  <h2 className="mb-3 font-display text-lg uppercase leading-snug text-white group-hover:text-gold-300">
                    {post.title}
                  </h2>
                  <p className="flex-1 text-sm leading-relaxed text-zinc-400">{post.description}</p>
                  <span className="mt-4 text-sm font-bold text-gold-400">Read the guide →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABanner
        title="Learned Something? Put It to Work."
        text="Instant quotes, gang sheet builder, 3D prints — everything in these guides is one click away."
      />
    </>
  );
}

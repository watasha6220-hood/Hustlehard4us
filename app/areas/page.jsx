import Link from "next/link";
import Icon from "@/components/Icons";
import { Reveal } from "@/components/Section";
import CTABanner from "@/components/CTABanner";
import { cities } from "@/data/cities";

export const metadata = {
  title: "Service Areas — Antelope Valley & Beyond",
  description:
    "Hustle Hard 4 US Designs serves Palmdale, Lancaster, Quartz Hill, Santa Clarita, Rosamond, and Littlerock with custom t-shirts, banners, DTF gang sheets, and embroidery.",
};

export default function AreasPage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="Service areas intro">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Service Areas
            </p>
            <h1 className="heading-xl">
              The Whole Valley <span className="text-gold-400">Covered</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Based in Palmdale, printing for the entire Antelope Valley and beyond.
              Find your city for local details — or ship anywhere in the US.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-label="Cities served">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link
                href={`/areas/${c.slug}`}
                className="card group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-glow"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400 transition group-hover:bg-gold-400 group-hover:text-ink-950">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <h2 className="heading-md text-lg">{c.name}</h2>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold-500">{c.distance}</p>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-400">
                  {c.intro.split(". ")[0]}.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-400 transition group-hover:gap-3">
                  {c.name} details <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABanner
        title="Not on the List? We Still Got You."
        text="DTF transfers and most orders ship anywhere in the US — distance is not a problem."
      />
    </>
  );
}

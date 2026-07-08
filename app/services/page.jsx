import Link from "next/link";
import Icon from "@/components/Icons";
import { Reveal, SectionHeader } from "@/components/Section";
import GallerySlider from "@/components/GallerySlider";
import CTABanner from "@/components/CTABanner";
import TrustBadges from "@/components/TrustBadges";
import { services } from "@/data/services";

export const metadata = {
  title: "Services — T-Shirts, Banners, Gang Sheets, Embroidery & More",
  description:
    "Full-service custom printing in Palmdale, CA: DTG & screen printed t-shirts, vinyl banners, DTF gang sheets, embroidery, event displays, and logo design.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Page hero */}
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="Services intro">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Our Services
            </p>
            <h1 className="heading-xl">
              One Shop. <span className="text-gold-400">Every Print.</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              From a single custom tee to a full event takeover — here&apos;s everything we
              can produce for your brand, business, or big moment.
            </p>
          </Reveal>

          {/* Jump nav */}
          <nav aria-label="Jump to service" className="mt-8 flex flex-wrap gap-2">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-ink-700 bg-ink-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-gold-400 hover:text-gold-300"
              >
                {s.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Service sections */}
      {services.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          aria-label={s.name}
          className={`scroll-mt-24 py-16 sm:py-24 ${i % 2 === 1 ? "bg-ink-900/40" : ""}`}
        >
          <div className={`container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
            <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-400">
                <Icon name={s.icon} className="h-7 w-7" />
              </span>
              <p className="eyebrow">{s.tagline}</p>
              <h2 className="heading-lg mb-4">{s.name}</h2>
              <p className="mb-6 leading-relaxed text-zinc-400">{s.description}</p>

              <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-white">
                Perfect for:
              </h3>
              <ul className="mb-8 grid gap-2.5 sm:grid-cols-2">
                {s.useCases.map((u) => (
                  <li key={u} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    {u}
                  </li>
                ))}
              </ul>

              <Link href={s.ctaHref || "/quote"} className="btn-primary">
                {s.cta} <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={0.1} className={i % 2 === 1 ? "lg:order-1" : ""}>
              <GallerySlider images={s.gallery} alt={`${s.name} examples`} />
            </Reveal>
          </div>
        </section>
      ))}

      <TrustBadges />
      <CTABanner
        title="Not Sure Which Service You Need?"
        text="Tell us your idea and budget — we'll recommend the best print method and get you a quote same day."
      />
    </>
  );
}

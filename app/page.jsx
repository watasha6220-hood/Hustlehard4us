import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icons";
import { Reveal, SectionHeader } from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
import FeaturedProducts from "@/components/FeaturedProducts";
import SketchToShirt from "@/components/SketchToShirt";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import CTABanner from "@/components/CTABanner";
import { services } from "@/data/services";

export const metadata = {
  title: "Custom Printing in Palmdale, CA | Hustle Hard 4 US Designs",
  description:
    "Custom t-shirts, banners, DTF gang sheets, embroidery & displays in Palmdale, CA. Bring your ideas to life — get a free quote today.",
};

const marqueeItems = [
  "Custom T-Shirts", "Banners & Signs", "DTF Gang Sheets", "Embroidery",
  "Event Displays", "Logo Design", "No Job Too Small", "Fast Turnaround",
];

const howItWorks = [
  {
    icon: "pen",
    step: "01",
    title: "Design",
    text: "Upload your artwork or work with our designers to create something fresh. We prep everything print-perfect.",
  },
  {
    icon: "bolt",
    step: "02",
    title: "Print",
    text: "We produce your order with commercial-grade equipment — DTG, screen print, DTF, vinyl, or embroidery.",
  },
  {
    icon: "truck",
    step: "03",
    title: "Deliver",
    text: "Pick up in Palmdale or have it shipped. Most orders are done in 3–5 business days. Rush? Just ask.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden" aria-label="Hero">
        <Image
          src="/images/hero.jpg"
          alt="Inside the Hustle Hard 4 US Designs print shop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" aria-hidden="true" />
        <div className="absolute inset-0 bg-grit" aria-hidden="true" />
        {/* drifting gold ambience blobs */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <span className="blob h-96 w-96 bg-gold-500/50" style={{ top: "-10%", left: "55%" }} />
          <span className="blob h-72 w-72 bg-amber-600/40" style={{ bottom: "-15%", left: "20%", animationDelay: "-6s" }} />
          <span className="blob h-80 w-80 bg-gold-300/25" style={{ top: "30%", right: "-8%", animationDelay: "-12s" }} />
        </div>

        <div className="container-x relative py-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
              Palmdale, CA • Custom Print Shop
            </p>
            <h1 className="heading-xl">
              Bring Your Ideas
              <br />
              <span className="text-gold-400">To Life</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-zinc-300">
              Custom printing for brands, events, and hustlers. T-shirts, banners,
              gang sheets, embroidery &amp; more — designed, printed, and delivered
              by people who grind as hard as you do.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/quote" className="btn-primary text-base">
                Get a Quote <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
              <Link href="/quote" className="btn-secondary text-base">
                <Icon name="upload" className="h-5 w-5" /> Start Your Design
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-zinc-400">
              <span className="flex items-center gap-2">
                <Icon name="star" className="h-4 w-4 text-gold-400" /> 5-star rated
              </span>
              <span className="flex items-center gap-2">
                <Icon name="bolt" className="h-4 w-4 text-gold-400" /> 3–5 day turnaround
              </span>
              <span className="flex items-center gap-2">
                <Icon name="shield" className="h-4 w-4 text-gold-400" /> No minimums*
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ MARQUEE STRIP ============ */}
      <div className="overflow-hidden border-y border-ink-700 bg-gold-400 py-3" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-8">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-sm uppercase tracking-wide text-ink-950">
              {item} <span className="text-ink-950/40">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ SERVICES PREVIEW ============ */}
      <section className="py-20 sm:py-28" aria-label="Our services">
        <div className="container-x">
          <SectionHeader
            eyebrow="What We Do"
            title="Print Anything. Seriously."
            text="Seven services, one shop, zero excuses — from t-shirts to 3D prints, whatever your brand needs to get seen, we make it."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* ============ FEATURED PRODUCTS ============ */}
      <FeaturedProducts />

      {/* ============ SKETCH → SHIRT (before/after) ============ */}
      <SketchToShirt />

      {/* ============ HOW IT WORKS ============ */}
      <section className="relative overflow-hidden py-20 sm:py-28" aria-label="How it works">
        <div className="container-x">
          <SectionHeader
            eyebrow="Simple Process"
            title="Design → Print → Deliver"
            text="From idea to in-hand in three steps. We handle the hard part so you can keep hustling."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((h, i) => (
              <Reveal key={h.step} delay={i * 0.12} className="relative">
                <div className="card relative h-full p-8">
                  <span className="absolute right-6 top-4 font-display text-6xl text-ink-700" aria-hidden="true">
                    {h.step}
                  </span>
                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400 text-ink-950 shadow-glow">
                    <Icon name={h.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="heading-md mb-3">{h.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{h.text}</p>
                </div>
                {i < 2 && (
                  <Icon
                    name="arrowRight"
                    className="absolute -right-6 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-gold-400 md:block"
                  />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <CTABanner />
    </>
  );
}

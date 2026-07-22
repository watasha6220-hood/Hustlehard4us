import { Suspense } from "react";
import Image from "next/image";
import Icon from "@/components/Icons";
import { Reveal, SectionHeader } from "@/components/Section";
import CTABanner from "@/components/CTABanner";
import Showcase3D from "@/components/Showcase3D";
import Print3DClient from "./Print3DClient";
import { MATERIALS_3D, PRICING_3D } from "@/data/printing3d";

export const metadata = {
  title: "3D Printing Service — Pick a Design or Upload Your File",
  description:
    "Local 3D printing in Palmdale, CA from $0.12/gram. Choose from our ready-made designs or upload your own STL/3MF file. PLA, PETG, TPU & resin. No setup fee on shop designs, $10 minimum, 48hr rush available.",
};

// Service schema for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "3D Printing Service",
  provider: { "@type": "LocalBusiness", name: "Hustlehard4USDesigns" },
  areaServed: "Antelope Valley, CA",
  description:
    "Custom 3D printing: ready-made designs or customer-uploaded STL files in PLA, PETG, TPU, and resin.",
  offers: { "@type": "Offer", priceCurrency: "USD", price: "10.00", description: "Starting at $10 minimum order, $0.12 per gram PLA" },
};

const perks = [
  { icon: "bolt", title: "Fast Local Turnaround", text: "Most prints done in 2–4 days. 48hr rush available. Free pickup in Palmdale — no shipping wait." },
  { icon: "shield", title: "Transparent Pricing", text: "Simple per-gram rates with the estimate shown before you order. Uploads get exact weight confirmed — no surprises." },
  { icon: "pencil", title: "Design Help Included", text: "No 3D file? We'll model simple parts, add your logo, or fix broken STLs. Just describe what you need." },
];

export default function Print3DPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-700 py-20 sm:py-28" aria-label="3D printing intro">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/3d/printer-hero.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
        </div>
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> New Service • 3D Printing
            </p>
            <h1 className="heading-xl">
              If You Can Imagine It,
              <br />
              <span className="text-gold-400">We Can Print It</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-zinc-300">
              Figurines, functional parts, branded merch, one-of-a-kind gifts.
              Pick one of our proven designs or upload your own file — priced by
              the gram, printed locally in Palmdale.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="#configurator" className="btn-primary text-base">
                Start a Print <Icon name="arrowRight" className="h-5 w-5" />
              </a>
              <a href="#pricing" className="btn-secondary text-base">
                See Pricing
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-ink-700 bg-ink-900/60" aria-label="Why print with us">
        <div className="container-x grid gap-6 py-10 md:grid-cols-3">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-sm uppercase text-white">{p.title}</h2>
                <p className="mt-1 text-sm text-zinc-400">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Showcase gallery */}
      <Showcase3D />

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 bg-ink-900/40 py-20 sm:py-28" aria-label="3D printing pricing">
        <div className="container-x">
          <SectionHeader
            eyebrow="Simple Pricing"
            title="Priced by the Gram. Period."
            text="We benchmarked national print services — most charge $0.10–$0.30 per gram plus setup fees on every order. We start at the bottom of that range, waive setup on our shop designs, and you skip shipping with free local pickup."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MATERIALS_3D.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.07}>
                <div className={`card flex h-full flex-col p-7 ${m.id === "pla" ? "border-gold-400/60 shadow-glow" : ""}`}>
                  {m.id === "pla" && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink-950">
                      Most Popular
                    </span>
                  )}
                  <h3 className="heading-md text-lg">{m.name}</h3>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold-500">{m.tagline}</p>
                  <p className="mb-1">
                    <span className="font-display text-4xl text-white">${m.perGram.toFixed(2)}</span>
                    <span className="text-sm font-bold text-zinc-500"> / gram</span>
                  </p>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-400">{m.blurb}</p>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    <li className="flex gap-2"><Icon name="check" className="h-3.5 w-3.5 shrink-0 text-gold-400" /> {m.colors.length} colors available</li>
                    <li className="flex gap-2"><Icon name="check" className="h-3.5 w-3.5 shrink-0 text-gold-400" /> 0.12–0.28mm layer options</li>
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-10 max-w-3xl">
            <div className="card bg-grit p-7">
              <h3 className="heading-md mb-4 text-base">The Fine Print (Simple Version)</h3>
              <ul className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> Personalized items (lithophane lamps, logo keychains, nameplates) are <strong className="text-white">flat-priced with all labor included</strong> — no surprises</li>
                <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> ${PRICING_3D.minOrder} order minimum</li>
                <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> ${PRICING_3D.setupFee} file setup on uploads — <strong className="text-white">waived on shop designs</strong></li>
                <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> 10% off 5+ pieces · 20% off 20+ pieces</li>
                <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> 48hr rush available (+50%)</li>
                <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> Upload estimates confirmed after slicing — price never changes without your OK</li>
                <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> Failed print? We reprint it free. Simple.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Configurator */}
      <section className="py-16 sm:py-24" aria-label="Order a 3D print">
        <div className="container-x">
          <SectionHeader
            eyebrow="Order Online"
            title="Configure Your Print"
            text="Live estimate updates as you build. Submit and we confirm within one business day."
          />
          <Suspense fallback={<p className="text-center text-zinc-500">Loading configurator…</p>}>
            <Print3DClient />
          </Suspense>
        </div>
      </section>

      <CTABanner
        title="Got a Weird Idea? Perfect."
        text="Custom parts, discontinued pieces, branded merch nobody else has — that's exactly what 3D printing is for."
      />
    </>
  );
}

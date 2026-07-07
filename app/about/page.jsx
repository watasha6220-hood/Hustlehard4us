import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icons";
import { Reveal, SectionHeader } from "@/components/Section";
import TrustBadges from "@/components/TrustBadges";
import CTABanner from "@/components/CTABanner";
import { site } from "@/data/site";

export const metadata = {
  title: "About Us — We Turn Your Vision Into Reality",
  description:
    "Hustle Hard 4 US Designs is a Palmdale, CA custom print shop built by hustlers, for hustlers. Custom apparel, embroidery, and merchandise — no job too small or too large.",
};

const values = [
  {
    icon: "pencil",
    title: "100% Custom Work",
    text: "Nothing off a shelf. Every order starts with your idea — we shape it, refine it, and print it exactly how you envisioned.",
  },
  {
    icon: "shield",
    title: "No Job Too Small or Large",
    text: "One memorial shirt for family or 5,000 units for a product launch — every order gets the same care and quality control.",
  },
  {
    icon: "pen",
    title: "Creative Support",
    text: "Stuck on the design? Our in-house creatives help with logos, layouts, and artwork prep at no-pressure prices.",
  },
  {
    icon: "bolt",
    title: "Hustle-Speed Turnaround",
    text: "We know deadlines don't wait. Most jobs finish in 3–5 business days, and we'll always shoot straight about timelines.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Story hero */}
      <section className="relative overflow-hidden border-b border-ink-700 py-20 sm:py-28" aria-label="Our story">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/products/tees-stack.jpg" alt="" fill sizes="100vw" className="object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/90 to-ink-950" />
        </div>
        <div className="container-x relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Our Story
            </p>
            <h1 className="heading-xl">
              We Turn Your Vision
              <br />
              <span className="text-gold-400">Into Reality</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Hustle Hard 4 US Designs was built the same way our customers build their
              dreams — from scratch, with grind. We started printing for local
              entrepreneurs in the Antelope Valley who needed someone to take their
              ideas as seriously as they did. Today we produce custom apparel,
              embroidery, banners, and merchandise for brands, businesses, teams, and
              families across Southern California.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-zinc-300">
              The name says it all: we hustle hard <em>for us</em> — and &ldquo;us&rdquo;
              includes every customer who walks through the door with a vision.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28" aria-label="What we stand for">
        <div className="container-x">
          <SectionHeader
            eyebrow="What We Stand For"
            title="Built Different, On Purpose"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="card flex h-full gap-5 p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-ink-950 shadow-glow">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="heading-md mb-2 text-lg">{v.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Location & contact */}
      <section className="py-20 sm:py-28" aria-label="Visit us">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Come Through
            </p>
            <h2 className="heading-lg mb-6">Proudly Printing in Palmdale</h2>
            <ul className="space-y-5 text-zinc-300">
              <li className="flex gap-4">
                <Icon name="pin" className="h-6 w-6 shrink-0 text-gold-400" />
                <div>
                  <p className="font-bold text-white">Address</p>
                  <address className="not-italic text-zinc-400">{site.address.full}</address>
                </div>
              </li>
              <li className="flex gap-4">
                <Icon name="phone" className="h-6 w-6 shrink-0 text-gold-400" />
                <div>
                  <p className="font-bold text-white">Phone</p>
                  <a href={site.phoneHref} className="text-zinc-400 transition hover:text-gold-300">{site.phone}</a>
                </div>
              </li>
              <li className="flex gap-4">
                <Icon name="clock" className="h-6 w-6 shrink-0 text-gold-400" />
                <div>
                  <p className="font-bold text-white">Hours</p>
                  {site.hours.map((h) => (
                    <p key={h.days} className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">{h.days}:</span> {h.time}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">Contact Us</Link>
              <Link href="/quote" className="btn-secondary">Get a Quote</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-700">
              <Image
                src="/images/products/gang-sheet.jpg"
                alt="DTF gang sheet production at Hustle Hard 4 US Designs"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <CTABanner
        title="Your Grind Deserves Great Merch"
        text="Whether you're launching a brand or throwing an event, let's make something people remember."
      />
    </>
  );
}

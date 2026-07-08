import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Icon from "@/components/Icons";
import { Reveal } from "@/components/Section";
import TrustBadges from "@/components/TrustBadges";
import CTABanner from "@/components/CTABanner";
import ServiceCard from "@/components/ServiceCard";
import { cities, getCity } from "@/data/cities";
import { services } from "@/data/services";
import { site } from "@/data/site";

// Pre-render every city page at build time (pure static = fast + SEO)
export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const city = getCity(params.slug);
  if (!city) return {};
  return {
    title: `Custom Printing in ${city.name}, CA — T-Shirts, Banners & Embroidery`,
    description: `${city.headline}: custom t-shirts, DTF gang sheets, vinyl banners, embroidery & displays for ${city.name}. ${city.distance}. Call ${site.phone} for a fast quote.`,
    alternates: { canonical: `${site.url}/areas/${city.slug}` },
  };
}

export default function CityPage({ params }) {
  const city = getCity(params.slug);
  if (!city) notFound();

  // LocalBusiness schema scoped to this service area
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    telephone: "+1-213-841-3068",
    url: `${site.url}/areas/${city.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: "CA",
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: `${city.name}, CA` },
    priceRange: "$$",
  };

  const otherCities = cities.filter((c) => c.slug !== city.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-700 py-20 sm:py-28" aria-label={`${city.name} intro`}>
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/hero.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/90 to-ink-950" />
        </div>
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
              Serving {city.name} • {city.county}
            </p>
            <h1 className="heading-xl">
              {city.headline.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gold-400">{city.headline.split(" ").slice(-2).join(" ")}</span>
            </h1>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-bold text-gold-300">
              <Icon name="pin" className="h-4 w-4" /> {city.distance}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">{city.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="btn-primary">
                Get a Quote <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={site.phoneHref} className="btn-secondary">
                <Icon name="phone" className="h-4 w-4" /> {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What locals order */}
      <section className="py-16 sm:py-24" aria-label={`Popular orders in ${city.name}`}>
        <div className="container-x grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="heading-lg mb-6">
              What {city.name} Orders Most
            </h2>
            <ul className="space-y-3">
              {city.popular.map((p) => (
                <li key={p} className="card flex items-center gap-4 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400">
                    <Icon name="star" className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-zinc-200">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card bg-grit p-8">
              <h3 className="heading-md mb-4 text-lg">The Local Rundown</h3>
              <p className="mb-6 leading-relaxed text-zinc-400">{city.localNote}</p>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex gap-3">
                  <Icon name="pin" className="h-5 w-5 shrink-0 text-gold-400" />
                  <span>Pickup at {site.address.full}</span>
                </li>
                <li className="flex gap-3">
                  <Icon name="bolt" className="h-5 w-5 shrink-0 text-gold-400" />
                  <span>Most orders done in 3–5 business days — rush available</span>
                </li>
                <li className="flex gap-3">
                  <Icon name="truck" className="h-5 w-5 shrink-0 text-gold-400" />
                  <span>Shipping available anywhere in the US</span>
                </li>
              </ul>
              <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold-400 hover:underline">
                Read our FAQ <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services grid (shared component = consistent, not thin content) */}
      <section className="bg-ink-900/40 py-16 sm:py-24" aria-label="Services available">
        <div className="container-x">
          <Reveal className="mb-10 text-center">
            <h2 className="heading-lg">Every Service, Available in {city.name}</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Other areas */}
      <section className="py-14" aria-label="Other service areas">
        <div className="container-x">
          <h2 className="heading-md mb-5">Also Serving</h2>
          <div className="flex flex-wrap gap-2">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="rounded-full border border-ink-700 bg-ink-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-gold-400 hover:text-gold-300"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title={`${city.name}, Let's Make Something.`}
        text="Instant online estimates, honest turnaround times, and print quality that reps your brand right."
      />
    </>
  );
}

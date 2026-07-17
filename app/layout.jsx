import "./globals.css";
import { Archivo, Archivo_Black } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickContact from "@/components/QuickContact";
import SmoothScroll from "@/components/SmoothScroll";
import GrainOverlay from "@/components/GrainOverlay";
import Analytics from "@/components/Analytics";
import PromoBanner from "@/components/PromoBanner";
import EmailCapture from "@/components/EmailCapture";
import { site } from "@/data/site";

// Self-hosted fonts (downloaded at build time, served from our own domain)
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Custom Printing in Palmdale, CA`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "custom printing Palmdale",
    "custom t-shirts",
    "DTF gang sheets",
    "vinyl banners",
    "embroidery Palmdale CA",
    "screen printing Antelope Valley",
    "custom displays",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  // Google Search Console verification — paste your code in .env.local
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// LocalBusiness structured data for SEO (rich result in Google/Maps)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": site.url,
  name: site.name,
  description: site.description,
  telephone: "+1-661-480-5275",
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.stateShort,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 34.5578, longitude: -118.0498 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "15:00" },
  ],
  sameAs: [site.social.instagram, site.social.facebook, site.social.tiktok],
  priceRange: "$$",
  image: `${site.url}/images/hero.jpg`,
  areaServed: ["Palmdale CA", "Lancaster CA", "Antelope Valley", "Los Angeles County"],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom T-Shirt Printing" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "DTF Gang Sheets" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vinyl Banners & Signs" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Embroidery" } },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivoBlack.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold-400 focus:px-4 focus:py-2 focus:font-bold focus:text-ink-950"
        >
          Skip to content
        </a>
        <PromoBanner />
        <Navbar />
        <main id="main" role="main">
          {children}
        </main>
        <EmailCapture />
        <Footer />
        <QuickContact />
        <SmoothScroll />
        <GrainOverlay />
        <Analytics />
      </body>
    </html>
  );
}

import Link from "next/link";
import Icon from "./Icons";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { cities } from "@/data/cities";

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-ink-700 bg-ink-900 bg-grit">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-400 font-display text-sm text-ink-950">
              HH
            </span>
            <div className="leading-none">
              <p className="font-display text-sm uppercase text-white">Hustle Hard 4 US</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold-400">Designs</p>
            </div>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-zinc-400">
            Custom printing for brands, events, and hustlers. If you can dream it, we can print it.
          </p>
          <div className="flex gap-3">
            {[
              { name: "instagram", href: site.social.instagram, label: "Instagram" },
              { name: "facebook", href: site.social.facebook, label: "Facebook" },
              { name: "tiktok", href: site.social.tiktok, label: "TikTok" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} on ${s.label}`}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-zinc-300 transition hover:border-gold-400 hover:text-gold-400"
              >
                <Icon name={s.name} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <nav aria-label="Footer services">
          <h3 className="heading-md mb-4 text-base">Services</h3>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services#${s.id}`} className="transition hover:text-gold-300">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick links */}
        <nav aria-label="Footer quick links">
          <h3 className="heading-md mb-4 text-base">Quick Links</h3>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li><Link href="/shop" className="transition hover:text-gold-300">Shop Products</Link></li>
            <li><Link href="/gang-sheet" className="transition hover:text-gold-300">Gang Sheet Builder</Link></li>
            <li><Link href="/3d-printing" className="transition hover:text-gold-300">3D Printing</Link></li>
            <li><Link href="/work" className="transition hover:text-gold-300">Recent Work</Link></li>
            <li><Link href="/quote" className="transition hover:text-gold-300">Get a Quote</Link></li>
            <li><Link href="/track" className="transition hover:text-gold-300">Track Your Order</Link></li>
            <li><Link href="/faq" className="transition hover:text-gold-300">FAQ</Link></li>
            <li><Link href="/blog" className="transition hover:text-gold-300">Blog</Link></li>
            <li><Link href="/about" className="transition hover:text-gold-300">About Us</Link></li>
            <li><Link href="/contact" className="transition hover:text-gold-300">Contact</Link></li>
            <li><Link href="/es" className="font-semibold text-gold-400 transition hover:text-gold-300">🇲🇽 Se Habla Español</Link></li>
          </ul>
          <h3 className="heading-md mb-3 mt-6 text-base">Areas We Serve</h3>
          <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-zinc-400">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={`/areas/${c.slug}`} className="transition hover:text-gold-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="heading-md mb-4 text-base">Visit / Contact</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3">
              <Icon name="pin" className="h-5 w-5 shrink-0 text-gold-400" />
              <address className="not-italic">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.stateShort} {site.address.zip}
              </address>
            </li>
            <li className="flex gap-3">
              <Icon name="phone" className="h-5 w-5 shrink-0 text-gold-400" />
              <a href={site.phoneHref} className="transition hover:text-gold-300">{site.phone}</a>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" className="h-5 w-5 shrink-0 text-gold-400" />
              <a href={`mailto:${site.email}`} className="break-all transition hover:text-gold-300">{site.email}</a>
            </li>
            <li className="flex gap-3">
              <Icon name="clock" className="h-5 w-5 shrink-0 text-gold-400" />
              <div>
                {site.hours.map((h) => (
                  <p key={h.days}>
                    <span className="font-semibold text-zinc-300">{h.days}:</span> {h.time}
                  </p>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-700">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Palmdale, CA • Serving the Antelope Valley &amp; beyond</p>
        </div>
      </div>
    </footer>
  );
}

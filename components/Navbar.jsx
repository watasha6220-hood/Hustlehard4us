"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";
import { site } from "@/data/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/work", label: "Our Work" },
  { href: "/gang-sheet", label: "Gang Sheets" },
  { href: "/3d-printing", label: "3D Printing" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/es", label: "🇲🇽 Español" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-ink-700 bg-ink-950/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav aria-label="Main navigation" className="container-x flex h-16 items-center justify-between sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-400 font-display text-sm text-ink-950">
            HH
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-sm uppercase tracking-wide text-white">
              Hustlehard4USDesigns
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold-400">
              Hustlehard4USDesigns
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`btn-ghost text-sm ${
                  pathname === l.href ? "text-gold-400" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={site.phoneHref} className="btn-ghost text-sm" aria-label={`Call ${site.phone}`}>
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </a>
          <Link href="/quote" className="btn-primary px-5 py-2.5 text-sm">
            Get a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-zinc-200 hover:bg-ink-700 lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-b border-ink-700 bg-ink-950/95 backdrop-blur-md lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-lg px-4 py-3 font-semibold ${
                      pathname === l.href
                        ? "bg-ink-800 text-gold-400"
                        : "text-zinc-200 hover:bg-ink-800"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-3 px-4 pb-2">
                <a href={site.phoneHref} className="btn-secondary flex-1 py-3 text-sm">
                  <Icon name="phone" className="h-4 w-4" /> Call
                </a>
                <Link href="/quote" className="btn-primary flex-1 py-3 text-sm">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

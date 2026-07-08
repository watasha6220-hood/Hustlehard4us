"use client";

// Dismissible promo bar — controlled from data/site.js → site.promo.
// Set text to "" to hide site-wide. Dismissal remembered per-message.

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "./Icons";
import { site } from "@/data/site";

export default function PromoBanner() {
  const promo = site.promo;
  // render immediately (SSR-visible); hide after mount if previously dismissed
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!promo?.text) return;
    if (localStorage.getItem(`hh4us_promo_${promo.text}`) === "1") setDismissed(true);
  }, [promo]);

  if (!promo?.text || dismissed) return null;

  return (
    <div className="relative bg-gold-400 text-center" role="region" aria-label="Current promotion">
      <Link
        href={promo.href || "/quote"}
        className="block px-10 py-2 text-sm font-extrabold uppercase tracking-wide text-ink-950 hover:underline"
      >
        ⚡ {promo.text}
      </Link>
      <button
        type="button"
        aria-label="Dismiss promotion"
        onClick={() => {
          localStorage.setItem(`hh4us_promo_${promo.text}`, "1");
          setDismissed(true);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-950/70 hover:text-ink-950"
      >
        <Icon name="close" className="h-4 w-4" />
      </button>
    </div>
  );
}

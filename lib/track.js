"use client";

// Conversion event tracking — fires to Microsoft Clarity and/or GA4
// when they're loaded (silently no-ops otherwise).
// Events used: quote_started, quote_submitted, gangsheet_ordered,
// print3d_ordered, contact_sent, subscribed

export function track(event) {
  try {
    if (typeof window === "undefined") return;
    window.clarity?.("event", event);
    window.gtag?.("event", event);
  } catch {
    /* never break the UI over analytics */
  }
}

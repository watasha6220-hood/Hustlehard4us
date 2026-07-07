"use client";

// #3 — Free analytics + live chat, loaded only when IDs are configured.
//
//  Microsoft Clarity (100% free): https://clarity.microsoft.com
//    → create project → copy the project ID → NEXT_PUBLIC_CLARITY_ID
//
//  Tawk.to live chat (100% free): https://tawk.to
//    → Administration → Chat Widget → copy the two IDs from the embed URL
//      https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
//    → NEXT_PUBLIC_TAWK_PROPERTY_ID / NEXT_PUBLIC_TAWK_WIDGET_ID
//
//  Without IDs this component renders nothing — zero performance cost.

import { useEffect } from "react";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

export default function Analytics() {
  useEffect(() => {
    // ---- Microsoft Clarity (heatmaps + session recordings) ----
    if (CLARITY_ID && !window.clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", CLARITY_ID);
    }

    // ---- Tawk.to live chat ----
    if (TAWK_PROPERTY_ID && TAWK_WIDGET_ID && !window.Tawk_API) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      s.charset = "UTF-8";
      s.setAttribute("crossorigin", "*");
      document.head.appendChild(s);
    }
  }, []);

  return null;
}

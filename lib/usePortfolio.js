"use client";

// Merges starter portfolio samples with admin-added real jobs.
// Once real jobs exist in the DB, they appear first (newest at top).

import { useEffect, useState } from "react";
import { portfolioItems as staticItems } from "@/data/portfolio";
import { db } from "./db";

export function normalizePortfolio(p) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    image: p.image,
    caption: p.caption || "",
    active: p.active !== false,
    _fromDb: true,
  };
}

export function usePortfolio() {
  const [items, setItems] = useState(staticItems);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const dbRows = (await db.listPortfolio()).map(normalizePortfolio);
        if (!alive) return;
        const overrides = new Map(dbRows.map((r) => [r.id, r]));
        const base = staticItems
          .map((s) => overrides.get(s.id) || s)
          .filter((s) => s.active !== false);
        const additions = dbRows.filter(
          (r) => r.active !== false && !staticItems.some((s) => s.id === r.id)
        );
        setItems([...additions, ...base]);
      } catch {
        /* fall back to starter items */
      }
    })();
    return () => { alive = false; };
  }, []);

  return items;
}

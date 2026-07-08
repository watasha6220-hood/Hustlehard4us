"use client";

// Merges the starter 3D design catalog (data/printing3d.js) with
// admin-managed designs. DB rows with the same id override the
// starter entries; active:false hides them from the site.

import { useEffect, useState } from "react";
import { designs3d as staticDesigns } from "@/data/printing3d";
import { db } from "./db";

export function normalizeDbDesign(d) {
  return {
    id: d.id,
    name: d.name,
    image: d.image,
    weightGrams: Number(d.weight_grams ?? d.weightGrams) || 0,
    sizeNote: d.size_note ?? d.sizeNote ?? "",
    badge: d.badge || null,
    blurb: d.blurb || "",
    flatPrice: d.flat_price != null ? Number(d.flat_price) : d.flatPrice != null ? Number(d.flatPrice) : null,
    flatNote: d.flat_note ?? d.flatNote ?? "",
    active: d.active !== false,
    _fromDb: true,
  };
}

export function useDbDesigns() {
  const [merged, setMerged] = useState(staticDesigns);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const dbRows = (await db.listDesigns3d()).map(normalizeDbDesign);
        if (!alive) return;
        const overrides = new Map(dbRows.map((d) => [d.id, d]));
        const base = staticDesigns
          .map((d) => overrides.get(d.id) || d)
          .filter((d) => d.active !== false);
        const additions = dbRows.filter(
          (d) => d.active !== false && !staticDesigns.some((s) => s.id === d.id)
        );
        setMerged([...additions, ...base]);
      } catch {
        // fall back to static catalog silently
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { designs: merged, loaded };
}

"use client";

// Merges static catalog (data/products.js) with admin-managed products.
// Admin products with the same id override static ones; inactive = hidden.

import { useEffect, useState } from "react";
import { products as staticProducts } from "@/data/products";
import { db } from "./db";

export function normalizeDbProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price) || 0,
    priceNote: p.price_note ?? p.priceNote ?? "",
    image: p.image,
    badge: p.badge || null,
    featured: !!p.featured,
    description: p.description || "",
    options: p.options || [],
    active: p.active !== false,
    _fromDb: true,
  };
}

export function useDbProducts() {
  const [merged, setMerged] = useState(staticProducts);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const dbRows = (await db.listProducts()).map(normalizeDbProduct);
        if (!alive) return;
        const overrides = new Map(dbRows.map((p) => [p.id, p]));
        const base = staticProducts
          .map((p) => overrides.get(p.id) || p)
          .filter((p) => p.active !== false);
        const additions = dbRows.filter(
          (p) => p.active !== false && !staticProducts.some((s) => s.id === p.id)
        );
        setMerged([...additions, ...base]);
      } catch {
        // fall back to static catalog silently
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { products: merged, loaded };
}

"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { categories } from "@/data/products";
import { useDbProducts } from "@/lib/useDbProducts";

export default function ShopGrid() {
  const [category, setCategory] = useState("All");
  const [quickView, setQuickView] = useState(null);
  const { products } = useDbProducts(); // static catalog + admin-added products

  const filtered = useMemo(
    () => (category === "All" ? products : products.filter((p) => p.category === category)),
    [category, products]
  );

  return (
    <section className="py-14 sm:py-20" aria-label="Product catalog">
      <div className="container-x">
        {/* Category filter */}
        <div className="mb-10 flex flex-wrap items-center gap-2" role="group" aria-label="Filter products by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                category === c
                  ? "border-gold-400 bg-gold-400 text-ink-950 shadow-glow"
                  : "border-ink-700 bg-ink-900 text-zinc-300 hover:border-gold-400 hover:text-gold-300"
              }`}
            >
              {c}
            </button>
          ))}
          <p className="ml-auto text-sm text-zinc-500" aria-live="polite">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
          ))}
        </div>
      </div>
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}

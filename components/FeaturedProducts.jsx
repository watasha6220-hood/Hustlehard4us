"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "./Icons";
import { SectionHeader, Reveal } from "./Section";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { useDbProducts } from "@/lib/useDbProducts";

export default function FeaturedProducts() {
  const [quickView, setQuickView] = useState(null);
  const { products } = useDbProducts();
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <section className="bg-ink-900/40 py-20 sm:py-28" aria-label="Featured products">
      <div className="container-x">
        <SectionHeader
          eyebrow="Fan Favorites"
          title="Featured Products"
          text="Our most-ordered items. Hover for a quick view, or jump straight to a quote."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/shop" className="btn-secondary">
            Browse All Products <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}

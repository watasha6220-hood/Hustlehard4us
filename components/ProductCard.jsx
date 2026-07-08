"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "./Icons";
import { Reveal } from "./Section";

export default function ProductCard({ product, index = 0, onQuickView }) {
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)}>
      <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold-400/60">
        <div className="relative aspect-square overflow-hidden bg-ink-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink-950">
              {product.badge}
            </span>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink-950/85 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="btn-primary w-full py-2.5 text-sm"
                aria-label={`Quick view ${product.name}`}
              >
                <Icon name="eye" className="h-4 w-4" /> Quick View
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            {product.category}
          </p>
          <h3 className="mb-2 font-display text-base uppercase text-white">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-bold text-gold-400">
              {product.priceNote && (
                <span className="mr-1 text-xs font-semibold text-zinc-500">
                  {product.priceNote}
                </span>
              )}
              ${product.price.toFixed(2)}
            </p>
            <Link
              href={`/quote?product=${product.id}`}
              className="text-sm font-bold text-zinc-300 underline-offset-4 transition hover:text-gold-300 hover:underline"
            >
              Quote →
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

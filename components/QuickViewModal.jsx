"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";

export default function QuickViewModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = product ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} details`}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16 }}
            className="card grid w-full max-w-3xl overflow-hidden md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square bg-ink-800">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    {product.category}
                  </p>
                  <h3 className="heading-md">{product.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close quick view"
                  className="rounded-lg p-2 text-zinc-400 hover:bg-ink-700 hover:text-white"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-4 text-2xl font-extrabold text-gold-400">
                {product.priceNote && (
                  <span className="mr-1 text-sm font-semibold text-zinc-500">{product.priceNote}</span>
                )}
                ${product.price.toFixed(2)}
              </p>

              <p className="mb-5 text-sm leading-relaxed text-zinc-400">{product.description}</p>

              <ul className="mb-6 flex flex-wrap gap-2" aria-label="Product options">
                {product.options.map((o) => (
                  <li key={o} className="rounded-full border border-ink-700 bg-ink-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                    {o}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex gap-3">
                <Link href={`/quote?product=${product.id}`} className="btn-primary flex-1 py-3 text-sm">
                  Get a Quote
                </Link>
                <Link href="/contact" className="btn-secondary py-3 text-sm">
                  Ask Us
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

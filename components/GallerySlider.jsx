"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";

/** Reusable image gallery slider with thumbnails */
export default function GallerySlider({ images, alt = "Gallery image" }) {
  const [index, setIndex] = useState(0);
  if (!images?.length) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div aria-label={alt} role="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-700 bg-ink-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={`${alt} ${index + 1} of ${images.length}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink-950/70 p-2.5 text-white backdrop-blur transition hover:bg-gold-400 hover:text-ink-950"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink-950/70 p-2.5 text-white backdrop-blur transition hover:bg-gold-400 hover:text-ink-950"
            >
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Gallery thumbnails">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`View image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index ? "border-gold-400" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";
import { SectionHeader } from "./Section";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % testimonials.length), []);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next]);

  const t = testimonials[index];

  return (
    <section
      className="bg-ink-900 bg-grit py-20 sm:py-28"
      aria-label="Customer testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-x">
        <SectionHeader
          eyebrow="Real Reviews"
          title="Hustlers Trust Us"
          text="From first-time brand owners to established businesses — here's what our customers say."
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="card relative overflow-hidden p-8 sm:p-12">
            <span className="absolute -top-4 left-8 font-display text-[120px] leading-none text-gold-400/10" aria-hidden="true">
              &ldquo;
            </span>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="relative"
              >
                <div className="mb-4 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Icon key={i} name="star" className="h-5 w-5 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="mb-6 text-lg leading-relaxed text-zinc-200 sm:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer>
                  <p className="font-display text-sm uppercase text-white">{t.name}</p>
                  <p className="text-sm text-zinc-500">{t.role}</p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button type="button" onClick={prev} aria-label="Previous testimonial" className="btn-secondary p-3">
              <Icon name="arrowLeft" className="h-4 w-4" />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-gold-400" : "w-2.5 bg-ink-700 hover:bg-zinc-600"
                  }`}
                />
              ))}
            </div>
            <button type="button" onClick={next} aria-label="Next testimonial" className="btn-secondary p-3">
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";
import { Reveal } from "./Section";

export default function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={Math.min(i * 0.04, 0.3)}>
            <div className={`card overflow-hidden transition ${isOpen ? "border-gold-400/60" : ""}`}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-white transition hover:text-gold-300"
                >
                  <span>{f.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen ? "rotate-45 bg-gold-400 text-ink-950" : "bg-ink-700 text-zinc-300"
                    }`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-zinc-400">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

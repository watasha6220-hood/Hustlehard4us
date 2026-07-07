"use client";

import { motion } from "framer-motion";

/** Fade/slide-in wrapper for scroll-reveal animations */
export function Reveal({ children, delay = 0, className = "", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ eyebrow, title, text, align = "center" }) {
  const alignCls = align === "left" ? "text-left items-start" : "text-center items-center mx-auto";
  return (
    <Reveal className={`mb-12 flex max-w-2xl flex-col ${alignCls}`}>
      {eyebrow && (
        <p className="eyebrow">
          <span className="h-px w-6 bg-gold-400" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="heading-lg">{title}</h2>
      {text && <p className="mt-4 text-zinc-400">{text}</p>}
    </Reveal>
  );
}

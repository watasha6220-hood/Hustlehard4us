"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Reveal } from "./Section";
import { usePortfolio } from "@/lib/usePortfolio";
import { portfolioCategories } from "@/data/portfolio";

export default function WorkGrid() {
  const items = usePortfolio();
  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () => (category === "All" ? items : items.filter((i) => i.category === category)),
    [category, items]
  );

  return (
    <section className="py-14 sm:py-20" aria-label="Portfolio gallery">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-center gap-2" role="group" aria-label="Filter work by category">
          {portfolioCategories.map((c) => (
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
            {filtered.length} job{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i * 0.05, 0.3)}>
              <figure className="card group overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-gold-400 backdrop-blur">
                    {item.category}
                  </span>
                </div>
                <figcaption className="p-5">
                  <h2 className="font-display text-base uppercase text-white">{item.title}</h2>
                  {item.caption && <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{item.caption}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

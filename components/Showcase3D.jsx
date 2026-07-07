"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "./Icons";
import { Reveal, SectionHeader } from "./Section";
import { designBasePrice } from "@/data/printing3d";
import { useDbDesigns } from "@/lib/useDbDesigns";

// 3D print showcase — starter catalog + admin-added designs (merged).
// "Print This" deep-links into the configurator with the design preselected.

export default function Showcase3D() {
  const { designs: designs3d } = useDbDesigns();

  return (
    <section className="py-20 sm:py-28" aria-label="3D print showcase">
      <div className="container-x">
        <SectionHeader
          eyebrow="The Showcase"
          title="Fresh Off the Print Bed"
          text="Every piece below is printed in-house. Pick one, choose your color, and it's yours — or use them as proof of what your custom file will look like."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {designs3d.map((d, i) => (
            <Reveal key={d.id} delay={Math.min(i * 0.05, 0.3)}>
              <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold-400/60">
                <div className="relative aspect-square overflow-hidden bg-ink-800">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {d.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink-950">
                      {d.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/85 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                    <Link
                      href={`/3d-printing?design=${d.id}#configurator`}
                      className="btn-primary w-full py-2.5 text-sm"
                      aria-label={`Print ${d.name}`}
                    >
                      <Icon name="bolt" className="h-4 w-4" /> Print This
                    </Link>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="mb-1 font-display text-base uppercase text-white">{d.name}</h3>
                  <p className="mb-2 text-xs text-zinc-500">{d.sizeNote} · ~{d.weightGrams}g</p>
                  <p className="mb-3 text-sm leading-relaxed text-zinc-400">{d.blurb}</p>
                  <p className="font-bold text-gold-400">
                    {d.flatPrice ? (
                      <>
                        ${d.flatPrice.toFixed(2)}
                        <span className="ml-1.5 rounded-full bg-gold-400/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gold-400">
                          All-inclusive
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="mr-1 text-xs font-semibold text-zinc-500">from</span>
                        ${Math.max(10, designBasePrice(d)).toFixed(2)}
                        <span className="ml-1 text-xs font-semibold text-zinc-500">in PLA</span>
                      </>
                    )}
                  </p>
                  {d.flatNote && (
                    <p className="mt-1 text-[11px] leading-snug text-zinc-500">{d.flatNote}</p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

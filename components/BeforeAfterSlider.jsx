"use client";

// Before/After drag slider — "napkin sketch → finished shirt".
// Pure pointer events + clip-path, keyboard accessible (arrow keys),
// no dependencies.

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "The Idea",
  afterLabel = "The Result",
  alt = "Before and after comparison",
}) {
  const [pos, setPos] = useState(50); // percentage
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    containerRef.current?.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
  };

  return (
    <div
      ref={containerRef}
      className="group relative aspect-square w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-ink-700 shadow-card"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="slider"
      aria-label={`${alt} — drag to compare`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* AFTER (base layer) */}
      <Image
        src={after}
        alt={`${alt} — after`}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="pointer-events-none object-cover"
      />

      {/* BEFORE (clipped layer) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${alt} — before`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10"
        style={{ left: `calc(${pos}% - 1px)` }}
        aria-hidden="true"
      >
        <div className="h-full w-0.5 bg-gold-400 shadow-glow" />
        <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink-950 bg-gold-400 text-ink-950 shadow-glow transition-transform group-active:scale-95">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="h-5 w-5">
            <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-ink-950/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white backdrop-blur">
        ✏️ {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ink-950">
        🔥 {afterLabel}
      </span>
    </div>
  );
}

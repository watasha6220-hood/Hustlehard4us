"use client";

// ============================================================
//  GANG SHEET BUILDER
//  • 22" wide DTF sheet, length grows as you add designs
//  • Upload PNG/JPG designs → drag, resize, rotate, duplicate
//  • "Auto-Arrange" packs everything tightly (shelf algorithm)
//  • Live price by linear foot → checkout saves the order
//    (Supabase when configured, demo storage otherwise)
// ============================================================

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icons";
import { db } from "@/lib/db";
import { uploadArtwork } from "@/lib/storage";
import { site } from "@/data/site";
import { track } from "@/lib/track";
import { useSpamGuard, HoneypotField } from "@/lib/spam";
import { isStripeEnabled, startCheckout } from "@/lib/stripe-client";

// DTF quality check: warn if uploaded image is too low-res for its
// printed size. 300 DPI is ideal; below 150 DPI will look pixelated.
const DPI_WARN = 150;

// ---- Sheet + pricing config (edit freely) -------------------
export const SHEET = {
  widthIn: 22,             // printable width in inches
  maxLengthIn: 240,        // 20 ft max
  minItemIn: 0.5,
  maxItemIn: 22,
  pricePerFoot: 7.99,      // matches data/products.js gang sheet price
  minCharge: 15.98,        // 2 ft minimum
  roundToFt: 0.5,          // bill in half-foot increments
};

const uid = () => `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const clamp = (v, min, max) => Math.min(max, Math.min(max, Math.max(min, v)));

export default function GangSheetBuilder() {
  const [items, setItems] = useState([]);        // {id,src,name,w,h,x,y,ar,rot}
  const [selected, setSelected] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  // ---- draft autosave: layout survives refresh/accidental close ----
  const DRAFT_KEY = "hh4us_gangsheet_draft";
  const [draftRestored, setDraftRestored] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved?.items?.length) {
        setItems(saved.items);
        setDraftRestored(true);
      }
    } catch { /* corrupt draft — ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      if (items.length) localStorage.setItem(DRAFT_KEY, JSON.stringify({ items, at: Date.now() }));
      else localStorage.removeItem(DRAFT_KEY);
    } catch { /* quota exceeded (huge images) — skip silently */ }
  }, [items]);

  const sheetRef = useRef(null);
  const fileRef = useRef(null);
  const dragState = useRef(null);
  const [pxPerIn, setPxPerIn] = useState(24);

  // Keep scale in sync with container width
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPxPerIn(el.clientWidth / SHEET.widthIn));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- derived: used length + price -------------------------
  const usedLengthIn = useMemo(() => {
    if (!items.length) return 0;
    return Math.max(...items.map((it) => it.y + (it.rot ? it.w : it.h)));
  }, [items]);

  const price = useMemo(() => {
    if (!items.length) return { feet: 0, total: 0 };
    const rawFt = usedLengthIn / 12;
    const feet = Math.max(
      SHEET.minCharge / SHEET.pricePerFoot,
      Math.ceil(rawFt / SHEET.roundToFt) * SHEET.roundToFt
    );
    return { feet, total: feet * SHEET.pricePerFoot };
  }, [items.length, usedLengthIn]);

  const sheetLengthIn = Math.max(24, Math.ceil((usedLengthIn + 6) / 12) * 12);

  // ---- add designs -------------------------------------------
  const addFiles = useCallback((files) => {
    [...files].forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const ar = img.width / img.height; // aspect ratio
          const w = clamp(6, SHEET.minItemIn, Math.min(SHEET.maxItemIn, 6));
          const h = w / ar;
          setItems((prev) => {
            const y = prev.length
              ? Math.max(...prev.map((it) => it.y + (it.rot ? it.w : it.h))) + 0.5
              : 0.5;
            return [
              ...prev,
              // pxW/pxH = source resolution, used for the DPI quality check
              { id: uid(), src: e.target.result, name: file.name, w, h, x: 0.5, y, ar, rot: false, pxW: img.width, pxH: img.height },
            ];
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // ---- item ops ----------------------------------------------
  const patchItem = (id, patch) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setSelected(null);
  };

  const duplicateItem = (id) => {
    setItems((prev) => {
      const src = prev.find((it) => it.id === id);
      if (!src) return prev;
      const copy = { ...src, id: uid(), x: clamp(src.x + 1, 0, SHEET.widthIn - (src.rot ? src.h : src.w)), y: src.y + 1 };
      return [...prev, copy];
    });
  };

  const rotateItem = (id) =>
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const rot = !it.rot;
        const wOnSheet = rot ? it.h : it.w;
        return { ...it, rot, x: clamp(it.x, 0, SHEET.widthIn - wOnSheet) };
      })
    );

  // ---- shelf packing (auto-arrange) --------------------------
  const autoArrange = () => {
    const gap = 0.35;
    const sorted = [...items].sort((a, b) => {
      const ah = a.rot ? a.w : a.h;
      const bh = b.rot ? b.w : b.h;
      return bh - ah;
    });
    let x = gap, y = gap, shelfH = 0;
    const placed = sorted.map((it) => {
      const w = it.rot ? it.h : it.w;
      const h = it.rot ? it.w : it.h;
      if (x + w + gap > SHEET.widthIn) {
        x = gap;
        y += shelfH + gap;
        shelfH = 0;
      }
      const out = { ...it, x, y };
      x += w + gap;
      shelfH = Math.max(shelfH, h);
      return out;
    });
    setItems(placed);
  };

  // ---- drag / resize (pointer events) ------------------------
  const onPointerDown = (e, id, mode) => {
    e.stopPropagation();
    e.preventDefault();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    setSelected(id);
    dragState.current = {
      id, mode,
      startX: e.clientX, startY: e.clientY,
      origX: it.x, origY: it.y, origW: it.w, origH: it.h,
      rot: it.rot, ar: it.ar,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  const onPointerMove = useCallback((e) => {
    const s = dragState.current;
    if (!s) return;
    const dxIn = (e.clientX - s.startX) / pxPerInRef.current;
    const dyIn = (e.clientY - s.startY) / pxPerInRef.current;

    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== s.id) return it;
        if (s.mode === "move") {
          const wOnSheet = it.rot ? it.h : it.w;
          return {
            ...it,
            x: clamp(s.origX + dxIn, 0, SHEET.widthIn - wOnSheet),
            y: clamp(s.origY + dyIn, 0, SHEET.maxLengthIn),
          };
        }
        // resize (keep aspect ratio, drag corner)
        const delta = Math.max(dxIn, dyIn);
        let w = clamp(s.origW + delta, SHEET.minItemIn, SHEET.maxItemIn);
        let h = w / s.ar;
        if (h > SHEET.maxItemIn) { h = SHEET.maxItemIn; w = h * s.ar; }
        const wOnSheet = it.rot ? h : w;
        return { ...it, w, h, x: clamp(it.x, 0, SHEET.widthIn - wOnSheet) };
      })
    );
  }, []);

  const onPointerUp = useCallback(() => {
    dragState.current = null;
    window.removeEventListener("pointermove", onPointerMove);
  }, [onPointerMove]);

  // pxPerIn inside stable callbacks
  const pxPerInRef = useRef(pxPerIn);
  useEffect(() => { pxPerInRef.current = pxPerIn; }, [pxPerIn]);

  // ---- DPI quality check: designs printed too large for their pixels
  const lowResItems = items.filter((it) => {
    if (!it.pxW) return false;
    const dpi = it.pxW / it.w; // pixels per printed inch
    return dpi < DPI_WARN;
  });

  // ---- checkout ----------------------------------------------
  const guard = useSpamGuard(5);
  const submitOrder = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (guard.isSpam()) { setSubmitted({ id: "spam" }); return; }
    setSaving(true);
    try {
      // Upload each unique design file to Supabase Storage (skipped in demo mode)
      const uniqueSrcs = [...new Set(items.map((it) => it.src))];
      const urls = (
        await Promise.all(uniqueSrcs.map((src) => uploadArtwork(src, "gang-sheets")))
      ).filter(Boolean);

      const order = await db.submitGangSheet({
        artwork_urls: urls,
        sheet_width: SHEET.widthIn,
        sheet_length: Number(usedLengthIn.toFixed(1)),
        items: items.map(({ id, name, w, h, x, y, rot }) => ({
          id, name,
          w: Number(w.toFixed(2)), h: Number(h.toFixed(2)),
          x: Number(x.toFixed(2)), y: Number(y.toFixed(2)),
          rotated: rot,
        })),
        item_count: items.length,
        price: Number(price.total.toFixed(2)),
        name: form.name,
        email: form.email,
        phone: form.phone,
        notes: form.notes || null,
        lang: "en",
        status: "new",
      });
      track("gangsheet_ordered");
      setSubmitted(order);
    } catch (err) {
      console.error("Gang sheet save failed:", err);
      setSubmitted({ id: "offline" });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  if (submitted) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12" role="status">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-ink-950">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 className="heading-lg mb-3">Gang Sheet Ordered!</h2>
        <p className="mb-2 text-zinc-400">
          {items.length} design{items.length !== 1 ? "s" : ""} on {price.feet} linear ft —{" "}
          <span className="font-bold text-gold-400">${price.total.toFixed(2)}</span>
        </p>
        <p className="mb-8 text-zinc-400">
          {isStripeEnabled
            ? "Pay now to lock in your spot in the print queue, or wait for us to confirm the layout first."
            : "We'll confirm your layout and send an invoice within 1 business day."}{" "}
          Questions? Call{" "}
          <a href={site.phoneHref} className="font-bold text-gold-400 hover:underline">{site.phone}</a>.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {isStripeEnabled && (
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                startCheckout({
                  kind: "gang_sheet",
                  price: price.total,
                  description: `DTF Gang Sheet — ${items.length} designs, ${price.feet} linear ft`,
                  email: form.email,
                  orderId: submitted?.id,
                }).catch((e) => alert(e.message))
              }
            >
              💳 Pay ${price.total.toFixed(2)} Now
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => { setSubmitted(null); setItems([]); setCheckout(false); setForm({ name: "", email: "", phone: "", notes: "" }); }}
          >
            Build Another Sheet
          </button>
        </div>
      </div>
    );
  }

  const selectedItem = items.find((it) => it.id === selected);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* ================= CANVAS ================= */}
      <div>
        {draftRestored && (
          <p className="mb-3 rounded-lg border border-gold-400/30 bg-gold-400/5 px-3 py-2 text-xs text-gold-300" role="status">
            ✨ Your previous layout was restored automatically.
            <button type="button" className="ml-2 font-bold underline" onClick={() => { setItems([]); setDraftRestored(false); }}>
              Start fresh
            </button>
          </p>
        )}
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary px-5 py-2.5 text-sm">
            <Icon name="upload" className="h-4 w-4" /> Add Designs
          </button>
          <input
            ref={fileRef} type="file" accept="image/*" multiple className="sr-only"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
          <button type="button" onClick={autoArrange} disabled={items.length < 2} className="btn-secondary px-5 py-2.5 text-sm disabled:opacity-40">
            <Icon name="layers" className="h-4 w-4" /> Auto-Arrange
          </button>
          {selectedItem && (
            <div className="flex items-center gap-1 rounded-xl border border-gold-400/50 bg-gold-400/10 px-2 py-1">
              <button type="button" onClick={() => rotateItem(selected)} className="btn-ghost px-2.5 py-1.5 text-xs" title="Rotate 90°">⟳ Rotate</button>
              <button type="button" onClick={() => duplicateItem(selected)} className="btn-ghost px-2.5 py-1.5 text-xs" title="Duplicate">⧉ Duplicate</button>
              <button type="button" onClick={() => removeItem(selected)} className="btn-ghost px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300" title="Delete">✕ Delete</button>
            </div>
          )}
        </div>

        {/* Sheet */}
        <div
          className="relative overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900 p-3"
          style={{ maxHeight: "70vh" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        >
          <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            <span>← {SHEET.widthIn}&quot; wide →</span>
            <span>{usedLengthIn > 0 ? `${(usedLengthIn / 12).toFixed(2)} ft used` : "Empty sheet"}</span>
          </div>
          <div
            ref={sheetRef}
            role="application"
            aria-label="Gang sheet layout canvas — drag designs to position them"
            className="relative w-full select-none rounded-lg"
            style={{
              height: sheetLengthIn * pxPerIn,
              backgroundColor: "#dcdcdc",
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
              backgroundSize: `${pxPerIn}px ${pxPerIn}px`,
              touchAction: "none",
            }}
            onPointerDown={() => setSelected(null)}
          >
            {/* foot markers */}
            {Array.from({ length: Math.floor(sheetLengthIn / 12) }).map((_, i) => (
              <div key={i} className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-zinc-400/70" style={{ top: (i + 1) * 12 * pxPerIn }}>
                <span className="absolute -top-2.5 right-1 text-[10px] font-bold text-zinc-500">{i + 1} ft</span>
              </div>
            ))}

            {/* items */}
            {items.map((it) => {
              const wPx = (it.rot ? it.h : it.w) * pxPerIn;
              const hPx = (it.rot ? it.w : it.h) * pxPerIn;
              const isSel = it.id === selected;
              return (
                <div
                  key={it.id}
                  className={`absolute cursor-move ${isSel ? "z-20" : "z-10"}`}
                  style={{ left: it.x * pxPerIn, top: it.y * pxPerIn, width: wPx, height: hPx }}
                  onPointerDown={(e) => onPointerDown(e, it.id, "move")}
                >
                  <div className={`relative h-full w-full ${isSel ? "outline outline-2 outline-gold-500" : "outline outline-1 outline-transparent hover:outline-zinc-400"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.src} alt={it.name} draggable={false}
                      className="h-full w-full object-fill"
                      style={{ transform: it.rot ? "rotate(90deg) scale(var(--s))" : "none", "--s": it.rot ? `${it.w / it.h}` : "1" }}
                    />
                    {isSel && (
                      <>
                        <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-ink-950 px-1.5 py-0.5 text-[10px] font-bold text-gold-400">
                          {(it.rot ? it.h : it.w).toFixed(1)}&quot; × {(it.rot ? it.w : it.h).toFixed(1)}&quot;
                        </span>
                        <span
                          role="slider" aria-label={`Resize ${it.name}`} aria-valuenow={Math.round(it.w)} tabIndex={0}
                          onPointerDown={(e) => onPointerDown(e, it.id, "resize")}
                          className="absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-ink-950 bg-gold-400"
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {!items.length && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
                <Icon name="upload" className="h-8 w-8" />
                <p className="text-sm font-bold">Drop design files here or click “Add Designs”</p>
                <p className="text-xs">PNG with transparent background works best</p>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          💡 Tip: click a design to select it — drag to move, use the gold corner to resize, and the toolbar to rotate/duplicate.
        </p>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside aria-label="Gang sheet summary">
        <div className="card sticky top-24 p-6">
          <h2 className="heading-md mb-5 text-lg">Sheet Summary</h2>
          {lowResItems.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200" role="alert">
              ⚠️ <strong>{lowResItems.length} design{lowResItems.length > 1 ? "s" : ""} may print blurry</strong> at the current size:{" "}
              {lowResItems.map((it) => it.name).join(", ")}. Shrink {lowResItems.length > 1 ? "them" : "it"} on the sheet or upload a higher-resolution file (300 DPI recommended).
            </div>
          )}
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-400">Designs</dt><dd className="font-bold text-white">{items.length}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Sheet width</dt><dd className="font-bold text-white">{SHEET.widthIn}&quot;</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Length used</dt><dd className="font-bold text-white">{(usedLengthIn / 12).toFixed(2)} ft</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Billed length</dt><dd className="font-bold text-white">{price.feet} ft</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Rate</dt><dd className="font-bold text-white">${SHEET.pricePerFoot.toFixed(2)} / ft</dd></div>
            <div className="flex justify-between border-t border-ink-700 pt-3 text-base">
              <dt className="font-bold text-white">Total</dt>
              <dd className="font-extrabold text-gold-400" aria-live="polite">${price.total.toFixed(2)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-zinc-500">Billed in {SHEET.roundToFt}-ft increments · ${SHEET.minCharge.toFixed(2)} minimum · 48hr turnaround</p>

          <AnimatePresence mode="wait">
            {!checkout ? (
              <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  type="button"
                  onClick={() => setCheckout(true)}
                  disabled={!items.length}
                  className="btn-primary mt-6 w-full disabled:pointer-events-none disabled:opacity-40"
                >
                  Order This Sheet <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form" onSubmit={submitOrder}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-6 space-y-4" aria-label="Gang sheet checkout"
              >
                <HoneypotField value={guard.hp} onChange={guard.setHp} />
                <div>
                  <label className="label" htmlFor="gs-name">Full name *</label>
                  <input id="gs-name" required autoComplete="name" className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label" htmlFor="gs-email">Email *</label>
                  <input id="gs-email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="label" htmlFor="gs-phone">Phone *</label>
                  <input id="gs-phone" type="tel" required autoComplete="tel" className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="label" htmlFor="gs-notes">Notes</label>
                  <textarea id="gs-notes" rows={2} className="input resize-none" placeholder="Deadline, special instructions…" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                </div>
                <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
                  {saving ? "Placing Order…" : `Place Order — $${price.total.toFixed(2)}`}
                </button>
                <button type="button" onClick={() => setCheckout(false)} className="btn-ghost w-full text-sm">← Back to editing</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}

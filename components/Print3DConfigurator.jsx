"use client";

// ============================================================
//  3D PRINT CONFIGURATOR
//  Path A: pick one of our ready-made designs (setup fee waived)
//  Path B: upload your own STL/3MF/OBJ + estimated weight
//  → live price: grams × material rate × qty, bulk tiers auto,
//    $10 minimum, optional 48hr rush (+50%)
// ============================================================

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icons";
import { db } from "@/lib/db";
import { uploadArtwork } from "@/lib/storage";
import { site } from "@/data/site";
import { MATERIALS_3D, PRICING_3D, designs3d as staticDesigns, designBasePrice } from "@/data/printing3d";
import { useDbDesigns } from "@/lib/useDbDesigns";
import { track } from "@/lib/track";
import { useSpamGuard, HoneypotField } from "@/lib/spam";
import { isStripeEnabled, startCheckout } from "@/lib/stripe-client";

const WEIGHT_PRESETS = [
  { label: "Small (keychain, ~25g)", grams: 25 },
  { label: "Medium (phone stand, ~60g)", grams: 60 },
  { label: "Large (planter, ~150g)", grams: 150 },
  { label: "XL (helmet-size, ~400g)", grams: 400 },
];

export default function Print3DConfigurator({ initialDesign }) {
  const { designs: designs3d } = useDbDesigns(); // starter + admin-added
  const [mode, setMode] = useState(initialDesign ? "design" : "design"); // design | upload
  const [designId, setDesignId] = useState(initialDesign || staticDesigns[0].id);
  const [file, setFile] = useState(null);
  const [customGrams, setCustomGrams] = useState(60);
  const [material, setMaterial] = useState("pla");
  const [color, setColor] = useState("Black");
  const [qty, setQty] = useState(1);
  const [rush, setRush] = useState(false);
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (initialDesign && designs3d.some((d) => d.id === initialDesign)) {
      setDesignId(initialDesign);
      setMode("design");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialDesign]);

  const design = designs3d.find((d) => d.id === designId) || designs3d[0];
  const mat = MATERIALS_3D.find((m) => m.id === material);
  const grams = mode === "design" ? design?.weightGrams || 0 : Number(customGrams) || 0;

  // keep chosen color valid for the material
  useEffect(() => {
    if (mat && !mat.colors.includes(color)) setColor(mat.colors[0]);
  }, [material]); // eslint-disable-line react-hooks/exhaustive-deps

  const price = useMemo(() => {
    if (!mat || !grams) return null;
    const q = Math.max(1, Number(qty) || 1);
    const tier = PRICING_3D.bulkTiers.find((t) => q >= t.min) || PRICING_3D.bulkTiers.at(-1);
    const isFlat = mode === "design" && !!design?.flatPrice;
    // Flat-priced designs include labor; per-gram jobs are material-driven
    const unitBase = mode === "design" ? designBasePrice(design, mat) : grams * mat.perGram;
    const unit = unitBase * (1 - tier.discount);
    const setup = mode === "upload" ? PRICING_3D.setupFee : 0; // waived on shop designs
    let total = unit * q + setup;
    if (rush) total *= PRICING_3D.rushMultiplier;
    total = Math.max(total, PRICING_3D.minOrder);
    return { unit, setup, tier, total, q, isFlat };
  }, [mat, grams, qty, rush, mode, design]);

  const canSubmit =
    contact.name.trim() &&
    /\S+@\S+\.\S+/.test(contact.email) &&
    contact.phone.trim() &&
    (mode === "design" ? !!design : true);

  const guard = useSpamGuard(5);
  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || saving) return;
    if (guard.isSpam()) { setSubmitted(true); return; }
    setSaving(true);
    try {
      const fileUrl = file ? await uploadArtwork(file, "3d-models") : null;
      await db.submitPrint3d({
        lang: "en",
        mode,
        design_id: mode === "design" ? designId : null,
        design_name: mode === "design" ? design?.name : file?.name || "Custom upload",
        file_url: fileUrl,
        material: mat.name,
        color,
        grams,
        quantity: Number(qty) || 1,
        rush,
        price: price ? Number(price.total.toFixed(2)) : null,
        notes: notes || null,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        status: "new",
      });
      track("print3d_ordered");
    } catch (err) {
      console.error("3D print order failed:", err);
    } finally {
      setSaving(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12" role="status">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-ink-950">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 className="heading-lg mb-3">Print Order Received!</h2>
        <p className="mb-2 text-zinc-400">
          {mode === "design" ? design?.name : "Your custom model"} in {mat?.name} ({color})
          {price && <> — est. <span className="font-bold text-gold-400">${price.total.toFixed(2)}</span></>}
        </p>
        <p className="mb-8 text-zinc-400">
          {mode === "upload"
            ? "We'll slice your file, confirm exact weight and price, and send a final quote within 1 business day."
            : isStripeEnabled
            ? "Pay now to jump straight into the print queue, or wait for our confirmation first."
            : "We'll confirm your order and turnaround within 1 business day."}{" "}
          Questions? Call <a href={site.phoneHref} className="font-bold text-gold-400 hover:underline">{site.phone}</a>.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {/* Pay Now only for shop designs — uploads need weight confirmation first */}
          {isStripeEnabled && mode === "design" && price && (
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                startCheckout({
                  kind: "print3d",
                  price: price.total,
                  description: `3D Print — ${design?.name} ×${price.q} (${mat?.name}, ${color})`,
                  email: contact.email,
                }).catch((e) => alert(e.message))
              }
            >
              💳 Pay ${price.total.toFixed(2)} Now
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={() => { setSubmitted(false); setFile(null); }}>
            Start Another Print
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} id="configurator" className="scroll-mt-24" aria-label="3D print configurator">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl border border-ink-700 bg-ink-900 p-1.5" role="tablist" aria-label="Choose design source">
            {[
              { id: "design", label: "🏆 Pick One of Our Designs", sub: "No setup fee" },
              { id: "upload", label: "📁 Upload Your Own File", sub: "STL, 3MF, OBJ" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => setMode(m.id)}
                className={`flex-1 rounded-lg px-4 py-3 text-center transition ${
                  mode === m.id ? "bg-gold-400 text-ink-950 shadow-glow" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="block text-sm font-extrabold">{m.label}</span>
                <span className={`text-[11px] font-semibold ${mode === m.id ? "text-ink-950/70" : "text-zinc-600"}`}>{m.sub}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "design" ? (
              <motion.fieldset key="design" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <legend className="heading-md mb-4 text-lg">Choose a design</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {designs3d.map((d) => (
                    <label
                      key={d.id}
                      className={`group cursor-pointer overflow-hidden rounded-xl border transition ${
                        designId === d.id ? "border-gold-400 shadow-glow" : "border-ink-700 hover:border-zinc-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="design3d"
                        value={d.id}
                        checked={designId === d.id}
                        onChange={() => setDesignId(d.id)}
                        className="sr-only"
                      />
                      <span className="relative block aspect-square">
                        <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                        {designId === d.id && (
                          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-ink-950">
                            <Icon name="check" className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </span>
                      <span className="block p-2.5">
                        <span className="block truncate text-xs font-bold text-white">{d.name}</span>
                        <span className="text-[11px] text-zinc-500">
                          {d.flatPrice ? `$${d.flatPrice.toFixed(2)} flat · ${d.sizeNote}` : `~${d.weightGrams}g · ${d.sizeNote}`}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </motion.fieldset>
            ) : (
              <motion.fieldset key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <legend className="heading-md mb-4 text-lg">Upload your model</legend>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload 3D model file"
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files?.[0] || null); }}
                  className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-700 bg-ink-800/50 p-6 text-center transition hover:border-gold-400/60"
                >
                  <Icon name="upload" className="h-7 w-7 text-gold-400" />
                  <p className="font-bold text-white">{file ? file.name : "Drop your STL / 3MF / OBJ here"}</p>
                  <p className="text-xs text-zinc-500">Max 100MB. We'll slice it and confirm exact weight & price.</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".stl,.3mf,.obj,.step,.stp"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>

                <p className="label mt-5">Estimated size (drives the live estimate)</p>
                <div className="flex flex-wrap gap-2">
                  {WEIGHT_PRESETS.map((w) => (
                    <button
                      key={w.grams}
                      type="button"
                      onClick={() => setCustomGrams(w.grams)}
                      className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                        Number(customGrams) === w.grams
                          ? "border-gold-400 bg-gold-400 text-ink-950"
                          : "border-ink-700 text-zinc-300 hover:border-gold-400"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      value={customGrams}
                      onChange={(e) => setCustomGrams(e.target.value)}
                      aria-label="Custom weight in grams"
                      className="input w-24 py-2 text-sm"
                    />
                    <span className="text-xs font-bold text-zinc-500">grams</span>
                  </div>
                </div>
              </motion.fieldset>
            )}
          </AnimatePresence>

          {/* Material */}
          <fieldset>
            <legend className="heading-md mb-4 text-lg">Material</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {MATERIALS_3D.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer flex-col rounded-xl border p-4 transition ${
                    material === m.id ? "border-gold-400 bg-gold-400/10" : "border-ink-700 bg-ink-800/50 hover:border-zinc-500"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.name}</span>
                    <span className="text-sm font-extrabold text-gold-400">${m.perGram.toFixed(2)}/g</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gold-500">{m.tagline}</span>
                  <span className="mt-1.5 text-xs leading-relaxed text-zinc-400">{m.blurb}</span>
                  <input
                    type="radio"
                    name="material3d"
                    value={m.id}
                    checked={material === m.id}
                    onChange={() => setMaterial(m.id)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          {/* Color + qty + rush */}
          <fieldset>
            <legend className="heading-md mb-4 text-lg">Options</legend>
            <p className="label">Color</p>
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Color">
              {mat?.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    color === c ? "border-gold-400 bg-gold-400 text-ink-950" : "border-ink-700 text-zinc-300 hover:border-gold-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="qty3d">Quantity</label>
                <input id="qty3d" type="number" min={1} max={1000} value={qty} onChange={(e) => setQty(e.target.value)} className="input" />
              </div>
              <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-ink-700 bg-ink-800/50 p-3.5">
                <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} className="h-5 w-5 accent-gold-400" />
                <span className="text-sm">
                  <span className="font-bold text-white">48hr Rush</span>{" "}
                  <span className="text-zinc-400">(+50%)</span>
                </span>
              </label>
            </div>

            <label className="label mt-4" htmlFor="notes3d">Notes</label>
            <textarea
              id="notes3d"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Custom text, photo for lithophane, logo details, deadline…"
              className="input resize-none"
            />
          </fieldset>

          {/* Contact */}
          <fieldset>
            <legend className="heading-md mb-4 text-lg">Contact</legend>
            <HoneypotField value={guard.hp} onChange={guard.setHp} />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="n3d">Name *</label>
                <input id="n3d" required autoComplete="name" className="input" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} />
              </div>
              <div>
                <label className="label" htmlFor="e3d">Email *</label>
                <input id="e3d" type="email" required autoComplete="email" className="input" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
              </div>
              <div>
                <label className="label" htmlFor="p3d">Phone *</label>
                <input id="p3d" type="tel" required autoComplete="tel" className="input" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
              </div>
            </div>
          </fieldset>
        </div>

        {/* ===== Price sidebar ===== */}
        <aside aria-label="3D print price summary">
          <div className="card sticky top-24 p-6">
            <h2 className="heading-md mb-5 text-lg">Live Estimate</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-400">Item</dt>
                <dd className="max-w-[55%] truncate text-right font-bold text-white">
                  {mode === "design" ? design?.name : file?.name || "Your upload"}
                </dd>
              </div>
              <div className="flex justify-between"><dt className="text-zinc-400">Material</dt><dd className="font-bold text-white">{mat?.name} · {color}</dd></div>
              <div className="flex justify-between">
                <dt className="text-zinc-400">{price?.isFlat ? "Pricing" : "Est. weight"}</dt>
                <dd className="font-bold text-white">{price?.isFlat ? "Flat rate — labor included" : `${grams}g`}</dd>
              </div>
              {price && (
                <>
                  <div className="flex justify-between"><dt className="text-zinc-400">Per piece</dt><dd className="font-bold text-white">${price.unit.toFixed(2)}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-400">Quantity</dt><dd className="font-bold text-white">× {price.q}</dd></div>
                  {price.setup > 0 && (
                    <div className="flex justify-between"><dt className="text-zinc-400">File setup</dt><dd className="font-bold text-white">${price.setup.toFixed(2)}</dd></div>
                  )}
                  {mode === "design" && (
                    <div className="flex justify-between"><dt className="text-zinc-400">Setup fee</dt><dd className="font-bold text-emerald-400">Waived ✓</dd></div>
                  )}
                  {rush && <div className="flex justify-between"><dt className="text-zinc-400">48hr rush</dt><dd className="font-bold text-white">×1.5</dd></div>}
                  {price.tier.discount > 0 && (
                    <div className="flex justify-between"><dt className="text-zinc-400">Bulk discount</dt><dd className="font-bold text-emerald-400">−{price.tier.discount * 100}%</dd></div>
                  )}
                  <div className="flex justify-between border-t border-ink-700 pt-3 text-base">
                    <dt className="font-bold text-white">Estimated total</dt>
                    <dd className="font-extrabold text-gold-400" aria-live="polite">${price.total.toFixed(2)}</dd>
                  </div>
                </>
              )}
            </dl>
            <p className="mt-3 text-xs text-zinc-500">
              {price?.isFlat && design?.flatNote
                ? design.flatNote + "."
                : `$${PRICING_3D.minOrder} order minimum · uploads get exact weight confirmed after slicing — price never changes without your OK.`}
            </p>
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="btn-primary mt-6 w-full disabled:pointer-events-none disabled:opacity-40"
            >
              {saving ? "Submitting…" : "Submit Print Order"} <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}

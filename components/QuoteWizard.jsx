"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";
import UploadPreview from "./UploadPreview";
import { site } from "@/data/site";
import { db } from "@/lib/db";
import { uploadArtwork } from "@/lib/storage";
import { wizardT } from "@/data/i18n-es";
import { track } from "@/lib/track";
import { useSpamGuard, HoneypotField } from "@/lib/spam";

// ---- Pricing engine (edit rates here) --------------------------------
const PRICING = {
  "custom-t-shirts": { label: "Custom T-Shirts", base: 14.99, unit: "shirt", garment: "shirt" },
  "hoodies": { label: "Hoodies & Sweatshirts", base: 34.99, unit: "hoodie", garment: "shirt" },
  "banners": { label: "Banners & Signs", base: 45, unit: "banner", garment: "banner" },
  "gang-sheets": { label: "DTF Gang Sheets", base: 7.99, unit: "linear ft", garment: "banner" },
  "embroidery": { label: "Embroidery (hats/polos)", base: 24.99, unit: "piece", garment: "shirt" },
  "displays": { label: "Custom Displays / Booths", base: 499, unit: "setup", garment: "banner" },
};

// Bulk discount tiers — the more you order, the lower the per-unit price
const TIERS = [
  { min: 100, discount: 0.3, label: "100+ units — 30% off" },
  { min: 50, discount: 0.22, label: "50–99 units — 22% off" },
  { min: 24, discount: 0.15, label: "24–49 units — 15% off" },
  { min: 12, discount: 0.08, label: "12–23 units — 8% off" },
  { min: 1, discount: 0, label: "1–11 units — standard rate" },
];

const COLOR_OPTIONS = ["Black", "White", "Gold", "Navy", "Red", "Heather Gray", "Teal", "Custom / Mixed"];
const PRINT_OPTIONS = ["DTG (full color)", "Screen Print", "Vinyl (HTV)", "Embroidery", "DTF Transfer", "Not sure — recommend for me"];

// step labels come from wizardT(lang) — see data/i18n-es.js

// Map shop product ids (from ?product= query) to wizard product keys
const productMap = {
  "classic-custom-tee": "custom-t-shirts",
  "full-color-dtg-tee": "custom-t-shirts",
  "team-tee-pack": "custom-t-shirts",
  "heavyweight-hoodie": "hoodies",
  "embroidered-snapback": "embroidery",
  "embroidered-polo": "embroidery",
  "vinyl-banner": "banners",
  "dtf-gang-sheet": "gang-sheets",
  "event-booth-package": "displays",
};

export default function QuoteWizard({ initialProduct, lang = "en" }) {
  const t = wizardT(lang);
  const steps = t.steps;
  const guard = useSpamGuard(4);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    product: productMap[initialProduct] || "",
    file: null,
    needsDesign: false,
    quantity: 24,
    colors: [],
    printMethod: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
    referral: "",
  });

  useEffect(() => {
    track("quote_started");
  }, []);

  useEffect(() => {
    if (productMap[initialProduct]) {
      setForm((f) => ({ ...f, product: productMap[initialProduct] }));
    }
  }, [initialProduct]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const pricing = PRICING[form.product];
  const estimate = useMemo(() => {
    if (!pricing) return null;
    const qty = Math.max(1, Number(form.quantity) || 1);
    const tier = TIERS.find((t) => qty >= t.min) || TIERS[TIERS.length - 1];
    const unit = pricing.base * (1 - tier.discount);
    const design = form.needsDesign ? 45 : 0;
    return {
      qty,
      unit,
      tier,
      design,
      total: unit * qty + design,
    };
  }, [pricing, form.quantity, form.needsDesign]);

  const canNext = () => {
    if (step === 0) return !!form.product;
    if (step === 2) return Number(form.quantity) >= 1;
    if (step === 4)
      return form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim();
    return true; // design + options are optional
  };

  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!canNext() || saving) return;
    // spam guard: honeypot filled or submitted inhumanly fast → silently drop
    if (guard.isSpam()) {
      setSubmitted(true);
      return;
    }
    setSaving(true);
    try {
      // Upload the design file to Supabase Storage (null in demo mode)
      const artworkUrl = form.file ? await uploadArtwork(form.file, "quotes") : null;
      // Saves to Supabase when configured, or local demo storage otherwise.
      // NOTE: product/colors are stored as English values even on /es —
      // the admin panel always reads in English. lang tags the lead 🇪🇸.
      await db.submitQuote({
        artwork_url: artworkUrl,
        product: pricing?.label || form.product,
        quantity: Number(form.quantity) || 1,
        colors: form.colors,
        print_method: form.printMethod || null,
        needs_design: form.needsDesign,
        notes: form.notes || null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        referral: form.referral || null,
        lang,
        estimate: estimate ? Number(estimate.total.toFixed(2)) : null,
        status: "new",
      });
      track("quote_submitted");
    } catch (err) {
      console.error("Quote save failed:", err);
    } finally {
      setSaving(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mx-auto max-w-2xl p-8 text-center sm:p-12"
        role="status"
      >
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-ink-950">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 className="heading-lg mb-3">{t.successTitle}</h2>
        <p className="mb-2 text-zinc-400">
          {t.successBody(form.name.split(" ")[0], pricing ? (lang === "es" ? t.products[form.product] || pricing.label : pricing.label.toLowerCase()) : "")}
        </p>
        {estimate && (
          <p className="mb-6 text-zinc-400">
            {t.successEst}{" "}
            <span className="font-bold text-gold-400">
              ${estimate.total.toFixed(2)}
            </span>{" "}
            <span className="text-sm">{t.successEstNote}</span>
          </p>
        )}
        <p className="mb-8 text-zinc-400">
          {t.successFollow} <strong className="text-white">{t.oneDay}</strong>. {t.needFaster}{" "}
          <a href={site.phoneHref} className="font-bold text-gold-400 hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setSubmitted(false);
            setStep(0);
          }}
        >
          {t.another}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl" aria-label="Quote request wizard">
      {/* Progress */}
      <ol className="mb-10 flex items-center justify-between gap-1" aria-label="Quote steps">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center gap-2">
            <span className="flex w-full items-center">
              <span
                className={`h-1 flex-1 rounded ${i === 0 ? "opacity-0" : i <= step ? "bg-gold-400" : "bg-ink-700"}`}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                aria-current={i === step ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${s}${i < step ? " (completed, click to return)" : ""}`}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${
                  i < step
                    ? "cursor-pointer bg-gold-400 text-ink-950"
                    : i === step
                    ? "bg-gold-400 text-ink-950 shadow-glow"
                    : "bg-ink-700 text-zinc-400"
                }`}
              >
                {i < step ? <Icon name="check" className="h-4 w-4" /> : i + 1}
              </button>
              <span
                className={`h-1 flex-1 rounded ${i === steps.length - 1 ? "opacity-0" : i < step ? "bg-gold-400" : "bg-ink-700"}`}
                aria-hidden="true"
              />
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${i <= step ? "text-gold-400" : "text-zinc-600"}`}>
              {s}
            </span>
          </li>
        ))}
      </ol>

      <div className="card p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {/* STEP 1 — Product */}
            {step === 0 && (
              <fieldset>
                <legend className="heading-md mb-2">{t.whatPrinting}</legend>
                <p className="mb-6 text-sm text-zinc-400">{t.pickProduct}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(PRICING).map(([key, p]) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition ${
                        form.product === key
                          ? "border-gold-400 bg-gold-400/10"
                          : "border-ink-700 bg-ink-800/50 hover:border-zinc-500"
                      }`}
                    >
                      <span>
                        <span className="block font-bold text-white">{t.products[key] || p.label}</span>
                        <span className="text-sm text-zinc-500">{lang === "es" ? "desde" : "from"} ${p.base.toFixed(2)} / {p.unit}</span>
                      </span>
                      <input
                        type="radio"
                        name="product"
                        value={key}
                        checked={form.product === key}
                        onChange={() => set({ product: key })}
                        className="h-5 w-5 accent-gold-400"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {/* STEP 2 — Design upload */}
            {step === 1 && (
              <fieldset>
                <legend className="heading-md mb-2">{t.uploadTitle}</legend>
                <p className="mb-6 text-sm text-zinc-400">{t.uploadSub}</p>
                <UploadPreview
                  garment={pricing?.garment || "shirt"}
                  onFile={(file) => set({ file })}
                />
                <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-ink-700 bg-ink-800/50 p-4">
                  <input
                    type="checkbox"
                    checked={form.needsDesign}
                    onChange={(e) => set({ needsDesign: e.target.checked })}
                    className="h-5 w-5 accent-gold-400"
                  />
                  <span className="text-sm">
                    <span className="font-bold text-white">{t.needDesign}</span>{" "}
                    <span className="text-zinc-400">{t.needDesignSub}</span>
                  </span>
                </label>
              </fieldset>
            )}

            {/* STEP 3 — Quantity */}
            {step === 2 && (
              <fieldset>
                <legend className="heading-md mb-2">{t.howMany}</legend>
                <p className="mb-6 text-sm text-zinc-400">{t.bulkNote}</p>
                <label className="label" htmlFor="qty">{t.quantity} ({pricing?.unit || "units"})</label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={100000}
                  value={form.quantity}
                  onChange={(e) => set({ quantity: e.target.value })}
                  className="input max-w-[180px] text-lg font-bold"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {[12, 24, 50, 100, 250].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => set({ quantity: q })}
                      className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
                        Number(form.quantity) === q
                          ? "border-gold-400 bg-gold-400 text-ink-950"
                          : "border-ink-700 text-zinc-300 hover:border-gold-400"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {estimate && (
                  <div className="mt-8 rounded-xl border border-gold-400/40 bg-gold-400/5 p-5" aria-live="polite">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gold-400">
                      {t.bulkPricing} — {estimate.tier.label}
                    </p>
                    <p className="text-2xl font-extrabold text-white">
                      ${estimate.unit.toFixed(2)}
                      <span className="text-sm font-semibold text-zinc-400"> / {pricing.unit}</span>
                      <span className="mx-3 text-zinc-600">•</span>
                      <span className="text-gold-400">${(estimate.unit * estimate.qty).toFixed(2)} total</span>
                    </p>
                  </div>
                )}
              </fieldset>
            )}

            {/* STEP 4 — Options */}
            {step === 3 && (
              <fieldset>
                <legend className="heading-md mb-2">{t.colorsOptions}</legend>
                <p className="mb-6 text-sm text-zinc-400">{t.colorsSub}</p>

                <p className="label">{t.colorsLabel}</p>
                <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Color options">
                  {COLOR_OPTIONS.map((c) => {
                    const active = form.colors.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          set({
                            colors: active ? form.colors.filter((x) => x !== c) : [...form.colors, c],
                          })
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-gold-400 bg-gold-400 text-ink-950"
                            : "border-ink-700 text-zinc-300 hover:border-gold-400"
                        }`}
                      >
                        {t.colors[c] || c}
                      </button>
                    );
                  })}
                </div>

                <label className="label" htmlFor="method">{t.methodLabel}</label>
                <select
                  id="method"
                  value={form.printMethod}
                  onChange={(e) => set({ printMethod: e.target.value })}
                  className="input mb-6"
                >
                  <option value="">{t.methodPlaceholder}</option>
                  {PRINT_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <label className="label" htmlFor="notes">{t.notesLabel}</label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => set({ notes: e.target.value })}
                  placeholder={t.notesPlaceholder}
                  className="input resize-none"
                />
              </fieldset>
            )}

            {/* STEP 5 — Contact */}
            {step === 4 && (
              <fieldset>
                <legend className="heading-md mb-2">{t.whereSend}</legend>
                <p className="mb-6 text-sm text-zinc-400">{t.respond}</p>
                <HoneypotField value={guard.hp} onChange={guard.setHp} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="q-name">{t.fullName}</label>
                    <input id="q-name" required autoComplete="name" value={form.name} onChange={(e) => set({ name: e.target.value })} className="input" placeholder="Jordan Rivera" />
                  </div>
                  <div>
                    <label className="label" htmlFor="q-email">{t.email}</label>
                    <input id="q-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className="input" placeholder="you@business.com" />
                  </div>
                  <div>
                    <label className="label" htmlFor="q-phone">{t.phone}</label>
                    <input id="q-phone" type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} className="input" placeholder="(661) 555-0123" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="q-ref">{t.referral}</label>
                    <input id="q-ref" value={form.referral} onChange={(e) => set({ referral: e.target.value })} className="input" placeholder={t.referralPlaceholder} />
                  </div>
                </div>

                {estimate && (
                  <div className="mt-8 rounded-xl border border-ink-700 bg-ink-800/60 p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">{t.summary}</p>
                    <dl className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><dt className="text-zinc-400">{t.product}</dt><dd className="font-semibold text-white">{t.products[form.product] || pricing.label}</dd></div>
                      <div className="flex justify-between"><dt className="text-zinc-400">{t.quantity}</dt><dd className="font-semibold text-white">{estimate.qty} × ${estimate.unit.toFixed(2)}</dd></div>
                      {form.needsDesign && (
                        <div className="flex justify-between"><dt className="text-zinc-400">{t.designService}</dt><dd className="font-semibold text-white">$45.00</dd></div>
                      )}
                      <div className="flex justify-between border-t border-ink-700 pt-2 text-base">
                        <dt className="font-bold text-white">{t.estTotal}</dt>
                        <dd className="font-extrabold text-gold-400">${estimate.total.toFixed(2)}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-xs text-zinc-500">{t.finePrint}</p>
                  </div>
                )}
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-secondary disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon name="arrowLeft" className="h-4 w-4" /> {t.back}
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary disabled:pointer-events-none disabled:opacity-40"
            >
              {t.continue} <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" disabled={!canNext() || saving} className="btn-primary disabled:pointer-events-none disabled:opacity-40">
              {saving ? t.submitting : t.submit} <Icon name="check" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

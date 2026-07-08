"use client";

// 3D Designs management: add / edit / hide / delete showcase designs,
// switch between per-gram and flat pricing, all without touching code.
// Changes appear on /3d-printing instantly.

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/db";
import { designs3d as staticDesigns, MATERIALS_3D } from "@/data/printing3d";
import { normalizeDbDesign } from "@/lib/useDbDesigns";

const emptyForm = {
  id: "",
  name: "",
  image: "",
  weightGrams: "50",
  sizeNote: "",
  badge: "",
  blurb: "",
  pricingMode: "gram", // gram | flat
  flatPrice: "",
  flatNote: "",
};

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const plaRate = MATERIALS_3D.find((m) => m.id === "pla").perGram;

export default function Designs3DManager() {
  const [dbDesigns, setDbDesigns] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setDbDesigns((await db.listDesigns3d()).map(normalizeDbDesign));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // merged view: db overrides static
  const overrides = new Map(dbDesigns.map((d) => [d.id, d]));
  const merged = [
    ...dbDesigns.filter((d) => !staticDesigns.some((s) => s.id === d.id)),
    ...staticDesigns.map((d) => overrides.get(d.id) || d),
  ];

  const startEdit = (d) =>
    setEditing({
      ...emptyForm,
      id: d.id,
      name: d.name,
      image: d.image,
      weightGrams: String(d.weightGrams ?? 50),
      sizeNote: d.sizeNote || "",
      badge: d.badge || "",
      blurb: d.blurb || "",
      pricingMode: d.flatPrice != null ? "flat" : "gram",
      flatPrice: d.flatPrice != null ? String(d.flatPrice) : "",
      flatNote: d.flatNote || "",
      _isEdit: true,
    });

  const toRow = (f, activeVal = true) => ({
    id: f.id ? slugify(f.id) : slugify(f.name),
    name: f.name,
    image: f.image,
    weight_grams: Number(f.weightGrams) || 50,
    size_note: f.sizeNote || null,
    badge: f.badge || null,
    blurb: f.blurb || "",
    flat_price: f.pricingMode === "flat" && f.flatPrice ? Number(f.flatPrice) : null,
    flat_note: f.pricingMode === "flat" ? f.flatNote || null : null,
    active: activeVal,
  });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!editing.name || !editing.image) {
      setError("Name and image path are required.");
      return;
    }
    if (editing.pricingMode === "flat" && !editing.flatPrice) {
      setError("Flat pricing selected — enter the flat price.");
      return;
    }
    setSaving(true);
    try {
      await db.upsertDesign3d(toRow(editing));
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      setError("Save failed — check console / Supabase policies (re-run schema.sql to add the designs3d table).");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d) => {
    await db.upsertDesign3d(
      toRow(
        {
          id: d.id, name: d.name, image: d.image,
          weightGrams: String(d.weightGrams), sizeNote: d.sizeNote,
          badge: d.badge || "", blurb: d.blurb,
          pricingMode: d.flatPrice != null ? "flat" : "gram",
          flatPrice: d.flatPrice != null ? String(d.flatPrice) : "",
          flatNote: d.flatNote || "",
        },
        d.active === false // flip
      )
    );
    load();
  };

  const remove = async (d) => {
    if (!confirm(`Delete "${d.name}"?`)) return;
    await db.deleteDesign3d(d.id);
    load();
  };

  const previewPrice = (d) =>
    d.flatPrice != null
      ? `$${Number(d.flatPrice).toFixed(2)} flat`
      : `~$${Math.max(10, d.weightGrams * plaRate).toFixed(2)} (${d.weightGrams}g PLA)`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          {merged.length} designs · changes appear on the 3D Printing page instantly.
          <span className="block text-xs text-zinc-600">
            Tip: put photos in <code>public/images/3d/</code> and use the path <code>/images/3d/file.jpg</code> — or paste any full image URL.
          </span>
        </p>
        <button type="button" onClick={() => setEditing({ ...emptyForm })} className="btn-primary px-5 py-2.5 text-sm">
          + Add 3D Design
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <form onSubmit={save} className="card mb-8 p-6" aria-label="3D design editor">
          <h3 className="heading-md mb-5 text-lg">{editing._isEdit ? `Edit: ${editing.name}` : "New 3D Design"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="d-name">Name *</label>
              <input id="d-name" className="input" value={editing.name} onChange={(e) => setEditing((f) => ({ ...f, name: e.target.value }))} placeholder="Skull Pencil Holder" />
            </div>
            <div>
              <label className="label" htmlFor="d-size">Size note</label>
              <input id="d-size" className="input" value={editing.sizeNote} onChange={(e) => setEditing((f) => ({ ...f, sizeNote: e.target.value }))} placeholder='~5" tall / Fits all phones' />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="d-img">Image path or URL *</label>
              <input id="d-img" className="input" value={editing.image} onChange={(e) => setEditing((f) => ({ ...f, image: e.target.value }))} placeholder="/images/3d/skull-holder.jpg or https://…" />
              {editing.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.image} alt="Preview" className="mt-2 h-24 w-24 rounded-lg border border-ink-700 object-cover" onError={(e) => (e.currentTarget.style.opacity = 0.25)} />
              )}
            </div>

            {/* ---- Pricing mode toggle ---- */}
            <div className="sm:col-span-2">
              <p className="label">Pricing mode</p>
              <div className="flex rounded-xl border border-ink-700 bg-ink-800 p-1">
                {[
                  { id: "gram", label: "Per-gram (material cost)", sub: "grams × material rate" },
                  { id: "flat", label: "Flat price (labor included)", sub: "for personalized / hands-on items" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setEditing((f) => ({ ...f, pricingMode: m.id }))}
                    aria-pressed={editing.pricingMode === m.id}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-center transition ${
                      editing.pricingMode === m.id ? "bg-gold-400 text-ink-950" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="block text-sm font-extrabold">{m.label}</span>
                    <span className={`text-[11px] ${editing.pricingMode === m.id ? "text-ink-950/70" : "text-zinc-600"}`}>{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="d-grams">Weight (grams) * <span className="font-normal text-zinc-600">{editing.pricingMode === "flat" ? "— used for premium-material upcharge" : "— drives the price"}</span></label>
              <input id="d-grams" type="number" min="1" className="input" value={editing.weightGrams} onChange={(e) => setEditing((f) => ({ ...f, weightGrams: e.target.value }))} />
              {editing.pricingMode === "gram" && editing.weightGrams && (
                <p className="mt-1 text-xs text-gold-400">≈ ${Math.max(10, Number(editing.weightGrams) * plaRate).toFixed(2)} in PLA</p>
              )}
            </div>

            {editing.pricingMode === "flat" && (
              <>
                <div>
                  <label className="label" htmlFor="d-flat">Flat price * ($)</label>
                  <input id="d-flat" type="number" step="0.01" min="1" className="input" value={editing.flatPrice} onChange={(e) => setEditing((f) => ({ ...f, flatPrice: e.target.value }))} placeholder="39.99" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="d-fnote">What's included (shown to customers)</label>
                  <input id="d-fnote" className="input" value={editing.flatNote} onChange={(e) => setEditing((f) => ({ ...f, flatNote: e.target.value }))} placeholder="Includes photo prep, print & LED base — comparable lamps run $38–$55 online" />
                </div>
              </>
            )}

            <div>
              <label className="label" htmlFor="d-badge">Badge (optional)</label>
              <input id="d-badge" className="input" value={editing.badge} onChange={(e) => setEditing((f) => ({ ...f, badge: e.target.value }))} placeholder="Best Seller / Perfect Gift" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="d-blurb">Description</label>
              <textarea id="d-blurb" rows={2} className="input resize-none" value={editing.blurb} onChange={(e) => setEditing((f) => ({ ...f, blurb: e.target.value }))} />
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-400">{error}</p>}
          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
              {saving ? "Saving…" : "Save Design"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary px-6 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Design list */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-xs uppercase tracking-widest text-zinc-500">
              <th className="pb-3 pr-4">Design</th>
              <th className="pb-3 pr-4">Pricing</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Badge</th>
              <th className="pb-3 pr-4">Source</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((d) => (
              <tr key={d.id} className={`border-b border-ink-800 ${d.active === false ? "opacity-40" : ""}`}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.image} alt="" className="h-10 w-10 rounded-lg border border-ink-700 object-cover" />
                    <div>
                      <p className="font-bold text-white">{d.name}</p>
                      <p className="text-xs text-zinc-600">{d.id}{d.active === false ? " · hidden" : ""}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                    d.flatPrice != null
                      ? "border-gold-400/40 bg-gold-400/10 text-gold-300"
                      : "border-zinc-600 bg-zinc-500/10 text-zinc-400"
                  }`}>
                    {d.flatPrice != null ? "Flat" : "Per-gram"}
                  </span>
                </td>
                <td className="py-3 pr-4 font-semibold text-gold-400">{previewPrice(d)}</td>
                <td className="py-3 pr-4 text-zinc-400">{d.badge || "—"}</td>
                <td className="py-3 pr-4 text-xs text-zinc-500">{d._fromDb ? "Database" : "Starter catalog"}</td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => startEdit(d)} className="btn-ghost px-2.5 py-1 text-xs">Edit</button>
                    <button type="button" onClick={() => toggleActive(d)} className="btn-ghost px-2.5 py-1 text-xs">
                      {d.active === false ? "Show" : "Hide"}
                    </button>
                    {d._fromDb && (
                      <button type="button" onClick={() => remove(d)} className="btn-ghost px-2.5 py-1 text-xs text-red-400 hover:text-red-300">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

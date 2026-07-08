"use client";

// Portfolio management — the owner's most important habit:
// photo of every finished job + one line = trust machine.
// Supports direct image upload to Supabase Storage (or path/URL).

import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/db";
import { uploadArtwork } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { portfolioItems as staticItems, portfolioCategories } from "@/data/portfolio";
import { normalizePortfolio } from "@/lib/usePortfolio";

const emptyForm = { id: "", title: "", category: "Apparel", image: "", caption: "" };
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function PortfolioManager() {
  const [dbItems, setDbItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setDbItems((await db.listPortfolio()).map(normalizePortfolio));
    } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const overrides = new Map(dbItems.map((r) => [r.id, r]));
  const merged = [
    ...dbItems.filter((r) => !staticItems.some((s) => s.id === r.id)),
    ...staticItems.map((s) => overrides.get(s.id) || s),
  ];

  const handleUpload = async (file) => {
    if (!file) return;
    if (!isSupabaseConfigured) {
      setError("Direct upload needs Supabase connected — for now paste an image path/URL instead.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const url = await uploadArtwork(file, "portfolio");
      if (url) setEditing((f) => ({ ...f, image: url }));
      else setError("Upload failed — check Supabase storage policies.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!editing.title || !editing.image) {
      setError("Title and image are required.");
      return;
    }
    setSaving(true);
    try {
      await db.upsertPortfolio({
        id: editing.id ? slugify(editing.id) : slugify(editing.title),
        title: editing.title,
        category: editing.category,
        image: editing.image,
        caption: editing.caption || null,
        active: true,
      });
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      setError("Save failed — re-run supabase/schema.sql to add the portfolio table.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    await db.upsertPortfolio({
      id: item.id, title: item.title, category: item.category,
      image: item.image, caption: item.caption || null,
      active: item.active === false,
    });
    load();
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await db.deletePortfolio(item.id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          {merged.length} jobs · appears on the <strong className="text-white">/work</strong> page instantly.
          <span className="block text-xs text-gold-500">
            📸 Pro habit: photo every finished job before it leaves the shop — 60 seconds each, builds trust forever.
          </span>
        </p>
        <button type="button" onClick={() => setEditing({ ...emptyForm })} className="btn-primary px-5 py-2.5 text-sm">
          + Add Job
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="card mb-8 p-6" aria-label="Portfolio editor">
          <h3 className="heading-md mb-5 text-lg">{editing.id ? `Edit: ${editing.title}` : "New Job"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="w-title">Title *</label>
              <input id="w-title" className="input" value={editing.title} onChange={(e) => setEditing((f) => ({ ...f, title: e.target.value }))} placeholder="50 Tees for XYZ Trucking" />
            </div>
            <div>
              <label className="label" htmlFor="w-cat">Category *</label>
              <select id="w-cat" className="input" value={editing.category} onChange={(e) => setEditing((f) => ({ ...f, category: e.target.value }))}>
                {portfolioCategories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Photo *</label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="btn-secondary px-5 py-2.5 text-sm disabled:opacity-50"
                >
                  {uploading ? "Uploading…" : "📤 Upload Photo"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => handleUpload(e.target.files?.[0])} />
                <span className="text-xs text-zinc-500">or paste a path/URL:</span>
                <input className="input flex-1" style={{ minWidth: "200px" }} value={editing.image} onChange={(e) => setEditing((f) => ({ ...f, image: e.target.value }))} placeholder="/images/... or https://…" aria-label="Image path or URL" />
              </div>
              {editing.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.image} alt="Preview" className="mt-3 h-28 w-36 rounded-lg border border-ink-700 object-cover" onError={(e) => (e.currentTarget.style.opacity = 0.25)} />
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="w-cap">One-line caption</label>
              <input id="w-cap" className="input" value={editing.caption} onChange={(e) => setEditing((f) => ({ ...f, caption: e.target.value }))} placeholder="Gold screen print, 3-day turnaround." />
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-400">{error}</p>}
          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">{saving ? "Saving…" : "Save Job"}</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary px-6 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((item) => (
          <div key={item.id} className={`card overflow-hidden ${item.active === false ? "opacity-40" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gold-500">{item.category}{item._fromDb ? "" : " · starter sample"}</p>
              <p className="font-bold text-white">{item.title}</p>
              {item.caption && <p className="mt-0.5 text-xs text-zinc-500">{item.caption}</p>}
              <div className="mt-3 flex gap-1">
                <button type="button" onClick={() => setEditing({ ...emptyForm, ...item, caption: item.caption || "" })} className="btn-ghost px-2.5 py-1 text-xs">Edit</button>
                <button type="button" onClick={() => toggleActive(item)} className="btn-ghost px-2.5 py-1 text-xs">{item.active === false ? "Show" : "Hide"}</button>
                {item._fromDb && (
                  <button type="button" onClick={() => remove(item)} className="btn-ghost px-2.5 py-1 text-xs text-red-400 hover:text-red-300">Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

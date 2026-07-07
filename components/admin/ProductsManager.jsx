"use client";

// Product management: add / edit / hide / delete products.
// Static catalog items (data/products.js) can be overridden by id;
// new products are stored in the DB (or demo storage) and appear
// in the Shop automatically.

import { useState, useEffect, useCallback } from "react";
import Icon from "../Icons";
import { db } from "@/lib/db";
import { products as staticProducts, categories } from "@/data/products";
import { normalizeDbProduct } from "@/lib/useDbProducts";

const emptyForm = {
  id: "",
  name: "",
  category: "Apparel",
  price: "",
  priceNote: "from",
  image: "",
  badge: "",
  featured: false,
  description: "",
  options: "",
};

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ProductsManager() {
  const [dbProducts, setDbProducts] = useState([]);
  const [editing, setEditing] = useState(null); // form state or null
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setDbProducts((await db.listProducts()).map(normalizeDbProduct));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // merged view: db overrides static
  const overrides = new Map(dbProducts.map((p) => [p.id, p]));
  const merged = [
    ...dbProducts.filter((p) => !staticProducts.some((s) => s.id === p.id)),
    ...staticProducts.map((p) => overrides.get(p.id) || p),
  ];

  const startEdit = (p) =>
    setEditing({
      ...emptyForm,
      ...p,
      price: String(p.price ?? ""),
      options: (p.options || []).join(", "),
      badge: p.badge || "",
      _isEdit: true,
    });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const id = editing.id ? slugify(editing.id) : slugify(editing.name);
    if (!id || !editing.name || !editing.price || !editing.image) {
      setError("Name, price, and image path are required.");
      return;
    }
    setSaving(true);
    try {
      await db.upsertProduct({
        id,
        name: editing.name,
        category: editing.category,
        price: Number(editing.price),
        price_note: editing.priceNote || null,
        image: editing.image,
        badge: editing.badge || null,
        featured: !!editing.featured,
        description: editing.description || "",
        options: editing.options
          ? editing.options.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        active: true,
      });
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      setError("Save failed — check console / Supabase policies.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p) => {
    // For static products, create an override row marked inactive
    await db.upsertProduct({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      price_note: p.priceNote || null,
      image: p.image,
      badge: p.badge || null,
      featured: !!p.featured,
      description: p.description || "",
      options: p.options || [],
      active: p.active === false, // flip
    });
    load();
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await db.deleteProduct(p.id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          {merged.length} products · changes appear in the Shop instantly.
          <span className="block text-xs text-zinc-600">
            Tip: put image files in <code>public/images/products/</code> and use the path <code>/images/products/file.jpg</code> — or paste any full image URL.
          </span>
        </p>
        <button type="button" onClick={() => setEditing({ ...emptyForm })} className="btn-primary px-5 py-2.5 text-sm">
          + Add Product
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <form onSubmit={save} className="card mb-8 p-6" aria-label="Product editor">
          <h3 className="heading-md mb-5 text-lg">{editing._isEdit ? `Edit: ${editing.name}` : "New Product"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="p-name">Name *</label>
              <input id="p-name" className="input" value={editing.name} onChange={(e) => setEditing((f) => ({ ...f, name: e.target.value }))} placeholder="Custom Trucker Hat" />
            </div>
            <div>
              <label className="label" htmlFor="p-cat">Category *</label>
              <select id="p-cat" className="input" value={editing.category} onChange={(e) => setEditing((f) => ({ ...f, category: e.target.value }))}>
                {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="p-price">Price * (number)</label>
              <input id="p-price" type="number" step="0.01" min="0" className="input" value={editing.price} onChange={(e) => setEditing((f) => ({ ...f, price: e.target.value }))} placeholder="19.99" />
            </div>
            <div>
              <label className="label" htmlFor="p-note">Price note</label>
              <input id="p-note" className="input" value={editing.priceNote} onChange={(e) => setEditing((f) => ({ ...f, priceNote: e.target.value }))} placeholder="from / from per sq ft" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="p-img">Image path or URL *</label>
              <input id="p-img" className="input" value={editing.image} onChange={(e) => setEditing((f) => ({ ...f, image: e.target.value }))} placeholder="/images/products/trucker-hat.jpg or https://…" />
              {editing.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.image} alt="Preview" className="mt-2 h-24 w-24 rounded-lg border border-ink-700 object-cover" onError={(e) => (e.currentTarget.style.opacity = 0.25)} />
              )}
            </div>
            <div>
              <label className="label" htmlFor="p-badge">Badge (optional)</label>
              <input id="p-badge" className="input" value={editing.badge} onChange={(e) => setEditing((f) => ({ ...f, badge: e.target.value }))} placeholder="New / Best Seller" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="h-5 w-5 accent-gold-400" checked={editing.featured} onChange={(e) => setEditing((f) => ({ ...f, featured: e.target.checked }))} />
                <span className="text-sm font-semibold text-zinc-300">Featured on Home page</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="p-desc">Description</label>
              <textarea id="p-desc" rows={2} className="input resize-none" value={editing.description} onChange={(e) => setEditing((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="p-opts">Options (comma-separated)</label>
              <input id="p-opts" className="input" value={editing.options} onChange={(e) => setEditing((f) => ({ ...f, options: e.target.value }))} placeholder="Embroidery, DTF Press, One Size" />
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-400">{error}</p>}
          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
              {saving ? "Saving…" : "Save Product"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary px-6 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Product list */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-xs uppercase tracking-widest text-zinc-500">
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Featured</th>
              <th className="pb-3 pr-4">Source</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((p) => (
              <tr key={p.id} className={`border-b border-ink-800 ${p.active === false ? "opacity-40" : ""}`}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-10 w-10 rounded-lg border border-ink-700 object-cover" />
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-xs text-zinc-600">{p.id}{p.active === false ? " · hidden" : ""}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-zinc-400">{p.category}</td>
                <td className="py-3 pr-4 font-semibold text-gold-400">${Number(p.price).toFixed(2)}</td>
                <td className="py-3 pr-4">{p.featured ? "⭐" : "—"}</td>
                <td className="py-3 pr-4 text-xs text-zinc-500">{p._fromDb ? "Database" : "Starter catalog"}</td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => startEdit(p)} className="btn-ghost px-2.5 py-1 text-xs">Edit</button>
                    <button type="button" onClick={() => toggleActive(p)} className="btn-ghost px-2.5 py-1 text-xs">
                      {p.active === false ? "Show" : "Hide"}
                    </button>
                    {p._fromDb && (
                      <button type="button" onClick={() => remove(p)} className="btn-ghost px-2.5 py-1 text-xs text-red-400 hover:text-red-300">Delete</button>
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

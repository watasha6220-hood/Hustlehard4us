"use client";

// ============================================================
//  DATA LAYER — one API for the whole app.
//  • Supabase configured → real database
//  • No keys yet        → DEMO MODE (browser localStorage)
//  Every function returns plain JS objects either way.
// ============================================================

import { supabase, isSupabaseConfigured } from "./supabase";

const LS_KEYS = {
  quotes: "hh4us_quotes",
  messages: "hh4us_messages",
  gang_sheets: "hh4us_gang_sheets",
  products: "hh4us_products",
  print3d_orders: "hh4us_print3d_orders",
  designs3d: "hh4us_designs3d",
  portfolio: "hh4us_portfolio",
  subscribers: "hh4us_subscribers",
};

// ---------- localStorage helpers (demo mode) ----------
const lsRead = (key) => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};
const lsWrite = (key, rows) => {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(rows));
};
const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ---------- generic CRUD ----------
async function insertRow(table, row) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from(table).insert(row).select().single();
    if (error) throw error;
    return data;
  }
  const rows = lsRead(LS_KEYS[table]);
  const newRow = { id: uid(), created_at: new Date().toISOString(), ...row };
  rows.unshift(newRow);
  lsWrite(LS_KEYS[table], rows);
  return newRow;
}

async function listRows(table, { orderBy = "created_at", ascending = false } = {}) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending });
    if (error) throw error;
    return data || [];
  }
  return lsRead(LS_KEYS[table]);
}

async function updateRow(table, id, patch) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from(table).update(patch).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }
  const rows = lsRead(LS_KEYS[table]);
  const i = rows.findIndex((r) => r.id === id);
  if (i > -1) {
    rows[i] = { ...rows[i], ...patch };
    lsWrite(LS_KEYS[table], rows);
    return rows[i];
  }
  return null;
}

async function deleteRow(table, id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    return true;
  }
  lsWrite(LS_KEYS[table], lsRead(LS_KEYS[table]).filter((r) => r.id !== id));
  return true;
}

// ---------- public API ----------
export const db = {
  // Leads
  submitQuote: (q) => insertRow("quotes", q),
  listQuotes: () => listRows("quotes"),
  updateQuote: (id, patch) => updateRow("quotes", id, patch),

  submitMessage: (m) => insertRow("messages", m),
  listMessages: () => listRows("messages"),
  updateMessage: (id, patch) => updateRow("messages", id, patch),

  submitGangSheet: (g) => insertRow("gang_sheets", g),
  listGangSheets: () => listRows("gang_sheets"),
  updateGangSheet: (id, patch) => updateRow("gang_sheets", id, patch),

  submitPrint3d: (p) => insertRow("print3d_orders", p),
  listPrint3d: () => listRows("print3d_orders"),
  updatePrint3d: (id, patch) => updateRow("print3d_orders", id, patch),

  // Products (admin-managed; merged with static defaults on the shop page)
  listProducts: () => listRows("products", { orderBy: "created_at", ascending: false }),
  upsertProduct: async (p) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("products").upsert(p).select().single();
      if (error) throw error;
      return data;
    }
    const rows = lsRead(LS_KEYS.products);
    const i = rows.findIndex((r) => r.id === p.id);
    if (i > -1) rows[i] = { ...rows[i], ...p };
    else rows.unshift({ created_at: new Date().toISOString(), ...p });
    lsWrite(LS_KEYS.products, rows);
    return p;
  },
  deleteProduct: (id) => deleteRow("products", id),

  // 3D designs (admin-managed; merged with data/printing3d.js defaults)
  listDesigns3d: () => listRows("designs3d", { orderBy: "created_at", ascending: false }),
  upsertDesign3d: async (d) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("designs3d").upsert(d).select().single();
      if (error) throw error;
      return data;
    }
    const rows = lsRead(LS_KEYS.designs3d);
    const i = rows.findIndex((r) => r.id === d.id);
    if (i > -1) rows[i] = { ...rows[i], ...d };
    else rows.unshift({ created_at: new Date().toISOString(), ...d });
    lsWrite(LS_KEYS.designs3d, rows);
    return d;
  },
  deleteDesign3d: (id) => deleteRow("designs3d", id),

  // Portfolio (admin-managed recent work)
  listPortfolio: () => listRows("portfolio"),
  upsertPortfolio: async (p) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("portfolio").upsert(p).select().single();
      if (error) throw error;
      return data;
    }
    const rows = lsRead(LS_KEYS.portfolio);
    const i = rows.findIndex((r) => r.id === p.id);
    if (i > -1) rows[i] = { ...rows[i], ...p };
    else rows.unshift({ created_at: new Date().toISOString(), ...p });
    lsWrite(LS_KEYS.portfolio, rows);
    return p;
  },
  deletePortfolio: (id) => deleteRow("portfolio", id),

  // Email subscribers ("10% off first order")
  subscribe: (email, source = "site") => insertRow("subscribers", { email, source }),
  listSubscribers: () => listRows("subscribers"),

  // Order tracking — public lookup by email.
  // Prefers the track_orders() SECURITY DEFINER function (works even
  // after auth-hardening.sql locks direct reads); falls back to direct
  // selects, then to demo storage.
  trackOrders: async (email) => {
    const norm = email.trim().toLowerCase();
    const match = (r) => (r.email || "").toLowerCase() === norm;
    if (isSupabaseConfigured) {
      const { data: rpc, error: rpcErr } = await supabase.rpc("track_orders", { lookup_email: norm });
      if (!rpcErr && rpc) {
        return { quotes: rpc.quotes || [], gangSheets: rpc.gangSheets || [], prints3d: rpc.prints3d || [] };
      }
      const [q, g, p] = await Promise.all([
        supabase.from("quotes").select("id,created_at,product,quantity,status").ilike("email", norm),
        supabase.from("gang_sheets").select("id,created_at,item_count,price,status").ilike("email", norm),
        supabase.from("print3d_orders").select("id,created_at,design_name,quantity,price,status").ilike("email", norm),
      ]);
      return { quotes: q.data || [], gangSheets: g.data || [], prints3d: p.data || [] };
    }
    return {
      quotes: lsRead(LS_KEYS.quotes).filter(match),
      gangSheets: lsRead(LS_KEYS.gang_sheets).filter(match),
      prints3d: lsRead(LS_KEYS.print3d_orders).filter(match),
    };
  },
};

export { isSupabaseConfigured };

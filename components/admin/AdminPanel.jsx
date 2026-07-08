"use client";

// ============================================================
//  ADMIN PANEL — /admin
//  Passcode-gated dashboard for quotes, messages, gang sheet
//  orders, and product management.
//  • Set NEXT_PUBLIC_ADMIN_PASSCODE in .env.local (default below)
//  • Data: Supabase when configured, demo storage otherwise
//  • For serious security, upgrade to Supabase Auth (see README)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import Icon from "../Icons";
import ProductsManager from "./ProductsManager";
import Designs3DManager from "./Designs3DManager";
import PortfolioManager from "./PortfolioManager";
import { db, isSupabaseConfigured } from "@/lib/db";

// 🇪🇸 badge + one-click Google Translate for Spanish-language leads
function LangBadge({ lang }) {
  if (lang !== "es") return null;
  return (
    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300" title="Customer used the Spanish site — contact them in Spanish">
      🇪🇸 Spanish
    </span>
  );
}

// 💳 Deposit link generator — creates a Stripe checkout and copies the URL
// so the owner can text/email it to the customer. Shown when Stripe is on.
const STRIPE_ON = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "1";

function DepositButton({ quote }) {
  const [state, setState] = useState("idle"); // idle | working | copied | error
  if (!STRIPE_ON) return null;

  const send = async () => {
    const suggested = quote.estimate ? (Number(quote.estimate) / 2).toFixed(2) : "";
    const input = prompt(
      `Deposit amount for ${quote.name} ($):\n(estimate is $${Number(quote.estimate || 0).toFixed(2)} — 50% suggested)`,
      suggested
    );
    if (!input) return;
    const amount = Number(input);
    if (!Number.isFinite(amount) || amount < 5) { alert("Enter a valid amount ($5 minimum)."); return; }
    setState("working");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "deposit",
          price: amount,
          description: `Deposit — ${quote.product} ×${quote.quantity} (${quote.name})`,
          email: quote.email,
          orderId: quote.id,
        }),
      });
      const data = await res.json();
      if (!data.url) throw new Error(data.error || "failed");
      await navigator.clipboard.writeText(data.url);
      setState("copied");
      setTimeout(() => setState("idle"), 4000);
    } catch (e) {
      console.error(e);
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  return (
    <button
      type="button"
      onClick={send}
      disabled={state === "working"}
      className="rounded-full border border-gold-400/50 bg-gold-400/10 px-3 py-1 text-xs font-bold text-gold-300 transition hover:bg-gold-400 hover:text-ink-950 disabled:opacity-50"
    >
      {state === "idle" && "💳 Payment link"}
      {state === "working" && "Creating…"}
      {state === "copied" && "✓ Copied! Text it to them"}
      {state === "error" && "Failed — check Stripe keys"}
    </button>
  );
}

function TranslateLink({ text }) {
  if (!text) return null;
  return (
    <a
      href={`https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}&op=translate`}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-2 text-xs font-bold text-gold-400 hover:underline"
    >
      Translate ↗
    </a>
  );
}

const PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "hustlehard2026";

const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "lost"];
const MSG_STATUSES = ["new", "replied", "closed"];
const GS_STATUSES = ["new", "printing", "shipped", "done"];
const P3D_STATUSES = ["new", "printing", "ready", "done"];

const statusColor = (s) =>
  ({
    new: "bg-sky-500/15 text-sky-300 border-sky-500/40",
    contacted: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    quoted: "bg-purple-500/15 text-purple-300 border-purple-500/40",
    printing: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    shipped: "bg-purple-500/15 text-purple-300 border-purple-500/40",
    replied: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    closed: "bg-zinc-500/15 text-zinc-400 border-zinc-500/40",
    lost: "bg-red-500/15 text-red-300 border-red-500/40",
  }[s] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/40");

const fmtDate = (d) =>
  new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function StatusSelect({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Update status"
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide outline-none ${statusColor(value)} bg-ink-900`}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-ink-900 text-zinc-200">{o}</option>
      ))}
    </select>
  );
}

// ------------------------------------------------------------
export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const [tab, setTab] = useState("quotes");
  const [quotes, setQuotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [gangSheets, setGangSheets] = useState([]);
  const [print3d, setPrint3d] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("hh4us_admin") === "1") {
      setAuthed(true);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [q, m, g, p3, subs] = await Promise.all([
        db.listQuotes(), db.listMessages(), db.listGangSheets(), db.listPrint3d(),
        db.listSubscribers().catch(() => []),
      ]);
      setQuotes(q);
      setMessages(m);
      setGangSheets(g);
      setPrint3d(p3);
      setSubscribers(subs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const login = (e) => {
    e.preventDefault();
    if (pass === PASSCODE) {
      sessionStorage.setItem("hh4us_admin", "1");
      setAuthed(true);
    } else {
      setError(true);
    }
  };

  // ---------- LOGIN GATE ----------
  if (!authed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form onSubmit={login} className="card w-full max-w-sm p-8" aria-label="Admin login">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400 font-display text-ink-950">HH</span>
          <h1 className="heading-md mb-1 text-center">Admin Panel</h1>
          <p className="mb-6 text-center text-sm text-zinc-500">Enter your passcode to continue</p>
          <label className="label" htmlFor="admin-pass">Passcode</label>
          <input
            id="admin-pass"
            type="password"
            className="input"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(false); }}
            autoFocus
          />
          {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-400">Wrong passcode — try again.</p>}
          <button type="submit" className="btn-primary mt-5 w-full">Unlock <Icon name="arrowRight" className="h-4 w-4" /></button>
          <p className="mt-4 text-center text-xs text-zinc-600">
            Set <code className="text-zinc-400">NEXT_PUBLIC_ADMIN_PASSCODE</code> in .env.local
          </p>
        </form>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  const stats = [
    { label: "Quote Requests", value: quotes.length, sub: `${quotes.filter((q) => q.status === "new").length} new` },
    { label: "Messages", value: messages.length, sub: `${messages.filter((m) => m.status === "new").length} new` },
    { label: "Gang Sheets", value: gangSheets.length, sub: `${gangSheets.filter((g) => g.status === "new").length} new` },
    { label: "3D Prints", value: print3d.length, sub: `${print3d.filter((p) => p.status === "new").length} new` },
    {
      label: "Pipeline Value",
      value: `$${[
        ...quotes.map((q) => Number(q.estimate) || 0),
        ...gangSheets.map((g) => Number(g.price) || 0),
        ...print3d.map((p) => Number(p.price) || 0),
      ].reduce((a, b) => a + b, 0).toFixed(0)}`,
      sub: "all estimates",
    },
  ];

  const tabs = [
    { id: "quotes", label: `Quotes (${quotes.length})` },
    { id: "messages", label: `Messages (${messages.length})` },
    { id: "gangsheets", label: `Gang Sheets (${gangSheets.length})` },
    { id: "print3d", label: `3D Prints (${print3d.length})` },
    { id: "products", label: "Products" },
    { id: "designs3d", label: "3D Designs" },
    { id: "portfolio", label: "Portfolio" },
    { id: "subscribers", label: `Subscribers (${subscribers.length})` },
  ];

  return (
    <div className="container-x py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg">Admin Panel</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {isSupabaseConfigured ? (
              <span className="text-emerald-400">● Connected to Supabase</span>
            ) : (
              <span className="text-amber-400">● Demo mode (browser storage) — add Supabase keys in .env.local to go live</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className="btn-secondary px-4 py-2 text-sm">↻ Refresh</button>
          <button
            type="button"
            onClick={() => { sessionStorage.removeItem("hh4us_admin"); setAuthed(false); }}
            className="btn-ghost px-4 py-2 text-sm"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{s.label}</p>
            <p className="mt-1 font-display text-3xl text-white">{s.value}</p>
            <p className="text-xs text-gold-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Admin sections" className="mb-6 flex flex-wrap gap-2 border-b border-ink-700 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === t.id ? "bg-gold-400 text-ink-950" : "text-zinc-400 hover:bg-ink-800 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && tab !== "products" && tab !== "designs3d" ? (
        <p className="py-16 text-center text-zinc-500">Loading…</p>
      ) : (
        <>
          {/* ---- QUOTES ---- */}
          {tab === "quotes" && (
            <div className="space-y-4">
              {!quotes.length && <EmptyState text="No quote requests yet. They'll appear here when customers use the Quote Builder." />}
              {quotes.map((q) => (
                <article key={q.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="flex flex-wrap items-center gap-2 font-bold text-white">
                        {q.name} <LangBadge lang={q.lang} />
                        <span className="font-normal text-zinc-500">· {fmtDate(q.created_at)}</span>
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-400">
                        <strong className="text-gold-400">{q.product}</strong> · qty {q.quantity}
                        {q.estimate ? <> · est. <strong className="text-white">${Number(q.estimate).toFixed(2)}</strong></> : null}
                        {q.needs_design ? " · needs design help" : ""}
                        {q.referral ? <> · 🎟 <span className="text-emerald-300">{q.referral}</span></> : null}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DepositButton quote={q} />
                      <StatusSelect value={q.status} options={QUOTE_STATUSES} onChange={async (s) => { await db.updateQuote(q.id, { status: s }); load(); }} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
                    <a className="hover:text-gold-300" href={`mailto:${q.email}`}>✉ {q.email}</a>
                    <a className="hover:text-gold-300" href={`tel:${q.phone}`}>☎ {q.phone}</a>
                    {q.print_method && <span>🖨 {q.print_method}</span>}
                    {q.colors?.length ? <span>🎨 {q.colors.join(", ")}</span> : null}
                    {q.artwork_url && (
                      <a className="font-bold text-gold-400 hover:underline" href={q.artwork_url} target="_blank" rel="noopener noreferrer">
                        📎 View artwork
                      </a>
                    )}
                  </div>
                  {q.notes && (
                    <p className="mt-3 rounded-lg bg-ink-800 p-3 text-sm text-zinc-300">
                      {q.notes}
                      {q.lang === "es" && <TranslateLink text={q.notes} />}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* ---- MESSAGES ---- */}
          {tab === "messages" && (
            <div className="space-y-4">
              {!messages.length && <EmptyState text="No contact messages yet." />}
              {messages.map((m) => (
                <article key={m.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-bold text-white">{m.name} <span className="font-normal text-zinc-500">· {fmtDate(m.created_at)}</span></h3>
                    <StatusSelect value={m.status} options={MSG_STATUSES} onChange={async (s) => { await db.updateMessage(m.id, { status: s }); load(); }} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
                    <a className="hover:text-gold-300" href={`mailto:${m.email}`}>✉ {m.email}</a>
                    {m.phone && <a className="hover:text-gold-300" href={`tel:${m.phone}`}>☎ {m.phone}</a>}
                  </div>
                  <p className="mt-3 rounded-lg bg-ink-800 p-3 text-sm text-zinc-300">{m.details}</p>
                </article>
              ))}
            </div>
          )}

          {/* ---- GANG SHEETS ---- */}
          {tab === "gangsheets" && (
            <div className="space-y-4">
              {!gangSheets.length && <EmptyState text="No gang sheet orders yet. They'll appear here when customers use the Gang Sheet Builder." />}
              {gangSheets.map((g) => (
                <article key={g.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">{g.name} <span className="font-normal text-zinc-500">· {fmtDate(g.created_at)}</span></h3>
                      <p className="mt-0.5 text-sm text-zinc-400">
                        {g.item_count} design{g.item_count !== 1 ? "s" : ""} · {Number(g.sheet_length).toFixed(1)}&quot; used ·{" "}
                        <strong className="text-gold-400">${Number(g.price).toFixed(2)}</strong>
                      </p>
                    </div>
                    <StatusSelect value={g.status} options={GS_STATUSES} onChange={async (s) => { await db.updateGangSheet(g.id, { status: s }); load(); }} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
                    <a className="hover:text-gold-300" href={`mailto:${g.email}`}>✉ {g.email}</a>
                    <a className="hover:text-gold-300" href={`tel:${g.phone}`}>☎ {g.phone}</a>
                    {g.artwork_urls?.length ? g.artwork_urls.map((u, i) => (
                      <a key={u} className="font-bold text-gold-400 hover:underline" href={u} target="_blank" rel="noopener noreferrer">
                        📎 Design {i + 1}
                      </a>
                    )) : null}
                  </div>
                  {g.items?.length ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold text-zinc-400 hover:text-gold-300">Layout details</summary>
                      <ul className="mt-2 grid gap-1 rounded-lg bg-ink-800 p-3 text-xs text-zinc-400 sm:grid-cols-2">
                        {g.items.map((it, i) => (
                          <li key={i}>• {it.name} — {it.w}&quot;×{it.h}&quot; at ({it.x}&quot;, {it.y}&quot;){it.rotated ? " ⟳" : ""}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                  {g.notes && <p className="mt-3 rounded-lg bg-ink-800 p-3 text-sm text-zinc-300">{g.notes}</p>}
                </article>
              ))}
            </div>
          )}

          {/* ---- 3D PRINTS ---- */}
          {tab === "print3d" && (
            <div className="space-y-4">
              {!print3d.length && <EmptyState text="No 3D print orders yet. They'll appear here when customers use the 3D Printing configurator." />}
              {print3d.map((p) => (
                <article key={p.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">{p.name} <span className="font-normal text-zinc-500">· {fmtDate(p.created_at)}</span></h3>
                      <p className="mt-0.5 text-sm text-zinc-400">
                        <strong className="text-gold-400">{p.design_name}</strong>
                        {" "}· {p.material}{p.color ? ` (${p.color})` : ""} · ~{p.grams}g × {p.quantity}
                        {p.rush ? " · ⚡ RUSH" : ""}
                        {p.price ? <> · <strong className="text-white">${Number(p.price).toFixed(2)}</strong></> : null}
                      </p>
                    </div>
                    <StatusSelect value={p.status} options={P3D_STATUSES} onChange={async (s) => { await db.updatePrint3d(p.id, { status: s }); load(); }} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
                    <a className="hover:text-gold-300" href={`mailto:${p.email}`}>✉ {p.email}</a>
                    <a className="hover:text-gold-300" href={`tel:${p.phone}`}>☎ {p.phone}</a>
                    <span className="text-zinc-500">{p.mode === "upload" ? "📁 Customer file" : "🏆 Shop design"}</span>
                    {p.file_url && (
                      <a className="font-bold text-gold-400 hover:underline" href={p.file_url} target="_blank" rel="noopener noreferrer">
                        📎 Download model
                      </a>
                    )}
                  </div>
                  {p.notes && <p className="mt-3 rounded-lg bg-ink-800 p-3 text-sm text-zinc-300">{p.notes}</p>}
                </article>
              ))}
            </div>
          )}

          {/* ---- PRODUCTS ---- */}
          {tab === "products" && <ProductsManager />}

          {/* ---- 3D DESIGNS ---- */}
          {tab === "designs3d" && <Designs3DManager />}

          {/* ---- PORTFOLIO ---- */}
          {tab === "portfolio" && <PortfolioManager />}

          {/* ---- SUBSCRIBERS ---- */}
          {tab === "subscribers" && (
            <div className="space-y-4">
              {!subscribers.length ? (
                <EmptyState text="No email subscribers yet — the '10% off first order' capture above the footer feeds this list." />
              ) : (
                <div className="card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-zinc-400">{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</p>
                    <button
                      type="button"
                      className="btn-secondary px-4 py-2 text-xs"
                      onClick={() => {
                        const csv = "email,source,date\n" + subscribers.map((s) => `${s.email},${s.source || ""},${s.created_at}`).join("\n");
                        const blob = new Blob([csv], { type: "text/csv" });
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = "hh4us-subscribers.csv";
                        a.click();
                      }}
                    >
                      ⬇ Export CSV
                    </button>
                  </div>
                  <ul className="divide-y divide-ink-800">
                    {subscribers.map((s) => (
                      <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                        <a href={`mailto:${s.email}`} className="font-semibold text-white hover:text-gold-300">{s.email}</a>
                        <span className="text-xs text-zinc-500">{s.source || "site"} · {fmtDate(s.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="card p-12 text-center text-zinc-500">
      <p>{text}</p>
    </div>
  );
}

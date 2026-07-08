"use client";

import { useState } from "react";
import Icon from "./Icons";
import { db } from "@/lib/db";
import { site } from "@/data/site";

const STATUS_STEPS = {
  // quote pipeline
  new: { label: "Received", pct: 25 },
  contacted: { label: "In Review", pct: 50 },
  quoted: { label: "Quote Sent", pct: 75 },
  won: { label: "In Production", pct: 90 },
  // production pipelines
  printing: { label: "Printing", pct: 60 },
  ready: { label: "Ready for Pickup!", pct: 90 },
  shipped: { label: "Shipped", pct: 90 },
  done: { label: "Complete ✓", pct: 100 },
  lost: { label: "Closed", pct: 100 },
  replied: { label: "Replied", pct: 100 },
  closed: { label: "Closed", pct: 100 },
};

function StatusBar({ status }) {
  const s = STATUS_STEPS[status] || STATUS_STEPS.new;
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-extrabold uppercase tracking-widest text-gold-400">{s.label}</span>
        <span className="text-zinc-500">{s.pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-700" role="progressbar" aria-valuenow={s.pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gold-400 transition-all" style={{ width: `${s.pct}%` }} />
      </div>
    </div>
  );
}

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function TrackClient() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) return;
    setLoading(true);
    try {
      setResults(await db.trackOrders(email));
    } catch (err) {
      console.error(err);
      setResults({ quotes: [], gangSheets: [], prints3d: [] });
    } finally {
      setLoading(false);
    }
  };

  const total = results
    ? results.quotes.length + results.gangSheets.length + results.prints3d.length
    : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={lookup} className="card flex flex-col gap-3 p-6 sm:flex-row" aria-label="Order lookup form">
        <div className="flex-1">
          <label htmlFor="track-email" className="sr-only">Email used on your order</label>
          <input
            id="track-email"
            type="email"
            required
            placeholder="Email you used when ordering"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary px-8 disabled:opacity-50">
          {loading ? "Looking up…" : "Find My Orders"}
        </button>
      </form>

      {results && (
        <div className="mt-8 space-y-4" aria-live="polite">
          {total === 0 ? (
            <div className="card p-10 text-center">
              <p className="mb-2 font-bold text-white">No orders found for that email.</p>
              <p className="text-sm text-zinc-400">
                Double-check the spelling, or call us at{" "}
                <a href={site.phoneHref} className="font-bold text-gold-400 hover:underline">{site.phone}</a>{" "}
                and we&apos;ll look it up.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-400">{total} order{total !== 1 ? "s" : ""} found:</p>

              {results.quotes.map((q) => (
                <article key={q.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Quote Request · {fmtDate(q.created_at)}</p>
                      <h2 className="font-bold text-white">{q.product} × {q.quantity}</h2>
                    </div>
                    <Icon name="pencil" className="h-5 w-5 text-gold-400" />
                  </div>
                  <StatusBar status={q.status} />
                </article>
              ))}

              {results.gangSheets.map((g) => (
                <article key={g.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Gang Sheet · {fmtDate(g.created_at)}</p>
                      <h2 className="font-bold text-white">{g.item_count} designs — ${Number(g.price).toFixed(2)}</h2>
                    </div>
                    <Icon name="layers" className="h-5 w-5 text-gold-400" />
                  </div>
                  <StatusBar status={g.status} />
                </article>
              ))}

              {results.prints3d.map((p) => (
                <article key={p.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">3D Print · {fmtDate(p.created_at)}</p>
                      <h2 className="font-bold text-white">{p.design_name} × {p.quantity}{p.price ? ` — $${Number(p.price).toFixed(2)}` : ""}</h2>
                    </div>
                    <Icon name="bolt" className="h-5 w-5 text-gold-400" />
                  </div>
                  <StatusBar status={p.status} />
                </article>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

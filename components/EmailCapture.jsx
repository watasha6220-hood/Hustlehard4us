"use client";

// "10% off your first order" email capture — sits above the footer.
// Saves to subscribers table (Supabase or demo storage), remembers
// subscription in localStorage so it doesn't nag repeat visitors.

import { useState, useEffect } from "react";
import Icon from "./Icons";
import { db } from "@/lib/db";
import { track } from "@/lib/track";
import { useSpamGuard, HoneypotField } from "@/lib/spam";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  // render immediately (SSR-visible); hide after mount if already subscribed
  const [hidden, setHidden] = useState(false);
  const guard = useSpamGuard(2);

  useEffect(() => {
    if (localStorage.getItem("hh4us_subscribed") === "1") setHidden(true);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (guard.isSpam() || !/\S+@\S+\.\S+/.test(email)) return;
    try {
      await db.subscribe(email, "footer");
      track("subscribed");
    } catch {
      /* duplicate email etc. — still show success */
    }
    localStorage.setItem("hh4us_subscribed", "1");
    setDone(true);
  };

  if (hidden && !done) return null;

  return (
    <section aria-label="Email signup" className="border-t border-ink-700 bg-ink-900">
      <div className="container-x flex flex-col items-center gap-5 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <h2 className="font-display text-xl uppercase text-white sm:text-2xl">
            Get <span className="text-gold-400">10% Off</span> Your First Order
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Plus early access to specials and drop-day deals. No spam, unsubscribe anytime.
          </p>
        </div>
        {done ? (
          <p className="flex items-center gap-2 rounded-xl border border-gold-400/40 bg-gold-400/10 px-6 py-3.5 font-bold text-gold-300" role="status">
            <Icon name="check" className="h-5 w-5" /> You&apos;re in! Use code <span className="text-white">HUSTLE10</span> at quote time.
          </p>
        ) : (
          <form onSubmit={submit} className="flex w-full max-w-md gap-2" aria-label="Subscribe for 10% off">
            <HoneypotField value={guard.hp} onChange={guard.setHp} />
            <label htmlFor="sub-email" className="sr-only">Email address</label>
            <input
              id="sub-email"
              type="email"
              required
              placeholder="you@email.com"
              className="input flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn-primary whitespace-nowrap px-6">Claim 10%</button>
          </form>
        )}
      </div>
    </section>
  );
}

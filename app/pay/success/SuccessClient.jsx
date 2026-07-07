"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icons";
import { site } from "@/data/site";
import { track } from "@/lib/track";

export default function SuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("loading"); // loading | paid | unknown

  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!sessionId) { setStatus("unknown"); return; }
    fetch(`/api/payment-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.paid) {
          setDetails(d);
          setStatus("paid");
          track("payment_completed");
        } else setStatus("unknown");
      })
      .catch(() => setStatus("unknown"));
  }, [sessionId]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20" aria-live="polite">
      <div className="card w-full max-w-xl p-10 text-center">
        {status === "loading" && <p className="text-zinc-400">Confirming your payment…</p>}

        {status === "paid" && (
          <>
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-ink-950">
              <Icon name="check" className="h-8 w-8" />
            </span>
            <h1 className="heading-lg mb-3">Payment Received!</h1>
            <p className="mb-2 text-zinc-400">
              {details?.amount ? <>We got your <strong className="text-gold-400">${details.amount.toFixed(2)}</strong> payment.</> : "Your payment went through."}
            </p>
            <p className="mb-8 text-zinc-400">
              A Stripe receipt is on its way to your email. Your order is officially locked in —
              we&apos;ll start production and keep you posted. Track it anytime on the{" "}
              <Link href="/track" className="font-bold text-gold-400 hover:underline">order tracker</Link>.
            </p>
          </>
        )}

        {status === "unknown" && (
          <>
            <h1 className="heading-lg mb-3">Almost There</h1>
            <p className="mb-8 text-zinc-400">
              We couldn&apos;t confirm this payment automatically. If you completed checkout you&apos;re
              all set — otherwise call us at{" "}
              <a href={site.phoneHref} className="font-bold text-gold-400 hover:underline">{site.phone}</a>.
            </p>
          </>
        )}

        <div className="flex justify-center gap-3">
          <Link href="/" className="btn-primary">Back Home</Link>
          <Link href="/track" className="btn-secondary">Track Order</Link>
        </div>
      </div>
    </section>
  );
}

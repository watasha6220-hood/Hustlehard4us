import { Suspense } from "react";
import QuoteClient from "./QuoteClient";
import { Reveal } from "@/components/Section";

export const metadata = {
  title: "Get a Quote — Instant Estimate for Custom Printing",
  description:
    "Build your custom printing quote in 5 quick steps: pick a product, upload your design, choose quantity and options, and get an instant estimate.",
};

export default function QuotePage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-14 sm:py-20" aria-label="Quote intro">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Quote Builder
            </p>
            <h1 className="heading-xl">
              Price Your Project in <span className="text-gold-400">2 Minutes</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Five quick steps, an instant estimate, and zero commitment. Bulk pricing
              applies automatically.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-label="Quote wizard">
        <div className="container-x">
          <Suspense fallback={<p className="text-center text-zinc-500">Loading quote builder…</p>}>
            <QuoteClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}

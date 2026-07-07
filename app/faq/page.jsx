import Link from "next/link";
import Icon from "@/components/Icons";
import { Reveal } from "@/components/Section";
import FaqAccordion from "@/components/FaqAccordion";
import CTABanner from "@/components/CTABanner";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";

export const metadata = {
  title: "FAQ — Pricing, Turnaround, Minimums & Print Methods",
  description:
    "Answers to the most common custom printing questions: t-shirt pricing, turnaround times, order minimums, DTG vs screen print vs DTF, gang sheets, file formats, and shipping.",
};

// FAQPage rich-result schema — Google can show expandable Q&A
// directly in search results for these questions.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="FAQ intro">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> FAQ
            </p>
            <h1 className="heading-xl">
              Questions? <span className="text-gold-400">Answered.</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Everything people ask us about pricing, turnaround, print methods,
              and files — straight answers, no runaround.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-label="Frequently asked questions">
        <div className="container-x">
          <FaqAccordion faqs={faqs} />

          <Reveal className="mx-auto mt-12 max-w-3xl">
            <div className="card flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="heading-md text-lg">Still have a question?</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Call, text, or chat — a real person answers, not a bot.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={site.phoneHref} className="btn-primary px-5 py-2.5 text-sm">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
                <Link href="/contact" className="btn-secondary px-5 py-2.5 text-sm">
                  Contact Us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABanner
        title="Got Your Answer? Let's Print."
        text="Instant estimates in the Quote Builder — bulk discounts applied automatically."
      />
    </>
  );
}

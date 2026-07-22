import WorkGrid from "@/components/WorkGrid";
import CTABanner from "@/components/CTABanner";
import { Reveal } from "@/components/Section";

export const metadata = {
  title: "Recent Work — Real Jobs, Real Results",
  description:
    "See real custom printing jobs from Hustlehard4USDesigns: t-shirt runs, banners, embroidery, 3D prints, and event displays for Antelope Valley brands and businesses.",
};

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="Recent work intro">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> The Receipts
            </p>
            <h1 className="heading-xl">
              Recent <span className="text-gold-400">Work</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Talk is cheap — here&apos;s what actually left the shop. Every job below
              was designed, printed, and delivered by us.
            </p>
          </Reveal>
        </div>
      </section>

      <WorkGrid />

      <CTABanner
        title="Want Your Project Up Here?"
        text="Every job on this page started with somebody's idea. Yours is next."
      />
    </>
  );
}

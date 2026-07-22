import TrackClient from "@/components/TrackClient";
import { Reveal } from "@/components/Section";

export const metadata = {
  title: "Track Your Order",
  description:
    "Check the status of your custom printing, gang sheet, or 3D print order from Hustlehard4USDesigns.",
};

export default function TrackPage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="Order tracking intro">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Order Status
            </p>
            <h1 className="heading-xl">
              Track Your <span className="text-gold-400">Order</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Enter the email you used when ordering and we&apos;ll pull up everything
              you&apos;ve got in the pipeline.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-label="Order lookup">
        <div className="container-x">
          <TrackClient />
        </div>
      </section>
    </>
  );
}

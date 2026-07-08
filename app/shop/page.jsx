import ShopGrid from "@/components/ShopGrid";
import CTABanner from "@/components/CTABanner";
import { Reveal } from "@/components/Section";

export const metadata = {
  title: "Shop — Custom Apparel, Prints & Displays",
  description:
    "Browse custom t-shirts, hoodies, embroidered hats, vinyl banners, DTF gang sheets, and event display packages from Hustle Hard 4 US Designs in Palmdale, CA.",
};

export default function ShopPage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="Shop intro">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> The Shop
            </p>
            <h1 className="heading-xl">
              Gear That <span className="text-gold-400">Gets Noticed</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Every product is made to order with your design. Prices shown are starting
              points — bulk orders unlock serious discounts.
            </p>
          </Reveal>
        </div>
      </section>

      <ShopGrid />
      <CTABanner
        title="Don't See What You Need?"
        text="We source thousands of blank styles and print on almost anything. Ask us — if it can hold ink or thread, we can brand it."
      />
    </>
  );
}

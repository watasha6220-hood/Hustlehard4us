import Link from "next/link";
import Icon from "./Icons";
import { Reveal } from "./Section";
import { site } from "@/data/site";

export default function CTABanner({
  title = "Ready to Print Something Great?",
  text = "Tell us what you're building. We'll help you design it, print it, and get it in your hands — fast.",
}) {
  return (
    <section aria-label="Call to action" className="relative overflow-hidden bg-gold-400 py-16 sm:py-20">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #000 0 2px, transparent 2px 18px)",
        }}
        aria-hidden="true"
      />
      <Reveal className="container-x relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl uppercase leading-tight text-ink-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 font-medium text-ink-950/80">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-8 py-4 font-bold text-white transition hover:bg-ink-800 active:scale-[0.98]"
          >
            Get a Quote <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink-950 px-8 py-4 font-bold text-ink-950 transition hover:bg-ink-950 hover:text-white active:scale-[0.98]"
          >
            <Icon name="phone" className="h-4 w-4" /> {site.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

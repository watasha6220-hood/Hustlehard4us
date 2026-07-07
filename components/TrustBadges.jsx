import Icon from "./Icons";
import { Reveal } from "./Section";
import { site } from "@/data/site";

export default function TrustBadges() {
  return (
    <section aria-label="Why choose us" className="border-y border-ink-700 bg-ink-900/60">
      <div className="container-x grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {site.trustBadges.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.06} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
              <Icon name={b.icon} className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-sm uppercase text-white">{b.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{b.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

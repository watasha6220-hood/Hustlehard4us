import Link from "next/link";
import Icon from "./Icons";
import { Reveal } from "./Section";
import BeforeAfterSlider from "./BeforeAfterSlider";

// "Napkin sketch → finished shirt" conversion section.
// Swap the images in /public/images/before-after/ with a real
// customer project whenever you have one — same file names, done.

export default function SketchToShirt() {
  return (
    <section className="relative overflow-hidden bg-ink-900/40 py-20 sm:py-28" aria-label="From sketch to shirt">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Design Services
          </p>
          <h2 className="heading-lg mb-5">
            From Napkin Sketch
            <br />
            to <span className="text-gold-400">Finished Fire</span>
          </h2>
          <p className="mb-4 leading-relaxed text-zinc-400">
            This is what we do best. A customer walked in with a ballpoint doodle
            on a napkin — our designers vectorized it, refined it, and pressed it
            onto premium tees. Drag the slider and see the glow-up yourself.
          </p>
          <p className="mb-8 leading-relaxed text-zinc-400">
            You don&apos;t need finished artwork, design software, or even a clear
            plan. Bring the idea — <strong className="text-white">we&apos;ll handle the rest</strong>,
            and you own the final files.
          </p>
          <ul className="mb-8 grid gap-2.5 sm:grid-cols-2">
            {[
              "Logo design & vectorizing",
              "2 free revisions included",
              "Print-ready file prep",
              "You keep the artwork files",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/quote" className="btn-primary">
              Start With Just an Idea <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <Link href="/services#design-services" className="btn-secondary">
              Design Services
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <BeforeAfterSlider
            before="/images/before-after/sketch.jpg"
            after="/images/before-after/finished.jpg"
            beforeLabel="Napkin Sketch"
            afterLabel="Finished Shirt"
            alt="Customer napkin sketch transformed into a finished printed t-shirt"
          />
          <p className="mt-3 text-center text-xs uppercase tracking-widest text-zinc-500">
            ← Drag the gold handle →
          </p>
        </Reveal>
      </div>
    </section>
  );
}

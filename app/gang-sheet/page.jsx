import GangSheetBuilder from "@/components/GangSheetBuilder";
import { Reveal } from "@/components/Section";
import Icon from "@/components/Icons";

export const metadata = {
  title: "Gang Sheet Builder — Build Your DTF Sheet Online",
  description:
    "Build your own 22\"-wide DTF gang sheet online: upload designs, arrange them on the sheet, see live pricing by the foot, and order in minutes.",
};

const steps = [
  { icon: "upload", text: "Upload your designs (PNG with transparency works best)" },
  { icon: "layers", text: "Drag, resize & rotate — or hit Auto-Arrange to pack the sheet" },
  { icon: "bolt", text: "Order with live pricing — transfers ship in 48 hours" },
];

export default function GangSheetPage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-14 sm:py-20" aria-label="Gang sheet builder intro">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> DTF Gang Sheets
            </p>
            <h1 className="heading-xl">
              Build Your <span className="text-gold-400">Gang Sheet</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Pack as many designs as you can onto a 22&quot;-wide DTF sheet and pay by the
              foot. What you see is what we print.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-ink-700 bg-ink-800/50 p-4 text-sm text-zinc-300">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  {s.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-16" aria-label="Gang sheet builder">
        <div className="container-x">
          <GangSheetBuilder />
        </div>
      </section>
    </>
  );
}

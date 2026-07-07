import Icon from "../Icons";
import { Reveal } from "../Section";

const badges = [
  { icon: "bolt", title: "Entrega Rápida", text: "Pedidos urgentes disponibles — la mayoría listos en 3–5 días hábiles." },
  { icon: "star", title: "Calidad Premium", text: "Tintas, hilos y materiales de grado comercial en cada trabajo." },
  { icon: "pencil", title: "100% Personalizado", text: "Tu arte, tu marca, a tu manera. Consulta de diseño gratis." },
  { icon: "shield", title: "Sin Mínimos*", text: "Ningún trabajo es muy chico ni muy grande — desde 1 playera hasta 10,000." },
];

export default function TrustBadgesEs() {
  return (
    <section aria-label="Por qué elegirnos" className="border-y border-ink-700 bg-ink-900/60">
      <div className="container-x grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b, i) => (
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

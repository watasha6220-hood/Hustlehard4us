import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icons";
import { Reveal, SectionHeader } from "@/components/Section";
import TrustBadgesEs from "@/components/es/TrustBadgesEs";
import { site } from "@/data/site";
import { services } from "@/data/services";

export const metadata = {
  title: "Impresión Personalizada en Palmdale, CA | Hustle Hard 4 US Designs",
  description:
    "Camisetas personalizadas, lonas, hojas DTF, bordado e impresión 3D en Palmdale, CA. Haz realidad tus ideas — cotización gratis. Se habla español.",
  alternates: { canonical: `${site.url}/es` },
};

// Spanish labels for the service cards
const serviceEs = {
  "custom-t-shirts": { name: "Camisetas Personalizadas", tag: "DTG • Serigrafía • Vinil", desc: "Desde una sola playera hasta líneas completas de ropa — imprimimos camisetas que la gente sí quiere usar." },
  "banners-signs": { name: "Lonas y Letreros", tag: "Cualquier tamaño, interior y exterior", desc: "Lonas de vinil resistentes con ojales, listas para el sol de California. Perfectas para inauguraciones y eventos." },
  "gang-sheets": { name: "Hojas DTF (Gang Sheets)", tag: "Transfers listos para planchar", desc: "Llena una hoja de 22 pulgadas con todos tus diseños y págala por pie. Colores vivos que aguantan lavadas." },
  "custom-displays": { name: "Displays para Eventos", tag: "Stands y montajes de marca", desc: "Paredes de fondo, banners retráctiles y manteles con tu logo — llega a tu evento como todo un profesional." },
  "embroidery": { name: "Bordado", tag: "Plano y 3D puff", desc: "Gorras, polos, chamarras y más con bordado de calidad comercial. Nada dice calidad como el hilo." },
  "3d-printing": { name: "Impresión 3D", tag: "Desde $0.12/gramo", desc: "Figuras, piezas funcionales, lámparas con tu foto y regalos únicos — impresos aquí en Palmdale." },
  "design-services": { name: "Servicios de Diseño", tag: "Logos y arte listo para imprimir", desc: "¿Tienes la idea pero no el archivo? Nuestros diseñadores crean tu logo y preparan todo para imprimir." },
};

const steps = [
  { icon: "pen", step: "01", title: "Diseña", text: "Sube tu diseño o trabaja con nuestros diseñadores. Nosotros lo dejamos perfecto para imprimir." },
  { icon: "bolt", step: "02", title: "Imprime", text: "Producimos tu pedido con equipo de calidad comercial — DTG, serigrafía, DTF, vinil o bordado." },
  { icon: "truck", step: "03", title: "Entrega", text: "Recoge en Palmdale o te lo enviamos. La mayoría de los pedidos están listos en 3–5 días hábiles." },
];

export default function HomeEsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden" aria-label="Principal">
        <Image src="/images/hero.jpg" alt="Taller de impresión de Hustle Hard 4 US Designs" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" aria-hidden="true" />
        <div className="absolute inset-0 bg-grit" aria-hidden="true" />
        <div className="container-x relative py-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
              Palmdale, CA • Se Habla Español
            </p>
            <h1 className="heading-xl">
              Haz Realidad
              <br />
              <span className="text-gold-400">Tus Ideas</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-zinc-300">
              Impresión personalizada para marcas, eventos y emprendedores.
              Camisetas, lonas, transfers DTF, bordado, impresión 3D y más —
              diseñado, impreso y entregado por gente que trabaja tan duro como tú.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/es/cotizar" className="btn-primary text-base">
                Cotizar Gratis <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
              <a href={site.phoneHref} className="btn-secondary text-base">
                <Icon name="phone" className="h-5 w-5" /> {site.phone}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-zinc-400">
              <span className="flex items-center gap-2"><Icon name="star" className="h-4 w-4 text-gold-400" /> 5 estrellas</span>
              <span className="flex items-center gap-2"><Icon name="bolt" className="h-4 w-4 text-gold-400" /> Listo en 3–5 días</span>
              <span className="flex items-center gap-2"><Icon name="shield" className="h-4 w-4 text-gold-400" /> Sin mínimos*</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 sm:py-28" aria-label="Nuestros servicios">
        <div className="container-x">
          <SectionHeader
            eyebrow="Lo Que Hacemos"
            title="Imprimimos de Todo. En Serio."
            text="Siete servicios, un solo taller, cero excusas. Lo que tu marca necesite para hacerse notar, nosotros lo hacemos."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const t = serviceEs[s.id] || { name: s.name, tag: s.tagline, desc: s.description.split(". ")[0] };
              return (
                <Reveal key={s.id} delay={i * 0.07}>
                  <Link
                    href="/es/cotizar"
                    className="card group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-glow"
                  >
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400 transition group-hover:bg-gold-400 group-hover:text-ink-950">
                      <Icon name={s.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="heading-md mb-1 text-lg">{t.name}</h3>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-500">{t.tag}</p>
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-400">{t.desc}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-400 transition group-hover:gap-3">
                      Cotizar <Icon name="arrowRight" className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <TrustBadgesEs />

      {/* CÓMO FUNCIONA */}
      <section className="py-20 sm:py-28" aria-label="Cómo funciona">
        <div className="container-x">
          <SectionHeader
            eyebrow="Proceso Sencillo"
            title="Diseña → Imprime → Entrega"
            text="De la idea a tus manos en tres pasos. Nosotros hacemos la parte difícil para que tú sigas trabajando."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((h, i) => (
              <Reveal key={h.step} delay={i * 0.12}>
                <div className="card relative h-full p-8">
                  <span className="absolute right-6 top-4 font-display text-6xl text-ink-700" aria-hidden="true">{h.step}</span>
                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400 text-ink-950 shadow-glow">
                    <Icon name={h.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="heading-md mb-3">{h.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gold-400 py-16 sm:py-20" aria-label="Llamada a la acción">
        <Reveal className="container-x relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl uppercase leading-tight text-ink-950 sm:text-4xl">
              ¿Listo Para Imprimir Algo Increíble?
            </h2>
            <p className="mt-3 font-medium text-ink-950/80">
              Cuéntanos tu proyecto. Te ayudamos a diseñarlo, imprimirlo y entregarlo — rápido y en tu idioma.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/es/cotizar" className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-8 py-4 font-bold text-white transition hover:bg-ink-800">
              Cotizar Ahora <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <a href={site.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink-950 px-8 py-4 font-bold text-ink-950 transition hover:bg-ink-950 hover:text-white">
              <Icon name="phone" className="h-4 w-4" /> {site.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

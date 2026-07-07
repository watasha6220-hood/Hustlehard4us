import { Suspense } from "react";
import QuoteWizard from "@/components/QuoteWizard";
import { Reveal } from "@/components/Section";
import { site } from "@/data/site";

export const metadata = {
  title: "Cotización Gratis — Impresión Personalizada",
  description:
    "Cotiza tu proyecto de impresión en 5 pasos: elige el producto, sube tu diseño, cantidad y opciones — estimado al instante. Se habla español.",
  alternates: { canonical: `${site.url}/es/cotizar` },
};

export default function CotizarPage() {
  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-14 sm:py-20" aria-label="Introducción">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Cotizador
            </p>
            <h1 className="heading-xl">
              Cotiza Tu Proyecto en <span className="text-gold-400">2 Minutos</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Cinco pasos rápidos, estimado al instante, sin compromiso.
              El descuento por volumen se aplica solo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-label="Cotizador">
        <div className="container-x">
          <Suspense fallback={<p className="text-center text-zinc-500">Cargando…</p>}>
            <QuoteWizard lang="es" />
          </Suspense>
        </div>
      </section>
    </>
  );
}

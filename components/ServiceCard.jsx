import Link from "next/link";
import Icon from "./Icons";
import { Reveal } from "./Section";

export default function ServiceCard({ service, index = 0 }) {
  return (
    <Reveal delay={index * 0.07}>
      <Link
        href={`/services#${service.id}`}
        className="card group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-glow"
      >
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400 transition group-hover:bg-gold-400 group-hover:text-ink-950">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <h3 className="heading-md mb-1 text-lg">{service.name}</h3>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-500">
          {service.tagline}
        </p>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-400">
          {service.description.split(". ")[0]}.
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-400 transition group-hover:gap-3">
          Learn more <Icon name="arrowRight" className="h-4 w-4" />
        </span>
      </Link>
    </Reveal>
  );
}

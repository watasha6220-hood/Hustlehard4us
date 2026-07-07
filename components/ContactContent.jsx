"use client";

import { useState } from "react";
import Icon from "./Icons";
import { Reveal } from "./Section";
import { site } from "@/data/site";
import { db } from "@/lib/db";
import { track } from "@/lib/track";
import { useSpamGuard, HoneypotField } from "@/lib/spam";

export default function ContactContent() {
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", details: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const guard = useSpamGuard(4);

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (guard.isSpam()) { setSent(true); return; } // silently drop bots
    setSaving(true);
    try {
      // Saves to Supabase when configured, or local demo storage otherwise.
      await db.submitMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        details: form.details,
        lang: "en",
        status: "new",
      });
      track("contact_sent");
    } catch (err) {
      console.error("Message save failed:", err);
    } finally {
      setSaving(false);
      setSent(true);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink-700 bg-ink-900 bg-grit py-16 sm:py-24" aria-label="Contact intro">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold-400" aria-hidden="true" /> Contact
            </p>
            <h1 className="heading-xl">
              Let&apos;s Talk <span className="text-gold-400">Print</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Call, text, WhatsApp, or drop your project details below — whichever is
              easiest for you. We respond fast.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.phoneHref} className="btn-primary">
                <Icon name="phone" className="h-4 w-4" /> Call {site.phone}
              </a>
              <a href={site.smsHref} className="btn-secondary">
                <Icon name="mail" className="h-4 w-4" /> Text Us
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Icon name="chat" className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-label="Contact form and location">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <Reveal>
            <div className="card p-7 sm:p-10">
              {sent ? (
                <div className="py-10 text-center" role="status">
                  <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-ink-950">
                    <Icon name="check" className="h-7 w-7" />
                  </span>
                  <h2 className="heading-md mb-3">Message Sent!</h2>
                  <p className="text-zinc-400">
                    Thanks {form.name.split(" ")[0] || "friend"} — we&apos;ll get back to you within 1 business day.
                    In a hurry? Call <a className="font-bold text-gold-400 hover:underline" href={site.phoneHref}>{site.phone}</a>.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} aria-label="Contact form">
                  <h2 className="heading-md mb-6">Send Project Details</h2>
                  <HoneypotField value={guard.hp} onChange={guard.setHp} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="c-name">Full name *</label>
                      <input id="c-name" required autoComplete="name" className="input" placeholder="Jordan Rivera" value={form.name} onChange={set("name")} />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-email">Email *</label>
                      <input id="c-email" type="email" required autoComplete="email" className="input" placeholder="you@business.com" value={form.email} onChange={set("email")} />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-phone">Phone</label>
                      <input id="c-phone" type="tel" autoComplete="tel" className="input" placeholder="(661) 555-0123" value={form.phone} onChange={set("phone")} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="c-details">Project details *</label>
                      <textarea
                        id="c-details"
                        required
                        rows={5}
                        className="input resize-none"
                        placeholder="What do you need printed? Quantity, sizes, deadline, and any design info…"
                        value={form.details}
                        onChange={set("details")}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary mt-6 w-full disabled:opacity-50 sm:w-auto">
                    {saving ? "Sending…" : "Send Message"} <Icon name="arrowRight" className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Info + map */}
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="card grid gap-5 p-7 sm:grid-cols-2">
              <div className="flex gap-3">
                <Icon name="pin" className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-bold text-white">Address</p>
                  <address className="text-sm not-italic text-zinc-400">
                    {site.address.street}<br />{site.address.city}, {site.address.stateShort} {site.address.zip}
                  </address>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="phone" className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-bold text-white">Phone</p>
                  <a href={site.phoneHref} className="text-sm text-zinc-400 hover:text-gold-300">{site.phone}</a>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="mail" className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-bold text-white">Email</p>
                  <a href={`mailto:${site.email}`} className="break-all text-sm text-zinc-400 hover:text-gold-300">{site.email}</a>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="clock" className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-bold text-white">Hours</p>
                  {site.hours.map((h) => (
                    <p key={h.days} className="text-sm text-zinc-400">{h.days}: {h.time}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="card overflow-hidden">
              <iframe
                src={site.mapEmbedSrc}
                title={`Map to ${site.name}`}
                width="100%"
                height="340"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Socials */}
            <div className="card flex items-center justify-between p-6">
              <p className="font-display text-sm uppercase text-white">Follow the hustle</p>
              <div className="flex gap-3">
                {[
                  { name: "instagram", href: site.social.instagram, label: "Instagram" },
                  { name: "facebook", href: site.social.facebook, label: "Facebook" },
                  { name: "tiktok", href: site.social.tiktok, label: "TikTok" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-zinc-300 transition hover:border-gold-400 hover:text-gold-400"
                  >
                    <Icon name={s.name} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

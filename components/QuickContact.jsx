"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";
import { site } from "@/data/site";

/** Floating quick-contact button: WhatsApp, SMS, and Call */
export default function QuickContact() {
  const [open, setOpen] = useState(false);

  const actions = [
    { label: "WhatsApp", href: site.whatsappHref, icon: "chat", bg: "bg-[#25D366]" },
    { label: "Text us", href: site.smsHref, icon: "mail", bg: "bg-sky-500" },
    { label: "Call now", href: site.phoneHref, icon: "phone", bg: "bg-gold-400" },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.a
              key={a.label}
              href={a.href}
              target={a.label === "WhatsApp" ? "_blank" : undefined}
              rel={a.label === "WhatsApp" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-2 rounded-full ${a.bg} py-2.5 pl-4 pr-5 text-sm font-bold text-ink-950 shadow-card`}
              aria-label={a.label}
            >
              <Icon name={a.icon} className="h-4 w-4" />
              {a.label}
            </motion.a>
          ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close quick contact menu" : "Open quick contact menu"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-ink-950 shadow-glow transition hover:bg-gold-300 active:scale-95"
      >
        <Icon name={open ? "close" : "chat"} className="h-6 w-6" />
      </button>
    </div>
  );
}

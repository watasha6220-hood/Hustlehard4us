"use client";

// Lightweight spam protection (no CAPTCHA needed for humans):
//  1. Honeypot — a hidden "website" field bots fill in, humans never see
//  2. Time gate — real people take >3s to fill a form
// Usage: const guard = useSpamGuard(); ...
//   <HoneypotField value={guard.hp} onChange={guard.setHp} />
//   if (guard.isSpam()) return;  // silently drop
//
// For extra armor later: add Cloudflare Turnstile (free) — see NEXT-LEVEL.md

import { useRef, useState } from "react";

export function useSpamGuard(minSeconds = 3) {
  const start = useRef(Date.now());
  const [hp, setHp] = useState("");

  const isSpam = () =>
    hp.trim() !== "" || (Date.now() - start.current) / 1000 < minSeconds;

  return { hp, setHp, isSpam };
}

export function HoneypotField({ value, onChange }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

// ============================================================
//  STRIPE (server-side only) — used by app/api/* routes.
//  Setup (~10 min, no monthly fee):
//   1. stripe.com → create account (fees: ~2.9% + 30¢ per charge)
//   2. Developers → API keys → copy both into .env.local:
//        STRIPE_SECRET_KEY=sk_live_... (or sk_test_... to test)
//        NEXT_PUBLIC_STRIPE_ENABLED=1
//   3. Optional promo: Products → Coupons → create "HUSTLE10" (10% off),
//      then Promotion Codes → code HUSTLE10 → allows the checkout
//      promo-code box to accept it.
//  Without keys, payment buttons hide automatically — site works fine.
// ============================================================

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;
export const isStripeConfigured = Boolean(key);

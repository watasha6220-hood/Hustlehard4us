// POST /api/checkout — creates a Stripe Checkout Session.
// Two modes:
//  • { kind: "gang_sheet", price, description, email }  → full payment
//  • { kind: "print3d",    price, description, email }  → full payment
//  • { kind: "deposit",    price, description, email }  → admin-sent deposit
// Amounts are validated server-side (min $5, max $10,000).

import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe-server";

const ALLOWED_KINDS = new Set(["gang_sheet", "print3d", "deposit"]);

export async function POST(req) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }
  try {
    const { kind, price, description, email, orderId } = await req.json();

    if (!ALLOWED_KINDS.has(kind)) {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }
    const amount = Math.round(Number(price) * 100);
    if (!Number.isFinite(amount) || amount < 500 || amount > 1000000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      allow_promotion_codes: true, // HUSTLE10 works here once created in Stripe
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name: description?.slice(0, 120) || "HH4US Designs order",
            },
          },
          quantity: 1,
        },
      ],
      metadata: { kind, orderId: orderId || "" },
      success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay/cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

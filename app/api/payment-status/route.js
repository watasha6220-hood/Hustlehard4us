// GET /api/payment-status?session_id=cs_... — verifies a checkout session
// so the success page can show a real confirmation.

import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe-server";

export async function GET(req) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      paid: session.payment_status === "paid",
      amount: (session.amount_total ?? 0) / 100,
      email: session.customer_details?.email || null,
      description: session.metadata?.kind || null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}

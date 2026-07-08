"use client";

// Client helper — POST to our checkout API and redirect to Stripe.
// Payment buttons only render when NEXT_PUBLIC_STRIPE_ENABLED=1.

export const isStripeEnabled = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "1";

export async function startCheckout({ kind, price, description, email, orderId }) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, price, description, email, orderId }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
    return true;
  }
  throw new Error(data.error || "Checkout failed");
}

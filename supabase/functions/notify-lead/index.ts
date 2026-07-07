// ============================================================
//  Supabase Edge Function: notify-lead
//  Sends TWO emails via Resend (free: 3,000/month) whenever a
//  new quote, message, or gang sheet order is inserted:
//    1. alert to the shop owner
//    2. branded confirmation to the customer
//
//  DEPLOY (once, free):
//    npx supabase functions deploy notify-lead --no-verify-jwt
//    npx supabase secrets set RESEND_API_KEY=re_xxx OWNER_EMAIL=you@email.com
//
//  Then create 4 Database Webhooks (Dashboard → Database → Webhooks):
//    table: quotes         | events: INSERT | → this function's URL
//    table: messages       | events: INSERT | → this function's URL
//    table: gang_sheets    | events: INSERT | → this function's URL
//    table: print3d_orders | events: INSERT | → this function's URL
// ============================================================

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "orders@hustlehard4usdesigns.com";
const FROM = "HH4US Designs <onboarding@resend.dev>"; // swap for your verified domain later

const gold = "#f5b52e";

function ownerHtml(table: string, r: Record<string, unknown>) {
  const rows = Object.entries(r)
    .filter(([k]) => !["id", "items"].includes(k))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#888;font-size:13px">${k}</td><td style="padding:6px 12px;font-size:13px"><strong>${
          Array.isArray(v) ? v.join(", ") : v ?? "—"
        }</strong></td></tr>`
    )
    .join("");
  return `
  <div style="font-family:Arial,sans-serif;background:#101014;color:#eee;padding:32px;border-radius:12px">
    <h2 style="color:${gold};text-transform:uppercase">🔥 New ${table.replace("_", " ")} lead</h2>
    <table style="border-collapse:collapse;background:#18181d;border-radius:8px">${rows}</table>
    <p style="color:#888;font-size:12px;margin-top:16px">Open your admin panel to manage this lead.</p>
  </div>`;
}

function customerHtml(name: string, kind: string, lang: string) {
  if (lang === "es") {
    return `
    <div style="font-family:Arial,sans-serif;background:#101014;color:#eee;padding:32px;border-radius:12px">
      <h2 style="color:${gold};text-transform:uppercase">¡Recibido, ${name}! 💪</h2>
      <p>Tu solicitud llegó a <strong>Hustle Hard 4 US Designs</strong>.</p>
      <p>Te respondemos dentro de <strong>1 día hábil</strong> — normalmente mucho más rápido.</p>
      <p>¿Lo necesitas antes? Llama o manda texto al <a href="tel:+12138413068" style="color:${gold}">(213) 841-3068</a>. Se habla español.</p>
      <p style="color:#888;font-size:12px;margin-top:24px">4654 Ave S, Suite #187, Palmdale, CA 93552</p>
    </div>`;
  }
  return `
  <div style="font-family:Arial,sans-serif;background:#101014;color:#eee;padding:32px;border-radius:12px">
    <h2 style="color:${gold};text-transform:uppercase">Got it, ${name}! 💪</h2>
    <p>Your ${kind} just landed at <strong>Hustle Hard 4 US Designs</strong>.</p>
    <p>We'll get back to you within <strong>1 business day</strong> — usually much faster.</p>
    <p>Need it sooner? Call or text <a href="tel:+12138413068" style="color:${gold}">(213) 841-3068</a>.</p>
    <p style="color:#888;font-size:12px;margin-top:24px">4654 Ave S, Suite #187, Palmdale, CA 93552</p>
  </div>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) console.error("Resend error:", await res.text());
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { table, record } = payload; // Supabase webhook shape
    if (!record) return new Response("no record", { status: 400 });

    const kindLabel =
      table === "quotes" ? "quote request"
      : table === "gang_sheets" ? "gang sheet order"
      : table === "print3d_orders" ? "3D print order"
      : "message";

    const lang = record.lang === "es" ? "es" : "en";
    const subject = lang === "es"
      ? "¡Recibimos tu solicitud! — HH4US Designs"
      : `We got your ${kindLabel}! — HH4US Designs`;

    await Promise.all([
      // Owner alert is ALWAYS in English (with 🇪🇸 flag when applicable)
      sendEmail(OWNER_EMAIL, `🔥 New ${kindLabel}${lang === "es" ? " 🇪🇸" : ""} — ${record.name}`, ownerHtml(table, record)),
      // Customer confirmation in their language
      record.email
        ? sendEmail(record.email, subject, customerHtml(record.name || "friend", kindLabel, lang))
        : Promise.resolve(),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response("error", { status: 500 });
  }
});

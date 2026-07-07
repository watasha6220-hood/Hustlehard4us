# 🚀 Next-Level Roadmap — honest audit & what's still missing

Ranked by impact for a Palmdale print shop. ⚡ = quick win · 💰 = direct revenue · 🔒 = protects the business

---

## TIER 1 — I'd do these next (biggest gaps)

### 1. 💰 Spanish version of the site (huge for Palmdale)
Palmdale/Lancaster is majority-Hispanic — a proper **/es** version (not Google
Translate widget) doubles the addressable local market. Nobody else's local
print shop site will have it done well. Next.js i18n + a `data/es.js`
translations file keeps it maintainable. Also: "Se habla español" badge in
the header/footer even before the full translation ships.

### 2. 💰 "Recent Work" portfolio page (admin-fed)
The single biggest trust gap right now: the site has AI product mockups but no
**proof of real jobs**. Add a `portfolio` table + admin tab → owner snaps a
photo of every finished order from their phone, adds one line ("50 tees for
XYZ Trucking"), it appears in a filterable gallery. Fresh content weekly =
trust + SEO + Instagram material from one photo.

### 3. 🔒 Supabase Auth on /admin + locked-down RLS
Current passcode is client-side and the database policies are wide open —
fine for launch, risky once real customer data accumulates. Upgrade:
email+password login (Supabase Auth, free), RLS policies flip to
"authenticated users only" for reads/updates, public keeps insert-only.
~1 hour of work, closes the biggest security hole.

### 4. 🔒 Spam protection on all forms
Public forms + open insert policies = bot spam eventually. Cheap fixes that
don't annoy humans: honeypot field (invisible to people, bots fill it),
minimum-time-to-submit check, and Cloudflare Turnstile (free, invisible
CAPTCHA) on the quote/contact forms.

### 5. 💰 Stripe deposits & payments
"Pay 50% deposit to lock in your order" converts approved quotes into
committed orders. Stripe has no monthly fee. Flow: admin marks a quote
"quoted" with final price → customer gets a payment link → deposit paid →
status auto-flips to "won". Also enables instant full payment for gang
sheets and flat-priced 3D items (they're already exact prices).

---

## TIER 2 — strong upgrades once Tier 1 is live

### 6. 💰 Customer order tracking page
`/track` — enter email + order number → see status (the admin statuses
already exist: printing → ready → done). Cuts "is my order ready?" calls
and looks incredibly professional for a local shop.

### 7. ⚡ Admin image uploads (no more file paths)
Right now adding a product/design photo means dropping a file in the code
folder or pasting a URL. Add an upload button in the admin editors that
pushes straight to Supabase Storage and fills the URL automatically —
owner manages everything from a phone, zero code folder access.

### 8. 💰 Email capture + simple follow-ups
A "10% off your first order" popup/footer signup feeding a `subscribers`
table. Even without fancy automation, the owner gets a list to blast when
there's a slow week ("Gang sheet special this Friday"). Resend can send the
campaigns free at this volume.

### 9. ⚡ Google Reviews on the site
Once the Google Business Profile has real reviews, replace/augment the
static testimonials with actual Google reviews (name + star + date +
"posted on Google"). Far more persuasive than site-hosted quotes.

### 10. 💰 Referral / repeat-customer hook
Print business is repeat business. Simplest version: after an order is
marked "done", the confirmation email includes "$10 off your next order +
$10 for any friend you send." Track with a code field on quotes.

---

## TIER 3 — polish & scale

- **DTF file checker** — client-side DPI/size validation warns customers
  about blurry uploads *before* ordering (fewer bad-art disputes)
- **Gang sheet draft saving** — localStorage autosave so customers don't
  lose 20 minutes of layout work; "email me my draft" for follow-up leads
- **PWA / add-to-home-screen** — one manifest file; repeat customers open
  the site like an app
- **Blog for SEO** — 2 posts/month: "DTG vs screen print for your brand,"
  "How to prep files for DTF" — owns the how-to searches locally
- **Gift cards** — sells itself around holidays; Stripe makes this easy
- **next/font self-hosting** — kill the render-blocking Google Fonts import
  (small, real Lighthouse gain)
- **Seasonal promo banner** — one line in `data/site.js` drives a
  dismissible top bar ("⚡ 20% off banners through Friday")
- **Conversion events in Clarity/GA4** — track quote-started vs completed,
  find exactly where people bail

---

## My pick if you say "just do it": 
**#1 Spanish + #2 Portfolio + #3 Auth + #4 spam protection** — two revenue
plays and two protection plays, all free, all doable right here.

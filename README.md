# Hustlehard4USDesigns — Custom Printing Website

A production-ready, mobile-first, SEO-optimized website built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Framer Motion**.

> 4654 Ave S, Suite #187, Palmdale, CA 93552 · (213) 841-3068

Now with **Supabase backend**, **Admin Panel** (`/admin`), an interactive **Gang Sheet Builder** (`/gang-sheet`), **3D t-shirt preview**, **Lenis smooth scrolling + film grain polish**, **artwork uploads to Supabase Storage**, **Resend email notifications**, and free **Tawk.to chat / Microsoft Clarity** hooks.

> 🚀 **Launching?** Follow `GO-LIVE-CHECKLIST.md` — 5 free signups, ~90 minutes, everything activates via `.env.local` keys.
> 💾 **Saving/owning this?** See `HOW-TO-SAVE.md` — download the zip, push to GitHub, deploy on Vercel.
> 🔒 **Going to real volume?** Run `supabase/auth-hardening.sql` + create an owner login (locks lead data behind auth).

### Newest: Stripe payments + Blog
- 💳 **Stripe** (`app/api/checkout`, `lib/stripe-*`): "Pay Now" on gang sheet & 3D shop-design confirmations, "💳 Payment link" deposit generator in admin Quotes tab (copies a checkout URL to text the customer), `/pay/success` + `/pay/cancelled` pages, HUSTLE10 promo-code support at checkout. Buttons hide until `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_ENABLED=1` are set — see GO-LIVE-CHECKLIST step 7.
- 📝 **Blog** (`/blog`, content in `data/posts.js`): 4 pre-written SEO articles (DTG vs screen vs DTF, DTF file prep, shirt cost guide, banner size guide) with Article schema, related posts, and in-article CTAs. Add a post = copy an object in `data/posts.js`.

### Latest additions (all 3 tiers)
- 🇲🇽 **Spanish site**: `/es` + `/es/cotizar` (bilingual quote wizard). Leads tagged `lang:es` → 🇪🇸 badge + Translate button in admin; customer confirmation emails auto-send in Spanish.
- 📸 **Recent Work**: `/work` portfolio page + admin Portfolio tab with direct photo upload to Supabase Storage.
- 📦 **Order tracking**: `/track` — customers check status by email (progress bars from admin statuses).
- 📧 **Email capture**: "10% off first order" bar above footer → Subscribers tab in admin + CSV export.
- 🛡️ **Spam protection**: honeypot + time-gate on every public form; `supabase/auth-hardening.sql` for locked-down RLS + secure tracking RPC.
- ⚡ **Promo banner**: dismissible top bar, edit in `data/site.js` → `promo`.
- 🎟 **Referral field** on quotes (shows with 🎟 in admin).
- 📱 **PWA manifest** (add-to-home-screen), 📊 conversion events (`lib/track.js`), self-hosted fonts via `next/font`, DTF low-res warning + draft autosave in the gang sheet builder.

---

## 🚀 Run Locally

```bash
npm install
npm run dev        # → http://localhost:3000
```

Works instantly with **zero setup** — forms and the admin panel run in *demo mode* (browser storage) until you connect Supabase.

---

## 🗄️ Connect Supabase (go live in ~5 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the dashboard, open **SQL Editor**, paste the contents of `supabase/schema.sql`, and click **Run**. This creates 4 tables: `quotes`, `messages`, `gang_sheets`, `products`.
3. Copy `.env.local.example` → `.env.local` and fill in from **Project Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_ADMIN_PASSCODE=your-secret-passcode
   ```
4. Restart `npm run dev`. The admin header will show **● Connected to Supabase**.

Every quote request, contact message, gang sheet order, and admin product edit now persists in your database. (When keys are missing, the same code transparently falls back to localStorage so you can demo everything.)

> 🔒 **Security note:** the starter RLS policies allow public read/write for simplicity. Before heavy production use, enable Supabase Auth and tighten the policies in `supabase/schema.sql` so only authenticated admins can read leads and edit products.

---

## 🛠️ Admin Panel — `/admin`

Passcode-gated dashboard (set `NEXT_PUBLIC_ADMIN_PASSCODE`; default `hustlehard2026` — change it!).

- **Dashboard stats** — lead counts, new items, total pipeline value
- **Quotes tab** — every Quote Builder submission with contact links + status workflow (new → contacted → quoted → won/lost)
- **Messages tab** — contact form messages (new → replied → closed)
- **Gang Sheets tab** — orders with full layout breakdown (every design's size/position) + production status (new → printing → shipped → done)
- **Products tab** — add / edit / hide / delete products **without touching code**. New products appear in the Shop and Home page instantly. Paste an image path (`/images/products/foo.jpg`) or any full image URL, with live preview.

## 🧩 Gang Sheet Builder — `/gang-sheet`

Customer-facing DTF sheet designer:

- 22"-wide canvas with inch grid + foot markers (config in `components/GangSheetBuilder.jsx` → `SHEET`)
- Upload multiple PNG/JPG designs (drag & drop supported)
- Drag to move, gold handle to resize (aspect-locked), rotate 90°, duplicate, delete
- **Auto-Arrange** — shelf-packing algorithm that packs designs tightly to minimize footage
- Live pricing: billed by linear foot in half-foot increments with a minimum charge
- Checkout saves the complete layout to Supabase → shows up in the admin panel ready to print

Production build:

```bash
npm run build
npm start
```

Deploy in one click on [Vercel](https://vercel.com) (recommended) — just import the repo.

---

## 📁 Project Structure

```
app/
  layout.jsx           # Root layout: navbar, footer, SEO meta, LocalBusiness JSON-LD
  page.jsx             # HOME — hero, services, featured products, how-it-works, testimonials
  globals.css          # Tailwind + brand utility classes (buttons, headings, cards)
  services/page.jsx    # SERVICES — 6 full sections with galleries + CTAs
  shop/page.jsx        # SHOP — filterable product grid + quick view
  about/page.jsx       # ABOUT — story, values, location
  contact/page.jsx     # CONTACT — form, map embed, click-to-call, socials
  quote/               # QUOTE BUILDER — 5-step wizard w/ live pricing
  gang-sheet/page.jsx  # GANG SHEET BUILDER — interactive DTF sheet designer
  3d-printing/         # 3D PRINTING — showcase, per-gram pricing, configurator
  admin/page.jsx       # ADMIN PANEL — leads, orders & product management
  faq/page.jsx         # FAQ — accordion + FAQPage rich-result schema
  areas/               # CITY LANDING PAGES — local SEO (see data/cities.js)
  sitemap.js           # Auto-generated sitemap.xml
  robots.js            # robots.txt

lib/
  supabase.js          # Supabase client (auto demo-mode without keys)
  db.js                # Unified data layer (Supabase ⇄ localStorage)
  useDbProducts.js     # Merges starter catalog + admin-added products

supabase/
  schema.sql           # Paste into Supabase SQL Editor to create tables

components/
  Navbar.jsx           # Sticky responsive nav
  Footer.jsx           # Footer with contact info + hours
  Icons.jsx            # Inline SVG icon set (zero dependencies)
  Section.jsx          # Scroll-reveal animation helpers
  ServiceCard.jsx      # Service preview card
  ProductCard.jsx      # Product card w/ hover + quick view
  QuickViewModal.jsx   # Product quick-view dialog
  ShopGrid.jsx         # Category filter + grid
  FeaturedProducts.jsx # Home page featured section
  Testimonials.jsx     # Auto-rotating review slider
  TrustBadges.jsx      # Trust badge strip
  CTABanner.jsx        # Gold conversion banner
  GallerySlider.jsx    # Image slider w/ thumbnails
  UploadPreview.jsx    # Drag-drop design upload + live shirt/banner mockup
  QuoteWizard.jsx      # Multi-step quote form + bulk pricing calculator
  QuickContact.jsx     # Floating WhatsApp / SMS / Call button
  GangSheetBuilder.jsx # Drag/resize/rotate canvas + auto-arrange + pricing
  admin/AdminPanel.jsx      # Dashboard, tabs, status workflows
  admin/ProductsManager.jsx # No-code product CRUD

data/
  site.js              # ⚙️ Business info (phone, address, hours, socials)
  products.js          # 🛍️ Product catalog (add products here!)
  services.js          # 🖨️ Services content + galleries
  testimonials.js      # ⭐ Customer reviews
  faqs.js              # ❓ FAQ content (feeds page + Google rich results)
  cities.js            # 📍 Service-area cities (each = a landing page)
  printing3d.js        # 🖨️ 3D print designs, materials & per-gram rates

public/images/         # 🖼️ All images live here
```

---

## 🖼️ HOW TO ADD PICTURES (30 seconds)

1. Drop your photo into `public/images/products/` (square ≈1000×1000 looks best; use `.jpg` or `.png`).
2. Reference it anywhere as `/images/products/your-photo.jpg`.

That's it — Next.js `<Image>` handles optimization, lazy-loading, and responsive sizes automatically.

## 🛍️ HOW TO ADD A PRODUCT (60 seconds)

Open `data/products.js`, copy any object in the array, and edit:

```js
{
  id: "trucker-hat",                          // unique, url-safe
  name: "Custom Trucker Hat",
  category: "Apparel",                        // Apparel | Prints | Displays
  price: 19.99,
  priceNote: "from",
  image: "/images/products/trucker-hat.jpg",  // your photo from step above
  badge: "New",                               // or null
  featured: true,                             // true = also shows on Home page
  description: "Foam-front trucker hat with your logo pressed or embroidered.",
  options: ["Embroidery", "DTF Press", "One Size"],
},
```

Save. It automatically appears in the Shop grid, category filters, Quick View, and (if `featured: true`) the Home page. **No component code changes needed.**

Same pattern for **services** (`data/services.js`), **reviews** (`data/testimonials.js`), and **business info** (`data/site.js` — phone, hours, socials, map).

---

## ✨ Features Included

- ✅ 6 pages: Home, Services, Shop, About, Contact, Quote Builder
- ✅ 5-step Quote Wizard with **instant estimate + automatic bulk-discount pricing** (edit rates in `components/QuoteWizard.jsx` → `PRICING` / `TIERS`)
- ✅ **Upload Your Design** with live t-shirt/banner mockup preview (client-side, no backend)
- ✅ Floating **WhatsApp / SMS / Call** quick-contact button
- ✅ Testimonials auto-slider, gallery sliders, Framer Motion scroll reveals
- ✅ Trust badges, CTA banners, marquee strip
- ✅ SEO: per-page meta, Open Graph, LocalBusiness JSON-LD, sitemap.xml, robots.txt
- ✅ Accessible: ARIA roles/labels, keyboard nav, focus rings, skip link
- ✅ Fully responsive, mobile-first

---

## 📧 Email Notifications (optional next step)

Forms already save to Supabase. To also get an email/SMS ping per lead:
- **Supabase Database Webhooks** → trigger on `INSERT` into `quotes` / `gang_sheets` → point at a [Resend](https://resend.com) email function or Twilio SMS.
- Or a Supabase **Edge Function** with a `pg_net` trigger for automated customer confirmation emails.

**Design file uploads:** store customer artwork in **Supabase Storage** — create a public `artwork` bucket and wire `UploadPreview`'s `onFile` / the gang sheet images to `supabase.storage.from("artwork").upload(...)`.

---

## 💳 E-commerce Integration (optional)

**Stripe (recommended for deposits/quick sales):**
```bash
npm install stripe @stripe/stripe-js
```
- Add `app/api/checkout/route.js` creating a Stripe Checkout Session from a product id + quantity.
- Add a "Buy Now" button in `QuickViewModal.jsx`. Products in `data/products.js` map 1:1 to Stripe Prices.

**Shopify-ready:** the product schema mirrors Shopify's — swap `data/products.js` for the Shopify Storefront API (`@shopify/storefront-api-client`) and keep the same `ProductCard`/`ShopGrid` components.

## 🎨 Rebranding

All brand colors live in `tailwind.config.js` (`ink` darks + `gold` accent). Change those hex values to instantly re-skin the whole site. Fonts are set in `app/globals.css` (Archivo / Archivo Black).

# 💸 $0 Upgrade Roadmap — Hustle Hard 4 US Designs

Every item below is free (free tier or open source), ranked by impact-per-effort.
⚡ = do this week · 🔥 = big visual/conversion payoff · 🧰 = nice-to-have

---

## 1. VISUAL "WOW" — make it look like a $10k agency build

| Upgrade | Free tool | Why it matters |
|---|---|---|
| ⚡🔥 **Real photos of real jobs** | Owner's phone + Snapseed (free) | Nothing beats authentic shop photos — AI/stock reads as "template." A consistent gold/dark edit preset makes even phone pics look branded. Until then: Unsplash/Pexels (free commercial use). |
| 🔥 **3D interactive t-shirt viewer** | `react-three-fiber` + `drei` (OSS) + free GLTF shirt model (Sketchfab CC0) | Drop the customer's uploaded logo onto a rotating 3D shirt in the quote builder. This is THE "whoa" feature visitors screenshot and share. 100% client-side, $0. |
| 🔥 **Buttery smooth scrolling** | `lenis` (OSS, ~3kb) | The single cheapest way to make a site feel expensive. Pairs perfectly with the existing Framer Motion reveals. |
| ⚡ **Sharper fonts, faster** | `next/font` (built-in) + Fontshare's *Clash Display* (free) | Self-hosts fonts (kills the render-blocking Google Fonts request) and Clash Display gives a more distinctive display face than Archivo Black. |
| 🔥 **Before/After slider** | ~40 lines of custom code | "Customer's napkin sketch → finished shirt" drag slider on the Design Services section. Sells the design service better than any paragraph. |
| 🧰 **Subtle noise/grain overlay + animated gradient accents** | Pure CSS/SVG | The current grit texture is good; a film-grain overlay + slow-moving gold gradient blobs behind the hero = modern streetwear aesthetic (see Nike SNKRS, Represent). |
| 🧰 **Lottie micro-animations** | LottieFiles free + `lottie-react` | Animated printer/stitching icons for "How It Works" instead of static SVGs. |
| 🧰 **Dynamic OG share images** | `next/og` (built-in, free) | When someone shares the site on IG/WhatsApp, they see a branded gold card per page instead of a generic screenshot. |

## 2. TRUST & CONVERSION — turn visitors into orders

| Upgrade | Free tool | Why |
|---|---|---|
| ⚡🔥 **Google Business Profile** | google.com/business (free) | #1 thing for a local print shop. Shows up in Maps + "print shop near me," collects real reviews. Then feed those real reviews into the testimonials slider. |
| ⚡🔥 **Free live chat** | Tawk.to (100% free, unlimited) | Answer "how much for 50 shirts?" in real time from a phone app. Massive for lead capture; the floating widget matches the quick-contact button. |
| ⚡ **Heatmaps + session recordings** | Microsoft Clarity (100% free, no limits) | Watch exactly where visitors drop off in the quote wizard and fix it. GA4 for traffic numbers (also free). |
| 🔥 **Real portfolio grid** | Supabase Storage (1GB free) | "Recent Work" page fed by the admin panel — owner snaps a photo of each finished job, uploads from phone, site updates itself. Fresh content = SEO + trust. |
| ⚡ **Email notifications on new leads** | Supabase webhooks + Resend (3,000 emails/mo free) | Owner gets an email (and customer gets a branded confirmation) the second a quote/gang sheet lands. No Zapier needed. |
| 🧰 **Booking for design consults** | Cal.com (free tier) | "Book a free 15-min design call" button — self-serve scheduling, embeds in the site. |
| 🧰 **Instagram feed section** | Behold.so free tier or manual grid | Social proof loop: shop posts jobs on IG → homepage shows the latest 6 automatically. |

## 3. SPEED & SEO — free rankings

| Upgrade | Free tool | Why |
|---|---|---|
| ⚡ **Deploy on Vercel free tier** | vercel.com | Global CDN, image optimization, HTTPS, preview deploys. The site is already static-rendered so it'll score 95+ on Lighthouse. |
| ⚡ **Cloudflare free** | DNS + CDN + basic WAF | Free domain-level caching/security in front of Vercel. |
| ⚡ **Search Console + sitemap submit** | Google/Bing (free) | Sitemap.xml already exists — submitting it starts local rankings for "custom shirts Palmdale," "DTF gang sheets Antelope Valley," etc. |
| 🧰 **FAQ page + FAQ schema** | Built-in JSON-LD | Wins the expandable FAQ rich results in Google ("How much do custom shirts cost?"). |
| 🧰 **City landing pages** | Just content | /custom-shirts-lancaster, /printing-antelope-valley — local SEO gold for a shop serving nearby cities. |

## 4. HARDEN THE FREE BACKEND

| Upgrade | Free tool | Why |
|---|---|---|
| ⚡ **Supabase Auth for /admin** | Supabase (free) | Replace the passcode with real email+password login and lock the RLS policies so only the owner can read leads. Still $0. |
| 🔥 **Artwork upload to Supabase Storage** | 1GB free | Quote builder + gang sheet currently preview files client-side only; storing them means the owner gets the actual print files with each order. |
| 🧰 **Stripe deposits** | Stripe (no monthly fee) | "Pay 50% deposit to lock in your order" button on accepted quotes. Only costs per-transaction %, nothing monthly. |
| 🧰 **Weekly DB backup** | Supabase scheduled backups (free tier daily) | Peace of mind, zero effort. |

---

## 🎯 If I could only do 5 (all free, ~1 day of work)

1. **Lenis smooth scroll + hero gradient/grain polish** — instant "expensive" feel
2. **3D shirt preview with the customer's uploaded design** — the shareable wow feature
3. **Tawk.to live chat + Microsoft Clarity** — capture leads, see friction
4. **Supabase Storage artwork uploads + Resend lead emails** — makes orders truly actionable
5. **Google Business Profile + Search Console** — free customers from Maps/search (owner does this one, ~30 min)

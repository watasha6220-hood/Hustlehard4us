# ✅ Go-Live Checklist — all free, ~90 minutes total

The code side of all five upgrades is DONE and live in this project.
These are the account signups only the owner can do. Each one activates
automatically once its key is pasted into `.env.local` (then restart/redeploy).

---

## 1. Supabase — database + artwork files (~10 min)
- [ ] Create free project at **supabase.com**
- [ ] SQL Editor → paste ALL of `supabase/schema.sql` → Run
      (now also creates the public `artwork` storage bucket + URL columns)
- [ ] Project Settings → API → copy into `.env.local`:
      `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✔ Result: quotes, messages, gang sheets persist; **customer design files
  are uploaded and linked in the admin panel** (📎 View artwork)

## 2. Resend — email notifications (~15 min)
- [ ] Sign up at **resend.com** (3,000 emails/mo free) → create API key
- [ ] Deploy the included edge function:
      ```
      npx supabase functions deploy notify-lead --no-verify-jwt
      npx supabase secrets set RESEND_API_KEY=re_xxx OWNER_EMAIL=your@email.com
      ```
- [ ] Supabase Dashboard → Database → Webhooks → create 4 webhooks
      (INSERT on `quotes`, `messages`, `gang_sheets`, `print3d_orders` → the function URL)
- ✔ Result: owner gets an instant email per lead + customer gets a branded
  gold confirmation email. Code: `supabase/functions/notify-lead/index.ts`

## 3. Tawk.to — free live chat (~10 min)
- [ ] Sign up at **tawk.to** (100% free, unlimited agents)
- [ ] Administration → Chat Widget → the embed URL looks like
      `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`
- [ ] Paste both IDs into `.env.local`:
      `NEXT_PUBLIC_TAWK_PROPERTY_ID`, `NEXT_PUBLIC_TAWK_WIDGET_ID`
- [ ] Install the Tawk.to phone app to answer chats on the go
- ✔ Result: chat bubble appears site-wide (loads only when IDs exist)

## 4. Microsoft Clarity — heatmaps + recordings (~5 min)
- [ ] Sign up at **clarity.microsoft.com** (100% free, no limits)
- [ ] New project → copy Project ID → `.env.local`: `NEXT_PUBLIC_CLARITY_ID`
- ✔ Result: watch real session replays of the quote wizard & gang sheet
  builder; find and fix drop-off points with data

## 5. Google Business Profile + Search Console (~30 min, biggest payoff)
- [ ] **google.com/business** → create profile with the exact
      name/address/phone used on the site (4654 Ave S #187, Palmdale)
- [ ] Verify (postcard/phone/video) → add photos of finished jobs weekly
- [ ] Ask every happy customer for a review (text them the review link!)
- [ ] **search.google.com/search-console** → add property → HTML tag method
      → paste the `content="..."` value into `.env.local`:
      `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- [ ] Submit sitemap: `https://YOURDOMAIN.com/sitemap.xml`
- ✔ Result: show up on Google Maps + "print shop near me" searches.
  The site already ships rich LocalBusiness schema (hours, geo, services,
  social links) so Google can build a full business panel.

---

## 6. Security hardening (before real lead volume, ~20 min)
- [ ] Supabase → Authentication → Users → Add the owner's email+password
- [ ] Authentication → Providers → Email → turn OFF "Enable Signups"
- [ ] SQL Editor → run `supabase/auth-hardening.sql`
      (locks lead reads behind login; keeps public inserts + catalog reads;
       adds the secure track_orders() function so /track keeps working)
- [ ] Ask your developer (or me) to swap the /admin passcode gate for
      Supabase Auth login — the SQL is ready either way

## 7. Stripe payments (~10 min, no monthly fee)
- [ ] Sign up at **stripe.com** → activate your account (bank details for payouts)
- [ ] Developers → API keys → copy the SECRET key into `.env.local`:
      `STRIPE_SECRET_KEY=sk_test_...` (test first!) and `NEXT_PUBLIC_STRIPE_ENABLED=1`
- [ ] Test with card `4242 4242 4242 4242` (any future date/CVC) on a gang
      sheet order → "💳 Pay Now" button appears on the confirmation screen
- [ ] Create the promo: Products → Coupons → new coupon `HUSTLE10` (10% off)
      → Promotion Codes → code `HUSTLE10` (customers can type it at checkout)
- [ ] Go live: swap to `sk_live_...` key
- ✔ Result: instant payment for gang sheets & 3D shop designs, plus
  "💳 Payment link" buttons in the admin Quotes tab — set a deposit amount,
  the link copies to your clipboard, text it to the customer. Paid = money
  in your Stripe balance, receipt auto-emailed.

## Deploy (free)
- [ ] Push to GitHub → import at **vercel.com** (free tier)
- [ ] Add all `.env.local` values in Vercel → Project → Environment Variables
- [ ] Point your domain (Cloudflare free DNS recommended) → done 🚀

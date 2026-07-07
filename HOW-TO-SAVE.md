# 💾 How to Save & Own This Project

You have **3 layers of "saved"** — do all three and you can never lose anything.

---

## Layer 1 — Download the project (do this right now, 2 min)

A ready-made zip of the entire project is in this workspace:

**`hh4us-website.zip`** → click it in the file list → download it to your computer.

That zip contains every page, component, image, and config — the complete website.
Keep a copy on your computer + a cloud drive (Google Drive / Dropbox).

To run it on any computer with Node.js 18+ installed:

```bash
unzip hh4us-website.zip
cd hh4us-website
npm install
npm run dev        # → http://localhost:3000
```

---

## Layer 2 — Put it on GitHub (free, permanent, 10 min)

GitHub = version control + the doorway to free hosting. One-time setup:

1. Create a free account at **github.com**
2. Click **New repository** → name it `hh4us-website` → keep it **Private** → Create
3. On your computer, in the unzipped project folder:

```bash
git init
git add .
git commit -m "HH4US Designs website v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hh4us-website.git
git push -u origin main
```

From now on, after any change: `git add . && git commit -m "what changed" && git push`
Every version is saved forever — you can always roll back.

> ⚠️ Never commit `.env.local` (it holds your secret keys). The included
> `.gitignore` already blocks it.

---

## Layer 3 — Deploy live on Vercel (free, 5 min)

1. Go to **vercel.com** → sign up with your GitHub account
2. **Add New → Project** → import `hh4us-website` → click **Deploy**
3. Add your environment variables: Project → **Settings → Environment Variables**
   (copy each key from `.env.local.example` with your real values —
   Supabase URL/key, admin passcode, Clarity ID, Tawk IDs, etc.)
4. Point your domain: Vercel → Settings → Domains → add
   `hustlehard4usdesigns.com` (buy one at Namecheap/Cloudflare ~$10/yr —
   the only thing in this whole stack that costs money)

**The magic:** after this, every `git push` automatically redeploys the live
site in ~1 minute. Edit → push → live.

---

## What saves WHERE (important to understand)

| Thing | Where it lives | Saved by |
|---|---|---|
| Pages, components, styling | Code files | Zip + GitHub |
| Starter products & 3D designs | `data/*.js` files | Zip + GitHub |
| **Admin panel edits** (products, 3D designs) | **Supabase database** | Automatic, in your Supabase project |
| **Leads** (quotes, messages, gang sheets, 3D orders) | **Supabase database** | Automatic |
| Customer artwork uploads | Supabase Storage | Automatic |
| Secret keys | `.env.local` (never in git) | Copy it somewhere safe manually! |

⚠️ **Demo mode caveat:** until you connect Supabase, admin edits and leads
live in the **browser's localStorage** — they survive refreshes but are tied
to that one browser and can be lost if you clear browsing data. Connecting
Supabase (see GO-LIVE-CHECKLIST.md, ~10 min, free) makes everything permanent
and accessible from any device.

**Supabase backups:** free tier keeps daily backups automatically. For extra
peace of mind: Supabase Dashboard → Database → Backups, or occasionally
export tables to CSV (Table Editor → Export).

---

## Quick answer version

1. **Today:** download `hh4us-website.zip` → keep 2 copies
2. **This week:** push to GitHub (private repo) + deploy on Vercel
3. **Before real customers:** connect Supabase so admin edits & leads are in a real database
4. `.env.local` values → save them in a password manager

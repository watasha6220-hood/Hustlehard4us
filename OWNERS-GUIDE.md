# 📖 Owner's Guide — How to Update Your Website

*Simple steps for everyday changes. No coding skills needed for most of these!*

---

## 🚨 The Golden Rule

There are **two ways** to change your website:

1. **The Admin Panel** (easiest — use this whenever you can)
   - Go to: **hustlehard4usdesigns.com/admin**
   - Type your passcode
   - Changes show up on the website **instantly**

2. **Editing files on GitHub** (for things not in the admin panel)
   - Go to: **github.com/watasha6220-hood/Hustlehard4us**
   - After you save a change there, the website updates itself in about **1 minute**

This guide tells you which way to use for each job.

---

# 1. 📸 How to Change Photos

## A. Add a photo of a finished job (do this every week!)

**Use the Admin Panel.**

1. Take a photo of the finished order with your phone
2. Go to **hustlehard4usdesigns.com/admin** and log in
3. Click the **Portfolio** tab
4. Click **+ Add Job**
5. Fill in:
   - **Title** — like "50 Tees for XYZ Trucking"
   - **Category** — pick one (Apparel, Banners, etc.)
   - Click **📤 Upload Photo** and pick your photo
   - **Caption** — one short line, like "Gold print, done in 3 days"
6. Click **Save Job**

Done! It shows on the **Recent Work** page right away.

## B. Change a product photo

**Use the Admin Panel.**

1. Admin panel → **Products** tab
2. Find the product → click **Edit**
3. In the **Image** box, paste a link to a new picture
   - *Where do I get a link?* Upload the photo in the **Portfolio** tab first
     (steps above), then right-click that photo → **Copy image address** —
     that's your link. Paste it into the product's Image box.
4. Click **Save Product**

## C. Change a big page photo (like the home page)

**This one uses GitHub.** The big photos live in a folder there.

1. Go to **github.com/watasha6220-hood/Hustlehard4us**
2. Click the folders: **public** → **images**
3. Find the photo you want to replace. The main home page photo is called
   **hero.jpg**
4. To replace it: click **Add file** → **Upload files** (top right)
5. Upload your new photo — **it must have the exact same name** as the old
   one (like `hero.jpg`). Same name = it replaces the old one.
6. Scroll down, click **Commit changes**
7. Wait about 1 minute. Refresh your website — new photo!

**Photo tips:**
- Use wide photos for the home page (like a phone photo turned sideways)
- Use square photos for products
- If a photo looks too bright on the site, ask your web helper (or the AI)
  to "match the site colors" — the site looks best with darker, golden photos

---

# 2. 🛍️ How to Add a New Product

**Use the Admin Panel.** Takes about 2 minutes.

1. Go to **hustlehard4usdesigns.com/admin** → log in
2. Click the **Products** tab
3. Click **+ Add Product**
4. Fill in the boxes:
   - **Name** — like "Custom Trucker Hat"
   - **Category** — Apparel, Prints, or Displays
   - **Price** — just the number, like `19.99`
   - **Price note** — usually the word `from`
   - **Image** — link to the product photo (see photo section above)
   - **Badge** — optional, like "New" or "Best Seller"
   - **Featured** — check this box if you want it on the home page
   - **Description** — one or two sentences
   - **Options** — words separated by commas, like `Embroidery, One Size`
5. Click **Save Product**

It's on the Shop page right now. Go look!

**To hide a product** (out of season, out of stock): click **Hide** next to it.
Click **Show** to bring it back. **To change a price:** click **Edit**, change
the number, **Save**.

## Adding a new 3D print design works the same way

Admin panel → **3D Designs** tab → **+ Add 3D Design**. One extra choice here:
- **Per-gram** — the site figures out the price from the weight (good for
  simple prints)
- **Flat price** — one set price that includes your work time (good for
  photo lamps, keychain packs — anything you spend real time on)

---

# 3. 💲 How to Change Pricing

## Product prices → Admin Panel
Products tab → **Edit** → change the price number → **Save**. Same for
3D Designs tab.

## Service prices (t-shirt base price, bulk discounts, gang sheet rate)
**These use GitHub.** They live in two files:

**T-shirt / service prices and bulk discounts:**
1. GitHub → open folders **components** → click file **QuoteWizard.jsx**
2. Click the little **pencil icon** (✏️ top right) to edit
3. Near the top you'll see lines like:
   ```
   "custom-t-shirts": { label: "Custom T-Shirts", base: 14.99, ...
   ```
   Change the number after `base:` to your new price.
4. A little lower, the bulk discounts:
   ```
   { min: 100, discount: 0.3, ...   ← 0.3 means 30% off
   ```
5. Click **Commit changes** (green button). Website updates in ~1 minute.

**Gang sheet price per foot:**
1. GitHub → **components** → **GangSheetBuilder.jsx** → pencil icon
2. Near the top find:
   ```
   pricePerFoot: 7.99,
   ```
   Change the number. **Commit changes.**

**3D printing per-gram rates:**
1. GitHub → **data** → **printing3d.js** → pencil icon
2. Find `perGram: 0.12` (and the others) → change → **Commit changes**

⚠️ **Careful rule for GitHub edits:** only change the **numbers**. Don't
delete commas, quotes, or brackets — the site needs those to work. If the
website looks broken after an edit, don't panic: in GitHub click **History**
on that file → open your change → click the **⋯ menu → Revert**. The site
goes back to how it was.

---

# 4. 🏷️ How to Turn the 10% Sale Banner On or Off

The gold bar at the top of every page. **This uses GitHub** — it's one line.

1. Go to GitHub → open folders **data** → click the file **site.js**
2. Click the **pencil icon** (✏️) to edit
3. Find this part (near the top):
   ```
   promo: {
     text: "Grand Opening Special — 10% off your first order with code HUSTLE10",
     href: "/quote",
   },
   ```

**To REMOVE the banner:** delete the words between the quotes so it says:
   ```
   text: "",
   ```
   (Keep the quotes! Empty quotes = no banner.)

**To CHANGE the sale:** type new words between the quotes:
   ```
   text: "Holiday Special — 15% off hoodies through Friday!",
   ```

**To BRING IT BACK later:** just type words between the quotes again.

4. Click **Commit changes** (green button)
5. Wait ~1 minute, refresh the site

---

# 5. 🕐 Other Easy Changes (all in GitHub → data folder)

| What you want to change | File to edit |
|---|---|
| Store hours, phone, address, social links | **data/site.js** |
| Customer reviews on home page | **data/testimonials.js** |
| FAQ questions and answers | **data/faqs.js** |
| Sale banner | **data/site.js** (see above) |
| Blog articles | **data/posts.js** |

Same steps every time: open the file → pencil icon → change the **words
between quotes** → **Commit changes** → wait 1 minute.

---

# 6. 🆘 If Something Breaks

1. **Don't panic.** Your website is saved at every step.
2. Go to GitHub → click **History** (or the clock icon) on the file you edited
3. Find the version from before your change → **⋯ menu → Revert**
4. The site fixes itself in about a minute.

Still stuck? The full technical guides are in the same GitHub folder:
- **README.md** — how everything works
- **GO-LIVE-CHECKLIST.md** — all the accounts and settings
- **HOW-TO-SAVE.md** — backups

---

# ✅ Your Weekly 10-Minute Habit

The website runs itself, but this little routine keeps customers coming:

- [ ] 📸 Add 1–2 finished jobs to the **Portfolio** (admin panel)
- [ ] 📸 Post the same photos to your **Google Business Profile**
- [ ] ⭐ Text the review link to this week's happy customers
- [ ] 📬 Check the admin panel **Quotes** tab — update statuses so
      order tracking stays accurate
- [ ] 💬 Reply to any chats you missed in the Tawk app

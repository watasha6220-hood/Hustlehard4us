// ============================================================
//  BLOG POSTS — add a post by copying an object below.
//  `body` is an array of blocks: h2 | p | ul | tip | cta
//  Each post targets a real Google search your customers make.
// ============================================================

export const posts = [
  {
    slug: "dtg-vs-screen-print-vs-dtf",
    title: "DTG vs Screen Print vs DTF: Which Is Right for Your Brand?",
    description:
      "The honest breakdown every clothing brand needs: cost, feel, durability, and color limits of DTG, screen printing, DTF transfers, and vinyl — with real numbers.",
    date: "2026-06-24",
    readMinutes: 6,
    category: "Apparel 101",
    image: "/images/products/tees-stack.jpg",
    body: [
      { t: "p", c: "If you're launching a clothing brand or ordering shirts for your business, the print method matters as much as the design. Pick wrong and you'll overpay, get colors that crack, or wait on setup fees you didn't need. Here's the no-BS breakdown we give customers at the counter." },
      { t: "h2", c: "DTG (Direct-to-Garment): The Detail King" },
      { t: "p", c: "DTG printers spray ink directly into the fabric like a photo printer for shirts. Unlimited colors, photo-quality detail, zero setup fees. The print feels soft because the ink becomes part of the fabric." },
      { t: "ul", c: ["Best for: photo prints, detailed art, gradients, small runs (1–24 shirts)", "Cost at our shop: from $14.99–$18.99 per shirt", "Watch out: works best on 100% cotton; slightly muted on dark polyester"] },
      { t: "h2", c: "Screen Printing: The Bulk Champion" },
      { t: "p", c: "Ink is pushed through a stencil (screen) one color at a time. There's setup work per color, which is why it shines at volume — the more shirts, the cheaper each one gets. The ink sits bold and thick on top of the fabric and survives hundreds of washes." },
      { t: "ul", c: ["Best for: 24+ shirts with 1–4 colors — team merch, events, uniforms", "Cost: our bulk tiers hit 30% off at 100+ pieces", "Watch out: not cost-effective for tiny runs or photo-style art"] },
      { t: "h2", c: "DTF Transfers: The Flexible Workhorse" },
      { t: "p", c: "Designs are printed on film, coated with adhesive powder, and heat-pressed onto almost ANY fabric — cotton, polyester, blends, nylon, even hats and bags. Colors pop, the print stretches without cracking, and you can gang multiple designs on one sheet to save money." },
      { t: "ul", c: ["Best for: mixed fabric types, small-to-medium runs, pressing yourself", "Cost: gang sheets from $7.99 per linear foot at our shop", "Watch out: low-resolution art prints blurry — use 300 DPI files"] },
      { t: "h2", c: "Vinyl (HTV): The Crisp Classic" },
      { t: "p", c: "Cut letters and shapes pressed onto the garment. Perfect for names, numbers, and one-color designs that need razor-sharp edges. Not for photos or gradients." },
      { t: "h2", c: "The 10-Second Decision Guide" },
      { t: "ul", c: ["1–24 shirts, colorful art → DTG", "24+ shirts, bold simple design → Screen print", "Mixed garments or press-it-yourself → DTF", "Names & numbers → Vinyl", "Still unsure → pick 'recommend for me' in our quote builder and we'll match the method to your art and budget"] },
      { t: "cta", c: "Get an instant estimate for any method", href: "/quote" },
    ],
  },
  {
    slug: "prepare-files-for-dtf-printing",
    title: "How to Prep Your Files for DTF Printing (So They Don't Print Blurry)",
    description:
      "300 DPI, transparent backgrounds, and the gang sheet math that saves you money — a print shop's checklist for perfect DTF transfers every time.",
    date: "2026-06-17",
    readMinutes: 5,
    category: "File Prep",
    image: "/images/products/gang-sheet.jpg",
    body: [
      { t: "p", c: "Nothing hurts more than a fire design that prints fuzzy. 90% of DTF problems trace back to the file, not the printer. Run through this checklist before you upload and your transfers will come out crisp every single time." },
      { t: "h2", c: "1. Resolution: 300 DPI at Print Size" },
      { t: "p", c: "DPI (dots per inch) only matters relative to the printed size. A 1000px-wide logo looks great at 3 inches wide (333 DPI) but turns to mush at 10 inches (100 DPI). Rule of thumb: pixels ÷ 300 = maximum clean print width in inches." },
      { t: "tip", c: "Our gang sheet builder warns you automatically if a design is sized too big for its resolution — watch for the yellow alert." },
      { t: "h2", c: "2. Transparent Background (PNG)" },
      { t: "p", c: "JPGs have white boxes baked in — that box WILL print. Export as PNG with a transparent background. In Photoshop: delete the background layer, then File → Export → PNG. In Canva: Download → PNG → check 'transparent background' (Pro feature)." },
      { t: "h2", c: "3. Mind the Thin Lines" },
      { t: "p", c: "Lines thinner than 1.5pt and tiny text below ~8pt can flake off garments after washing. Thicken hairline details or size the design up." },
      { t: "h2", c: "4. Gang Sheet Math That Saves Money" },
      { t: "p", c: "DTF is billed by the linear foot on a 22\"-wide sheet — so packing designs tightly is literally free money. Mix sizes: fill gaps around big back prints with pocket logos, sleeve hits, and hat patches. Our builder's Auto-Arrange button does the packing for you." },
      { t: "ul", c: ["One 22×12\" foot fits roughly: 1 back print + 2 pocket logos, OR 12 pocket-size logos, OR 20+ hat patches", "Order the same logo in multiple sizes — you'll always find a use", "Rotate tall designs 90° to fill horizontal gaps"] },
      { t: "h2", c: "5. Color Notes" },
      { t: "p", c: "DTF prints white ink behind your colors automatically, so bright colors pop on any garment color. Pure black designs on black shirts, though — tell us, so we adjust, or you'll get a subtle 'black-on-black' ghost look (which some brands actually want!)." },
      { t: "cta", c: "Build your gang sheet with live pricing", href: "/gang-sheet" },
    ],
  },
  {
    slug: "custom-shirt-cost-guide",
    title: "How Much Do Custom Shirts Really Cost? (2026 Price Guide)",
    description:
      "Real numbers for custom t-shirt pricing: per-shirt costs by quantity, what drives price up or down, and how bulk discounts actually work.",
    date: "2026-06-10",
    readMinutes: 4,
    category: "Pricing",
    image: "/images/products/tee-black.jpg",
    body: [
      { t: "p", c: "Searching 'custom shirt price' gets you everything from $5 to $50 — useless. Here's how pricing actually works, with our real numbers, so you can budget before you even talk to a shop." },
      { t: "h2", c: "The Baseline" },
      { t: "p", c: "A quality custom tee starts around $14.99 at our shop — that's the blank shirt, printing, and labor. Photo-quality full-color DTG runs $18.99. Hoodies start at $34.99. Anyone quoting $6 shirts is using paper-thin blanks or hiding fees." },
      { t: "h2", c: "Quantity Changes Everything" },
      { t: "ul", c: ["1–11 shirts: standard rate (setup spread across few units)", "12–23 shirts: 8% off — $13.79 each", "24–49 shirts: 15% off — $12.74 each", "50–99 shirts: 22% off — $11.69 each", "100+ shirts: 30% off — $10.49 each"] },
      { t: "p", c: "That means a 100-shirt order costs barely more than a 60-shirt order at some shops. If you're close to a discount tier, jumping up almost always makes sense — extra shirts become giveaways that market your brand." },
      { t: "h2", c: "What Adds Cost (and What Doesn't)" },
      { t: "ul", c: ["Adds cost: printing both sides, 4XL+ sizes, rush turnaround, premium blank upgrades", "Doesn't add cost with us: number of colors on DTG/DTF, design consultation, mixing sizes in one order"] },
      { t: "h2", c: "The Design Factor" },
      { t: "p", c: "No print-ready file? Design service adds a one-time $45 (includes 2 revisions, and you own the files forever). Split across a 50-shirt order, that's 90¢ a shirt for professional artwork." },
      { t: "tip", c: "Family reunions, teams, memorials: one design + bulk tier + mixed sizes is the cheapest possible path. Get everyone's size BEFORE ordering — reorders of 5 shirts cost more per shirt than the original 50." },
      { t: "cta", c: "Price your exact order in 2 minutes", href: "/quote" },
    ],
  },
  {
    slug: "event-banner-size-guide",
    title: "What Size Banner Do You Actually Need? A No-Guess Guide",
    description:
      "Banner size cheat sheet for grand openings, birthdays, trade shows, and storefronts — plus the readability rule most people get wrong.",
    date: "2026-06-03",
    readMinutes: 4,
    category: "Banners & Events",
    image: "/images/products/banner.jpg",
    body: [
      { t: "p", c: "Order a banner too small and nobody reads it; too big and you paid for vinyl you didn't need. Use this cheat sheet — it's the same guidance we give at the counter." },
      { t: "h2", c: "The 10-Foot Rule" },
      { t: "p", c: "Letters need 1 inch of height for every 10 feet of viewing distance. Roadside banner read from 100 feet? You need 10-inch letters minimum — which means at least a 3-foot-tall banner once you add spacing and a logo." },
      { t: "h2", c: "Size Cheat Sheet" },
      { t: "ul", c: ["Birthday / backdrop table: 2×4 ft or 3×5 ft", "Storefront 'grand opening': 3×8 ft or 4×10 ft", "Fence line / roadside: 4×8 ft minimum, 10-inch+ letters", "Trade show booth backdrop: 8×8 ft wall or retractable 33×80\" stands", "Car parade / hand-carried: 2×6 ft with wind slits"] },
      { t: "h2", c: "Outdoor? Three Things That Matter" },
      { t: "ul", c: ["13oz vinyl minimum — lighter material rips in Antelope Valley wind", "Hems + grommets standard (every banner we make includes them)", "Wind slits for fence installs — they save your banner's life"] },
      { t: "h2", c: "Design Tips That Cost Nothing" },
      { t: "ul", c: ["High contrast wins: dark text on light background or vice versa", "One message. Name, offer, phone — not your life story", "Put your phone number BIG — banners generate calls, not clicks"] },
      { t: "cta", c: "Get a banner quote — any size", href: "/quote" },
    ],
  },
];

export const getPost = (slug) => posts.find((p) => p.slug === slug);

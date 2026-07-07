// ============================================================
//  CITY LANDING PAGES — local SEO for nearby service areas.
//  Each entry generates /areas/<slug> with unique copy (never
//  duplicated boilerplate — Google penalizes thin doorway pages).
//  ADD A CITY: copy an object, write 2–3 sentences that are
//  genuinely specific to that city, done.
// ============================================================

export const cities = [
  {
    slug: "palmdale",
    name: "Palmdale",
    county: "Los Angeles County",
    distance: "Our home base",
    headline: "Palmdale's Custom Print Shop",
    intro:
      "We're located right here on Ave S — Palmdale isn't a 'service area' for us, it's home. Swing by the shop to feel blanks in person, approve your proof face-to-face, and pick up your order the moment it's done with zero shipping wait.",
    popular: ["Same-day pickup on rush jobs", "School & youth sports uniforms", "Aerospace & industrial workwear", "Quinceañera & family event shirts"],
    localNote:
      "From Highland High spirit wear to vendor booths at the Antelope Valley Fair, we've printed for events and businesses all over town. Free local pickup, always.",
  },
  {
    slug: "lancaster",
    name: "Lancaster",
    county: "Los Angeles County",
    distance: "15 minutes from our shop",
    headline: "Custom Printing for Lancaster, CA",
    intro:
      "Lancaster customers make up a huge part of our family — you're a straight shot up Sierra Highway from our Palmdale shop. Order online, and your shirts, banners, or transfers are ready for pickup the same week, no LA drive required.",
    popular: ["BLVD event & festival merch", "Church group & ministry shirts", "Small business storefront banners", "Clothing brand merch drops"],
    localNote:
      "We regularly print for businesses along The BLVD and vendors at Lancaster's street fairs. Ask about delivery on bulk orders — we're up there weekly.",
  },
  {
    slug: "quartz-hill",
    name: "Quartz Hill",
    county: "Los Angeles County",
    distance: "20 minutes from our shop",
    headline: "Quartz Hill Custom Shirts & Banners",
    intro:
      "No print shop in Quartz Hill? No problem — we're one town over. Quartz Hill families and small businesses use us for everything from Little League uniforms to Almond Blossom Festival booth setups.",
    popular: ["Youth league team uniforms", "Almond Blossom Festival banners", "Family reunion & memorial tees", "Home business branding"],
    localNote:
      "Small-town orders get big-shop treatment: no minimums, honest pricing, and free pickup in Palmdale — or meet-up delivery for larger jobs.",
  },
  {
    slug: "santa-clarita",
    name: "Santa Clarita",
    county: "Los Angeles County",
    distance: "35 minutes via the 14",
    headline: "Custom Printing Serving Santa Clarita",
    intro:
      "Skip the LA pricing — Santa Clarita businesses ride the 14 to us for print quality at Antelope Valley rates. We handle corporate polos, trade show displays, and bulk tees for SCV companies, gyms, and youth organizations.",
    popular: ["Corporate embroidered polos", "Trade show booth packages", "Gym & fitness studio merch", "Bulk event t-shirts"],
    localNote:
      "Most SCV orders ship or are ready for pickup in 3–5 business days. Bulk orders over 100 pieces? We'll talk delivery to your office.",
  },
  {
    slug: "rosamond",
    name: "Rosamond",
    county: "Kern County",
    distance: "25 minutes from our shop",
    headline: "Rosamond's Closest Custom Print Shop",
    intro:
      "Rosamond and the Kern County side of the valley are firmly in our delivery zone. Whether it's workwear for aerospace contractors near Edwards AFB or banners for local events, you don't need to drive to Bakersfield or LA.",
    popular: ["Aerospace contractor workwear", "Military family & unit shirts", "Local event & fundraiser banners", "DTF transfers shipped to your door"],
    localNote:
      "We're proud to serve Edwards AFB families — ask about our military discount on bulk unit and squadron orders.",
  },
  {
    slug: "littlerock",
    name: "Littlerock",
    county: "Los Angeles County",
    distance: "10 minutes east on Pearblossom Hwy",
    headline: "Custom Shirts & Signs for Littlerock",
    intro:
      "We're practically neighbors — ten minutes down Pearblossom Highway. Littlerock's farm stands, markets, and family businesses use us for signage that survives the desert sun and shirts that survive the workday.",
    popular: ["Farm stand & market signage", "UV-resistant outdoor banners", "Work crew shirts & hi-vis printing", "Community event tees"],
    localNote:
      "Our 13oz vinyl banners are built for high-desert wind and sun — reinforced hems and grommets standard, because we know exactly what Pearblossom Highway weather does to cheap banners.",
  },
];

export const getCity = (slug) => cities.find((c) => c.slug === slug);

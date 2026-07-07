// ============================================================
//  3D PRINTING — designs, materials & pricing
//
//  ADD A DESIGN: drop a photo in /public/images/3d/, copy an
//  object in `designs3d`, edit fields. It appears in the
//  showcase + configurator automatically.
//
//  PRICING (researched vs. online bureaus, 2026):
//  • Service bureaus: $0.10–$0.30/g + $3–10 setup (find3dprinting.com)
//  • Budget online services: $0.05–$0.15/g + setup (3dprinting.com)
//  → We price at the LOW end of bureau range with local pickup
//    as the differentiator. Edit rates below any time.
// ============================================================

export const MATERIALS_3D = [
  {
    id: "pla",
    name: "PLA",
    perGram: 0.12,
    tagline: "Everyday standard",
    blurb: "Crisp detail, huge color range. Perfect for decor, figurines, prototypes, and gifts.",
    colors: ["Black", "White", "Gold", "Silver", "Red", "Teal", "Rainbow Silk"],
  },
  {
    id: "petg",
    name: "PETG",
    perGram: 0.15,
    tagline: "Tough & outdoor-safe",
    blurb: "Stronger and more heat/UV resistant. Best for functional parts, brackets, and outdoor items.",
    colors: ["Black", "White", "Clear", "Blue", "Orange"],
  },
  {
    id: "tpu",
    name: "TPU (Flexible)",
    perGram: 0.25,
    tagline: "Bendy & rugged",
    blurb: "Rubber-like flex for phone cases, gaskets, bumpers, and anything that needs to survive drops.",
    colors: ["Black", "White", "Red"],
  },
  {
    id: "resin",
    name: "Resin (High Detail)",
    perGram: 0.35,
    tagline: "Miniature-grade detail",
    blurb: "Ultra-fine layers for miniatures, jewelry masters, and pieces where every detail matters.",
    colors: ["Gray", "Black", "Clear", "White"],
  },
];

export const PRICING_3D = {
  setupFee: 5,          // waived for ready-made shop designs
  minOrder: 10,         // minimum charge per order
  rushMultiplier: 1.5,  // 48hr rush
  bulkTiers: [
    { min: 20, discount: 0.2, label: "20+ pieces — 20% off" },
    { min: 5, discount: 0.1, label: "5–19 pieces — 10% off" },
    { min: 1, discount: 0, label: "1–4 pieces — standard" },
  ],
};

// Ready-made designs — printed on demand in your color choice.
// PRICING, two modes per design:
//  • weightGrams only        → price = grams × material rate (material cost jobs)
//  • flatPrice set           → FIXED price that includes labor
//    (use for anything with real hands-on work: photo processing,
//     multi-color swaps, assembly, custom text). flatPrice wins
//    when present. flatNote explains what's included.
export const designs3d = [
  {
    id: "crowned-dragon",
    name: "Crowned Dragon Figurine",
    image: "/images/3d/dragon.jpg",
    weightGrams: 120,
    sizeNote: '~7" tall',
    badge: "Show Piece",
    blurb: "Our flagship display print — a detailed dragon that shows exactly what our machines can do.",
  },
  {
    id: "flexi-dragon",
    name: "Articulated Flexi Dragon",
    image: "/images/3d/flexi-dragon.jpg",
    weightGrams: 55,
    sizeNote: '~12" long',
    badge: "Best Seller",
    blurb: "Prints fully assembled and moves right off the bed. Kids and desk-fidgeters can't put it down.",
  },
  {
    id: "geo-planters",
    name: "Geometric Planter Set (3)",
    image: "/images/3d/planters.jpg",
    weightGrams: 210,
    sizeNote: "3 sizes",
    badge: null,
    blurb: "Low-poly planters with drainage. A modern touch for desks, shelves, and shop counters.",
  },
  {
    id: "hex-phone-stand",
    name: "Hex Phone Stand",
    image: "/images/3d/phone-stand.jpg",
    weightGrams: 45,
    sizeNote: "Fits all phones",
    badge: null,
    blurb: "Adjustable angle, cable pass-through, honeycomb style. Add your logo for client gifts.",
  },
  {
    id: "lithophane-lamp",
    name: "Photo Lithophane Lamp",
    image: "/images/3d/lithophane.jpg",
    weightGrams: 150,
    sizeNote: "Your photo, LED base",
    badge: "Perfect Gift",
    blurb: "Send us a photo — it appears like magic when the lamp lights up. Weddings, memorials, birthdays.",
    flatPrice: 39.99,
    flatNote: "Includes photo prep, print & LED base — comparable lamps run $38–$55 online",
  },
  {
    id: "logo-keychains",
    name: "Custom Logo Keychains (10-pack)",
    image: "/images/3d/keychains.jpg",
    weightGrams: 80,
    sizeNote: "10 pieces",
    badge: "Brand Builder",
    blurb: "Your logo as a giveaway people actually keep. Great for launches, events, and counter displays.",
    flatPrice: 34.99,
    flatNote: "Includes logo setup & modeling — $3.50/keychain vs $5–10 each elsewhere",
  },
  {
    id: "desk-nameplate",
    name: "Executive Desk Nameplate",
    image: "/images/3d/nameplate.jpg",
    weightGrams: 95,
    sizeNote: "Custom text",
    badge: null,
    blurb: "Raised lettering, two-color print, honeycomb accent. CEO energy for any desk.",
    flatPrice: 29.99,
    flatNote: "Includes custom text layout & two-color print",
  },
];

export const getDesign3d = (id) => designs3d.find((d) => d.id === id);

// Price helper — single source of truth used by showcase + configurator.
// Flat-priced designs: material choice doesn't change price (PLA assumed);
// premium materials still add the difference in material cost.
export function designBasePrice(design, material) {
  if (!design) return 0;
  if (design.flatPrice) {
    const plaRate = MATERIALS_3D.find((m) => m.id === "pla").perGram;
    const upcharge = material && material.id !== "pla"
      ? design.weightGrams * Math.max(0, material.perGram - plaRate)
      : 0;
    return design.flatPrice + upcharge;
  }
  const rate = (material || MATERIALS_3D.find((m) => m.id === "pla")).perGram;
  return design.weightGrams * rate;
}

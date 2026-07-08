// ============================================================
//  PRODUCTS — HOW TO ADD A PRODUCT (takes ~60 seconds):
//
//  1. Drop your product photo in  /public/images/products/
//     (square images ~1000x1000 look best)
//  2. Copy any object below, paste it into the array,
//     and update the fields. That's it — it will appear
//     automatically in the Shop grid, category filters,
//     Featured section (if featured: true), and Quick View.
//
//  category must be one of: "Apparel" | "Prints" | "Displays"
// ============================================================

export const categories = ["All", "Apparel", "Prints", "Displays"];

export const products = [
  {
    id: "classic-custom-tee",
    name: "Classic Custom Tee",
    category: "Apparel",
    price: 14.99,
    priceNote: "from",
    image: "/images/products/tee-black.jpg",
    badge: "Best Seller",
    featured: true,
    description:
      "Soft-hand premium cotton tee with your design printed via DTG, screen print, or vinyl. Sizes S–5XL in 20+ colors.",
    options: ["DTG", "Screen Print", "Vinyl", "S–5XL"],
  },
  {
    id: "full-color-dtg-tee",
    name: "Full-Color DTG Tee",
    category: "Apparel",
    price: 18.99,
    priceNote: "from",
    image: "/images/products/tee-white.jpg",
    badge: "Photo-Ready",
    featured: true,
    description:
      "Unlimited colors, photo-quality prints. Perfect for detailed artwork, gradients, and full-color brand graphics.",
    options: ["Unlimited Colors", "No Setup Fees", "S–5XL"],
  },
  {
    id: "heavyweight-hoodie",
    name: "Heavyweight Custom Hoodie",
    category: "Apparel",
    price: 34.99,
    priceNote: "from",
    image: "/images/products/hoodie.jpg",
    badge: null,
    featured: false,
    description:
      "Premium fleece hoodie printed or embroidered with your brand. A streetwear staple for clothing lines and teams.",
    options: ["Print or Embroidery", "S–4XL", "10+ Colors"],
  },
  {
    id: "embroidered-snapback",
    name: "3D Puff Embroidered Hat",
    category: "Apparel",
    price: 24.99,
    priceNote: "from",
    image: "/images/products/embroidery-hat.jpg",
    badge: "Premium",
    featured: true,
    description:
      "Snapbacks, dad hats, and truckers with flat or 3D puff embroidery. Up to 15,000 stitches included.",
    options: ["3D Puff", "Flat Stitch", "Multiple Styles"],
  },
  {
    id: "embroidered-polo",
    name: "Embroidered Business Polo",
    category: "Apparel",
    price: 26.99,
    priceNote: "from",
    image: "/images/products/polo.jpg",
    badge: null,
    featured: false,
    description:
      "Clean, professional polos with your logo embroidered on the chest. Ideal for staff uniforms and corporate wear.",
    options: ["Left-Chest Logo", "Moisture-Wicking", "S–4XL"],
  },
  {
    id: "team-tee-pack",
    name: "Team Tee Pack (12+)",
    category: "Apparel",
    price: 9.99,
    priceNote: "from / shirt",
    image: "/images/products/tees-stack.jpg",
    badge: "Bulk Deal",
    featured: false,
    description:
      "Bulk pricing for teams, events, and merch drops. One design, 12+ shirts, serious savings — mix sizes freely.",
    options: ["12+ Units", "Mix Sizes", "Volume Discounts"],
  },
  {
    id: "vinyl-banner",
    name: "Vinyl Banner (13oz)",
    category: "Prints",
    price: 4.5,
    priceNote: "from / sq ft",
    image: "/images/products/banner.jpg",
    badge: "Best Seller",
    featured: true,
    description:
      "Heavy-duty 13oz vinyl banners with hems and grommets. Indoor/outdoor, any size — grand openings to game day.",
    options: ["Any Size", "Grommets Included", "Full Color"],
  },
  {
    id: "dtf-gang-sheet",
    name: "DTF Gang Sheet",
    category: "Prints",
    price: 7.99,
    priceNote: "from / linear ft",
    image: "/images/products/gang-sheet.jpg",
    badge: "Printer's Choice",
    featured: true,
    description:
      "Fill a 22\" wide sheet with as many designs as you can fit. Vibrant, stretchable DTF transfers ready to press.",
    options: ['22" Wide', "Ready to Press", "48hr Turnaround"],
  },
  {
    id: "event-booth-package",
    name: "Event Booth Package",
    category: "Displays",
    price: 499,
    priceNote: "from",
    image: "/images/products/booth.jpg",
    badge: "Turn-Key",
    featured: false,
    description:
      "Backdrop wall, retractable banner, and branded table cover — a complete turn-key setup for vendors and pop-ups.",
    options: ["Backdrop", "Retractable Banner", "Table Cover"],
  },

  // 👇 ADD NEW PRODUCTS HERE — copy an object above and edit it.
];

export const featuredProducts = products.filter((p) => p.featured);

// ============================================================
//  SERVICES — add/edit services here. Each service renders a
//  full section on /services and a preview card on the Home page.
//  To add gallery images: drop files in /public/images/products
//  (or anywhere in /public) and list the paths in `gallery`.
// ============================================================

export const services = [
  {
    id: "custom-t-shirts",
    name: "Custom T-Shirts",
    icon: "shirt",
    tagline: "DTG • Screen Print • Vinyl",
    description:
      "From one-off statement pieces to full merch lines, we print tees that people actually want to wear. Choose DTG for photo-quality full color, screen printing for bold high-volume runs, or vinyl for names, numbers, and crisp one-color hits.",
    useCases: ["Clothing brands & merch drops", "Family reunions & memorials", "Sports teams & schools", "Business uniforms & staff wear"],
    gallery: ["/images/products/tee-black.jpg", "/images/products/tee-white.jpg", "/images/products/tees-stack.jpg", "/images/products/hoodie.jpg"],
    cta: "Start Your Shirt Order",
  },
  {
    id: "banners-signs",
    name: "Banners & Signs",
    icon: "flag",
    tagline: "Any size, indoor & outdoor",
    description:
      "Heavy-duty 13oz vinyl banners with reinforced hems and grommets, yard signs, and window graphics that make your business impossible to miss. Full-color, weather-resistant printing built for California sun.",
    useCases: ["Grand openings & sales events", "Trade shows & vendor booths", "Birthday & celebration banners", "Storefront & job-site signage"],
    gallery: ["/images/products/banner.jpg", "/images/products/booth.jpg"],
    cta: "Get a Banner Quote",
  },
  {
    id: "gang-sheets",
    name: "DTF Gang Sheets",
    icon: "layers",
    tagline: "Press-ready transfers by the foot",
    description:
      "Maximize every inch — pack multiple designs onto one 22\"-wide DTF gang sheet and press them yourself whenever you need. Vibrant color, strong stretch, and wash durability that rivals screen printing. Perfect for printers, boutiques, and side hustles.",
    useCases: ["Print shops & pressing businesses", "Boutiques & online stores", "Mixed-size logo sheets", "On-demand merch fulfillment"],
    gallery: ["/images/products/gang-sheet.jpg", "/images/products/tees-stack.jpg"],
    cta: "Build a Gang Sheet",
    ctaHref: "/gang-sheet",
  },
  {
    id: "custom-displays",
    name: "Custom Displays",
    icon: "booth",
    tagline: "Event booths & branded setups",
    description:
      "Show up like a pro. Backdrop walls, retractable banner stands, branded table covers, and complete vendor booth packages designed to stop foot traffic and make your brand look established from day one.",
    useCases: ["Trade shows & conventions", "Pop-up shops & vendor markets", "Photo backdrops for events", "Church, school & community events"],
    gallery: ["/images/products/booth.jpg", "/images/products/banner.jpg"],
    cta: "Design My Booth",
  },
  {
    id: "embroidery",
    name: "Embroidery",
    icon: "needle",
    tagline: "Flat & 3D puff stitching",
    description:
      "Nothing says premium like thread. We digitize your logo and stitch it onto hats, polos, hoodies, jackets, and bags with commercial multi-head machines — flat stitch for clean detail or 3D puff for that bold raised look.",
    useCases: ["Company polos & uniforms", "Snapbacks, dad hats & beanies", "Varsity & team jackets", "Premium brand merchandise"],
    gallery: ["/images/products/embroidery-hat.jpg", "/images/products/polo.jpg"],
    cta: "Get Embroidery Pricing",
  },
  {
    id: "3d-printing",
    name: "3D Printing",
    icon: "layers",
    tagline: "From $0.12/gram • PLA, PETG, TPU, resin",
    description:
      "Our newest service: professional 3D printing priced by the gram. Choose from our showcase of ready-made designs — figurines, planters, lithophane lamps, custom keychains — or upload your own STL/3MF file and we'll print it locally. Functional parts, branded merch, one-of-a-kind gifts, all with free Palmdale pickup.",
    useCases: ["Custom branded merch & giveaways", "Replacement & functional parts", "Photo lithophane gifts", "Prototypes for inventors & makers"],
    gallery: ["/images/3d/dragon.jpg", "/images/3d/lithophane.jpg", "/images/3d/planters.jpg", "/images/3d/keychains.jpg"],
    cta: "Start a 3D Print",
    ctaHref: "/3d-printing",
  },
  {
    id: "design-services",
    name: "Design Services",
    icon: "pen",
    tagline: "Logos & print-ready artwork",
    description:
      "Got a vision but no files? Our in-house designers create logos, tweak your artwork, and prep everything print-ready. Bring a napkin sketch, a screenshot, or just an idea — we'll turn it into artwork you own.",
    useCases: ["Logo design for new businesses", "Artwork cleanup & vectorizing", "Merch collection design", "Event flyers & promo graphics"],
    gallery: ["/images/products/tee-black.jpg", "/images/products/embroidery-hat.jpg"],
    cta: "Book a Design Session",
  },
];

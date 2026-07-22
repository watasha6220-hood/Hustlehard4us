// ============================================================
//  SITE CONFIG — edit this file to update business info
//  everywhere on the site (navbar, footer, contact, SEO, etc.)
// ============================================================

export const site = {
  name: "Hustlehard4USDesigns",
  shortName: "HH4US Designs",
  tagline: "Bring Your Ideas to Life",
  description:
    "Custom printing for brands, events, and hustlers. T-shirts, banners, DTF gang sheets, embroidery, custom displays, and design services in Palmdale, CA.",
  url: "https://www.hustlehard4usdesigns.com",

  address: {
    street: "4654 Ave S, Suite #187",
    city: "Palmdale",
    state: "California",
    stateShort: "CA",
    zip: "93552",
    full: "4654 Ave S, Suite #187, Palmdale, CA 93552",
  },

  phone: "(661) 480-5275",
  phoneHref: "tel:+16614805275",
  smsHref: "sms:+16614805275",
  // WhatsApp deep link — number in international format, no symbols
  whatsappHref:
    "https://wa.me/16614805275?text=Hi%20HH4US%20Designs!%20I%27d%20like%20a%20quote%20for%20a%20custom%20printing%20project.",
  email: "orders@hustlehard4usdesigns.com", // update to your real inbox

  hours: [
    { days: "Mon – Fri", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "10:00 AM – 3:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],

  social: {
    instagram: "https://instagram.com/hustlehard4usdesigns",
    facebook: "https://facebook.com/hustlehard4usdesigns",
    tiktok: "https://tiktok.com/@hustlehard4usdesigns",
  },

  // Google Maps embed for the Contact page
  mapEmbedSrc:
    "https://www.google.com/maps?q=4654+Ave+S+Suite+187+Palmdale+CA+93552&output=embed",

  // Promo bar — set text: "" to hide. Shown at the very top of every page.
  promo: {
    text: "Grand Opening Special — 10% off your first order with code HUSTLE10",
    href: "/quote",
  },

  trustBadges: [
    { icon: "bolt", title: "Fast Turnaround", text: "Rush orders available — most jobs ship in 3–5 business days." },
    { icon: "star", title: "Premium Quality", text: "Commercial-grade inks, threads, and materials on every job." },
    { icon: "pencil", title: "100% Custom Work", text: "Your art, your brand, your way. Free design consultation." },
    { icon: "shield", title: "No Minimums*", text: "No job too small or too large — from 1 shirt to 10,000." },
  ],
};

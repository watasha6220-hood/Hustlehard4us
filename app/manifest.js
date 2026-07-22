// PWA manifest — lets repeat customers "Add to Home Screen"
// and open the site like an app.

export default function manifest() {
  return {
    name: "Hustlehard4USDesigns",
    short_name: "HH4US",
    description: "Custom printing for brands, events, and hustlers — Palmdale, CA.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#f5b52e",
    icons: [
      { src: "/images/logo.png", sizes: "512x512", type: "image/png" },
      { src: "/images/logo.png", sizes: "192x192", type: "image/png" },
    ],
  };
}

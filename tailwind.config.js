/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== BRAND COLORS — change these to instantly re-skin the site =====
        ink: {
          950: "#09090b",
          900: "#101014",
          800: "#18181d",
          700: "#232329",
        },
        gold: {
          300: "#ffd76a",
          400: "#f5b52e",
          500: "#e09c12",
          600: "#b87d0a",
        },
      },
      fontFamily: {
        display: ["var(--font-archivo-black)", "Impact", '"Arial Black"', "sans-serif"],
        sans: ["var(--font-archivo)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(245,181,46,0.45)",
        card: "0 8px 30px -12px rgba(0,0,0,0.55)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

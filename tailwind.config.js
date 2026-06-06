/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "sidebar-item-in": {
          "0%": { opacity: "0", transform: "translateX(-18px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "accordion-down": {
          "0%": { opacity: "0", maxHeight: "0" },
          "100%": { opacity: "1", maxHeight: "640px" },
        },
      },
      animation: {
        "fade-in": "fade-in 180ms ease-out both",
        "scale-in": "scale-in 180ms ease-out both",
        "slide-in-left": "slide-in-left 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "sidebar-item-in": "sidebar-item-in 220ms ease-out both",
        "accordion-down": "accordion-down 220ms ease-out both",
      },
    },
  },
  plugins: [],
}

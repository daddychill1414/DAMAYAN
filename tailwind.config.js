/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E4036", // Moss
        accent: "#CC5833", // Clay
        background: "#F2F0E9", // Cream
        dark: "#1A1A1A", // Charcoal
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        drama: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

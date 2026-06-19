/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F", // Deep Blue
        accent: "#F59E0B",  // Warm Orange
        background: "#F8FAFC", // Soft White
        dark: "#334155", // Dark Slate
        neutralGray: "#6B7280", // Neutral Gray
        urgency: {
          critical: "#DC2626", // Red
          warning: "#FACC15", // Yellow
          stable: "#16A34A" // Green
        }
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

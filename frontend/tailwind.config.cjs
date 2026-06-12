/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        cardBg: "#131926",
        borderBg: "#1F293D",
        accentBlue: "#1D4ED8",
        accentCyan: "#06B6D4",
        accentGreen: "#10B981",
        accentOrange: "#F59E0B",
        accentRed: "#EF4444",
      },
    },
  },
  plugins: [],
}
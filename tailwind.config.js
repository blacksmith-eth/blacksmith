/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#262a33",
        white: "#fff1e5",
        slate: {
          100: "#f2dfce",
          200: "#ebddd1",
        },
      },
    },
  },
  plugins: [],
};

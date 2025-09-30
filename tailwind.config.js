/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },


      colors: {
        brand: "var(--Secondary-5-main)",     // akcent, ikony (#FABB46)
        primary: "var(--Primary-1)",          // tło kafelków (#FFFBEC)
        bordercolor: "var(--Primary-7-main)", // obramowania (#FBD346)
        chipactive: "var(--Chip-Active)",     // aktywne chipsy (#FEF2C7)
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        primary: {
          50: '#edf6f9',
          100: '#d1e7dd',
          200: '#a3cfbb',
          300: '#83c5be',
          400: '#5cbdb2',
          500: '#83c5be',
          600: '#006d77',
          700: '#005a61',
          800: '#00474b',
          900: '#003335',
        },
        // Direct color mappings
        'theme-dark': '#006d77',
        'theme-medium': '#83c5be', 
        'theme-light': '#edf6f9',
      },
    },
  },
  plugins: [],
};

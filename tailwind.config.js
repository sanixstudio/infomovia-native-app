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
          50: '#FFCC00',   // theme-light
          100: '#B13BFF',  // theme-accent
          200: '#B13BFF',  // theme-accent
          300: '#B13BFF',  // theme-accent
          400: '#B13BFF',  // theme-accent
          500: '#B13BFF',  // theme-accent
          600: '#471396',  // theme-medium
          700: '#471396',  // theme-medium
          800: '#471396',  // theme-medium
          900: '#090040',  // theme-dark
        },
        // Direct color mappings
        'theme-dark': '#090040',
        'theme-medium': '#471396', 
        'theme-accent': '#B13BFF',
        'theme-light': '#FFCC00',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        green: {
          50: '#f2f9f5',
          100: '#d4f0e8',
          200: '#a8dccd',
          300: '#7cc2b1',
          400: '#4fa894',
          500: '#11a97d', // your base green color
          600: '#0e8d63',
          700: '#0a7049',
          800: '#06442f',
          900: '#021716',
        },
        lightgreen: '#68f7aa', // your base green color
        violet: '#8a91f3',
      },
    },
  },
  plugins: [],
}

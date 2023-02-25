/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBlue: '#D6DBF5',
        lightRed: '#F8BCBC',
        lightGreen: '#94D7A2', 
        ashGray: '#F5F7FB',
        defaultIndigo: '#4D5B9E',
        darkIndigo: '#293264'
      }
    },
  },
  plugins: [],
}

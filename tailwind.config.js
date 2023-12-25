/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/app/core/layout/*.{html,ts}"
  ],
  theme: {
    extend: {
      flex: {
        '0 ': '2 2 0%'
      }
    },
  },
  plugins: [],
}


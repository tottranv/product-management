/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{html,ts,vue}'],
  theme: {
    extend: {
      colors: {
        'tran25': 'rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}


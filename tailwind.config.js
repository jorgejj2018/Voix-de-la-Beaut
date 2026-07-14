/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F5E6E0',
          black: '#1A1A1B',
          gold: '#D4AF37',
        },
      },
    },
  },
  plugins: [],
}

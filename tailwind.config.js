/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#080E14',
          light: '#0E1722',
        },
        surface: 'rgba(15, 23, 36, 0.75)',
        gold: {
          DEFAULT: '#D4AF37',
          bronze: '#C5A880',
        },
        ink: {
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 25px 80px -20px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
};

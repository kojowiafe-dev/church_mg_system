// import { transform } from 'framer-motion';

// import { transform } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      keyframes: {
        breathe: {
          '0%, 100%': {
            transform: 'scale(1)', opacity: '1'
          },
          '50%': {
            transform: 'scale(1.05)', opacity: '0.9',
          },
        },
      },
      animation: {
        breathe: 'breathe 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} 
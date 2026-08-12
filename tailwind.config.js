/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0f11',
          800: '#18181c',
          700: '#222228',
        },
        cream: {
          100: '#fcfbf7',
          200: '#f5f2eb',
          300: '#e6e1d5',
          400: '#c5bfb0',
        },
        maroon: {
          900: '#2d0c15',
          800: '#4a1523',
          700: '#6b1d32',
          600: '#8c2440',
        },
        gold: {
          500: '#d4af37',
          400: '#e5c158',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
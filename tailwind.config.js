/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          navy: '#41436A',
          burgundy: '#974063',
          coral: '#F54768',
          peach: '#FF9677',
          50: '#FFF1ED',
          100: '#FFE4DB',
          200: '#FFCAB7',
          300: '#FFA994',
          400: '#FF8770',
          500: '#F54768',
          600: '#D93A58',
          700: '#974063',
          800: '#6A2E45',
          900: '#41436A',
        }
      },
      animation: {
        'pulse-fire': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}
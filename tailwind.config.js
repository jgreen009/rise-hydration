/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        rise: {
          berry: '#e82935',
          lime: '#3ee06b',
          mango: '#ffa840',
          blue: '#1e60ff'
        }
      },
      animation: {
        'gradient-pan': 'gradient-pan 18s ease infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite'
      },
      keyframes: {
        'gradient-pan': {
          '0%,100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'shimmer': {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' }
        }
      }
    }
  },
  plugins: []
}

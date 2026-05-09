/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        'primary-light': '#2E6DAD',
        accent: '#4ECDC4',
        success: '#2ECC71',
        danger: '#E74C3C',
        warning: '#F39C12',
        surface: '#F8F9FA',
        'surface-elevated': '#FFFFFF',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6C757D',
        border: '#DEE2E6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

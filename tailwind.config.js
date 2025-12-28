/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#121212',
        'bg-surface': '#262220',
        'bg-surface-hover': '#302c28',
        'accent-amber': '#E8A850',
        'accent-coral': '#D4836A',
        'text-primary': '#F5F0EB',
        'text-secondary': '#9A9590',
        'text-disabled': '#5A5550',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 12px rgba(30, 25, 20, 0.4)',
      },
      borderRadius: {
        'card': '14px',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#4A90E2',
        'brand-orange': '#F5A623', 
        'brand-green': '#7ED321', // Playful colors
      },
      fontFamily: {
        'rounded': ['"M PLUS Rounded 1c"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

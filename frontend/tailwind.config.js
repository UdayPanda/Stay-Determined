/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'gotu': ['Gotu', 'sans-serif'],
        'dancing-script': ['Dancing Script', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


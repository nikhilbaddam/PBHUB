/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#5f6FFF"
      },animation: {
        spin: 'spin 1s linear infinite', // Default spin animation
      },
    },
  },
  plugins: [],
}





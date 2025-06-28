/** @type {import('tailwindcss').Config} */
export default {
    darkMode:'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Tell Tailwind where to look for classes
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  
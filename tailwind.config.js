/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}", // This only looks at files in the root folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
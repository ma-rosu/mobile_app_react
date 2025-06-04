/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#030014',
        secondary: '#151312',
        light: {
          100: '#D6C7FF',
          200: '#A8B5DB',
          300: '#9ca4ab',
        },
        dark: {
          100: '#221f3d',
          200: '#0f0d23'
        }
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2e7d32',
          light: '#60ad5e',
          dark: '#005005',
        },
        secondary: {
          DEFAULT: '#4caf50',
          light: '#80e27e',
          dark: '#087f23',
        },
        accent: {
          DEFAULT: '#8bc34a',
          light: '#bef67a',
          dark: '#5a9216',
        },
        dark: {
          DEFAULT: '#1b5e20',
          light: '#4c8c4a',
          dark: '#003300',
        },
        light: {
          DEFAULT: '#c8e6c9',
          light: '#fbffff',
          dark: '#97b498',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus', 'active'],
      textColor: ['hover', 'focus', 'active'],
      borderColor: ['hover', 'focus', 'active'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
}

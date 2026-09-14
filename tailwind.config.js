/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FDFCF7',
          100: '#FAF7F0',
          200: '#F4EFE6',
          300: '#EAE1D2',
          400: '#D8CAB3',
          500: '#C2B095',
        },
        paper: {
          light: '#F8F5EE',
          card: '#FFFFFF',
          soft: '#F3EFE6',
          border: '#EBE3D5',
        },
        amberGold: {
          50: '#FDF8F0',
          100: '#FBF0DE',
          200: '#F6DCB5',
          300: '#F0C487',
          400: '#E7A954',
          500: '#D58E2E',
          600: '#BD7522',
          700: '#99581D',
          800: '#7E471E',
          900: '#673B1B',
        },
        ink: {
          900: '#1A1816',
          800: '#2C2723',
          700: '#463F38',
          600: '#685F55',
          500: '#8C8175',
          400: '#ADA398',
          300: '#CEC7BE',
          200: '#E4DFD8',
          100: '#F1EDE7',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
    },
  },
  plugins: [],
};

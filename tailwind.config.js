/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neo: {
          canvas: '#FFFDF5',
          yellow: '#FFDE59',
          orange: '#FF6B4A',
          green: '#2EEC96',
          purple: '#C4A1FF',
          blue: '#68B5FF',
          pink: '#FFA6D5',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};

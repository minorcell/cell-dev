import Color from 'element-plus/es/components/color-picker/src/utils/color.mjs'

/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require('@iconify/tailwind')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        global: "#374151"
      }
    },
  },
  plugins: [addDynamicIconSelectors()],
  corePlugins: {
    preflight: false,
  }
}


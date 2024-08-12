const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue,html}"],
  theme: {
    fontFamily: {
      sans: ["Inter", ...fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
}

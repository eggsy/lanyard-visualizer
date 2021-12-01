import { defineConfig } from "windicss/helpers"
import { resolve } from "path"

import LineClamp from "windicss/plugin/line-clamp"
import defaultTheme from "windicss/defaultTheme"

// Import backgrounds
import backgrounds from "./src/data/backgrounds"

export default defineConfig({
  safelist: [...backgrounds],
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
    },
  },
  extract: {
    include: ["index.html", resolve("./src/**/*.{vue,html,jsx,tsx}")],
    exclude: ["node_modules", ".git"],
  },
  shortcuts: {
    btn: "bg-gray-100 bg-opacity-10 hover:bg-opacity-25 transition px-4 py-2 rounded-lg text-white",
  },
  plugins: [LineClamp],
})

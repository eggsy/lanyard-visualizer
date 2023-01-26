import { defineConfig } from "windicss/helpers"
import { resolve } from "path"

import LineClamp from "windicss/plugin/line-clamp"
import defaultTheme from "windicss/defaultTheme"

export default defineConfig({
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
    btn: "bg-white/5 hover:bg-white/10 flex space-x-2 items-center text-white/30 hover:text-white/50 select-none transition px-4 py-2 text-sm rounded-lg",
  },
  plugins: [LineClamp],
})

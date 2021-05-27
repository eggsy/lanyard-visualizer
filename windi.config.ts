import { defineConfig } from "windicss/helpers";
import { resolve } from "path";

import LineClamp from "windicss/plugin/line-clamp";
import defaultTheme from "windicss/defaultTheme";

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
  plugins: [LineClamp],
});

import { defineConfig } from "vite"
import { resolve } from "path"

// Import plugins
import Vue from "@vitejs/plugin-vue"
import Icons from "unplugin-icons/vite"

export default defineConfig({
  root: "./src",
  build: {
    outDir: resolve("./dist"),
  },
  plugins: [
    Vue(),
    Icons({
      autoInstall: true,
    }),
  ],
})

import routes from "./routes"
import App from "./App.vue"

import { createApp } from "vue"
import { MotionPlugin } from "@vueuse/motion"
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

import "virtual:windi.css"

createApp(App).use(router).use(MotionPlugin).mount("#app")

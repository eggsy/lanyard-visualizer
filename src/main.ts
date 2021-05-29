import { createApp } from "vue";
import App from "./App.vue";

// Import Vue router, routes and create the router
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Import Windi CSS
import "virtual:windi.css";

// Create and mount the app
createApp(App)
  .use(router)
  .mount("#app");

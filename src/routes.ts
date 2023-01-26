// Import routes
import HomeComponent from "./views/index.vue"
import UserComponent from "./views/[id].vue"

// Import types
import { RouteRecordRaw } from "vue-router"

const RouterConfig: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeComponent,
  },
  {
    path: "/:id",
    alias: ["/user/:id", "/users/:id", "/u/:id"],
    name: "User",
    component: UserComponent,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
]

// Export router config
export default RouterConfig

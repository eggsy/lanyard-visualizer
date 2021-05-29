// Import routes
import HomeComponent from "./views/index.vue"
import UserComponent from "./views/user/[id].vue"

// Import types
import { RouteRecordRaw } from "vue-router"

const RouterConfig: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeComponent
  },
  {
    path: "/user/:id",
    alias: "/users/:id",
    name: "User",
    component: UserComponent,
    props: true
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
]

// Export router config
export default RouterConfig

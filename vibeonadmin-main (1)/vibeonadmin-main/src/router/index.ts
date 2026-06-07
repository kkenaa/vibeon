import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/GridView.vue";
import EditFormView from "../views/EditFormView.vue";
import UsersView from "../views/UsersView.vue";
import MembersView from "../views/MembersView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/edit/:name",
      name: "edit-form",
      component: EditFormView,
    },
    {
      path: "/users",
      name: "users",
      component: UsersView,
    },
    {
      path: "/users/:userId",
      name: "user-detail",
      component: UsersView,
    },
    {
      path: "/members",
      name: "members",
      component: MembersView,
    },
  ],
});

router.beforeEach((_, _2, next) => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  next();
});

export default router;

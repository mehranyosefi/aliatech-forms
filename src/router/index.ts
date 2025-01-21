import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import FormsView from "@/views/FormsView.vue";
import FormCrudView from "@/views/FormCrudView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => LoginView,
    },
    {
      path: "/forms",
      name: "forms",
      component: () => FormsView,
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
      },
    },
    {
      path: "/forms/crud",
      name: "form-crud",
      component: () => FormCrudView,
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
      },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => NotFoundView,
    },
  ],
});

export default router;

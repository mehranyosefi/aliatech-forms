import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import FormsView from "@/views/FormsView.vue";
import FormCreateView from "@/views/FormCreateView.vue";
import FormEditView from "@/views/FormEditView.vue";
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
      path: "/forms/create",
      name: "form-create",
      component: () => FormCreateView,
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
      },
    },
    {
      path: "/forms/:id",
      name: "form-edit",
      component: () => FormEditView,
      meta: {
        layout: "DefaultLayout",
        requiresAuth: true,
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => NotFoundView,
    },
  ],
});

export default router;

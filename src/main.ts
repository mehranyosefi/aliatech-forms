import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import clickOutside from "./plugin/clickOutside";
import { useUserStore } from "./composable/useUserStore";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(clickOutside);
app.mount("#app");

router.beforeEach((to, from, next) => {
  const useUser = useUserStore();
  if (to.meta.requiresAuth && !useUser.isLoggedIn) next({ name: "login" });
  else if (useUser.isLoggedIn && to.name === "login") next({ name: "forms" });
  else next();
});

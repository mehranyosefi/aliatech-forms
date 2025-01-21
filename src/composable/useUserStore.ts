import { computed, reactive, type ComputedRef } from "vue";
import { defineStore } from "pinia";
import { useFetch } from "./useFetch";
import { type UserStore } from "@/types";
import router from "@/router";

export const useUserStore = defineStore("user", () => {
  const state = reactive<UserStore>({
    user: {
      email: "",
    },
    access_token: localStorage.getItem("access_token")
      ? JSON.parse(localStorage.getItem("access_token") as string)
      : null,
    refresh_token: localStorage.getItem("refresh_token")
      ? JSON.parse(localStorage.getItem("refresh_token") as string)
      : null,
  });

  const isLoggedIn: ComputedRef<boolean> = computed(
    () => state.access_token !== null
  );
  async function signup(body: { email: string; password: string }) {
    const { fetchData, data, error } = useFetch();
    await fetchData("signup", { method: "POST", body });
    if (data.value?.ok) {
      state.user.email = body.email;
      setTokens(data.value.data);
      router.push("/forms");
    } else if (data.value?.status === 400 || data.value?.status === 422) {
      return { data };
    } else throw error.value;
  }

  function setTokens(value: { access: string; refresh: string }) {
    if (value.access) {
      localStorage.setItem("access_token", JSON.stringify(value.access));
      state.access_token = value.access;
    }
    if (value.refresh) {
      localStorage.setItem("refresh_token", JSON.stringify(value.refresh));
      state.refresh_token = value.refresh;
    }
  }

  return { state, signup, isLoggedIn, setTokens };
});

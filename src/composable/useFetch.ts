import {
  reactive,
  ref,
  shallowRef,
  type Reactive,
  type Ref,
  type ShallowRef,
} from "vue";
import { useUserStore } from "./useUserStore";

interface ReturnUseFetch {
  data: Ref<null | any>;
  loading: ShallowRef<boolean>;
  error: Ref<string | null | Error>;
  fetchData: (url: string, config?: FetchConfig) => Promise<void>;
}
interface FetchConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: null | object;
}

const defaultHeaders: { [key: string]: string } = {
  "Content-Type": "application/json",
  accept: "application/json",
};
const baseUrl: string =
  import.meta.env.VITE_API_BASE_URL || "https://interview.cetri.ir/main/main/";

// set this variable for handle request when get 403 error and other parallel requests
const requestLoadings: Reactive<string[]> = reactive([]);

export function useFetch(): ReturnUseFetch {
  const data = ref<null | any>(null);
  const error = ref<null | string | Error>(null);
  const loading = shallowRef<boolean>(false);

  const fetchData = async (url: string, config?: FetchConfig) => {
    async function triggerFetch() {
      return await fetch(baseUrl + url, {
        method: config?.method || "GET",
        headers: config?.headers
          ? { ...defaultHeaders, ...config.headers }
          : defaultHeaders,
        body: config?.body ? JSON.stringify(config.body) : null,
      });
    }
    const useUser = useUserStore();
    if (useUser.isLoggedIn)
      defaultHeaders["Authorization"] = `Bearer ${useUser.state.access_token}`;
    if (requestLoadings.includes("refresh_token")) return;
    loading.value = true;
    try {
      const response = await triggerFetch();
      data.value = await response.json();
      if (
        !data.value?.ok &&
        data.value?.status === 403 &&
        useUser.state.refresh_token
      ) {
        requestLoadings.push("refresh_token");
        try {
          const res = await fetch(
            baseUrl + `refresh?token=${useUser.state.refresh_token}`,
            {
              method: "POST",
              headers: config?.headers
                ? { ...defaultHeaders, ...config.headers }
                : defaultHeaders,
            }
          );
          const resData = await res.json();
          if (resData.value?.ok) {
            useUser.setTokens(resData.data);
            // call reauest again after get 403 error
            const response = await triggerFetch();
            data.value = await response.json();
          }
        } catch (err) {
          error.value =
            err instanceof Error ? err.message : "An unknown error occurred";
        } finally {
          const index = requestLoadings.findIndex(
            (item) => item === "refresh_token"
          );
          if (index > -1) requestLoadings.splice(index, 1);
        }
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
  };
}

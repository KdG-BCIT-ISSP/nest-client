import { accessTokenAtom } from "@/atoms/auth/atom";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();
const axiosInterceptor: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// adds auth header if a token is available
axiosInterceptor.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { requiresAuth?: boolean }) => {
    const token = store.get(accessTokenAtom);

    if (config.requiresAuth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// response interceptor
axiosInterceptor.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let errorMessage = "An error occurred";

    if (error.response && error.response.data) {
      errorMessage =
        (error.response.data as { message?: string })?.message || errorMessage;
    }

    // custom error messages
    const requestUrl = error.config?.url || "";
    if (requestUrl.includes("/member/join")) {
      errorMessage = `Join failed: ${errorMessage}`;
    } else if (requestUrl.includes("/member/login")) {
      errorMessage = `Login failed: ${errorMessage}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInterceptor;

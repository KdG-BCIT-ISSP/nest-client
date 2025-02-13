import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getNewAccessToken } from "./auth/accessToken/route";
import { getCookie, deleteCookie, setCookie } from "cookies-next";

const axiosInterceptor: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

// adds auth header if a token is available
axiosInterceptor.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { requiresAuth?: boolean }) => {
    if (config.requiresAuth) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        const sanitizedToken = token.replace(/"/g, "");
        config.headers.Authorization = `Bearer ${sanitizedToken}`;
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// first response interceptor for handling 401 errors
axiosInterceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getCookie("refreshToken")?.toString() || "";

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await getNewAccessToken(refreshToken);
        localStorage.setItem("accessToken", response.accessToken);
        setCookie("refreshToken", response.refreshToken);
        return axiosInterceptor(originalRequest);
      } catch (refreshError) {
        deleteCookie("refreshToken", { path: "/" });
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
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

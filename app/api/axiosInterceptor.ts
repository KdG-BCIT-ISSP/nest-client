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

// response error types
const INVALID_TOKEN_ERROR = "Invalid token";
const EXPIRED_TOKEN_ERROR = "Expired token";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

// adds auth header if a token is available
axiosInterceptor.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { requiresAuth?: boolean }) => {
    if (config.requiresAuth) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        const sanitizedToken = token
          .replace(/^(\\|")+/g, "")
          .replace(/(\\|")+$/g, "");
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

    const responseType = error.response?.data?.error;

    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (responseType === EXPIRED_TOKEN_ERROR) {
          try {
            const response = await getNewAccessToken(refreshToken);
            localStorage.setItem("accessToken", response.accessToken);
            setCookie("refreshToken", response.refreshToken);
            return axiosInterceptor(originalRequest);
          } catch (refreshError) {
            handleLogout();
            return Promise.reject(refreshError);
          }
        }

        if (responseType === INVALID_TOKEN_ERROR) {
          handleLogout();
        }
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

// function to handle logout
const handleLogout = () => {
  deleteCookie("refreshToken", { path: "/" });
  localStorage.removeItem("accessToken");
  window.location.href = "/auth/login";
  alert("Invalid token. Please log in again.");
};

export default axiosInterceptor;

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

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

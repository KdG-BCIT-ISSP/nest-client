import { getCookie, deleteCookie, setCookie } from "cookies-next";

const PROXY_BASE_URL = "/api/proxy";
const EXTERNAL_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const INVALID_TOKEN_ERROR = "Invalid token";
const EXPIRED_TOKEN_ERROR = ["Expired token", "Token expired"];

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(
    `${EXTERNAL_API_BASE_URL}/auth/getNewAccessToken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    }
  );
  if (!response.ok) throw new Error("Failed to refresh token");
  const data = await response.json();
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}

function handleLogout() {
  localStorage.removeItem("accessToken");
  deleteCookie("refreshToken", { path: "/" });
  alert("Invalid token. Please log in again.");
  window.location.href = "/auth/login";
}

export async function fetchInterceptor(
  endpoint: string,
  options: RequestInit = {}
) {
  const accessToken = localStorage.getItem("accessToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // Remove the /api prefix if present for proxy routing
  const finalEndpoint = endpoint.startsWith("/api")
    ? endpoint.replace(/^\/api/, "")
    : endpoint;

  const config: RequestInit & { _retry?: boolean } = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(`${PROXY_BASE_URL}${finalEndpoint}`, config);

    if (response.status === 401 && !config._retry) {
      config._retry = true;
      const errorData = await response.json().catch(() => ({}));
      const responseType = errorData.error || "";

      if (EXPIRED_TOKEN_ERROR.includes(responseType)) {
        const refreshToken = getCookie("refreshToken")?.toString() || "";
        try {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshAccessToken(refreshToken);
          localStorage.setItem("accessToken", newAccessToken);
          setCookie("refreshToken", newRefreshToken);

          config.headers = {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return await fetch(`${PROXY_BASE_URL}${finalEndpoint}`, config);
        } catch (refreshError) {
          handleLogout();
          throw refreshError;
        }
      }

      if (responseType === INVALID_TOKEN_ERROR) {
        handleLogout();
        throw new Error("Invalid token");
      }

      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export const get = (endpoint: string, options: RequestInit = {}) =>
  fetchInterceptor(endpoint, { ...options, method: "GET" });

export const post = <T>(endpoint: string, body: T, options: RequestInit = {}) =>
  fetchInterceptor(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });

export const put = <T>(endpoint: string, body: T, options: RequestInit = {}) =>
  fetchInterceptor(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });

export const del = (endpoint: string, options: RequestInit = {}) =>
  fetchInterceptor(endpoint, { ...options, method: "DELETE" });

import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ============================================================
// SINGLE-FLIGHT REFRESH LOCK
// Prevents multiple parallel 401s from triggering multiple
// simultaneous /auth/refresh calls (which breaks refresh token
// rotation: first call succeeds & rotates the token, any other
// parallel call then fails with an already-invalidated token).
// ============================================================

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
}

function onRefreshFailed(error) {
  refreshSubscribers.forEach((callback) => callback(null, error));
  refreshSubscribers = [];
}

// Auth routes jinke 401 ko refresh logic se handle nahi karna
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

function isAuthRoute(url = "") {
  return AUTH_ROUTES.some((route) => url.includes(route));
}

// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle expired access token
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Network error / config missing: seedha reject
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Login/register/refresh ke 401 ko seedha component tak jane do
    // (isse wrong email/password par page reload nahi hoga)
    if (isAuthRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // ------------------------------------------------------
      // If a refresh is already in progress, wait for it
      // instead of firing another /auth/refresh call.
      // ------------------------------------------------------
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newAccessToken, refreshError) => {
            if (refreshError || !newAccessToken) {
              reject(refreshError || error);
              return;
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          isRefreshing = false;
          onRefreshFailed(error);

          window.location.href = "/login";

          return Promise.reject(error);
        }

        // Get new tokens
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        // Save new tokens
        localStorage.setItem("access_token", newAccessToken);

        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        isRefreshing = false;
        onRefreshed(newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired/invalid
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        isRefreshing = false;
        onRefreshFailed(refreshError);

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
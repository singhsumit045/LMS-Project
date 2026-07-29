import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

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

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          window.location.href = "/login";

          return Promise.reject(error);
        }

        // Get new tokens
        const response = await axios.post(
          "http://localhost:3000/auth/refresh",
          {
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        // Save new tokens
        localStorage.setItem(
          "access_token",
          newAccessToken
        );

        if (newRefreshToken) {
          localStorage.setItem(
            "refresh_token",
            newRefreshToken
          );
        }

        // Retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired/invalid
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
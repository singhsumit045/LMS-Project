
import api from "./api";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);

  // Save access token
  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  // Save refresh token
  localStorage.setItem(
    "refresh_token",
    response.data.refresh_token
  );

  // Save user information
  if (response.data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response;
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// =========================
// GET PROFILE
// =========================

export const getProfile = () => {
  return api.get("/auth/profile");
};

// =========================
// UPDATE PROFILE
// =========================

export const updateProfile = (data) => {
  return api.put("/auth/profile", data);
};

// =========================
// REFRESH ACCESS TOKEN
// =========================

export const refreshToken = () => {
  const refresh_token = localStorage.getItem("refresh_token");

  return api.post("/auth/refresh", {
    refresh_token,
  });
};

// =========================
// LOGOUT
// =========================

export const logoutUser = () => {
  return api.post("/auth/logout");
};

// =========================
// CLEAR AUTH DATA
// =========================

export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};


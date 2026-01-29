// frontend/src/api/axios.ts

import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-auth-backend-unrd.onrender.com",
  withCredentials: true, // Keep this for other requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add Authorization header with token from localStorage
// frontend/src/api/axios.ts

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const sessionId = localStorage.getItem("sessionId");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (sessionId) {
      config.headers["X-Session-Id"] = sessionId;
    }

    const fullUrl = `${config.baseURL}${config.url}`;
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 Making request");
    console.log("Method:", config.method?.toUpperCase());
    console.log("Full URL:", fullUrl);
    console.log(
      "Authorization:",
      config.headers.Authorization ? "Bearer ***" : "None",
    );
    console.log("Session-Id:", config.headers["X-Session-Id"] || "None");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return config;
  },
  (error) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/refresh-token")) {
      console.error("❌ Refresh token failed, user needs to login again");
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Access token expired, attempting to refresh...");

        const refreshToken = localStorage.getItem("refreshToken");
        const response = await api.post("/api/auth/refresh-token", {
          refreshToken,
        });

        // Update tokens
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        console.log(
          "✅ Token refreshed successfully, retrying original request",
        );
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed in catch block");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.error("API error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  },
);

export default api;

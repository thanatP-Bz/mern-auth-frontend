import axios from "axios";

const api = axios.create({
  baseURL:
    "https://mern-auth-backend-unrd.onrender.com" /* || "http://localhost:4004" */,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor with full URL logging
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 Making request");
    console.log("Method:", config.method?.toUpperCase());
    console.log("Full URL:", fullUrl);
    console.log("Data:", config.data);
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
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("❌ Error occurred");
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    console.log("Response status:", error.response?.status);
    console.log("Response data:", error.response?.data);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const originalRequest = error.config;

    if (originalRequest.url?.includes("/refresh-token")) {
      console.error("❌ Refresh token failed, user needs to login again");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Access token expired, attempting to refresh...");
        await api.post("/api/auth/refresh-token");
        console.log(
          "✅ Token refreshed successfully, retrying original request",
        );
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed in catch block");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.error("API error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  },
);

export default api;

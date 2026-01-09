import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4004",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

///for debugging header//
api.interceptors.request.use(
  (config) => {
    console.log("making request to:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we're retrying to prevent infinite loop

      try {
        console.log("🔄 Access token expired, attempting to refresh...");

        // Call refresh endpoint
        // The refreshToken cookie is sent AUTOMATICALLY by the browser!
        await api.post("/api/auth/refresh-token");

        console.log(
          "✅ Token refreshed successfully, retrying original request"
        );

        // The new accessToken cookie is set AUTOMATICALLY by backend!
        // Now retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or invalid
        console.error("❌ Refresh token failed, user needs to login again");

        // Clear user data from localStorage
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // For other errors, just log and reject
    console.error("API error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;

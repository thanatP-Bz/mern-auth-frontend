import axios from "axios";

console.log("🔧 Backend URL: http://localhost:4004/api/");

const axiosInstance = axios.create({
  baseURL: "http://localhost:4004/api/",
  withCredentials: false, // ← Changed to false (no cookies)
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("📡 Making request to:", config.baseURL! + config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Request with token:", token.substring(0, 30) + "...");

      // Decode and show token expiration
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiresAt = new Date(payload.exp * 1000);
        const now = new Date();
        const timeLeft = Math.floor(
          (expiresAt.getTime() - now.getTime()) / 1000
        );

        console.log("⏰ Token expires at:", expiresAt.toLocaleTimeString());
        console.log(
          "⏳ Time left:",
          timeLeft > 0 ? `${timeLeft}s` : "EXPIRED!"
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log("⚠️ Could not decode token", e);
      }
    } else {
      console.log("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response success:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error("❌ Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 ==========================================");
      console.log("🔄 TOKEN REFRESH FLOW STARTED");
      console.log("🔄 ==========================================");
      console.log("⚠️ 401 Unauthorized - Token expired!");

      const refreshToken = localStorage.getItem("refreshToken"); // ← Get from localStorage

      if (!refreshToken) {
        console.error("❌ No refresh token found in localStorage!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth";
        return Promise.reject(error);
      }

      console.log("🔄 Attempting to refresh token...");
      console.log(
        "🔑 Using refresh token:",
        refreshToken.substring(0, 30) + "..."
      );

      try {
        console.log("📡 Calling refresh endpoint...");

        const response = await axios.post(
          `http://localhost:4004/api/auth/refresh-token`,
          { refreshToken: refreshToken } // ← Send in body
        );

        console.log("✅ Refresh response received:", response.status);

        const newAccessToken = response.data.accessToken;

        if (!newAccessToken) {
          console.error("❌ No access token in refresh response!");
          throw new Error("No token received");
        }

        console.log(
          "🆕 New access token received:",
          newAccessToken.substring(0, 30) + "..."
        );

        // Decode and show new token expiration
        try {
          const payload = JSON.parse(atob(newAccessToken.split(".")[1]));
          const expiresAt = new Date(payload.exp * 1000);
          console.log(
            "⏰ New token expires at:",
            expiresAt.toLocaleTimeString()
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          console.log("⚠️ Could not decode new token", e);
        }

        localStorage.setItem("token", newAccessToken); // ← Save new token
        console.log("💾 New access token saved to localStorage");

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("🔄 Retrying original request with new token...");
        console.log("🔄 ==========================================");

        return axiosInstance(originalRequest);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (refreshError: any) {
        console.log("🔄 ==========================================");
        console.error("❌ TOKEN REFRESH FAILED!");
        console.log("🔄 ==========================================");
        console.error(
          "Error:",
          refreshError.response?.data || refreshError.message
        );
        console.log("🚪 Logging out and redirecting to /auth...");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken"); // ← Also remove refresh token
        localStorage.removeItem("user");
        window.location.href = "/auth";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

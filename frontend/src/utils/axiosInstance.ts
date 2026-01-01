import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4004/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  // Success handler - just return response
  (response) => response,

  // Error handler - this is where the magic happens!
  async (error) => {
    // Save the original request that failed
    const originalRequest = error.config;

    // Check if:
    // 1. Error is 401 (token expired)
    // 2. We haven't already tried to refresh (prevent infinite loop)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as "we tried to refresh for this one"
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem("refreshToken");

        // If no refresh token, can't refresh - throw error
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh-token endpoint
        // IMPORTANT: Use regular axios, not axiosInstance (avoid interceptor loop!)
        const response = await axios.post(
          "http://localhost:4004/api/auth/refresh-token",
          { refreshToken }
        );

        // Get the new access token from response
        const newAccessToken = response.data.accessToken;

        // Save new access token to localStorage
        localStorage.setItem("accessToken", newAccessToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - token is truly expired or invalid
        // Clear everything and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      }
    }

    // If error is not 401, or we already tried refreshing, just throw it
    return Promise.reject(error);
  }
);
export default axiosInstance;

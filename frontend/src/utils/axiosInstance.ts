import axios, { AxiosError, type AxiosRequestConfig } from "axios";

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:4004/api",
  // safe to keep even if not using cookies yet
});

/* ------------------------------------------------------------------ */
/* Refresh queue control                                               */
/* ------------------------------------------------------------------ */

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (error: any) => void;
}[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  failedQueue = [];
};

/* ------------------------------------------------------------------ */
/* Request interceptor                                                 */
/* ------------------------------------------------------------------ */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "http://localhost:4004/api/auth/refresh-token",
          { refreshToken }
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update default axios headers for future requests
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return Promise.reject({
        success: false,
        status: 503,
        message: "You are offline. Please check your internet connection.",
      });
    }
    return config;
  },
  (error) => Promise.reject(error),
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/signup") &&
      !originalRequest.url.includes("/auth/verify-email")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await AxiosInstance.post(
          "/api/auth/erp/refresh",
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data?.access_token;
        if (newAccessToken) {
          // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          };
        }
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      }
    }
    // NETWORK / TIMEOUT HANDLING
    let apiMessage = "Something went wrong";
    let status = error.response?.status || 500;

    if (error.code === "ECONNABORTED") {
      apiMessage = "Network timeout. Please check your connection.";
      status = 408;
    } else if (!error.response) {
      apiMessage = "Network error. Please check your internet connection.";
      status = 503;
    } else {
      apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.errors?.[0] ||
        error.message ||
        "Something went wrong";
    }

    const customError = {
      success: false,
      status,
      message: apiMessage,
      raw: error,
    };

    return Promise.reject(customError);
  },
);

export default AxiosInstance;

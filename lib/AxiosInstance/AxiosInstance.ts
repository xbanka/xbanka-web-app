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
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/erp/login") &&
      !originalRequest.url.includes("/api/auth/erp/register") &&
      !originalRequest.url.includes("/api/auth/erp/verify")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await AxiosInstance.post(
          "/api/auth/erp/refresh",
          {},
          { withCredentials: true }
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
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      "Something went wrong" ||
      String(error);

    const customError = {
      success: false,
      status: error.response?.status || 500,
      message: apiMessage,
      raw: error, // keep raw error if you need debugging
    };

    return Promise.reject(customError);
  }
);

export default AxiosInstance;
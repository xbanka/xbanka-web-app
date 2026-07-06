import axios from "axios";
import { getDeviceId, getDeviceInfo } from "../device";
import { tokenStore } from "@/store/token.store";
import { authTokens } from "../authToken";
import { refreshAccessToken } from "../refresh-token";

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
    // const token = tokenStore.get();
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const deviceId = getDeviceId();
    const { deviceName, deviceType } = getDeviceInfo();

    config.headers["x-device-id"] = deviceId;
    config.headers["x-device-name"] = deviceName;
    config.headers["x-device-type"] = deviceType;
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
        const newAccessToken = await refreshAccessToken();

        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        tokenStore.clear();
        authTokens.clear();
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          document.cookie = "accessToken=; Max-Age=0; path=/";
          window.location.href = "/sign-in";
        }
        return Promise.reject({
          success: false,
          status: 401,
          message: "Session expired",
          silent: true,
          raw: refreshError,
        });
        // return Promise.reject(refreshError);
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
    } else if (status === 500) {
      apiMessage = "Service currently unavailable. Please try again later.";
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

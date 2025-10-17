import axios from "axios";
import { toast } from "react-toastify";
import { sanitizeObject } from "../controllers/Sanitize.controller";

export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  timeout: 10000, // Increased timeout to 10 seconds
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


AxiosInstance.interceptors.request.use(function (config) {

  // post, put, delete
  if (config.data) {
    config.data = JSON.stringify(sanitizeObject(config.data));
  }

//   // get
  if (config.params) {
    config.params = JSON.stringify(sanitizeObject(config.params));
  }

  return config;
}, function (error) {

  toast.error("Something went wrong!");
  console.error(error);
  return Promise.reject(error);
}
);

AxiosInstance.interceptors.response.use(function onFulfilled(response) {
  // suppress global success toasts; pages will opt-in when needed
  return response;

}, async function onRejected(error) {
  const originalRequest = error.config || {};
  const status = error.response?.status;
  const reqUrl = (originalRequest.url || "").toString();
  const isAuthEndpoint = reqUrl.includes('/api/auth/login') || reqUrl.includes('/api/auth/register') || reqUrl.includes('/api/auth/verify-otp') || reqUrl.includes('/api/auth/refresh');
  const isTimeout = error.code === 'ECONNABORTED';

  // Handle timeout errors - don't try refresh, just show error
  if (isTimeout) {
    toast.error("Request timeout. Please check your connection.");
    return Promise.reject(error);
  }

  // Do NOT try refresh for auth endpoints; let the error bubble for toast
  if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
    originalRequest._retry = true;
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/auth/refresh`, {}, { withCredentials: true });
      const accessToken = res.data?.accessToken;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`
        };
        return AxiosInstance(originalRequest);
      }
    } catch (refreshErr) {
      localStorage.removeItem('accessToken');
      toast.error("Session expired. Please log in again.");
      // hint for app to redirect; components can listen to this state, or we can just bounce now
      try { window?.location?.assign?.('/'); } catch (_) {}
      return Promise.reject(refreshErr);
    }
  }

  toast.error(error.response?.data?.message || "Something went wrong!");
  console.error(error);
  return Promise.reject(error);
});

// Attach access token if present
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});

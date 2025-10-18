import axios from "axios";
import { sanitizeObject } from "../controllers/Sanitize.controller";

export const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(function (config) {
  // Add authorization token if it exists
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Sanitize request data (but don't double stringify - axios will handle JSON conversion)
  if (config.data) {
    config.data = sanitizeObject(config.data);
  }

  if (config.params) {
    config.params = sanitizeObject(config.params);
  }

  return config;
}, function (error) {
  console.error(error);
  return Promise.reject(error);
});

AxiosInstance.interceptors.response.use(function onFulfilled(response) {
  // Don't show automatic toasts - let components handle their own notifications
  return response;
}, function onRejected(error) {
  // Only log errors - let components handle their own error notifications
  console.error(error);
  return Promise.reject(error);
});



import axios from "axios";
import { toast } from "react-toastify";
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
  toast.error("Something went wrong!");
  console.error(error);
  return Promise.reject(error);
});

AxiosInstance.interceptors.response.use(function onFulfilled(response) {

//   console.log("Response:", response.data);

  toast.success(response.data?.message || "Success!");
  return response;

}, function onRejected(error) {
  toast.error(error.response?.data?.message || "Something went wrong!");
  console.error(error);
  return Promise.reject(error);
});



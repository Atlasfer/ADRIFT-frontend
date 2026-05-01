import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject token lazily — avoid importing store at module level
apiClient.interceptors.request.use((config) => {
  // Dynamic import to avoid SSR issues with Zustand persist
  if (typeof window !== "undefined") {
    const { useAuthStore } = require("@/store/authStore");
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message;
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

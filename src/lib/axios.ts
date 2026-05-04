// src/lib/axios.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      // Ambil token dari localStorage (zustand persist)
      const authStorage = localStorage.getItem("adrift-auth");
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (error) {
      console.error("Error reading auth token:", error);
    }
  }
  return config;
});

// Interceptor untuk handle error response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("adrift-auth");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
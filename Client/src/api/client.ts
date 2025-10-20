// @/api/client.ts
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/authStore";
import { decodeJWT } from "@/utils/decoder";
const Client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Interceptor para adicionar token em todas as requisições
Client.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros de autenticação
Client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa tudo
      const token = Cookies.get("auth-token");
      if (!token) return Promise.reject(error);
      const decodedToken = decodeJWT(token);
      if (decodedToken.type === "user") {
        useAuthStore.getState().logout("user");
      } else if (decodedToken.type === "enterprise") {
        useAuthStore.getState().logout("enterprise");
      }
    }
    return Promise.reject(error);
  },
);
export default Client;

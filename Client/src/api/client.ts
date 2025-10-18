// @/api/client.ts
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/authStore";

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
      Cookies.remove("auth-token");
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default Client;

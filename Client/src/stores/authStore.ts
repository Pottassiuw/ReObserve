// src/stores/authStore.ts
import { create } from "zustand";
import type { Empresa, Usuario } from "@/types/types";

// Tipo do usuário logado
type UserType = "user" | "empresa" | "superadmin" | null;

// Estado da store
interface AuthState {
  userType: UserType;
  user: Usuario | null;
  empresa: Empresa | null;
  superAdmin: SuperAdmin | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Ações
  checkAuth: () => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  loginEmpresa: (cnpj: string, password: string) => Promise<void>;
  loginSuperAdmin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial
  userType: null,
  user: null,
  empresa: null,
  superAdmin: null,
  isAuthenticated: false,
  isLoading: true,

  // Verificar autenticação ao carregar
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      // Chama endpoint que identifica quem está logado
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        // Sua API deve retornar algo como: { type: 'user', data: {...} }
        if (data.type === "user") {
          set({
            userType: "user",
            user: data.data,
            empresa: null,
            superAdmin: null,
            isAuthenticated: true,
            isLoading: false,
          });
        } else if (data.type === "empresa") {
          set({
            userType: "empresa",
            user: null,
            empresa: data.data,
            superAdmin: null,
            isAuthenticated: true,
            isLoading: false,
          });
        } else if (data.type === "superadmin") {
          set({
            userType: "superadmin",
            user: null,
            empresa: null,
            superAdmin: data.data,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        // Não autenticado
        set({
          userType: null,
          user: null,
          empresa: null,
          superAdmin: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      set({
        userType: null,
        user: null,
        empresa: null,
        superAdmin: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Login: Usuário
  loginUser: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      const response = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        set({
          userType: "user",
          user,
          empresa: null,
          superAdmin: null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error("Login falhou");
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Login: Empresa
  loginEmpresa: async (cnpj: string, password: string) => {
    try {
      set({ isLoading: true });

      const response = await fetch("/api/auth/empresa/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cnpj, password }),
      });

      if (response.ok) {
        const empresa = await response.json();
        set({
          userType: "empresa",
          user: null,
          empresa,
          superAdmin: null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error("Login falhou");
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Login: Super Admin
  loginSuperAdmin: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      const response = await fetch("/api/auth/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const superAdmin = await response.json();
        set({
          userType: "superadmin",
          user: null,
          empresa: null,
          superAdmin,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error("Login falhou");
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Logout (funciona para todos)
  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      set({
        userType: null,
        user: null,
        empresa: null,
        superAdmin: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  },
}));

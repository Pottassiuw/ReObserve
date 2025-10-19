import { create } from "zustand";
import Cookies from "js-cookie";
import {
  loginApi,
  logoutApi,
  type UserPayload,
  type EnterprisePayload,
} from "@/api/endpoints/auth";
import { decodeJWT } from "@/utils/decoder";
import { retornarUsuario } from "@/api/endpoints/users";

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userType: "user" | "enterprise" | null;
  admin: boolean;
  userId: number | null;
  login: (
    type: "user" | "enterprise",
    data: UserPayload | EnterprisePayload,
  ) => Promise<void>;
  logout: (type: "user" | "enterprise") => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userType: null,
  admin: false,
  userId: null,
  isAuthLoading: true,

  login: async (type, data) => {
    set({ isAuthLoading: true });
    try {
      const result = await loginApi(type, data);

      if (!result.success) {
        throw new Error(result.error || "Erro ao fazer login");
      }

      const isUser = !!result.user;

      set({
        isAuthenticated: true,
        userType: isUser ? "user" : "enterprise",
        admin: result.user?.admin || false,
        userId: result.user?.id || result.enterprise?.id || null,
      });
    } catch (error) {
      console.error("Erro no processo de login:", error);
      set({
        isAuthenticated: false,
        userType: null,
        admin: false,
        userId: null,
      });
      throw error;
    } finally {
      set({ isAuthLoading: false });
    }
  },

  logout: async (type) => {
    await logoutApi(type);
    set({ isAuthenticated: false, userType: null, admin: false, userId: null });
  },

  checkAuth: async () => {
    const token = Cookies.get("auth-token");

    if (token) {
      const decoded = decodeJWT(token);

      if (decoded && decoded.type && decoded.id) {
        let isAdmin = false;

        // Se for usuário, busca os dados para verificar admin
        if (decoded.type === "user") {
          try {
            const userData = await retornarUsuario(decoded.id);
            isAdmin = Boolean(userData?.admin);
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
          }
        }

        set({
          isAuthenticated: true,
          userType: decoded.type,
          admin: isAdmin,
          userId: decoded.id,
        });
      } else {
        set({
          isAuthenticated: false,
          userType: null,
          admin: false,
          userId: null,
        });
      }
    } else {
      set({
        isAuthenticated: false,
        userType: null,
        admin: false,
        userId: null,
      });
    }

    set({ isAuthLoading: false });
  },
}));

useAuthStore.getState().checkAuth();

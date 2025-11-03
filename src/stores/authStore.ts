import { create } from "zustand";
import { loginApi, logoutApi } from "@/api/endpoints/auth";
import { decodeJWT } from "@/utils/decoder";
import { setGlobalAuthToken, clearGlobalAuthToken } from "@/api/client";

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userType: "user" | "enterprise" | null;
  admin: boolean;
  userId: number | null;
  initialized: boolean;
  login: (
    type: "user" | "enterprise",
    credentials: { email?: string; cnpj?: string; senha: string },
  ) => Promise<void>;
  logout: (type: "user" | "enterprise") => Promise<void>;
  initialize: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userType: null,
  admin: false,
  userId: null,
  isAuthLoading: true,
  initialized: false,
  login: async (type, credentials) => {
    set({ isAuthLoading: true });
    try {
      const result = await loginApi(type, credentials);

      if (!result.success || !result.token) {
        throw new Error(result.error || "Erro ao fazer login");
      }
      setGlobalAuthToken(result.token);
      const decoded = decodeJWT(result.token);
      const userId = decoded?.sub ? parseInt(decoded.sub, 10) : null;
      const isAdmin =
        decoded.admin === true ||
        decoded.admin === "true" ||
        result.user?.admin ||
        false;
      if (!userId) {
        throw new Error("ID não encontrado no token");
      }
      set({
        isAuthenticated: true,
        userType: type,
        admin: isAdmin,
        userId: userId,
        isAuthLoading: false,
        initialized: true,
      });
    } catch (error) {
      console.error("❌ Erro no login:", error);
      clearGlobalAuthToken();
      set({
        isAuthenticated: false,
        userType: null,
        admin: false,
        userId: null,
        isAuthLoading: false,
        initialized: true,
      });
      throw error;
    }
  },

  logout: async (type) => {
    try {
      await logoutApi(type);
    } finally {
      clearGlobalAuthToken();
      set({
        isAuthenticated: false,
        userType: null,
        admin: false,
        userId: null,
        initialized: true,
      });
    }
  },

  initialize: () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      console.log("❌ Sem token");
      set({
        isAuthenticated: false,
        userType: null,
        admin: false,
        userId: null,
        isAuthLoading: false,
        initialized: true,
      });
      return;
    }

    try {
      const decoded = decodeJWT(token);
      const userId = decoded?.sub ? parseInt(decoded.sub, 10) : null;

      if (!decoded || !decoded.type || !userId) {
        console.log("❌ Token inválido");
        clearGlobalAuthToken();
        set({
          isAuthenticated: false,
          userType: null,
          admin: false,
          userId: null,
          isAuthLoading: false,
          initialized: true,
        });
        return;
      }

      const isAdmin = decoded.admin === true || decoded.admin === "true";

      set({
        isAuthenticated: true,
        userType: decoded.type,
        admin: isAdmin,
        userId: userId,
        isAuthLoading: false,
        initialized: true,
      });
    } catch (error) {
      console.error("❌ Erro ao inicializar:", error);
      clearGlobalAuthToken();
      set({
        isAuthenticated: false,
        userType: null,
        admin: false,
        userId: null,
        isAuthLoading: false,
        initialized: true,
      });
    }
  },
}));

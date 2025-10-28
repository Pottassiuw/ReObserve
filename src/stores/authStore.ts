import { create } from "zustand";
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
    credentials: { email?: string; cnpj?: string; senha: string },
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

  login: async (type, credentials) => {
    set({ isAuthLoading: true });
    try {
      const result = await loginApi(type, credentials);

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
    set({ isAuthLoading: true });

    try {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        set({
          isAuthenticated: false,
          userType: null,
          admin: false,
          userId: null,
          isAuthLoading: false,
        });
        return;
      }

      const decoded = decodeJWT(token);

      const userId = decoded?.sub ? parseInt(decoded.sub, 10) : null;

      if (!decoded || !decoded.type || !userId) {
        console.log("❌ Token inválido:", { decoded, userId });
        localStorage.removeItem("auth-token");
        set({
          isAuthenticated: false,
          userType: null,
          admin: false,
          userId: null,
          isAuthLoading: false,
        });
        return;
      }

      let isAdmin = false;

      if (decoded.type === "user") {
        try {
          const userData = await retornarUsuario(userId);
          isAdmin = Boolean(userData?.admin);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          localStorage.removeItem("auth-token");
          set({
            isAuthenticated: false,
            userType: null,
            admin: false,
            userId: null,
            isAuthLoading: false,
          });
          return;
        }
      }

      set({
        isAuthenticated: true,
        userType: decoded.type,
        admin: isAdmin,
        userId: userId,
        isAuthLoading: false,
      });
    } catch (error) {
      console.error("Erro no checkAuth:", error);
      set({
        isAuthenticated: false,
        userType: null,
        admin: false,
        userId: null,
        isAuthLoading: false,
      });
    }
  },
}));

useAuthStore.getState().checkAuth();

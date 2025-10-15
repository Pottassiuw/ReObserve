import { create } from "zustand";
import Cookies from "js-cookie";
import client from "@/api/client";

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userType: "user" | "enterprise" | null;
  admin: boolean;
  login: (type: "user" | "enterprise", data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userType: null,
  admin: false,
  isAuthLoading: true,

  // login
  login: async (type, data) => {
    const endpoint =
      type === "user" ? "/users/auth/login" : "/enterprises/auth/login";

    const response = await client.post(endpoint, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    const result = response.data;
    if (!result) throw new Error("Falha no login");

    if (result.token) {
      Cookies.set("auth-token", result.token, { expires: 7 });
    }

    const isUser = !!result.user;
    const isEnterprise = !!result.enterprise;

    if (isUser) {
      const admin = Boolean(result.user.admin);
      set({
        isAuthenticated: true,
        userType: "user",
        admin,
      });
    } else if (isEnterprise) {
      set({
        isAuthenticated: true,
        userType: "enterprise",
        admin: false,
      });
    } else {
      const auth = Boolean(result.token);
      set({
        isAuthenticated: auth,
        userType: auth ? type : null,
        admin: false,
      });
    }
  },

  // logout
  logout: () => {
    Cookies.remove("auth-token");
    set({ isAuthenticated: false, userType: null, admin: false });
  },

  checkAuth: () => {
    const token = Cookies.get("auth-token");
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false, userType: null, admin: false });
    }
    set({ isAuthLoading: false });
  },
}));

useAuthStore.getState().checkAuth();

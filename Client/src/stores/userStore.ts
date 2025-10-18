import { create } from "zustand";
import type { User } from "@/types";
import { retornarUsuario, deletarUsuario } from "@/api/endpoints/users";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  retornarUsuario: (id: number) => Promise<User | null>;
  deletarUsuario: (id: number) => Promise<void>;
  clearUser: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  retornarUsuario: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const usuario = await retornarUsuario(id);
      console.log("🎯 Dados recebidos do backend:", usuario); // LOG IMPORTANTE
      set({ user: usuario, isLoading: false });
      return usuario;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao buscar usuário";
      set({ error: errorMessage, isLoading: false, user: null });
      throw error;
    }
  },

  deletarUsuario: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deletarUsuario(id);
      set({ user: null, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao deletar usuário";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearUser: () => {
    set({ user: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

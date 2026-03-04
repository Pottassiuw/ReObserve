import { create } from "zustand";
import type { User } from "@/types";
import {
  retornarUsuario,
  deletarUsuario,
  retornarUsuarios,
} from "@/api/endpoints/users";
import { logDebug } from "@/utils/logger";

interface UserStore {
  user: User | User[] | null;
  isLoading: boolean;
  error: string | null;
  retornarUsuario: (id: number) => Promise<User | null>;
  retornarUsuarios: (empresaId: number) => Promise<User[] | null>;
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
      logDebug("Dados recebidos do backend", { usuario });
      set({ user: usuario, isLoading: false });
      return usuario;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao buscar usuário";
      set({ error: errorMessage, isLoading: false, user: null });
      throw error;
    }
  },
  retornarUsuarios: async (empresaId) => {
    set({ isLoading: true, error: null });
    try {
      const usuarios = await retornarUsuarios(empresaId);
      logDebug("Dados recebidos do backend", {
        count: usuarios.length,
        ids: usuarios.map((user) => user.id),
      });
      set({ user: usuarios.map((user) => ({ ...user })), isLoading: false });
      return usuarios;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao buscar usuários";
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

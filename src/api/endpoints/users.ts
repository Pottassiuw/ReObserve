import Client from "@/api/client";
import type { User } from "@/types";

export const retornarUsuario = async (id: number): Promise<User> => {
  try {
    if (!id) {
      throw new Error("ID do usuário não fornecido");
    }
    const response = await Client.get(`/users/${id}`);
    if (!response.data || !response.data.usuario) {
      throw new Error("Usuário não encontrado");
    }
    return response.data.usuario;
  } catch (error: any) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};
export const retornarUsuarios = async (empresaId: number): Promise<User[]> => {
  try {
    const response = await Client.get(`/enterprises/${empresaId}/users/`);
    if (!response || !response.data) {
      throw new Error("Empresa não existe");
    }
    const usuarios = response.data.users || response.data;

    return Array.isArray(usuarios) ? usuarios : [];
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
};
export const deletarUsuario = async (id: number): Promise<void> => {
  try {
    if (!id) {
      throw new Error("ID do usuário não fornecido");
    }
    const response = await Client.delete(`/users/${id}`);
    if (!response.data) {
      throw new Error("Usuário não encontrado para deletação");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao deletar usuário: ${error.message}`);
  }
};

import Client from "@/api/client";
import type { User } from "@/types";

export const retornarUsuario = async (id: number): Promise<User> => {
  try {
    if (!id) {
      throw new Error("ID do usuário não fornecido");
    }

    const response = await Client.get(`/users/${id}`);
    const usuario = response.data?.data;

    if (!response.data?.success || !usuario) {
      throw new Error(response.data?.message || "Usuário não encontrado");
    }

    return usuario;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Erro ao buscar usuário: ${error.message}`,
    );
  }
};
export const retornarUsuarios = async (empresaId: number): Promise<User[]> => {
  try {
    const response = await Client.get(`/enterprises/${empresaId}/users/`);
    const usuarios = response.data?.data;

    if (!response.data?.success || !Array.isArray(usuarios)) {
      throw new Error(response.data?.message || "Empresa não existe");
    }

    return usuarios;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Failed to fetch users: ${error.message}`,
    );
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

export const deletarUsuarioEmpresa = async (
  empresaId: number,
  userId: number,
): Promise<void> => {
  try {
    if (!empresaId || !userId) {
      throw new Error("IDs da empresa e do usuário são obrigatórios");
    }
    const response = await Client.delete(
      `/enterprises/${empresaId}/users/delete/${userId}`,
    );
    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.error || "Erro ao deletar usuário da empresa",
      );
    }
    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao deletar usuário: ${error.message}`);
  }
};

export const deletarTodosUsuariosEmpresa = async (
  empresaId: number,
): Promise<void> => {
  try {
    if (!empresaId) {
      throw new Error("ID da empresa é obrigatório");
    }
    const response = await Client.delete(
      `/enterprises/${empresaId}/users/delete/`,
    );
    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.error || "Erro ao deletar todos os usuários",
      );
    }
    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao deletar usuários: ${error.message}`);
  }
};

export const atualizarUsuario = async (
  id: number,
  data: { nome?: string; email?: string; senha?: string },
): Promise<User> => {
  try {
    if (!id) {
      throw new Error("ID do usuário é obrigatório");
    }
    const response = await Client.put(`/users/${id}`, data);
    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.error || "Erro ao atualizar usuário",
      );
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Erro ao atualizar usuário: ${error.message}`,
    );
  }
};

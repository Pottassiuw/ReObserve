import Client from "@/api/client";
import type { Enterprise } from "@/types";

export const retornarEmpresa = async (id: number): Promise<Enterprise> => {
  try {
    if (!id) {
      throw new Error("ID é obrigatório");
    }
    const response = await Client.get(`/enterprises/${id}`);
    if (!response || !response.data) {
      throw new Error("Nenhum dado recebido");
    }
    return response.data.enterprise || response.data.empresa;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Erro ao buscar empresa: ${error.message}`,
    );
  }
};

export const atualizarEmpresa = async (
  id: number,
  data: {
    razaoSocial?: string;
    nomeFantasia?: string;
    endereco?: string;
    situacaoCadastral?: string;
    naturezaJuridica?: string;
    CNAES?: string;
    senha?: string;
  },
): Promise<Enterprise> => {
  try {
    if (!id) {
      throw new Error("ID é obrigatório");
    }
    const response = await Client.put(`/enterprises/${id}`, data);
    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.error || "Erro ao atualizar empresa",
      );
    }
    return response.data.enterprise;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Erro ao atualizar empresa: ${error.message}`,
    );
  }
};

export const removerEmpresa = async (id: number): Promise<void> => {
  try {
    if (!id) {
      throw new Error("ID é obrigatório");
    }
    await Client.delete(`/enterprises/${id}`);
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Erro ao deletar empresa: ${error.message}`,
    );
  }
};
interface UserDataPayload {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  empresaId: number;
  grupoId: number;
}
export const criarUsuario = async (data: UserDataPayload) => {
  try {
    if (!data) {
      throw new Error("Dados são obrigatórios");
    }
    const response = await Client.post("/users/auth/register", data);
    if (!response || !response.data) {
      throw new Error("Nenhum dado recebido");
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
};

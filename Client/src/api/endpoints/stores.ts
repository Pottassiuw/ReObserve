import Client from "@/api/client";
import type { Enterprise } from "@/types";

export const retornarEmpresa = async (id: number): Promise<Enterprise> => {
  try {
    if (!id) {
      throw new Error("ID é obrigatório");
    }
    const response = await Client.get(`/enterprise/${id}`);
    if (!response || !response.data) {
      throw new Error("Nenhum dado recebido");
    }
    return response.data.empresa;
  } catch (error) {
    throw new Error(`Failed to fetch enterprise: ${error}`);
  }
};

export const removerEmpresa = async (id: number): Promise<void> => {
  try {
    if (!id) {
      throw new Error("ID é obrigatório");
    }
    await Client.delete(`/enterprise/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete enterprise: ${error}`);
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

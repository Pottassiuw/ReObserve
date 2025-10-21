import Client from "@/api/client";
import type { Grupo } from "@/types";
import { Permissoes } from "@/stores/permissionsStore";

interface GrupoPayload {
  nome: string;
  permissoes: Permissoes;
  empresaId: number;
}

export const criarGrupo = async (data: GrupoPayload) => {
  try {
    if (!data.nome) {
      throw new Error("Nome do grupo é obrigatório");
    } else if (!data.empresaId) {
      throw new Error("ID da empresa é obrigatório");
    } else if (!data.permissoes) {
      throw new Error("Permissões do grupo são obrigatórias");
    }
    const response = await Client.post(`/groups/enterprises/groups`, data);
    if (!response || !response.data) {
      throw new Error("Nenhum dado recebido");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Erro ao criar grupo: ${error.message}`,
    );
  }
};

export const listarGrupos = async (empresaId: number): Promise<Grupo[]> => {
  try {
    if (!empresaId) {
      throw new Error("ID da empresa é obrigatório");
    }
    const response = await Client.get(`/groups/enterprises/groups`);
    if (!response || !response.data) {
      throw new Error("Nenhum dado recebido");
    }
    console.log("📦 Resposta da API:", response.data);

    const grupos = response.data.data || response.data.grupos || response.data;

    console.log("📋 Grupos extraídos:", grupos);
    return Array.isArray(grupos) ? grupos : [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        `Erro ao buscar grupos: ${error.message}`,
    );
  }
};

//export const retornarGrupo = async (id: number): Promise<Grupo> => {
//  try {
//    if (!id) {
//      throw new Error("ID do grupo é obrigatório");
//    }
//    const response = await Client.get(`/groups/${id}`);
//    if (!response || !response.data) {
//      throw new Error("Nenhum dado recebido");
//    }
//    return response.data.grupo || response.data;
//  } catch (error: any) {
//    throw new Error(
//      error?.response?.data?.message ||
//        `Erro ao buscar grupo: ${error.message}`,
//    );
//  }
//};

export const deletarGrupo = async (id: number): Promise<void> => {
  try {
    if (!id) {
      throw new Error("Erro: Id não fornecido");
    }
    await Client.delete(`/groups/enterprises/groups/${id}`);
  } catch (error: any) {
    throw new Error("Erro em deletar o grupo!:", error.message);
  }
};

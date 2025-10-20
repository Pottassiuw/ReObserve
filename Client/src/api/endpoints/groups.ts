import Client from "@/api/client";
import type { Grupo } from "@/types";

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

export const retornarGrupo = async (id: number): Promise<Grupo> => {
  try {
    if (!id) {
      throw new Error("ID do grupo é obrigatório");
    }
    const response = await Client.get(`/grupos/${id}`);
    if (!response || !response.data) {
      throw new Error("Nenhum dado recebido");
    }
    return response.data.grupo || response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        `Erro ao buscar grupo: ${error.message}`,
    );
  }
};

import Client from "@/api/client";
import { logError } from "@/utils/logger";

export interface Period {
  id: number;
  dataInicio: string;
  dataFim: string;
  fechado: boolean;
  valorTotal: number;
  observacoes?: string;
  dataFechamento?: string;
  lancamentos?: any[];
}

export const listarPeriodos = async (): Promise<Period[]> => {
  try {
    const response = await Client.get("/periods");
    return response.data.data;
  } catch (error: any) {
    logError("Error listing periods", error);
    throw new Error(error.response?.data?.message || "Erro ao listar períodos");
  }
};

export const buscarPeriodo = async (id: number): Promise<Period> => {
  try {
    const response = await Client.get(`/periods/${id}`);
    return response.data.data;
  } catch (error: any) {
    logError("Error fetching period", error);
    throw new Error(error.response?.data?.message || "Erro ao buscar período");
  }
};

export const criarPeriodo = async (data: {
  dataInicio: string;
  dataFim: string;
  observacoes?: string;
}): Promise<Period> => {
  try {
    const response = await Client.post("/periods", data);
    return response.data.data;
  } catch (error: any) {
    logError("Error creating period", error);
    throw new Error(error.response?.data?.message || "Erro ao criar período");
  }
};

export const fecharPeriodo = async (
  id: number,
  data: {
    lancamentosIds: number[];
    observacoes?: string;
  },
): Promise<Period> => {
  try {
    const response = await Client.post(`/periods/${id}/close`, data);
    return response.data.data;
  } catch (error: any) {
    logError("Error closing period", error);
    throw new Error(error.response?.data?.message || "Erro ao fechar período");
  }
};

export const reabrirPeriodo = async (
  id: number,
  motivo?: string,
): Promise<Period> => {
  try {
    const response = await Client.post(`/periods/${id}/reopen`, { motivo });
    return response.data.data;
  } catch (error: any) {
    logError("Error reopening period", error);
    throw new Error(error.response?.data?.message || "Erro ao reabrir período");
  }
};

export const deletarPeriodo = async (id: number): Promise<void> => {
  try {
    await Client.delete(`/periods/${id}`);
  } catch (error: any) {
    logError("Error deleting period", error);
    throw new Error(error.response?.data?.message || "Erro ao deletar período");
  }
};

export const buscarLancamentosDisponiveis = async (): Promise<any[]> => {
  try {
    const response = await Client.get(`/periods/0/available-releases`);
    return response.data.data;
  } catch (error: any) {
    logError("Error fetching available releases", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar lançamentos disponíveis",
    );
  }
};

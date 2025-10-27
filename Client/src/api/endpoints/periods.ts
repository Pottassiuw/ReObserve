// src/api/endpoints/periods.ts
import Client from "@/api/client";
export interface Period {
  id: number;
  dataInicio: string;
  dataFim: string;
  fechado: boolean;
  valorTotal?: number;
  observacoes?: string;
  dataFechamento?: string;
  empresaId: number;
  lancamentos?: any[];
}
export interface CreatePeriodDTO {
  dataInicio: string;
  dataFim: string;
  observacoes?: string;
}
export interface ClosePeriodDTO {
  lancamentosIds: number[];
  observacoes?: string;
}
export const listarPeriodos = async (): Promise<Period[]> => {
  const response = await Client.get("/periods");
  return response.data?.data || response.data || [];
};
export const buscarPeriodo = async (id: number): Promise<Period> => {
  const response = await Client.get(`/periods/${id}`);
  return response.data?.data || response.data;
};
export const criarPeriodo = async (data: CreatePeriodDTO): Promise<Period> => {
  const response = await Client.post("/periods", data);
  return response.data?.data || response.data;
};
export const buscarLancamentosDisponiveis = async (
  periodoId: number,
): Promise<any[]> => {
  const response = await Client.get(`/periods/${periodoId}/available-releases`);
  return response.data?.data || response.data || [];
};
export const fecharPeriodo = async (
  id: number,
  data: ClosePeriodDTO,
): Promise<Period> => {
  const response = await Client.post(`/periods/${id}/close`, data);
  return response.data?.data || response.data;
};
export const reabrirPeriodo = async (
  id: number,
  motivo?: string,
): Promise<Period> => {
  const response = await Client.post(`/periods/${id}/reopen`, { motivo });
  return response.data?.data || response.data;
};
export const deletarPeriodo = async (id: number): Promise<void> => {
  await Client.delete(`/periods/${id}`);
};

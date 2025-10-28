import Client from "@/api/client";
import type { Period } from "@/stores/periodStore";

export interface CreatePeriodDTO {
  dataInicio: string;
  dataFim: string;
  observacoes?: string;
}

export interface ClosePeriodDTO {
  lancamentosIds: number[];
  observacoes?: string;
}

// Tipo da resposta da API (pode ser diferente do nosso Period interno)
interface PeriodAPIResponse {
  id: number;
  dataInicio: string;
  dataFim: string;
  fechado: boolean;
  valorTotal?: number;
  observacoes?: string;
  dataFechamento?: string;
  empresaId: number;
  fechadoPor?: number;
  quantidadeNotas?: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
  lancamentos?: any[];
}

// Função helper para normalizar a resposta da API
const normalizePeriod = (apiPeriod: PeriodAPIResponse): Period => {
  return {
    id: apiPeriod.id,
    dataInicio: apiPeriod.dataInicio,
    dataFim: apiPeriod.dataFim,
    status: apiPeriod.fechado ? "fechado" : "aberto",
    valorTotal: apiPeriod.valorTotal || 0,
    quantidadeNotas: apiPeriod.quantidadeNotas || 0,
    empresaId: apiPeriod.empresaId,
    fechadoPor: apiPeriod.fechadoPor,
    dataFechamento: apiPeriod.dataFechamento,
    dataCriacao: apiPeriod.dataCriacao || new Date().toISOString(),
    dataAtualizacao: apiPeriod.dataAtualizacao || new Date().toISOString(),
    observacoes: apiPeriod.observacoes,
  };
};

export const listarPeriodos = async (): Promise<Period[]> => {
  const response = await Client.get("/periods");
  const data = response.data?.data || response.data || [];
  return Array.isArray(data) ? data.map(normalizePeriod) : [];
};

export const buscarPeriodo = async (id: number): Promise<Period> => {
  const response = await Client.get(`/periods/${id}`);
  const data = response.data?.data || response.data;
  return normalizePeriod(data);
};

export const criarPeriodo = async (data: CreatePeriodDTO): Promise<Period> => {
  const response = await Client.post("/periods", data);
  const periodoData = response.data?.data || response.data;
  return normalizePeriod(periodoData);
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
  const periodoData = response.data?.data || response.data;
  return normalizePeriod(periodoData);
};

export const reabrirPeriodo = async (
  id: number,
  motivo?: string,
): Promise<Period> => {
  const response = await Client.post(`/periods/${id}/reopen`, { motivo });
  const periodoData = response.data?.data || response.data;
  return normalizePeriod(periodoData);
};

export const deletarPeriodo = async (id: number): Promise<void> => {
  await Client.delete(`/periods/${id}`);
};

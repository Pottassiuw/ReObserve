// src/Client/endpoints/periods.ts
import Client from "@/api/client";
import type { Period } from "@/stores/periodStore";

export const listarPeriodos = async (empresaId?: number): Promise<Period[]> => {
  const response = await Client.get("/periodos", {
    params: empresaId ? { empresaId } : undefined,
  });
  return response.data;
};

export const retornarPeriodo = async (id: number): Promise<Period> => {
  const response = await Client.get(`/periodos/${id}`);
  return response.data;
};

export const criarPeriodo = async (data: Partial<Period>): Promise<Period> => {
  const response = await Client.post("/periodos", data);
  return response.data;
};

export const atualizarPeriodo = async (
  id: number,
  data: Partial<Period>,
): Promise<Period> => {
  const response = await Client.put(`/periodos/${id}`, data);
  return response.data;
};

export const deletarPeriodo = async (id: number): Promise<void> => {
  await Client.delete(`/periodos/${id}`);
};

export const fecharPeriodo = async (
  id: number,
  observacoes?: string,
): Promise<Period> => {
  const response = await Client.post(`/periodos/${id}/fechar`, { observacoes });
  return response.data;
};

export const reabrirPeriodo = async (
  id: number,
  motivo?: string,
): Promise<Period> => {
  const response = await Client.post(`/periodos/${id}/reabrir`, { motivo });
  return response.data;
};

export const buscarPeriodoAtivo = async (
  empresaId: number,
): Promise<Period | null> => {
  const response = await Client.get("/periodos/ativo", {
    params: { empresaId },
  });
  return response.data;
};

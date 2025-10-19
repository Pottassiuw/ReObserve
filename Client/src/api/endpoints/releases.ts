import Client from "@/api/client";
import { uploadImagemAoStorage } from "@/utils/supabase-sdk"; // Importa do utils
import type { NotaFiscal, Lancamento } from "@/types";

export interface CriarLancamentoPayload {
  data_lancamento: string;
  latitude: number;
  longitude: number;
  notaFiscal: Omit<
    NotaFiscal,
    "id" | "dataCriacao" | "empresaId" | "lancamento"
  >;
  periodoId?: number | null; // Pode vir como number, string ou null do formulário

  // O crucial: O campo de arquivos que o usuário seleciona
  imagensFiles: File[];
}

export const listarLancamentos = async (
  empresaId?: number,
): Promise<Lancamento[]> => {
  const response = await Client.get("/Lancamentos", {
    params: empresaId ? { empresaId } : undefined,
  });
  return response.data;
};

export const retornarLancamento = async (id: number): Promise<Lancamento> => {
  const response = await Client.get(`/Lancamentos/${id}`);
  return response.data;
};

export const atualizarLancamento = async (
  id: number,
  data: Partial<Lancamento>,
): Promise<Lancamento> => {
  const response = await Client.put(`/Lancamentos/${id}`, data);
  return response.data;
};

export const deletarLancamento = async (id: number): Promise<void> => {
  await Client.delete(`/Lancamentos/${id}`);
};

export const uploadXML = async (
  file: File,
): Promise<{ xml: string; data: Partial<Lancamento> }> => {
  const formData = new FormData();
  formData.append("xml", file);
  const response = await Client.post("/Lancamentos/upload-xml", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const criarLancamentoComUpload = async (
  data: CriarLancamentoPayload,
): Promise<Lancamento> => {
  const { imagensFiles, ...dadosLancamento } = data;

  if (!imagensFiles || imagensFiles.length === 0) {
    throw new Error("Pelo menos uma imagem é obrigatória.");
  }

  console.log("Iniciando upload de imagens para o Supabase Storage...");
  const uploadPromises = imagensFiles.map((file) =>
    uploadImagemAoStorage(file),
  );
  const imageUrls = await Promise.all(uploadPromises);
  console.log("Uploads concluídos. URLs:", imageUrls);

  const dataParaBackend = {
    ...dadosLancamento,
    imageUrls,
  };

  const response = await Client.post("/Lancamentos", dataParaBackend);
  return response.data;
};

export const criarLancamento = async (
  data: Omit<CriarLancamentoPayload, "imagensFiles"> & { imageUrls: string[] },
): Promise<Lancamento> => {
  const response = await Client.post("/Lancamentos", data);
  return response.data;
};

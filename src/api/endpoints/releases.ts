import Client from "@/api/client";
import { uploadImagens } from "@/utils/supabase-sdk";
import type { Lancamento, CriarLancamentoDTO } from "@/types";

export interface CriarLancamentoBackendPayload {
  notaFiscal: {
    numero: string;
    valor: number;
    dataEmissao: string;
    xmlPath?: string;
  };
  data_lancamento: string;
  latitude: number;
  longitude: number;
  periodoId?: number;
  imagensUrls: string[];
  usuarioId: number;
  empresaId: number;
}

export const listarLancamentos = async (
  empresaId: number,
): Promise<Lancamento[]> => {
  const response = await Client.get(
    `/releases/enterprise/${empresaId}/releases`,
  );

  return response.data?.data || response.data || [];
};

export const retornarLancamento = async (id: number): Promise<Lancamento> => {
  const response = await Client.get(`/releases/${id}`);
  return response.data?.data || response.data;
};

export const atualizarLancamento = async (
  id: number,
  empresaId: number,
  data: Partial<CriarLancamentoDTO>,
): Promise<Lancamento> => {
  try {
    if (!id || !empresaId) {
      throw new Error("ID do lançamento e da empresa são obrigatórios");
    }

    const payload: any = {};

    // Construir objeto notaFiscal se houver dados relacionados
    if (data.valor !== undefined || data.dataEmissao || data.xmlPath !== undefined || data.numeroNotaFiscal) {
      payload.notaFiscal = {};
      if (data.valor !== undefined) {
        payload.notaFiscal.valor = data.valor;
      }
      if (data.dataEmissao) {
        payload.notaFiscal.dataEmissao = data.dataEmissao.toISOString();
      }
      if (data.xmlPath !== undefined) {
        payload.notaFiscal.xmlPath = data.xmlPath;
      }
      // Nota: numero não pode ser alterado normalmente, mas incluímos se fornecido
      if (data.numeroNotaFiscal) {
        payload.notaFiscal.numero = data.numeroNotaFiscal;
      }
    }

    if (data.data_lancamento) {
      payload.data_lancamento = data.data_lancamento.toISOString();
    }

    if (data.latitude !== undefined) {
      payload.latitude = data.latitude;
    }

    if (data.longitude !== undefined) {
      payload.longitude = data.longitude;
    }

    if (data.periodoId !== undefined) {
      payload.periodoId = data.periodoId;
    }

    if (data.imagensUrls && data.imagensUrls.length > 0) {
      const imagensUrls = await uploadImagens(data.imagensUrls as any);
      payload.imagensUrls = imagensUrls;
    }

    const response = await Client.put(
      `/releases/enterprise/${empresaId}/release/${id}`,
      payload,
    );

    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.error || "Erro ao atualizar lançamento",
      );
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Erro ao atualizar lançamento: ${error.message}`,
    );
  }
};

export const deletarLancamento = async (
  id: number,
  enterpriseId: number,
): Promise<void> => {
  await Client.delete(`/releases/enterprise/${enterpriseId}/release/${id}`);
};

export const uploadXML = async (
  file: File,
): Promise<{ xml: string; data: Partial<Lancamento> }> => {
  const formData = new FormData();
  formData.append("xml", file);
  const response = await Client.post("/releases/upload-xml", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data || response.data;
};

export const criarLancamento = async (
  data: CriarLancamentoDTO,
): Promise<Lancamento> => {
  console.log("📤 Criando lançamento...", data);

  if (!data.imagensUrls || data.imagensUrls.length === 0) {
    throw new Error("Pelo menos uma imagem é obrigatória.");
  }

  if (!data.empresaId) {
    throw new Error("ID da empresa é obrigatório.");
  }

  if (!data.usuarioId) {
    throw new Error("ID do usuário é obrigatório.");
  }

  console.log("📸 Enviando", data.imagensUrls.length, "URLs de imagens...");

  const payload: CriarLancamentoBackendPayload = {
    notaFiscal: {
      numero: data.numeroNotaFiscal,
      valor: data.valor,
      dataEmissao: data.dataEmissao.toISOString(),
      xmlPath: data.xmlPath,
    },
    data_lancamento: data.data_lancamento.toISOString(),
    latitude: data.latitude,
    longitude: data.longitude,
    periodoId: data.periodoId,
    imagensUrls: data.imagensUrls,
    usuarioId: data.usuarioId,
    empresaId: data.empresaId,
  };

  console.log("🚀 Enviando para o backend:", payload);

  const response = await Client.post("/releases/enterprise", payload);

  console.log("✅ Lançamento criado:", response.data);

  return response.data?.data || response.data;
};

import Client, { setGlobalAuthToken, clearGlobalAuthToken } from "@/api/client";
import { logError } from "@/utils/logger";

export type EnterprisePayload = {
  cnpj: string;
  senha: string;
};

export type UserPayload = {
  email: string;
  senha: string;
};

export interface EnterpriseLookupData {
  cnpj: string;
  nomeFantasia: string | null;
  razaoSocial: string;
  naturezaJuridica: string;
  endereco: string;
  CNAES: string;
  situacaoCadastral: string;
  telefone: string | null;
  email: string | null;
  responsavel: string | null;
  dataAbertura: string | null;
}

export const loginApi = async (
  type: "user" | "enterprise",
  credentials: { email?: string; cnpj?: string; senha: string },
) => {
  try {
    const endpoint = type === "user" ? "users" : "enterprises";
    const { data } = await Client.post(`/${endpoint}/auth/login`, credentials);

    if (!data?.token) throw new Error("Token não retornado pela API");

    setGlobalAuthToken(data.token);

    return data;
  } catch (error: any) {
    logError("Authentication error", error.response?.data || error.message);
    throw new Error("Falha no login.");
  }
};

export const logoutApi = async (type: "user" | "enterprise") => {
  const endpoint = type === "user" ? "users" : "enterprises";
  try {
    await Client.post(`/${endpoint}/auth/logout`);
    clearGlobalAuthToken();
  } catch (error: any) {
    logError("Logout error", error.response?.data || error.message);
    throw new Error("Falha no logout.");
  }
};

export const lookupEnterpriseByCNPJ = async (
  cnpj: string,
): Promise<EnterpriseLookupData> => {
  try {
    const cleanCNPJ = cnpj.replace(/\D/g, "");
    console.log(cleanCNPJ);
    const { data } = await Client.get(`/enterprises/cnpj/${cleanCNPJ}`);

    if (!data?.success || !data?.data) {
      throw new Error(data?.message || "Não foi possível buscar dados do CNPJ");
    }
    return data.data;
  } catch (error: any) {
    logError("CNPJ lookup error", error.response?.data || error.message);
    throw new Error(
      error?.response?.data?.message ||
        "Não foi possível buscar os dados do CNPJ no momento.",
    );
  }
};

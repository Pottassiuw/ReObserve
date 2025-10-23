import Client, { setGlobalAuthToken, clearGlobalAuthToken } from "@/api/client";

export type EnterprisePayload = {
  cnpj: string;
  senha: string;
};

export type UserPayload = {
  email: string;
  senha: string;
};

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
    console.error("Erro ao autenticar:", error.response?.data || error.message);
    throw new Error("Falha no login.");
  }
};

export const logoutApi = async (type: "user" | "enterprise") => {
  const endpoint = type === "user" ? "users" : "enterprises";
  try {
    await Client.post(`${endpoint}/auth/logout`);
    clearGlobalAuthToken();
  } catch (error: any) {
    console.error("Erro ao Deslogar:", error.response?.data || error.message);
    throw new Error("Falha no logout.");
  }
};

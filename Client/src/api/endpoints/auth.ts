import Client from "@/api/client";

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
  data: EnterprisePayload | UserPayload,
) => {
  try {
    const endpoint = type === "user" ? "users" : "enterprises";
    const response = await Client.post(`/${endpoint}/auth/login`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    await Client.post("/auth/logout", { withCredentials: true });
  } catch (error) {
    throw error;
  }
};

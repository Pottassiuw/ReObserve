import Client from "@/api/client";

export const retornarUsuario = async (id: number) => {
  try {
    if (!id) {
      throw new Error("ID do usuário não fornecido");
    }
    const response = await Client.get(`/users/${id}`);
    if (!response.data || !response.data.usuario) {
      throw new Error("Usuário não encontrado");
    }
    console.log("Usuário retornado:", response.data.usuario);
    return response.data.usuario;
  } catch (error: any) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

export const deletarUsuario = async (id: number) => {
  try {
    if (!id) {
      throw new Error("ID do usuário não fornecido");
    }
    const response = await Client.delete(`/users/${id}`);
    if (!response.data) {
      throw new Error("Usuário não encontrado para deletação");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao deletar usuário: ${error.message}`);
  }
};

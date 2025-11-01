import Client from "@/api/client";

export interface DashboardStats {
  receitaTotal: number;
  notasEmitidas: number;
  periodoAtual: {
    nome: string;
    status: string;
  } | null;
  pendencias: number;
}
export interface DadosMensais {
  mes: string;
  entradas: number;
  saidas: number;
}

export interface Atividade {
  id: number;
  type: "success" | "warning" | "info";
  message: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  dadosMensais: DadosMensais[];
  atividadesRecentes: Atividade[];
  categorias: { name: string; value: number }[];
}

export const buscarDadosDashboard = async (): Promise<DashboardData> => {
  try {
    const response = await Client.get("/enterprises/dashboard");
    if (!response || !response.data) {
      throw new Error("Nenhum dado recebido");
    }
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw new Error(`Failed to fetch dashboard data: ${error}`);
  }
};

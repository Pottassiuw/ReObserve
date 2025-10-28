import { removerEmpresa, retornarEmpresa } from "@/api/endpoints/stores";
import type { Enterprise } from "@/types";
import { create } from "zustand";
interface enterpriseStore {
  enterprise: Enterprise | null;
  getEnterprise: (id: number) => Promise<Enterprise | undefined>;
  removeEnterprise: (id: number) => void;
}

export const useEnterpriseStore = create<enterpriseStore>((set) => ({
  enterprise: null,

  getEnterprise: async (id) => {
    const enterprise = await retornarEmpresa(id);
    if (!enterprise) {
      throw new Error("Empresa não encontrada");
    }
    set({ enterprise });
    return enterprise;
  },

  removeEnterprise: async (id) => {
    await removerEmpresa(id);
    set({ enterprise: null });
  },
}));

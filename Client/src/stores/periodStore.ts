import { create } from "zustand";

export interface Period {
  id: number;
  dataInicio: string;
  dataFim: string;
  status: "aberto" | "fechado";
  valorTotal: number;
  quantidadeNotas: number;
  empresaId: number;
  fechadoPor?: number;
  dataFechamento?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  observacoes?: string;
}

interface PeriodStore {
  periods: Period[];
  currentPeriod: Period | null;
  isLoading: boolean;
  error: string | null;

  setPeriods: (periods: Period[]) => void;
  addPeriod: (period: Period) => void;
  updatePeriod: (id: number, data: Partial<Period>) => void;
  removePeriod: (id: number) => void;
  setCurrentPeriod: (period: Period | null) => void;
  closePeriod: (id: number) => void;
  reopenPeriod: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPeriods: () => void;
}

export const usePeriodStore = create<PeriodStore>((set) => ({
  periods: [],
  currentPeriod: null,
  isLoading: false,
  error: null,

  setPeriods: (periods) => set({ periods }),

  addPeriod: (period) =>
    set((state) => ({
      periods: [...state.periods, period],
    })),

  updatePeriod: (id, data) =>
    set((state) => ({
      periods: state.periods.map((period) =>
        period.id === id ? { ...period, ...data } : period,
      ),
    })),

  removePeriod: (id) =>
    set((state) => ({
      periods: state.periods.filter((period) => period.id !== id),
    })),

  setCurrentPeriod: (period) => set({ currentPeriod: period }),

  closePeriod: (id) =>
    set((state) => ({
      periods: state.periods.map((period) =>
        period.id === id
          ? {
              ...period,
              status: "fechado" as const,
              dataFechamento: new Date().toISOString(),
            }
          : period,
      ),
    })),

  reopenPeriod: (id) =>
    set((state) => ({
      periods: state.periods.map((period) =>
        period.id === id
          ? {
              ...period,
              status: "aberto" as const,
              dataFechamento: undefined,
            }
          : period,
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearPeriods: () => set({ periods: [], currentPeriod: null, error: null }),
}));

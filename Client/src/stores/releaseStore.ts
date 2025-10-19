// src/store/releaseStore.ts
import { create } from "zustand";

export interface Release {
  id: number;
  data_lancamento: string;
  latitude: number;
  longitude: number;
  dataCriacao: string;
  dataAtualizacao: string;
  periodoId?: number;
  notaFiscalId: number;
  usuarioId: number;
  empresaId: number;
  valor?: number;
  xml?: string;
  imagem?: string;
}

interface ReleaseStore {
  releases: Release[];
  currentRelease: Release | null;
  isLoading: boolean;
  error: string | null;

  setReleases: (releases: Release[]) => void;
  addRelease: (release: Release) => void;
  updateRelease: (id: number, data: Partial<Release>) => void;
  removeRelease: (id: number) => void;
  setCurrentRelease: (release: Release | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearReleases: () => void;
}

export const useReleaseStore = create<ReleaseStore>((set) => ({
  releases: [],
  currentRelease: null,
  isLoading: false,
  error: null,

  setReleases: (releases) => set({ releases }),

  addRelease: (release) =>
    set((state) => ({
      releases: [...state.releases, release],
    })),

  updateRelease: (id, data) =>
    set((state) => ({
      releases: state.releases.map((release) =>
        release.id === id ? { ...release, ...data } : release,
      ),
    })),

  removeRelease: (id) =>
    set((state) => ({
      releases: state.releases.filter((release) => release.id !== id),
    })),

  setCurrentRelease: (release) => set({ currentRelease: release }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearReleases: () => set({ releases: [], currentRelease: null, error: null }),
}));

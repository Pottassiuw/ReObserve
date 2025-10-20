import { create } from "zustand";
import type { Lancamento } from "@/types";

interface ReleaseStore {
  releases: Lancamento[];
  currentRelease: Lancamento | null;
  isLoading: boolean;
  error: string | null;

  setReleases: (releases: Lancamento[]) => void;
  addRelease: (release: Lancamento) => void;
  updateRelease: (id: number, data: Partial<Lancamento>) => void;
  removeRelease: (id: number) => void;
  setCurrentRelease: (release: Lancamento | null) => void;
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

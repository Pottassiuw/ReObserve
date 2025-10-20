import { useCallback } from "react";
import { useReleaseStore } from "@/stores/releaseStore";
import type { Lancamento } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import {
  listarLancamentos,
  retornarLancamento,
  criarLancamento,
  atualizarLancamento,
  deletarLancamento,
} from "@/api/endpoints/releases";

export const useReleasesManagement = () => {
  const {
    releases,
    currentRelease,
    isLoading,
    error,
    setReleases,
    addRelease,
    updateRelease,
    removeRelease,
    setCurrentRelease,
    setLoading,
    setError,
  } = useReleaseStore();

  const { userId, userType } = useAuthStore();
  const { canViewRelease, canCreateRelease, canEditRelease, canDeleteRelease } =
    usePermissionsStore();

  // Carregar lançamentos
  const loadReleases = useCallback(async () => {
    if (!canViewRelease()) {
      setError("Você não tem permissão para visualizar lançamentos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const empresaId = userType === "enterprise" ? userId : undefined;
      const data = await listarLancamentos(empresaId || undefined);

      // CORREÇÃO: Verificar se data é um array, caso contrário usar array vazio
      const releasesArray = Array.isArray(data) ? data : [];
      console.log("Dados recebidos da API:", data);
      console.log("Array de releases:", releasesArray);

      setReleases(releasesArray);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao carregar lançamentos";
      setError(message);
      console.error("Erro ao carregar lançamentos:", err);

      // CORREÇÃO: Em caso de erro, garantir que releases seja um array vazio
      setReleases([]);
    } finally {
      setLoading(false);
    }
  }, [canViewRelease, userId, userType, setReleases, setLoading, setError]);

  // Carregar lançamento específico
  const loadRelease = useCallback(
    async (id: number) => {
      if (!canViewRelease()) {
        setError("Você não tem permissão para visualizar este lançamento");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await retornarLancamento(id);
        setCurrentRelease(data);
        return data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao carregar lançamento";
        setError(message);
        console.error("Erro ao carregar lançamento:", err);
      } finally {
        setLoading(false);
      }
    },
    [canViewRelease, setCurrentRelease, setLoading, setError],
  );

  // Criar lançamento
  const createRelease = useCallback(
    async (data: Partial<Lancamento>) => {
      if (!canCreateRelease()) {
        setError("Você não tem permissão para criar lançamentos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        const newRelease = await criarLancamento(data);
        addRelease(newRelease);
        return newRelease;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao criar lançamento";
        setError(message);
        console.error("Erro ao criar lançamento:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canCreateRelease, addRelease, setLoading, setError],
  );

  // Atualizar lançamento
  const updateReleaseById = useCallback(
    async (id: number, data: Partial<Lancamento>) => {
      if (!canEditRelease()) {
        setError("Você não tem permissão para editar lançamentos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        const updated = await atualizarLancamento(id, data);
        updateRelease(id, updated);
        return updated;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao atualizar lançamento";
        setError(message);
        console.error("Erro ao atualizar lançamento:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canEditRelease, updateRelease, setLoading, setError],
  );

  // Deletar lançamento
  const deleteRelease = useCallback(
    async (id: number) => {
      if (!canDeleteRelease()) {
        setError("Você não tem permissão para deletar lançamentos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        await deletarLancamento(id);
        removeRelease(id);
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao deletar lançamento";
        setError(message);
        console.error("Erro ao deletar lançamento:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canDeleteRelease, removeRelease, setLoading, setError],
  );

  return {
    releases: Array.isArray(releases) ? releases : [], // CORREÇÃO: Garantir que sempre retorna um array
    currentRelease,
    isLoading,
    error,
    loadReleases,
    loadRelease,
    createRelease,
    updateRelease: updateReleaseById,
    deleteRelease,
    setCurrentRelease,
    // Permissões
    canCreate: canCreateRelease(),
    canView: canViewRelease(),
    canEdit: canEditRelease(),
    canDelete: canDeleteRelease(),
  };
};

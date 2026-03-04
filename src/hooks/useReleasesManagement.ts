import { useCallback } from "react";
import { useReleaseStore } from "@/stores/releaseStore";
import type { CriarLancamentoDTO, Lancamento } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { logError, logInfo } from "@/utils/logger";
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

  if (!userId) throw new Error("Id deve ser fornecido");

  const loadReleases = useCallback(async () => {
    if (!canViewRelease()) {
      setError("Você não tem permissão para visualizar lançamentos");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      logInfo("Loading releases", { userType, userId });
      const data = await listarLancamentos(userId);
      const releasesArray = Array.isArray(data) ? data : [];
      logInfo("Releases loaded", { count: releasesArray.length });
      setReleases(releasesArray);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Erro ao carregar lançamentos";
      setError(message);
      logError("Error loading releases", err);
      setReleases([]);
    } finally {
      setLoading(false);
    }
  }, [canViewRelease, userId, setReleases, setLoading, setError]);

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
        logError("Error loading release", err);
      } finally {
        setLoading(false);
      }
    },
    [canViewRelease, setCurrentRelease, setLoading, setError],
  );

  const createRelease = useCallback(
    async (data: CriarLancamentoDTO) => {
      if (!canCreateRelease()) {
        setError("Você não tem permissão para criar lançamentos");
        throw new Error("Sem permissão");
      }
      const releaseData: CriarLancamentoDTO = {
        ...data,
        empresaId: userId,
        usuarioId: userType === "user" ? userId : undefined,
      };
      setLoading(true);
      setError(null);
      try {
        const newRelease = await criarLancamento(releaseData);
        addRelease(newRelease);
        return newRelease;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Erro ao criar lançamento";
        setError(message);
        logError("Error creating release", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canCreateRelease, userId, userType, addRelease, setLoading, setError],
  );

  const updateReleaseById = useCallback(
    async (id: number, data: Partial<Lancamento>) => {
      if (!canEditRelease()) {
        setError("Você não tem permissão para editar lançamentos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        const updated = await atualizarLancamento(
          id,
          userId,
          data as Partial<CriarLancamentoDTO>,
        );
        updateRelease(id, updated);
        return updated;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao atualizar lançamento";
        setError(message);
        logError("Error updating release", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canEditRelease, userId, updateRelease, setLoading, setError],
  );

  const deleteRelease = useCallback(
    async (id: number) => {
      if (!canDeleteRelease()) {
        setError("Você não tem permissão para deletar lançamentos");
        throw new Error("Sem permissão");
      }
      setLoading(true);
      setError(null);
      try {
        await deletarLancamento(id, userId);
        removeRelease(id);
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao deletar lançamento";
        setError(message);
        logError("Error deleting release", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canDeleteRelease, userId, removeRelease, setLoading, setError],
  );

  return {
    releases: Array.isArray(releases) ? releases : [],
    currentRelease,
    isLoading,
    error,
    loadReleases,
    loadRelease,
    createRelease,
    updateRelease: updateReleaseById,
    deleteRelease,
    setCurrentRelease,
    canCreate: canCreateRelease(),
    canView: canViewRelease(),
    canEdit: canEditRelease(),
    canDelete: canDeleteRelease(),
    empresaId: userId,
    usuarioId: userId,
  };
};

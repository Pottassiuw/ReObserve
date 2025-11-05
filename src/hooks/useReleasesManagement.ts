import { useCallback } from "react";
import { useReleaseStore } from "@/stores/releaseStore";
import type { CriarLancamentoDTO, Lancamento } from "@/types";
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
  if (!userId) throw new Error("Id deve ser fornecido");
  const getEmpresaId = useCallback((): number => {
    if (userType === "enterprise") {
      return userId; 
    }
    return userId;
  }, [userId, userType]);

  const loadReleases = useCallback(async () => {
    if (!canViewRelease()) {
      setError("Você não tem permissão para visualizar lançamentos");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const empresaId = getEmpresaId();

      console.log("🔍 Carregando releases...", {
        userType,
        userId,
        empresaId,
      });
      const data = await listarLancamentos(empresaId);
      console.log(data);
      const releasesArray = Array.isArray(data) ? data : [];
      console.log("✅ Releases carregados:", releasesArray.length);
      setReleases(releasesArray);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Erro ao carregar lançamentos";
      setError(message);
      console.error("❌ Erro ao carregar lançamentos:", err);
      setReleases([]);
    } finally {
      setLoading(false);
    }
  }, [
    canViewRelease,
    userId,
    userType,
    getEmpresaId,
    setReleases,
    setLoading,
    setError,
  ]);
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
  const createRelease = useCallback(
    async (data: CriarLancamentoDTO) => {
      if (!canCreateRelease()) {
        setError("Você não tem permissão para criar lançamentos");
        throw new Error("Sem permissão");
      }
      const empresaId = getEmpresaId();
      const releaseData: CriarLancamentoDTO = {
        ...data,
        usuarioId: userId,
        empresaId: empresaId,
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
        console.error("❌ Erro ao criar lançamento:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canCreateRelease, userId, getEmpresaId, addRelease, setLoading, setError],
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
        const empresaId = getEmpresaId();
        const updated = await atualizarLancamento(
          id,
          empresaId,
          data as Partial<CriarLancamentoDTO>,
        );
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
    [canEditRelease, getEmpresaId, updateRelease, setLoading, setError],
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
        console.error("Erro ao deletar lançamento:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canDeleteRelease, removeRelease, setLoading, setError],
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
    // Permissões
    canCreate: canCreateRelease(),
    canView: canViewRelease(),
    canEdit: canEditRelease(),
    canDelete: canDeleteRelease(),
    // Expor empresaId e userId para uso nos componentes
    empresaId: getEmpresaId(),
    usuarioId: userId,
  };
};

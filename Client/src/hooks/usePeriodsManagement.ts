import { useCallback } from "react";
import { usePeriodStore, type Period } from "@/stores/periodStore";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import {
  listarPeriodos,
  criarPeriodo,
  deletarPeriodo,
  fecharPeriodo,
  reabrirPeriodo,
} from "@/api/endpoints/periods";

export const usePeriodsManagement = () => {
  const {
    periods,
    currentPeriod,
    isLoading,
    error,
    setPeriods,
    addPeriod,
    updatePeriod,
    removePeriod,
    setCurrentPeriod,
    closePeriod: closeLocalPeriod,
    reopenPeriod: reopenLocalPeriod,
    setLoading,
    setError,
  } = usePeriodStore();

  const { userId, userType } = useAuthStore();
  const { canViewPeriod, canCreatePeriod, canEditPeriod, canDeletePeriod } =
    usePermissionsStore();

  // Carregar períodos
  const loadPeriods = useCallback(async () => {
    if (!canViewPeriod()) {
      setError("Você não tem permissão para visualizar períodos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listarPeriodos();
      setPeriods(data);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao carregar períodos";
      setError(message);
      console.error("Erro ao carregar períodos:", err);
    } finally {
      setLoading(false);
    }
  }, [canViewPeriod, userId, userType, setPeriods, setLoading, setError]);

  // Carregar período específico
  const loadPeriod = useCallback(
    async (id: number) => {
      if (!canViewPeriod()) {
        setError("Você não tem permissão para visualizar este período");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await retornarPeriodo(id);
        setCurrentPeriod(data);
        return data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao carregar período";
        setError(message);
        console.error("Erro ao carregar período:", err);
      } finally {
        setLoading(false);
      }
    },
    [canViewPeriod, setCurrentPeriod, setLoading, setError],
  );

  // Criar período
  const createPeriod = useCallback(
    async (data: Partial<Period>) => {
      if (!canCreatePeriod()) {
        setError("Você não tem permissão para criar períodos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        const newPeriod = await criarPeriodo(data);
        addPeriod(newPeriod);
        return newPeriod;
      } catch (err: any) {
        const message = err.response?.data?.message || "Erro ao criar período";
        setError(message);
        console.error("Erro ao criar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canCreatePeriod, addPeriod, setLoading, setError],
  );

  // Atualizar período
  const updatePeriodById = useCallback(
    async (id: number, data: Partial<Period>) => {
      if (!canEditPeriod()) {
        setError("Você não tem permissão para editar períodos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        const updated = await atualizarPeriodo(id, data);
        updatePeriod(id, updated);
        return updated;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao atualizar período";
        setError(message);
        console.error("Erro ao atualizar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canEditPeriod, updatePeriod, setLoading, setError],
  );

  // Deletar período
  const deletePeriod = useCallback(
    async (id: number) => {
      if (!canDeletePeriod()) {
        setError("Você não tem permissão para deletar períodos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        await deletarPeriodo(id);
        removePeriod(id);
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao deletar período";
        setError(message);
        console.error("Erro ao deletar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canDeletePeriod, removePeriod, setLoading, setError],
  );

  // Fechar período
  const closePeriod = useCallback(
    async (id: number, observacoes?: string) => {
      if (!canEditPeriod()) {
        setError("Você não tem permissão para fechar períodos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        const updated = await fecharPeriodo(id, observacoes);
        closeLocalPeriod(id);
        return updated;
      } catch (err: any) {
        const message = err.response?.data?.message || "Erro ao fechar período";
        setError(message);
        console.error("Erro ao fechar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canEditPeriod, closeLocalPeriod, setLoading, setError],
  );

  // Reabrir período
  const reopenPeriod = useCallback(
    async (id: number, motivo?: string) => {
      if (!canEditPeriod()) {
        setError("Você não tem permissão para reabrir períodos");
        throw new Error("Sem permissão");
      }

      setLoading(true);
      setError(null);

      try {
        const updated = await reabrirPeriodo(id, motivo);
        reopenLocalPeriod(id);
        return updated;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Erro ao reabrir período";
        setError(message);
        console.error("Erro ao reabrir período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canEditPeriod, reopenLocalPeriod, setLoading, setError],
  );

  return {
    periods,
    currentPeriod,
    isLoading,
    error,
    loadPeriods,
    loadPeriod,
    createPeriod,
    updatePeriod: updatePeriodById,
    deletePeriod,
    closePeriod,
    reopenPeriod,
    setCurrentPeriod,
    // Permissões
    canCreate: canCreatePeriod(),
    canView: canViewPeriod(),
    canEdit: canEditPeriod(),
    canDelete: canDeletePeriod(),
  };
};

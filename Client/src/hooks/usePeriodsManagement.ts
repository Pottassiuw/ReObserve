// hooks/usePeriodsManagement.ts
import { useCallback } from "react";
import { toast } from "sonner";
import { usePeriodStore } from "@/stores/periodStore";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import {
  listarPeriodos,
  buscarPeriodo,
  criarPeriodo,
  deletarPeriodo,
  fecharPeriodo,
  reabrirPeriodo,
  type Period,
  type CreatePeriodDTO,
  type ClosePeriodDTO,
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
    setLoading,
    setError,
  } = usePeriodStore();

  const { userId, userType } = useAuthStore();
  const { canViewPeriod, canCreatePeriod, canEditPeriod, canDeletePeriod } =
    usePermissionsStore();

  // Helper para verificar permissões
  const checkPermission = useCallback(
    (permissionCheck: () => boolean, action: string) => {
      if (!permissionCheck()) {
        const message = `Você não tem permissão para ${action}`;
        setError(message);
        toast.error(message);
        throw new Error(message);
      }
    },
    [setError],
  );

  // Carregar todos os períodos
  const loadPeriods = useCallback(async () => {
    try {
      checkPermission(canViewPeriod, "visualizar períodos");
      setLoading(true);
      setError(null);

      const data = await listarPeriodos();
      setPeriods(data);
      return data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Erro ao carregar períodos";
      setError(message);
      console.error("Erro ao carregar períodos:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [canViewPeriod, checkPermission, setPeriods, setLoading, setError]);

  // Carregar período específico
  const loadPeriod = useCallback(
    async (id: number) => {
      try {
        checkPermission(canViewPeriod, "visualizar este período");
        setLoading(true);
        setError(null);

        const data = await buscarPeriodo(id);
        setCurrentPeriod(data);
        return data;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Erro ao carregar período";
        setError(message);
        console.error("Erro ao carregar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canViewPeriod, checkPermission, setCurrentPeriod, setLoading, setError],
  );

  // Criar período
  const createPeriod = useCallback(
    async (data: CreatePeriodDTO) => {
      try {
        checkPermission(canCreatePeriod, "criar períodos");
        setLoading(true);
        setError(null);

        const newPeriod = await criarPeriodo(data);
        addPeriod(newPeriod);
        toast.success("Período criado com sucesso!");
        return newPeriod;
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || "Erro ao criar período";
        setError(message);
        if (!err.message.includes("permissão")) {
          toast.error(message);
        }
        console.error("Erro ao criar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canCreatePeriod, checkPermission, addPeriod, setLoading, setError],
  );

  // Deletar período
  const deletePeriod = useCallback(
    async (id: number) => {
      try {
        checkPermission(canDeletePeriod, "deletar períodos");
        setLoading(true);
        setError(null);

        await deletarPeriodo(id);
        removePeriod(id);
        toast.success("Período deletado com sucesso!");
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Erro ao deletar período";
        setError(message);
        if (!err.message.includes("permissão")) {
          toast.error(message);
        }
        console.error("Erro ao deletar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canDeletePeriod, checkPermission, removePeriod, setLoading, setError],
  );

  // Fechar período (nova implementação)
  const closePeriod = useCallback(
    async (id: number, data: ClosePeriodDTO) => {
      try {
        checkPermission(canEditPeriod, "fechar períodos");
        setLoading(true);
        setError(null);

        const updated = await fecharPeriodo(id, data);
        updatePeriod(id, updated);
        toast.success("Período fechado com sucesso!");
        return updated;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Erro ao fechar período";
        setError(message);
        if (!err.message.includes("permissão")) {
          toast.error(message);
        }
        console.error("Erro ao fechar período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canEditPeriod, checkPermission, updatePeriod, setLoading, setError],
  );

  // Reabrir período
  const reopenPeriod = useCallback(
    async (id: number, motivo?: string) => {
      try {
        checkPermission(canEditPeriod, "reabrir períodos");
        setLoading(true);
        setError(null);

        const updated = await reabrirPeriodo(id, motivo);
        updatePeriod(id, updated);
        toast.success("Período reaberto com sucesso!");
        return updated;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Erro ao reabrir período";
        setError(message);
        if (!err.message.includes("permissão")) {
          toast.error(message);
        }
        console.error("Erro ao reabrir período:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [canEditPeriod, checkPermission, updatePeriod, setLoading, setError],
  );

  return {
    // Estado
    periods,
    currentPeriod,
    isLoading,
    error,

    // Ações
    loadPeriods,
    loadPeriod,
    createPeriod,
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

import { useState, useEffect, useCallback } from "react";
import { deletarGrupo, listarGrupos } from "@/api/endpoints/groups";
import type { Grupo } from "@/types";
import { useAuthStore } from "@/stores/authStore";
export const useGroups = () => {
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, userType } = useAuthStore();

  const loadGroups = useCallback(async () => {
    if (userType !== "enterprise" || !userId) {
      setError("Apenas empresas podem carregar grupos");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await listarGrupos(userId);
      console.log("📦 Grupos carregados:", data);
      setGroups(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const message = err.message || "Erro ao carregar grupos";
      setError(message);
      console.error("Erro ao carregar grupos:", err);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userType]);

  useEffect(() => {
    if (userType === "enterprise" && userId) {
      loadGroups();
    }
  }, [userType, userId, loadGroups]);

  return {
    groups,
    isLoading,
    error,
    loadGroups,
  };
};

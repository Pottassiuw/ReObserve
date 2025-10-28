import { useState, useEffect, useCallback } from "react";
import { deletarGrupo, listarGrupos, criarGrupo } from "@/api/endpoints/groups";
import type { Grupo } from "@/types";
import { toast } from "sonner";

interface UseGroupsProps {
  empresaId?: number;
  autoLoad?: boolean;
}

interface UseGroupsReturn {
  grupos: Grupo[];
  isLoading: boolean;
  error: string | null;
  loadGrupos: () => Promise<void>;
  deleteGrupo: (id: number) => Promise<void>;
  createGrupo: (data: {
    nome: string;
    permissoes: string[];
    empresaId: number;
  }) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGroups = ({
  empresaId,
  autoLoad = true,
}: UseGroupsProps = {}): UseGroupsReturn => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGrupos = useCallback(async () => {
    if (!empresaId) {
      setError("ID da empresa é obrigatório");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listarGrupos(empresaId);
      setGrupos(data);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao carregar grupos";
      setError(errorMessage);
      console.error("Erro ao carregar grupos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [empresaId]);

  const deleteGrupo = useCallback(async (id: number) => {
    if (!id) {
      toast.error("ID do grupo não fornecido");
      return;
    }

    const toastId = toast.loading("Deletando grupo...");

    try {
      await deletarGrupo(id);
      toast.success("Grupo deletado com sucesso!", { id: toastId });

      // Atualiza a lista local removendo o grupo deletado
      setGrupos((prev) => prev.filter((grupo) => grupo.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao deletar grupo";
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
      throw err;
    }
  }, []);

  const createGrupo = useCallback(
    async (data: { nome: string; permissoes: string[]; empresaId: number }) => {
      const toastId = toast.loading("Criando grupo...");

      try {
        const novoGrupo = await criarGrupo(data);
        toast.success("Grupo criado com sucesso!", { id: toastId });
        // Recarrega a lista de grupos
        await loadGrupos();
        return novoGrupo;
      } catch (err: any) {
        const errorMessage = err.message || "Erro ao criar grupo";
        toast.error(errorMessage, { id: toastId });
        setError(errorMessage);
        throw err;
      }
    },
    [loadGrupos],
  );

  const refetch = useCallback(async () => {
    await loadGrupos();
  }, [loadGrupos]);

  useEffect(() => {
    if (autoLoad && empresaId) {
      loadGrupos();
    }
  }, [autoLoad, empresaId, loadGrupos]);

  return {
    grupos,
    isLoading,
    error,
    loadGrupos,
    deleteGrupo,
    createGrupo,
    refetch,
  };
};

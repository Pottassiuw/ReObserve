// src/hooks/usePermissionsLoader.ts
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore, Permissoes } from "@/stores/permissionsStore";
import { retornarUsuario } from "@/api/endpoints/users";

/**
 * Hook para carregar as permissões do usuário logado
 * Deve ser usado no componente raiz da aplicação ou em um provider
 */
export const usePermissionsLoader = () => {
  const { userId, userType, isAuthenticated, admin } = useAuthStore();
  const { setPermissions, clearPermissions } = usePermissionsStore();

  useEffect(() => {
    const loadUserPermissions = async () => {
      if (!isAuthenticated || !userId) {
        clearPermissions();
        return;
      }

      // Empresa tem todas as permissões
      if (userType === "enterprise") {
        setPermissions([
          Permissoes.admin,
          Permissoes.lancamento,
          Permissoes.periodo,
          Permissoes.verLancamentos,
          Permissoes.editarLancamentos,
          Permissoes.verPeriodos,
          Permissoes.editarPeriodos,
          Permissoes.deletarLancamentos,
          Permissoes.deletarPeriodos,
        ]);
        return;
      }

      // Para usuários, carregar permissões do backend
      if (userType === "user") {
        try {
          const userData = await retornarUsuario(userId);

          // Se não tiver grupo, apenas permissões básicas
          if (!userData?.grupo?.permissoes) {
            setPermissions([Permissoes.lancamento, Permissoes.verLancamentos]);
            return;
          }

          // Converter as permissões do grupo para o enum
          const permissions: Permissoes[] = userData.grupo.permissoes
            .map((perm: string) => Permissoes[perm as keyof typeof Permissoes])
            .filter(Boolean);

          setPermissions(permissions);

          console.log("✅ Permissões carregadas:", permissions);
        } catch (error) {
          console.error("Erro ao carregar permissões:", error);
          // Em caso de erro, dar permissões mínimas
          setPermissions([Permissoes.lancamento, Permissoes.verLancamentos]);
        }
      }
    };

    loadUserPermissions();
  }, [
    userId,
    userType,
    isAuthenticated,
    admin,
    setPermissions,
    clearPermissions,
  ]);
};

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore, Permissoes } from "@/stores/permissionsStore";
import { retornarUsuario } from "@/api/endpoints/users";

export const usePermissionsLoader = () => {
  const { userId, userType, isAuthenticated } = useAuthStore();
  const { setPermissions, clearPermissions, setPermissionsLoaded } =
    usePermissionsStore();

  useEffect(() => {
    const loadUserPermissions = async () => {
      if (!isAuthenticated || !userId) {
        clearPermissions();
        setPermissionsLoaded(false);
        return;
      }

      try {
        console.log("🔄 Carregando permissões para:", { userId, userType });

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
          setPermissionsLoaded(true);
          console.log("✅ Permissões de empresa carregadas");
          return;
        }

        if (userType === "user") {
          const userData = await retornarUsuario(userId);

          if (userData.admin) {
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
            setPermissionsLoaded(true);
            console.log("✅ Permissões de admin carregadas");
            return;
          }

          if (!userData?.grupo?.permissoes) {
            setPermissions([Permissoes.lancamento, Permissoes.verLancamentos]);
            setPermissionsLoaded(true);
            console.log("✅ Permissões básicas carregadas");
            return;
          }

          const permissions: Permissoes[] = userData.grupo.permissoes
            .map((perm: string) => Permissoes[perm as keyof typeof Permissoes])
            .filter(Boolean);

          setPermissions(permissions);
          setPermissionsLoaded(true);
          console.log("✅ Permissões do grupo carregadas:", permissions);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar permissões:", error);
        setPermissions([Permissoes.lancamento, Permissoes.verLancamentos]);
        setPermissionsLoaded(true);
      }
    };

    loadUserPermissions();
  }, [userId, userType, isAuthenticated]);
};

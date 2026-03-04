import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore, Permissoes } from "@/stores/permissionsStore";
import { logInfo, logError } from "@/utils/logger";
import { retornarUsuario } from "@/api/endpoints/users";
import { ALL_PERMISSIONS, BASIC_PERMISSIONS } from "@/constants";

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
        logInfo("Loading permissions", { userId, userType });

        if (userType === "enterprise") {
          setPermissions(ALL_PERMISSIONS);
          setPermissionsLoaded(true);
          logInfo("Enterprise permissions loaded");
          return;
        }

        if (userType === "user") {
          const userData = await retornarUsuario(userId);

          if (userData.admin) {
            setPermissions(ALL_PERMISSIONS);
            setPermissionsLoaded(true);
            logInfo("Admin permissions loaded");
            return;
          }

          if (!userData?.grupo?.permissoes) {
            setPermissions(BASIC_PERMISSIONS);
            setPermissionsLoaded(true);
            logInfo("Basic permissions loaded");
            return;
          }

          const permissions: Permissoes[] = userData.grupo.permissoes
            .map((perm: string) => Permissoes[perm as keyof typeof Permissoes])
            .filter(Boolean);

          setPermissions(permissions);
          setPermissionsLoaded(true);
          logInfo("Group permissions loaded", { count: permissions.length });
        }
      } catch (error) {
        logError("Error loading permissions", error);
        setPermissions(BASIC_PERMISSIONS);
        setPermissionsLoaded(true);
      }
    };

    loadUserPermissions();
  }, [userId, userType, isAuthenticated]);
};

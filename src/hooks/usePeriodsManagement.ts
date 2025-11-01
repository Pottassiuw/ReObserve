// hooks/usePeriodsManagement.ts
import { usePermissionsStore } from "@/stores/permissionsStore";

/**
 * Hook SUPER simplificado apenas para verificar permissões
 * Todo o resto é feito diretamente no componente com useState
 */
export const usePeriodsManagement = () => {
  const { canViewPeriod, canCreatePeriod, canEditPeriod, canDeletePeriod } =
    usePermissionsStore();

  return {
    // Permissões (apenas isso!)
    canCreate: canCreatePeriod(),
    canView: canViewPeriod(),
    canEdit: canEditPeriod(),
    canDelete: canDeletePeriod(),
  };
};

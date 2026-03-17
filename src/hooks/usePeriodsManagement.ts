// hooks/usePeriodsManagement.ts
import { usePermissionsStore } from "@/stores/permissionsStore";

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

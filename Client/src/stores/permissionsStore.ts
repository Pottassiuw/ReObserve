import { create } from "zustand";

export enum Permissoes {
  admin = "admin",
  lancamento = "lancamento",
  periodo = "periodo",
  verLancamentos = "verLancamentos",
  editarLancamentos = "editarLancamentos",
  verPeriodos = "verPeriodos",
  editarPeriodos = "editarPeriodos",
  deletarLancamentos = "deletarLancamentos",
  deletarPeriodos = "deletarPeriodos",
}

interface PermissionsStore {
  permissions: Permissoes[];
  isLoading: boolean;

  setPermissions: (permissions: Permissoes[]) => void;
  hasPermission: (permission: Permissoes) => boolean;
  hasAnyPermission: (permissions: Permissoes[]) => boolean;
  hasAllPermissions: (permissions: Permissoes[]) => boolean;
  clearPermissions: () => void;

  // Helpers para verificações comuns
  canCreateRelease: () => boolean;
  canViewRelease: () => boolean;
  canEditRelease: () => boolean;
  canDeleteRelease: () => boolean;
  canCreatePeriod: () => boolean;
  canViewPeriod: () => boolean;
  canEditPeriod: () => boolean;
  canDeletePeriod: () => boolean;
  isAdmin: () => boolean;
}

export const usePermissionsStore = create<PermissionsStore>((set, get) => ({
  permissions: [],
  isLoading: false,

  setPermissions: (permissions) => set({ permissions }),

  hasPermission: (permission) => {
    const { permissions } = get();
    // Admin tem todas as permissões
    if (permissions.includes(Permissoes.admin)) return true;
    return permissions.includes(permission);
  },

  hasAnyPermission: (requiredPermissions) => {
    const { hasPermission } = get();
    return requiredPermissions.some((perm) => hasPermission(perm));
  },

  hasAllPermissions: (requiredPermissions) => {
    const { hasPermission } = get();
    return requiredPermissions.every((perm) => hasPermission(perm));
  },

  clearPermissions: () => set({ permissions: [] }),

  // Helpers
  canCreateRelease: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.lancamento);
  },

  canViewRelease: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.verLancamentos);
  },

  canEditRelease: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.editarLancamentos);
  },

  canDeleteRelease: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.deletarLancamentos);
  },

  canCreatePeriod: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.periodo);
  },

  canViewPeriod: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.verPeriodos);
  },

  canEditPeriod: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.editarPeriodos);
  },

  canDeletePeriod: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.deletarPeriodos);
  },

  isAdmin: () => {
    const { hasPermission } = get();
    return hasPermission(Permissoes.admin);
  },
}));

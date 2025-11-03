import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import type { ReactElement } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactElement;
  requirePermission?: () => boolean;
  requireEnterprise?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requirePermission,
  requireEnterprise,
  requireAdmin,
}: Props) {
  const {
    isAuthenticated,
    userId,
    userType,
    initialized,
    isAuthLoading,
  } = useAuthStore();
  const { permissionsLoaded, isAdmin } = usePermissionsStore();

  if (!initialized || isAuthLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-lg font-semibold text-indigo-900">
          Verificando autenticação...
        </p>
      </div>
    );
  }

  // Não autenticado? Redireciona
  if (!isAuthenticated || !userId) {
    toast.warning("Você precisa fazer login para acessar esta página");
    const loginPath =
      userType === "enterprise" ? "/enterprise/login" : "/user/login";
    return <Navigate to={loginPath} replace />;
  }

  if (!permissionsLoaded) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-lg font-semibold text-indigo-900">
          Carregando permissões...
        </p>
      </div>
    );
  }

  // Verifica se requer empresa
  if (requireEnterprise && userType !== "enterprise") {
    toast.error("Acesso negado! Esta página é exclusiva para empresas.");
    return <Navigate to="/dashboard" replace />;
  }

  // Verifica se requer admin
  if (requireAdmin && !isAdmin()) {
    toast.error("Acesso negado! Você não tem permissão de administrador.");
    return <Navigate to="/dashboard" replace />;
  }

  // Verifica permissão personalizada
  if (requirePermission && !requirePermission()) {
    toast.error("Acesso negado! Você não tem permissão para acessar esta página.");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
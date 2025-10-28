import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { ReactElement } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactElement;
  adminOnly?: boolean;
}
export default function ProtectedRoute({ children, adminOnly }: Props) {
  const { isAuthenticated, admin, isAuthLoading } = useAuthStore();

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-bold text-indigo-500">Carregando...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    toast.warning("Você não está autenticado!");
    return <Navigate to="/user/login" replace />;
  }

  if (adminOnly && !admin) {
    toast.warning("Página precisa de privilégios!");
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

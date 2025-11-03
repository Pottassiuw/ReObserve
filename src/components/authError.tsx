import { AlertCircle, RefreshCcw, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

interface AuthErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function AuthError({
  message = "Sessão expirada ou inválida",
  onRetry,
}: AuthErrorProps) {
  const { initialize, userType } = useAuthStore();
  const navigate = useNavigate();

  const handleRetry = async () => {
    if (onRetry) {
      onRetry();
    } else {
      initialize();
    }
  };

  const handleBackToLogin = () => {
    if (userType === "enterprise") {
      navigate("/enterprise/login");
    } else {
      navigate("/user/login");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">
              Por favor, faça login para continuar.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleBackToLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl shadow-md"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Fazer Login
            </Button>

            <Button
              onClick={handleRetry}
              variant="outline"
              className="w-full py-6 rounded-xl"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Tentar Novamente
            </Button>

            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="w-full py-6 rounded-xl text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para Home
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

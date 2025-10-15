import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUsuarioSchema, type LoginUsuarioInput } from "@/lib/userSchemas";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useAppNavigator } from "@/hooks/navigate";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { navigateToDashboard } = useAppNavigator();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUsuarioInput>({
    resolver: zodResolver(LoginUsuarioSchema),
  });
  const onSubmit = async (data: LoginUsuarioInput) => {
    setIsLoading(true);
    const loadingToastId = toast.loading("Logando usuário...");
    try {
      await login("user", data);
      toast.success("Usuário logado com sucesso!", {
        id: loadingToastId,
        duration: 2000,
      });
      navigateToDashboard();
    } catch (error: any) {
      toast.error("Erro ao logar usuário!", {
        id: loadingToastId,
        description: error?.message || "Ocorreu um erro desconhecido.",
        duration: 5000,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Re<span className="text-indigo-500">Observe</span>
            </h1>
            <p className="text-gray-600">Sistema de Laudos Inteligentes</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-gray-600">
                Entre com suas credenciais para continuar
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="seu@email.com"
                    className="pl-10 py-6 rounded-xl"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    {...register("senha")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-12 py-6 rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {errors.senha && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senha.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer font-normal"
                  >
                    Lembrar-me
                  </Label>
                </label>
                <Button
                  variant="link"
                  className="text-indigo-500 hover:text-indigo-600 p-0 h-auto font-medium"
                >
                  Esqueceu a senha?
                </Button>
              </div>

              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 py-6 rounded-xl shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            © {new Date().getFullYear()} ReObserve – Sistema de Laudos
            Inteligentes
          </p>
        </div>
      </div>
    </main>
  );
}

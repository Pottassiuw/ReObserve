import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import {
  LoginEmpresaSchema,
  type LoginEmpresaInput,
} from "@/lib/enterpriseSchemas";
import { useAppNavigator } from "@/hooks/useAppNavigator";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";
import { formatCNPJ } from "@/utils/formatters";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { navigateToRegisterEnterprise, navigateToDashboard } =
    useAppNavigator();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginEmpresaInput>({
    resolver: zodResolver(LoginEmpresaSchema),
  });
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setValue("cnpj", formattedCNPJ, { shouldValidate: true });
  };
  const onSubmit = async (data: LoginEmpresaInput) => {
    setIsLoading(true);
    const loadingToastId = toast.loading("Logando Empresa...");
    try {
      await login("enterprise", data);
      toast.success("Empresa logada com sucesso!", {
        id: loadingToastId,
        duration: 2000,
      });
      navigateToDashboard();
    } catch (error: any) {
      toast.error("Erro ao logar a Empresa!", {
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
                <Label htmlFor="cnpj">CNPJ</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="cnpj"
                    type="text"
                    value={watch("cnpj")}
                    {...register("cnpj")}
                    onChange={handleCNPJChange}
                    placeholder="00.000.000/0000-00"
                    className="pl-10 py-6 rounded-xl"
                  />
                </div>
                {errors.cnpj && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cnpj?.message}
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
                    type={showPassword ? "text" : "password"}
                    {...register("senha")}
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
                    {errors.senha?.message}
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

            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 bg-white text-gray-500 text-sm">ou</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Não tem uma conta?{" "}
                <Button
                  onClick={navigateToRegisterEnterprise}
                  variant="link"
                  className="text-indigo-500 hover:text-indigo-600 p-0 h-auto font-semibold hover:cursor-pointer"
                >
                  Criar conta
                </Button>
              </p>
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

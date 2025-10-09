import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  criarUsuarioSchema,
  type criarUsuarioInput,
} from "../../../../../shared/schemas/userSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Tipo estendido para incluir confirmação de senha
type FormData = Omit<criarUsuarioInput, "empresaId" | "grupoId"> & {
  confirmSenha: string;
};

// Schema estendido para validação de senhas do formulário
const formSchema = criarUsuarioSchema
  .omit({ empresaId: true, grupoId: true })
  .extend({
    confirmSenha: z.string().min(1, "Por favor, confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: "As senhas não coincidem",
    path: ["confirmSenha"],
  });

function UserRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const goToHome = () => navigate("/");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema), // Aqui usamos formSchema, não criarUsuarioSchema
    defaultValues: {
      cpf: "",
      senha: "",
      confirmSenha: "",
      nome: "",
      email: "",
    },
  });

  // ... restante do código ...
  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2");
    }
    return value.slice(0, 14);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue("cpf", formatted, { shouldValidate: false });
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Remove formatação do CPF antes de enviar
      const cpfLimpo = data.cpf.replace(/\D/g, "");

      // Prepara dados para envio (remove confirmSenha e adiciona empresaId)
      const dadosEnvio: criarUsuarioInput = {
        nome: data.nome,
        cpf: cpfLimpo,
        senha: data.senha,
        email: data.email,
        empresaId: 1, // TODO: Pegar o ID da empresa do contexto/estado global
        // grupoId é opcional, então não precisa ser enviado
      };

      // TODO: Implementar chamada à API
      console.log("Dados para envio:", dadosEnvio);

      // Simula requisição
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Tratar resposta e redirecionar
      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      // TODO: Mostrar mensagem de erro apropriada
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Re<span className="text-indigo-500">Observe</span>
          </h1>
          <p className="text-gray-600">Sistema de Laudos Inteligentes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Novo Usuário
            </h2>
            <p className="text-gray-600">
              Cadastre um novo usuário para sua empresa
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="nome"
                    type="text"
                    {...register("nome")}
                    placeholder="João da Silva"
                    className="pl-10 py-5 rounded-xl"
                  />
                </div>
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome.message}</p>
                )}
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="cpf"
                    type="text"
                    {...register("cpf")}
                    onChange={handleCPFChange}
                    value={watch("cpf")}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="pl-10 py-5 rounded-xl"
                  />
                </div>
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="joao@exemplo.com"
                    className="pl-10 py-5 rounded-xl"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    {...register("senha")}
                    placeholder="••••••••"
                    className="pl-10 pr-12 py-5 rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.senha && (
                  <p className="text-sm text-red-500">{errors.senha.message}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmSenha">Confirmar Senha</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmSenha")}
                    placeholder="••••••••"
                    className="pl-10 pr-12 py-5 rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-transparent"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmSenha && (
                  <p className="text-sm text-red-500">
                    {errors.confirmSenha.message}
                  </p>
                )}
              </div>

              {/* Info sobre empresa */}
              <div className="col-span-2 bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                <p className="text-sm text-indigo-800">
                  <span className="font-semibold">Nota:</span> Este usuário será
                  vinculado automaticamente à sua empresa.
                </p>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex gap-4 mt-2">
                <Button
                  type="button"
                  onClick={goToHome}
                  variant="outline"
                  className="flex-1 py-5 rounded-xl hover:cursor-pointer"
                >
                  ← Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 py-5 rounded-xl shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar Usuário"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} ReObserve — Sistema de Laudos
          Inteligentes
        </p>
      </div>
    </div>
  );
}

export default UserRegister;

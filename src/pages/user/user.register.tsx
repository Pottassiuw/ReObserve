import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { criarUsuarioSchema, type criarUsuarioInput } from "@/lib/userSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { criarUsuario } from "@/api/endpoints/stores";
import { formatCPF } from "@/utils/formatters";
import { useGroups } from "@/hooks/useGroups";
import { z } from "zod";

export default function CreateUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userType, userId } = useAuthStore();
  const navigate = useNavigate();

  // Passa o empresaId para o hook
  const {
    grupos,
    isLoading: loadingGroups,
    error: groupsError,
  } = useGroups({
    empresaId: userId || undefined,
    autoLoad: true,
  });

  const formSchema = criarUsuarioSchema
    .extend({
      confirmSenha: z.string().min(1, "Por favor, confirme sua senha"),
    })
    .refine((data) => data.senha === data.confirmSenha, {
      message: "As senhas não coincidem",
      path: ["confirmSenha"],
    });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedGrupoId = watch("grupoId");
  const selectedGroup = grupos.find((g) => g.id === selectedGrupoId);

  // Verifica se o usuário é uma empresa
  useEffect(() => {
    if (userType !== "enterprise") {
      toast.error("Acesso negado", {
        description: "Apenas empresas podem criar usuários",
      });
      navigate("/dashboard");
    }
  }, [userType, navigate]);

  // Debug grupos carregados
  useEffect(() => {
    console.log("Grupos carregados:", grupos);
    console.log("Loading:", loadingGroups);
    console.log("Error:", groupsError);
    console.log("UserId:", userId);
  }, [grupos, loadingGroups, groupsError, userId]);

  const onSubmit = async (data: criarUsuarioInput) => {
    setIsLoading(true);
    const loadingToastId = toast.loading("Criando usuário...");

    try {
      const payload = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cpf: data.cpf,
        empresaId: userId!,
        grupoId: data.grupoId,
      };

      await criarUsuario(payload);
      toast.success("Usuário criado com sucesso!", {
        id: loadingToastId,
        description: `${data.nome} foi adicionado ao sistema`,
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/users/view");
      }, 1500);
    } catch (error: any) {
      toast.error("Erro ao criar usuário", {
        id: loadingToastId,
        description: error?.message || "Ocorreu um erro desconhecido",
        duration: 5000,
      });
      console.error("Erro ao criar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userType !== "enterprise") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-indigo-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Criar Novo Usuário
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Adicione um novo usuário à sua empresa com permissões específicas
          </p>
        </div>

        {/* Erro ao carregar grupos */}
        {groupsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{groupsError}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg border-0">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-indigo-900">
              Informações do Usuário
            </CardTitle>
            <CardDescription>
              Preencha todos os campos para criar um novo usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="nome"
                    {...register("nome")}
                    placeholder="João da Silva"
                    className="pl-10"
                  />
                </div>
                {errors.nome && (
                  <p className="text-red-500 text-sm">{errors.nome.message}</p>
                )}
              </div>

              {/* Email e CPF */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="joao@empresa.com"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    {...register("cpf")}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setValue("cpf", formatted);
                    }}
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm">{errors.cpf.message}</p>
                  )}
                </div>
              </div>

              {/* Senha e Confirmar Senha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      {...register("senha")}
                      placeholder="••••••••"
                      className="pl-10 pr-12"
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
                    <p className="text-red-500 text-sm">
                      {errors.senha.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmSenha")}
                      placeholder="••••••••"
                      className="pl-10 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 hover:bg-transparent"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmSenha && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmSenha.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Grupo de Permissões */}
              <div className="space-y-2">
                <Label htmlFor="grupo">Grupo de Permissões *</Label>
                {loadingGroups ? (
                  <div className="flex items-center justify-center py-8 border rounded-lg bg-indigo-50/50">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                    <span className="ml-2 text-sm text-gray-600">
                      Carregando grupos...
                    </span>
                  </div>
                ) : grupos.length === 0 ? (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-900">
                      Nenhum grupo encontrado.
                      <Button
                        variant="link"
                        onClick={() => navigate("/groups")}
                        className="p-0 h-auto ml-1 text-indigo-600"
                      >
                        Criar grupo primeiro
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select
                    onValueChange={(value) =>
                      setValue("grupoId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Selecione um grupo" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.id} value={grupo.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{grupo.nome}</span>
                            <span className="text-xs text-gray-500">
                              {grupo.permissoes?.length || 0} permissões
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.grupoId && (
                  <p className="text-red-500 text-sm">
                    {errors.grupoId.message}
                  </p>
                )}
              </div>

              {/* Info do Grupo Selecionado */}
              {selectedGroup && (
                <Alert className="bg-indigo-50 border-indigo-200">
                  <Shield className="h-4 w-4 text-indigo-600" />
                  <AlertDescription className="text-indigo-900">
                    <div className="space-y-2">
                      <div>
                        <strong>Grupo:</strong> {selectedGroup.nome}
                      </div>
                      <div className="text-sm">
                        <strong>Permissões:</strong>{" "}
                        {selectedGroup.permissoes?.length || 0}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1 order-2 sm:order-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 order-1 sm:order-2 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading || loadingGroups || grupos.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Criando...
                    </>
                  ) : (
                    "Criar Usuário"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

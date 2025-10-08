import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { criarUsuarioSchema } from "../../../../../shared/schemas/userSchemas";

function UserRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const goToHome = () => navigate("/");
  const [formData, setFormData] = useState({
    cpf: "",
    senha: "",
    confirmSenha: "",
    nome: "",
    email: "",
  });

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2");
    }
    return value;
  };

  const handleChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value);
    }
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const cpfError = criarUsuarioSchema.cpf(formData.cpf);
    if (cpfError) newErrors.cpf = cpfError;

    const senhaError = criarUsuarioSchema.senha(formData.senha);
    if (senhaError) newErrors.senha = senhaError;

    if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = "As senhas não coincidem";
    }

    const nomeError = criarUsuarioSchema.nome(formData.nome);
    if (nomeError) newErrors.nome = nomeError;

    const emailError = criarUsuarioSchema.email(formData.email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        console.log("Usuário cadastrado:", formData);
      }, 1500);
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
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="João da Silva"
                  className="pl-10 py-5 rounded-xl"
                />
              </div>
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome}</p>
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
                  value={formData.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="pl-10 py-5 rounded-xl"
                />
              </div>
              {errors.cpf && (
                <p className="text-sm text-red-500">{errors.cpf}</p>
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
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="joao@exemplo.com"
                  className="pl-10 py-5 rounded-xl"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
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
                  value={formData.senha}
                  onChange={(e) => handleChange("senha", e.target.value)}
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
                <p className="text-sm text-red-500">{errors.senha}</p>
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
                  value={formData.confirmSenha}
                  onChange={(e) => handleChange("confirmSenha", e.target.value)}
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
                <p className="text-sm text-red-500">{errors.confirmSenha}</p>
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
                onClick={goToHome}
                variant="outline"
                className="flex-1 py-5 rounded-xl hover:cursor-pointer"
              >
                ← Voltar
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
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
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} ReObserve – Sistema de Laudos
          Inteligentes
        </p>
      </div>
    </div>
  );
}

export default UserRegister;

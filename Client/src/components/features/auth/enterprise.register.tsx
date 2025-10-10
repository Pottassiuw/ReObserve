import { useState } from "react";
import { Building2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  criarEmpresaSchema,
  type CriarEmpresaInput,
} from "@/lib/enterpriseSchemas";

function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    isSubmitted,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CriarEmpresaInput>({
    resolver: zodResolver(criarEmpresaSchema),
  });

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 14) {
      return cleaned
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setValue("cnpj", formattedCNPJ, { shouldValidate: true });
  };
  //criar lógica de voltar
  const handleNext = () => {
    setStep(step + 1);
  };

  //validar os steps para errors
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Re<span className="text-indigo-500">Observe</span>
          </h1>
          <p className="text-gray-600">Sistema de Laudos Inteligentes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cadastro de Empresa
            </h2>
            <p className="text-gray-600">
              Preencha os dados da sua empresa para começar
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 whitespace-nowrap">
                    {s === 1 && "Acesso"}
                    {s === 2 && "Empresa"}
                    {s === 3 && "Detalhes"}
                  </span>
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-24 mx-4 rounded transition-all ${
                      step > s ? "bg-indigo-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Credenciais */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="cnpj"
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => handleChange("cnpj", e.target.value)}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className="pl-10 py-6 rounded-xl"
                  />
                </div>
                {errors.cnpj && (
                  <p className="text-sm text-red-500">{errors.cnpj}</p>
                )}
              </div>

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
                    className="pl-10 pr-12 py-6 rounded-xl"
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
                    onChange={(e) =>
                      handleChange("confirmSenha", e.target.value)
                    }
                    placeholder="••••••••"
                    className="pl-10 pr-12 py-6 rounded-xl"
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
            </div>
          )}

          {/* Step 2: Dados da Empresa */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  type="text"
                  value={formData.nomeFantasia}
                  onChange={(e) => handleChange("nomeFantasia", e.target.value)}
                  placeholder="Nome da sua empresa"
                  className="py-6 rounded-xl"
                />
                {errors.nomeFantasia && (
                  <p className="text-sm text-red-500">{errors.nomeFantasia}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  type="text"
                  value={formData.razaoSocial}
                  onChange={(e) => handleChange("razaoSocial", e.target.value)}
                  placeholder="Razão social completa"
                  className="py-6 rounded-xl"
                />
                {errors.razaoSocial && (
                  <p className="text-sm text-red-500">{errors.razaoSocial}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturezaJuridica">Natureza Jurídica</Label>
                <select
                  id="naturezaJuridica"
                  value={formData.naturezaJuridica}
                  onChange={(e) =>
                    handleChange("naturezaJuridica", e.target.value)
                  }
                  className="w-full py-3 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                >
                  <option value="">Selecione...</option>
                  <option value="LTDA">Sociedade Limitada (LTDA)</option>
                  <option value="SA">Sociedade Anônima (S.A.)</option>
                  <option value="MEI">
                    Microempreendedor Individual (MEI)
                  </option>
                  <option value="EIRELI">
                    Empresa Individual de Responsabilidade Limitada (EIRELI)
                  </option>
                  <option value="EI">Empresário Individual (EI)</option>
                </select>
                {errors.naturezaJuridica && (
                  <p className="text-sm text-red-500">
                    {errors.naturezaJuridica}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Endereço e CNAEs */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Rua, número, bairro, cidade - UF"
                  className="py-6 rounded-xl"
                />
                {errors.endereco && (
                  <p className="text-sm text-red-500">{errors.endereco}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="CNAES">CNAEs (separe por vírgula)</Label>
                <Input
                  id="CNAES"
                  type="text"
                  value={formData.CNAES}
                  onChange={(e) => handleChange("CNAES", e.target.value)}
                  placeholder="Ex: 6201-5/00, 6203-4/00"
                  className="py-6 rounded-xl"
                />
                {errors.CNAES && (
                  <p className="text-sm text-red-500">{errors.CNAES}</p>
                )}
                <p className="text-xs text-gray-500">
                  Informe os códigos CNAE da atividade econômica da empresa
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situacaoCadastral">Situação Cadastral</Label>
                <select
                  id="situacaoCadastral"
                  value={formData.situacaoCadastral}
                  onChange={(e) =>
                    handleChange("situacaoCadastral", e.target.value)
                  }
                  className="w-full py-3 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Suspensa">Suspensa</option>
                  <option value="Inapta">Inapta</option>
                  <option value="Baixada">Baixada</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-6 rounded-xl"
              >
                Voltar
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 py-6 rounded-xl shadow-md hover:shadow-lg"
              >
                Próximo
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 py-6 rounded-xl shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Cadastrando...
                  </>
                ) : (
                  "Finalizar Cadastro"
                )}
              </Button>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Button
                variant="link"
                className="text-indigo-500 hover:text-indigo-600 p-0 h-auto font-semibold"
              >
                Fazer login
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
  );
}

export default Register;

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
} from "lucide-react";
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
import { formatCNPJ } from "@/utils/formatters";
import client from "@/api/client";
import { lookupEnterpriseByCNPJ, type EnterpriseLookupData } from "@/api/endpoints/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";

function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLookingUpCNPJ, setIsLookingUpCNPJ] = useState(false);
  const [cnpjLookupError, setCnpjLookupError] = useState<string | null>(null);
  const [lookupData, setLookupData] = useState<EnterpriseLookupData | null>(null);

  const navigate = useNavigate();
  const lookupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLookedUpCNPJRef = useRef<string | null>(null);

  const formSchema = criarEmpresaSchema
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
    formState: { errors },
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const cnpjValue = watch("cnpj") || "";
  const isAutoFilled = Boolean(lookupData);

  const applyLookupDataToForm = (enterpriseData: EnterpriseLookupData) => {
    setValue("nomeFantasia", enterpriseData.nomeFantasia || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("razaoSocial", enterpriseData.razaoSocial || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("naturezaJuridica", enterpriseData.naturezaJuridica || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("endereco", enterpriseData.endereco || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("CNAES", enterpriseData.CNAES || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("situacaoCadastral", enterpriseData.situacaoCadastral || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const clearLookupFormFields = () => {
    setValue("nomeFantasia", "", { shouldValidate: false });
    setValue("razaoSocial", "", { shouldValidate: false });
    setValue("naturezaJuridica", "", { shouldValidate: false });
    setValue("endereco", "", { shouldValidate: false });
    setValue("CNAES", "", { shouldValidate: false });
    setValue("situacaoCadastral", "", { shouldValidate: false });
  };

  const resetLookupState = (clearFields: boolean = false) => {
    setLookupData(null);
    setCnpjLookupError(null);
    setIsLookingUpCNPJ(false);
    lastLookedUpCNPJRef.current = null;

    if (clearFields) {
      clearLookupFormFields();
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setValue("cnpj", formattedCNPJ, { shouldValidate: true, shouldDirty: true });
  };

  useEffect(() => {
    const cleanCNPJ = cnpjValue.replace(/\D/g, "");

    if (lookupTimeoutRef.current) {
      clearTimeout(lookupTimeoutRef.current);
    }

    if (cleanCNPJ.length !== 14) {
      if (lookupData || cnpjLookupError) {
        resetLookupState(true);
      }
      return;
    }

    if (lastLookedUpCNPJRef.current === cleanCNPJ) {
      return;
    }

    lookupTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLookingUpCNPJ(true);
        setCnpjLookupError(null);

        const enterpriseData = await lookupEnterpriseByCNPJ(cleanCNPJ);
        lastLookedUpCNPJRef.current = cleanCNPJ;
        setLookupData(enterpriseData);
        applyLookupDataToForm(enterpriseData);
        clearErrors([
          "nomeFantasia",
          "razaoSocial",
          "naturezaJuridica",
          "endereco",
          "CNAES",
          "situacaoCadastral",
        ]);
        toast.success("Dados da empresa preenchidos automaticamente!");
      } catch (error: any) {
        setLookupData(null);
        lastLookedUpCNPJRef.current = null;
        clearLookupFormFields();
        const message = error?.message || "Não foi possível consultar o CNPJ.";
        setCnpjLookupError(message);
      } finally {
        setIsLookingUpCNPJ(false);
      }
    }, 600);

    return () => {
      if (lookupTimeoutRef.current) {
        clearTimeout(lookupTimeoutRef.current);
      }
    };
  }, [cnpjValue]);

  const ValidateStep = async (currentStep: number) => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["cnpj", "senha", "confirmSenha"];
        break;
      case 2:
        fieldsToValidate = ["nomeFantasia", "razaoSocial", "naturezaJuridica"];
        break;
      case 3:
        fieldsToValidate = ["endereco", "CNAES", "situacaoCadastral"];
        break;
    }

    if (currentStep === 1) {
      await trigger(["senha", "confirmSenha"], { shouldFocus: true });
    }

    const isValid =
      currentStep === 1 ? await trigger() : await trigger(fieldsToValidate);

    if (currentStep === 1) {
      const senha = watch("senha");
      const confirmSenha = watch("confirmSenha");

      if (senha !== confirmSenha) {
        setError("confirmSenha", { message: "As senhas não coincidem" });
        return false;
      }

      clearErrors("confirmSenha");
      return true;
    }

    return isValid;
  };

  const handleNext = async () => {
    const isStepValid = await ValidateStep(step);
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: CriarEmpresaInput) => {
    try {
      setIsLoading(true);
      const {
        cnpj,
        senha,
        nomeFantasia,
        razaoSocial,
        naturezaJuridica,
        endereco,
        situacaoCadastral,
        CNAES,
      } = data;

      const empresa = await client.post("/enterprises/auth/register", {
        cnpj,
        senha,
        nomeFantasia,
        razaoSocial,
        naturezaJuridica,
        endereco,
        situacaoCadastral,
        CNAES,
      });

      if (!empresa) {
        toast.error("Empresa não cadastrada");
        return;
      }

      toast.success("Empresa cadastrada com sucesso");
      navigate("/enterprise/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao cadastrar empresa",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Re<span className="text-indigo-500">Observe</span>
            </h1>
            <p className="text-gray-600">Sistema de Laudos Inteligentes</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Cadastro de Empresa
              </h2>
              <p className="text-gray-600">
                Preencha os dados da sua empresa para começar
              </p>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:mb-8 sm:max-w-md sm:mx-auto sm:gap-0">
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
                    <span className="mt-2 text-[11px] text-gray-600 whitespace-nowrap sm:text-xs">
                      {s === 1 && "Acesso"}
                      {s === 2 && "Empresa"}
                      {s === 3 && "Detalhes"}
                    </span>
                  </div>
                  {s < 3 && (
                    <div
                      className={`hidden h-1 w-16 mx-2 rounded transition-all sm:block sm:w-24 sm:mx-4 ${
                        step > s ? "bg-indigo-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

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
                      {...register("cnpj")}
                      value={cnpjValue}
                      onChange={handleCNPJChange}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className="pl-10 pr-10 py-6 rounded-xl"
                    />
                    {isLookingUpCNPJ && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    )}
                  </div>
                  {isLookingUpCNPJ && (
                    <p className="text-sm text-indigo-600">
                      Consultando dados da empresa pelo CNPJ...
                    </p>
                  )}
                  {cnpjLookupError && !errors.cnpj && (
                    <p className="text-sm text-amber-600">{cnpjLookupError}</p>
                  )}
                  {lookupData && !isLookingUpCNPJ && (
                    <p className="text-sm text-emerald-600">
                      Dados encontrados. Os próximos campos serão preenchidos automaticamente.
                    </p>
                  )}
                  {errors.cnpj && (
                    <p className="text-sm text-red-500">{errors.cnpj.message}</p>
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
                    <p className="text-sm text-red-500">{errors.confirmSenha.message}</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input
                    id="nomeFantasia"
                    type="text"
                    placeholder="Nome da sua empresa"
                    {...register("nomeFantasia")}
                    readOnly={isAutoFilled}
                    className={`py-6 rounded-xl ${isAutoFilled ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}`}
                  />
                  {errors.nomeFantasia && (
                    <p className="text-sm text-red-500">{errors.nomeFantasia.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    type="text"
                    {...register("razaoSocial")}
                    placeholder="Razão social completa"
                    readOnly={isAutoFilled}
                    className={`py-6 rounded-xl ${isAutoFilled ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}`}
                  />
                  {errors.razaoSocial && (
                    <p className="text-sm text-red-500">{errors.razaoSocial.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="naturezaJuridica">Natureza Jurídica</Label>
                  {isAutoFilled ? (
                    <Input
                      id="naturezaJuridica"
                      type="text"
                      {...register("naturezaJuridica")}
                      readOnly
                      className="py-6 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      id="naturezaJuridica"
                      {...register("naturezaJuridica")}
                      className="w-full py-3 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                    >
                      <option value="">Selecione...</option>
                      <option value="LTDA">Sociedade Limitada (LTDA)</option>
                      <option value="SA">Sociedade Anônima (S.A.)</option>
                      <option value="MEI">Microempreendedor Individual (MEI)</option>
                      <option value="EIRELI">
                        Empresa Individual de Responsabilidade Limitada (EIRELI)
                      </option>
                      <option value="EI">Empresário Individual (EI)</option>
                    </select>
                  )}
                  {errors.naturezaJuridica && (
                    <p className="text-sm text-red-500">{errors.naturezaJuridica.message}</p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    type="text"
                    {...register("endereco")}
                    placeholder="Rua, número, bairro, cidade - UF"
                    readOnly={isAutoFilled}
                    className={`py-6 rounded-xl ${isAutoFilled ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}`}
                  />
                  {errors.endereco && (
                    <p className="text-sm text-red-500">{errors.endereco.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="CNAES">CNAEs</Label>
                  <Input
                    id="CNAES"
                    type="text"
                    {...register("CNAES")}
                    placeholder="Ex: 6201-5/00, 6203-4/00"
                    readOnly={isAutoFilled}
                    className={`py-6 rounded-xl ${isAutoFilled ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}`}
                  />
                  {errors.CNAES && (
                    <p className="text-sm text-red-500">{errors.CNAES.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Informe os códigos CNAE da atividade econômica da empresa
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situacaoCadastral">Situação Cadastral</Label>
                  {isAutoFilled ? (
                    <Input
                      id="situacaoCadastral"
                      type="text"
                      {...register("situacaoCadastral")}
                      readOnly
                      className="py-6 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      id="situacaoCadastral"
                      {...register("situacaoCadastral")}
                      className="w-full py-3 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                    >
                      <option value="Ativa">Ativa</option>
                      <option value="Suspensa">Suspensa</option>
                      <option value="Inapta">Inapta</option>
                      <option value="Baixada">Baixada</option>
                    </select>
                  )}
                  {errors.situacaoCadastral && (
                    <p className="text-sm text-red-500">{errors.situacaoCadastral.message}</p>
                  )}
                </div>

                {lookupData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefoneLookup">Telefone</Label>
                      <Input
                        id="telefoneLookup"
                        value={lookupData.telefone || "Não informado"}
                        readOnly
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailLookup">Email</Label>
                      <Input
                        id="emailLookup"
                        value={lookupData.email || "Não informado"}
                        readOnly
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavelLookup">Responsável</Label>
                      <Input
                        id="responsavelLookup"
                        value={lookupData.responsavel || "Não informado"}
                        readOnly
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aberturaLookup">Data de Abertura</Label>
                      <Input
                        id="aberturaLookup"
                        value={lookupData.dataAbertura || "Não informado"}
                        readOnly
                        className="bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
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
                  onClick={handleSubmit(onSubmit)}
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
                  onClick={() => navigate("/enterprise/login")}
                  className="text-indigo-500 hover:text-indigo-600 p-0 h-auto font-semibold cursor-pointer"
                >
                  Fazer login
                </Button>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            © {new Date().getFullYear()} ReObserve – Sistema de Laudos Inteligentes
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;

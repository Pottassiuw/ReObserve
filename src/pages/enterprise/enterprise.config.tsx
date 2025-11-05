import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Shield,
  Key,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  FileText,
  Briefcase,
} from "lucide-react";
import { useEnterpriseStore } from "@/stores/enterpriseStore";
import { useAuthStore } from "@/stores/authStore";
import { atualizarEmpresa } from "@/api/endpoints/stores";
import { toast } from "sonner";

export default function EnterpriseSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { enterprise, getEnterprise } = useEnterpriseStore();
  const { userId } = useAuthStore();

  const [enterpriseData, setEnterpriseData] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    endereco: "",
    situacaoCadastral: "",
    naturezaJuridica: "",
    CNAES: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userId) {
      getEnterprise(userId);
    }
  }, [userId, getEnterprise]);

  useEffect(() => {
    if (enterprise) {
      setEnterpriseData({
        razaoSocial: enterprise.razaoSocial || "",
        nomeFantasia: enterprise.nomeFantasia || "",
        endereco: enterprise.endereco || "",
        situacaoCadastral: enterprise.situacaoCadastral || "",
        naturezaJuridica: enterprise.naturezaJuridica || "",
        CNAES: enterprise.CNAES || "",
      });
    }
  }, [enterprise]);

  const handleSaveEnterpriseData = async () => {
    if (!userId || !enterprise) return;

    setIsSaving(true);
    try {
      await atualizarEmpresa(userId, enterpriseData);
      toast.success("Dados da empresa atualizados com sucesso!");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Recarregar dados
      await getEnterprise(userId);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar dados da empresa");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!userId) return;

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Preencha todos os campos de senha");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setIsSaving(true);
    try {
      await atualizarEmpresa(userId, { senha: passwordData.newPassword });
      toast.success("Senha alterada com sucesso!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar senha");
    } finally {
      setIsSaving(false);
    }
  };

  if (!enterprise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-indigo-900">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
            Configurações da Empresa
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie as informações e configurações da sua empresa
          </p>
        </div>

        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Configurações salvas com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Atualize as informações cadastrais da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="razaoSocial" className="text-indigo-900">
                  Razão Social *
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="razaoSocial"
                    value={enterpriseData.razaoSocial}
                    onChange={(e) =>
                      setEnterpriseData({
                        ...enterpriseData,
                        razaoSocial: e.target.value,
                      })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeFantasia" className="text-indigo-900">
                  Nome Fantasia
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="nomeFantasia"
                    value={enterpriseData.nomeFantasia}
                    onChange={(e) =>
                      setEnterpriseData({
                        ...enterpriseData,
                        nomeFantasia: e.target.value,
                      })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-900">CNPJ</Label>
                <Input
                  value={enterprise.cnpj || ""}
                  disabled
                  className="bg-white/50 border-indigo-100 text-indigo-900"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco" className="text-indigo-900">
                  Endereço *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="endereco"
                    value={enterpriseData.endereco}
                    onChange={(e) =>
                      setEnterpriseData({
                        ...enterpriseData,
                        endereco: e.target.value,
                      })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situacaoCadastral" className="text-indigo-900">
                  Situação Cadastral *
                </Label>
                <Input
                  id="situacaoCadastral"
                  value={enterpriseData.situacaoCadastral}
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      situacaoCadastral: e.target.value,
                    })
                  }
                  className="border-indigo-100 focus:border-indigo-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturezaJuridica" className="text-indigo-900">
                  Natureza Jurídica *
                </Label>
                <Input
                  id="naturezaJuridica"
                  value={enterpriseData.naturezaJuridica}
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      naturezaJuridica: e.target.value,
                    })
                  }
                  className="border-indigo-100 focus:border-indigo-300"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="CNAES" className="text-indigo-900">
                  CNAES *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Textarea
                    id="CNAES"
                    value={enterpriseData.CNAES}
                    onChange={(e) =>
                      setEnterpriseData({
                        ...enterpriseData,
                        CNAES: e.target.value,
                      })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300 min-h-[100px]"
                    placeholder="Digite os códigos CNAES"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (enterprise) {
                    setEnterpriseData({
                      razaoSocial: enterprise.razaoSocial || "",
                      nomeFantasia: enterprise.nomeFantasia || "",
                      endereco: enterprise.endereco || "",
                      situacaoCadastral: enterprise.situacaoCadastral || "",
                      naturezaJuridica: enterprise.naturezaJuridica || "",
                      CNAES: enterprise.CNAES || "",
                    });
                  }
                }}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEnterpriseData}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>Altere a senha de acesso da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Use uma senha forte com pelo menos 8 caracteres, incluindo
                letras maiúsculas, minúsculas e números.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-indigo-900">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="pl-10 pr-10 border-indigo-100 focus:border-indigo-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-indigo-400 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-indigo-900">
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSavePassword}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


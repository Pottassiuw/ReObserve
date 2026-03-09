import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const toastId = toast.loading("Atualizando dados da empresa...");
    try {
      await atualizarEmpresa(userId, enterpriseData);
      toast.success("Dados da empresa atualizados com sucesso!", {
        id: toastId,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Recarregar dados
      await getEnterprise(userId);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar dados da empresa", {
        id: toastId,
      });
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
    const toastId = toast.loading("Alterando senha...");
    try {
      await atualizarEmpresa(userId, { senha: passwordData.newPassword });
      toast.success("Senha alterada com sucesso!", { id: toastId });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar senha", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (!enterprise) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
          <p className="text-white/50 text-sm">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-indigo-900">Configurações da Empresa</h1>
          <p className="text-sm text-muted-foreground">Gerencie as informações e configurações da sua empresa</p>
        </div>

        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200 py-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Configurações salvas com sucesso!</AlertDescription>
          </Alert>
        )}

        <Card className="border-0 shadow-md">
          <CardHeader className="px-5 py-4 pb-2">
            <CardTitle className="text-indigo-900 flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Dados da Empresa
            </CardTitle>
            <CardDescription className="text-xs">Atualize as informações cadastrais da sua empresa</CardDescription>
          </CardHeader>
          <CardContent className="px-5 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="razaoSocial" className="text-xs font-medium text-indigo-900">Razão Social *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
                  <Input id="razaoSocial" value={enterpriseData.razaoSocial} onChange={(e) => setEnterpriseData({ ...enterpriseData, razaoSocial: e.target.value })} className="pl-9 h-9 text-sm border-indigo-100 focus:border-indigo-300" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="nomeFantasia" className="text-xs font-medium text-indigo-900">Nome Fantasia</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
                  <Input id="nomeFantasia" value={enterpriseData.nomeFantasia} onChange={(e) => setEnterpriseData({ ...enterpriseData, nomeFantasia: e.target.value })} className="pl-9 h-9 text-sm border-indigo-100 focus:border-indigo-300" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-indigo-900">CNPJ</Label>
                <Input value={enterprise.cnpj || ""} disabled className="h-9 text-sm bg-white/50 border-indigo-100 text-indigo-900" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="endereco" className="text-xs font-medium text-indigo-900">Endereço *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
                  <Input id="endereco" value={enterpriseData.endereco} onChange={(e) => setEnterpriseData({ ...enterpriseData, endereco: e.target.value })} className="pl-9 h-9 text-sm border-indigo-100 focus:border-indigo-300" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="situacaoCadastral" className="text-xs font-medium text-indigo-900">Situação Cadastral *</Label>
                <select id="situacaoCadastral" value={enterpriseData.situacaoCadastral} onChange={(e) => setEnterpriseData({ ...enterpriseData, situacaoCadastral: e.target.value })} className="w-full h-9 py-0 px-3 text-sm border border-indigo-100 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all outline-none text-indigo-900">
                  <option value="">Selecione...</option>
                  <option value="Ativa">Ativa</option>
                  <option value="Suspensa">Suspensa</option>
                  <option value="Inapta">Inapta</option>
                  <option value="Baixada">Baixada</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="naturezaJuridica" className="text-xs font-medium text-indigo-900">Natureza Jurídica *</Label>
                <select id="naturezaJuridica" value={enterpriseData.naturezaJuridica} onChange={(e) => setEnterpriseData({ ...enterpriseData, naturezaJuridica: e.target.value })} className="w-full h-9 py-0 px-3 text-sm border border-indigo-100 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all outline-none text-indigo-900">
                  <option value="">Selecione...</option>
                  <option value="LTDA">Sociedade Limitada (LTDA)</option>
                  <option value="SA">Sociedade Anônima (S.A.)</option>
                  <option value="MEI">Microempreendedor Individual (MEI)</option>
                  <option value="EIRELI">Empresa Individual de Responsabilidade Limitada (EIRELI)</option>
                  <option value="EI">Empresário Individual (EI)</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="CNAES" className="text-xs font-medium text-indigo-900">CNAES *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
                  <Input id="CNAES" value={enterpriseData.CNAES} onChange={(e) => setEnterpriseData({ ...enterpriseData, CNAES: e.target.value })} className="pl-9 h-9 text-sm border-indigo-100 focus:border-indigo-300" placeholder="Digite os códigos CNAES" />
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => { if (enterprise) setEnterpriseData({ razaoSocial: enterprise.razaoSocial || "", nomeFantasia: enterprise.nomeFantasia || "", endereco: enterprise.endereco || "", situacaoCadastral: enterprise.situacaoCadastral || "", naturezaJuridica: enterprise.naturezaJuridica || "", CNAES: enterprise.CNAES || "" }); }} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto" disabled={isSaving}>Cancelar</Button>
              <Button size="sm" onClick={handleSaveEnterpriseData} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</> : <><Save className="h-4 w-4 mr-2" />Salvar Alterações</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="px-5 py-4 pb-2">
            <CardTitle className="text-indigo-900 flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Segurança
            </CardTitle>
            <CardDescription className="text-xs">Altere a senha de acesso da empresa</CardDescription>
          </CardHeader>
          <CardContent className="px-5 py-3">
            <Alert className="bg-amber-50 border-amber-200 py-2 mb-3">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-xs">Use uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="new-password" className="text-xs font-medium text-indigo-900">Nova Senha</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
                  <Input id="new-password" type={showPassword ? "text" : "password"} placeholder="Digite sua nova senha" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="pl-9 pr-10 h-9 text-sm border-indigo-100 focus:border-indigo-300" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password" className="text-xs font-medium text-indigo-900">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
                  <Input id="confirm-password" type={showPassword ? "text" : "password"} placeholder="Confirme sua nova senha" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="pl-9 h-9 text-sm border-indigo-100 focus:border-indigo-300" />
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto" disabled={isSaving}>Cancelar</Button>
              <Button size="sm" onClick={handleSavePassword} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Alterando...</> : <><Save className="h-4 w-4 mr-2" />Alterar Senha</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

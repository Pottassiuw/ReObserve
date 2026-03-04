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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Shield,
  Key,
  Mail,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { atualizarUsuario } from "@/api/endpoints/users";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { logInfo } from "@/utils/logger";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    user,
    isLoading: userLoading,
    error: userError,
    retornarUsuario,
  } = useUserStore();
  const { userId, userType } = useAuthStore();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const currentUser = Array.isArray(user) ? user[0] : user;

  // Redirecionar empresas para a página de configuração delas
  if (userType === "enterprise") {
    return <Navigate to="/enterprise/settings" replace />;
  }

  useEffect(() => {
    if (userId) {
      logInfo("Chamando retornarUsuario com ID", { userId });
      retornarUsuario(userId);
    }
  }, [userId, retornarUsuario]);

  useEffect(() => {
    if (currentUser) {
      logInfo("Atualizando userData", {
        nome: currentUser.nome,
        email: currentUser.email,
      });
      setUserData({
        name: currentUser.nome || "",
        email: currentUser.email || "",
      });
    }
  }, [user]);

  const handleSaveUserData = async () => {
    if (!userId || !currentUser) return;

    setIsSaving(true);
    try {
      await atualizarUsuario(userId, {
        nome: userData.name,
        email: userData.email,
      });
      toast.success("Dados atualizados com sucesso!");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Recarregar dados
      await retornarUsuario(userId);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar dados");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!userId) return;

    // Aqui você pode adicionar validação da senha atual se necessário
    // Por enquanto, apenas atualiza a senha
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Preencha todos os campos de senha");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsSaving(true);
    try {
      await atualizarUsuario(userId, { senha: passwordData.newPassword });
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

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-indigo-900">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {userError}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Nenhum usuário encontrado.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-indigo-900">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e de segurança
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
              <User className="h-5 w-5" />
              Meus Dados
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-indigo-900">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-indigo-900">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>

              {currentUser.cpf && (
                <div className="space-y-2">
                  <Label className="text-indigo-900">CPF</Label>
                  <Input
                    value={currentUser.cpf}
                    disabled
                    className="bg-white/50 border-indigo-100 text-indigo-900"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentUser) {
                    setUserData({
                      name: currentUser.nome || "",
                      email: currentUser.email || "",
                    });
                  }
                }}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveUserData}
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
            <CardDescription>Altere sua senha de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Use uma senha forte com pelo menos 8 caracteres, incluindo
                letras e números.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-indigo-900">
                  Senha Atual
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha atual"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
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
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
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

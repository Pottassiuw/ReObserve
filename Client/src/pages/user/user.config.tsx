import { useState } from "react";
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
  Building2,
  Shield,
  Key,
  Mail,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estados para configurações do usuário
  const [userData, setUserData] = useState({
    name: "João Silva",
    email: "joao.silva@minhaempresa.com",
  });

  // Dados da empresa (read-only)
  const companyData = {
    name: "Minha Empresa LTDA",
    cnpj: "12.345.678/0001-90",
    address: "Rua Example, 123",
    city: "São Paulo",
    state: "SP",
    cep: "01234-567",
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-indigo-900">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e de segurança
          </p>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Configurações salvas com sucesso!
            </AlertDescription>
          </Alert>
        )}

        {/* Perfil do Usuário */}
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
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
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
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Empresa (Read-only) */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50/50 to-white">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Informações da sua empresa (somente leitura)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-indigo-900">Razão Social</Label>
                <Input
                  value={companyData.name}
                  disabled
                  className="bg-white/50 border-indigo-100 text-indigo-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-900">CNPJ</Label>
                <Input
                  value={companyData.cnpj}
                  disabled
                  className="bg-white/50 border-indigo-100 text-indigo-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-900">CEP</Label>
                <Input
                  value={companyData.cep}
                  disabled
                  className="bg-white/50 border-indigo-100 text-indigo-900"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-indigo-900">Endereço</Label>
                <Input
                  value={companyData.address}
                  disabled
                  className="bg-white/50 border-indigo-100 text-indigo-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-900">Cidade</Label>
                <Input
                  value={companyData.city}
                  disabled
                  className="bg-white/50 border-indigo-100 text-indigo-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-900">Estado</Label>
                <Input
                  value={companyData.state}
                  disabled
                  className="bg-white/50 border-indigo-100 text-indigo-900"
                />
              </div>
            </div>

            <Alert className="bg-indigo-50 border-indigo-200">
              <AlertCircle className="h-4 w-4 text-indigo-600" />
              <AlertDescription className="text-indigo-800">
                Para alterar os dados da empresa, entre em contato com o
                administrador do sistema.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

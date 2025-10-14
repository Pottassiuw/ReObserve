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
  Calendar,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  DollarSign,
  Info,
} from "lucide-react";

export default function CreatePeriodPage() {
  const [formData, setFormData] = useState({
    dataInicio: "",
    dataFim: "",
    valorTotal: "",
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    // Navegar de volta
    console.log("Cancelar criação");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-indigo-900">
              Criar Novo Período
            </h1>
            <p className="text-muted-foreground">
              Defina o período contábil e suas datas
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Período criado com sucesso!
            </AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            O período será criado <strong>aberto</strong> por padrão. Você
            poderá fechá-lo posteriormente quando todas as notas fiscais
            estiverem lançadas.
          </AlertDescription>
        </Alert>

        {/* Form Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do Período
            </CardTitle>
            <CardDescription>
              Preencha as datas de início e fim do período contábil
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Início */}
              <div className="space-y-2">
                <Label
                  htmlFor="dataInicio"
                  className="text-indigo-900 font-medium"
                >
                  Data de Início *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Data em que o período contábil inicia
                </p>
              </div>

              {/* Data Fim */}
              <div className="space-y-2">
                <Label
                  htmlFor="dataFim"
                  className="text-indigo-900 font-medium"
                >
                  Data de Fim *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="dataFim"
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) =>
                      setFormData({ ...formData, dataFim: e.target.value })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Data em que o período contábil encerra
                </p>
              </div>

              {/* Valor Total (Opcional) */}
              <div className="space-y-2">
                <Label
                  htmlFor="valorTotal"
                  className="text-indigo-900 font-medium"
                >
                  Valor Total Estimado
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (Opcional)
                  </span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="valorTotal"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.valorTotal}
                    onChange={(e) =>
                      setFormData({ ...formData, valorTotal: e.target.value })
                    }
                    className="pl-10 border-indigo-100 focus:border-indigo-300"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor estimado para o período (será calculado automaticamente
                  após o fechamento)
                </p>
              </div>

              {/* Divider */}
              <div className="border-t pt-6">
                <div className="bg-indigo-50/50 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Status do Período
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-900">
                        Aberto
                      </p>
                      <p className="text-xs text-muted-foreground">
                        O período será criado aberto, permitindo lançamentos de
                        notas fiscais. Use a opção "Fechar Período" quando
                        finalizar todos os lançamentos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Criar Período
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Warning Card */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-amber-900">
                  Atenção
                </h3>
                <p className="text-sm text-amber-800">
                  Certifique-se de que as datas estão corretas. Após criar o
                  período e adicionar lançamentos, será necessário reabrir o
                  período para alterar suas datas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

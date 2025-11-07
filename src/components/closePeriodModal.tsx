import { formatCurrency } from "@/utils/formatters";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, Image, Lock } from "lucide-react";
import { toast } from "sonner";
import Client from "@/api/client";

interface Release {
  id: number;
  data_lancamento: string;
  notaFiscal: {
    numero: string;
    valor: number;
    dataEmissao: string;
  };
  imagens: Array<{ url: string }>;
  usuarios: {
    nome: string;
  };
}

interface ClosePeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: any;
  onSuccess: () => void;
}

const ClosePeriodModal = ({
  open,
  onOpenChange,
  period,
  onSuccess,
}: ClosePeriodModalProps) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedReleases, setSelectedReleases] = useState<number[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (open && period) {
      loadAvailableReleases();
    } else {
      resetForm();
    }
  }, [open, period]);

  const resetForm = () => {
    setReleases([]);
    setSelectedReleases([]);
    setObservacoes("");
  };

  const loadAvailableReleases = async () => {
    setIsFetching(true);
    try {
      const response = await Client.get(
        `/periods/${period.id}/available-releases`,
      );
      setReleases(response.data?.data || []);
    } catch (error: any) {
      console.error("Erro ao carregar lançamentos:", error);
      toast.error("Erro ao carregar lançamentos disponíveis");
    } finally {
      setIsFetching(false);
    }
  };

  const toggleRelease = (releaseId: number) => {
    setSelectedReleases((prev) =>
      prev.includes(releaseId)
        ? prev.filter((id) => id !== releaseId)
        : [...prev, releaseId],
    );
  };

  const selectAll = () => {
    if (selectedReleases.length === releases.length) {
      setSelectedReleases([]);
    } else {
      setSelectedReleases(releases.map((r) => r.id));
    }
  };

  const calculateTotal = () => {
    return releases
      .filter((r) => selectedReleases.includes(r.id))
      .reduce((sum, r) => sum + (r.notaFiscal?.valor || 0), 0);
  };

  const handleClose = async () => {
    if (selectedReleases.length === 0) {
      toast.error("Selecione pelo menos um lançamento");
      return;
    }

    setIsLoading(true);
    try {
      await Client.post(`/periods/${period.id}/close`, {
        lancamentosIds: selectedReleases,
        observacoes,
      });

      toast.success("Período fechado com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao fechar período:", error);
      toast.error(error.response?.data?.message || "Erro ao fechar período");
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = calculateTotal();
  const allSelected =
    releases.length > 0 && selectedReleases.length === releases.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-600">
            Fechar Período
          </DialogTitle>
          <DialogDescription>
            Selecione os lançamentos que deseja incluir neste período
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Informações do Período */}
          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Data Início</p>
                  <p className="font-semibold">
                    {new Date(period?.dataInicio).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data Fim</p>
                  <p className="font-semibold">
                    {new Date(period?.dataFim).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo da Seleção */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-sm text-gray-600">Lançamentos Selecionados</p>
              <p className="text-2xl font-bold text-indigo-600">
                {selectedReleases.length} / {releases.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>

          {/* Botão Selecionar Todos */}
          {releases.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={selectAll}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {allSelected ? "Desmarcar Todos" : "Selecionar Todos"}
            </Button>
          )}

          {/* Lista de Lançamentos */}
          {isFetching ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              <p className="text-gray-500 mt-2">Carregando lançamentos...</p>
            </div>
          ) : releases.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhum lançamento disponível para este período. Crie lançamentos
                dentro das datas do período.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {releases.map((release) => {
                const isSelected = selectedReleases.includes(release.id);
                return (
                  <Card
                    key={release.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => toggleRelease(release.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRelease(release.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Nota Fiscal</p>
                            <p className="font-semibold">
                              {release.notaFiscal?.numero}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Valor</p>
                            <p className="font-semibold text-green-600">
                              {formatCurrency(release.notaFiscal?.valor || 0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Data</p>
                            <p className="font-medium">
                              {new Date(
                                release.data_lancamento,
                              ).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Imagens</p>
                            <Badge variant="secondary">
                              <Image className="w-3 h-3 mr-1" />
                              {release.imagens?.length || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (Opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione observações sobre o fechamento do período..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleClose}
            disabled={isLoading || selectedReleases.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fechando...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Fechar Período ({selectedReleases.length} lançamentos)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClosePeriodModal;

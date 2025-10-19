// src/pages/PeriodsPage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MoreVertical,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { usePeriodsManagement } from "@/hooks/usePeriodsManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PeriodsPage() {
  const {
    periods,
    isLoading,
    error,
    loadPeriods,
    createPeriod,
    updatePeriod,
    deletePeriod,
    closePeriod,
    reopenPeriod,
    canCreate,
    canEdit,
    canDelete,
    canView,
  } = usePeriodsManagement();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isReopenDialogOpen, setIsReopenDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [periodToDelete, setPeriodToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  });

  const [closeData, setCloseData] = useState({
    observacoes: "",
  });

  const [reopenData, setReopenData] = useState({
    motivo: "",
  });

  useEffect(() => {
    if (canView) {
      loadPeriods();
    }
  }, [canView]);

  const resetForm = () => {
    setFormData({
      dataInicio: "",
      dataFim: "",
      observacoes: "",
    });
  };

  const handleCreate = async () => {
    if (!canCreate) {
      alert("Você não tem permissão para criar períodos");
      return;
    }

    try {
      await createPeriod({
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        observacoes: formData.observacoes,
        status: "aberto",
      } as any);
      setIsCreateDialogOpen(false);
      resetForm();
      loadPeriods();
    } catch (error) {
      console.error("Erro ao criar período:", error);
    }
  };

  const handleEdit = async () => {
    if (!canEdit || !selectedPeriod) {
      alert("Você não tem permissão para editar períodos");
      return;
    }

    try {
      await updatePeriod(selectedPeriod.id, {
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        observacoes: formData.observacoes,
      });
      setIsEditDialogOpen(false);
      setSelectedPeriod(null);
      resetForm();
      loadPeriods();
    } catch (error) {
      console.error("Erro ao editar período:", error);
    }
  };

  const handleClosePeriod = async () => {
    if (!selectedPeriod) return;

    try {
      await closePeriod(selectedPeriod.id, closeData.observacoes);
      setIsCloseDialogOpen(false);
      setSelectedPeriod(null);
      setCloseData({ observacoes: "" });
      loadPeriods();
    } catch (error) {
      console.error("Erro ao fechar período:", error);
    }
  };

  const handleReopenPeriod = async () => {
    if (!selectedPeriod) return;

    try {
      await reopenPeriod(selectedPeriod.id, reopenData.motivo);
      setIsReopenDialogOpen(false);
      setSelectedPeriod(null);
      setReopenData({ motivo: "" });
      loadPeriods();
    } catch (error) {
      console.error("Erro ao reabrir período:", error);
    }
  };

  const openEditDialog = (period: any) => {
    if (!canEdit) {
      alert("Você não tem permissão para editar períodos");
      return;
    }
    setSelectedPeriod(period);
    setFormData({
      dataInicio: period.dataInicio,
      dataFim: period.dataFim,
      observacoes: period.observacoes || "",
    });
    setIsEditDialogOpen(true);
  };

  const openCloseDialog = (period: any) => {
    setSelectedPeriod(period);
    setIsCloseDialogOpen(true);
  };

  const openReopenDialog = (period: any) => {
    setSelectedPeriod(period);
    setIsReopenDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (!canDelete) {
      alert("Você não tem permissão para deletar períodos");
      return;
    }
    setPeriodToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (periodToDelete) {
      try {
        await deletePeriod(periodToDelete);
        setDeleteDialogOpen(false);
        setPeriodToDelete(null);
        loadPeriods();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  // Estatísticas
  const totalPeriods = periods.length;
  const openPeriods = periods.filter((p) => p.status === "aberto").length;
  const closedPeriods = periods.filter((p) => p.status === "fechado").length;

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Você não tem permissão para visualizar períodos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Períodos</h1>
            <p className="text-gray-600 mt-2">Gerencie os períodos contábeis</p>
          </div>
          {canCreate && (
            <Button
              onClick={() => {
                resetForm();
                setIsCreateDialogOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Período
            </Button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPeriods}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Abertos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {openPeriods}
                  </p>
                </div>
                <Unlock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fechados</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {closedPeriods}
                  </p>
                </div>
                <Lock className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Períodos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Períodos</CardTitle>
            <CardDescription>
              Todos os períodos contábeis cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : periods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum período encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Data Fim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell className="font-medium">{period.id}</TableCell>
                      <TableCell>
                        {new Date(period.dataInicio).toLocaleDateString(
                          "pt-BR",
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(period.dataFim).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            period.status === "aberto" ? "default" : "secondary"
                          }
                          className={
                            period.status === "aberto"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {period.status === "aberto" ? (
                            <>
                              <Unlock className="w-3 h-3 mr-1" />
                              Aberto
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Fechado
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{period.quantidadeNotas || 0}</TableCell>
                      <TableCell>
                        R$ {(period.valorTotal || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEdit && (
                              <DropdownMenuItem
                                onClick={() => openEditDialog(period)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            )}
                            {canEdit && period.status === "aberto" && (
                              <DropdownMenuItem
                                onClick={() => openCloseDialog(period)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Fechar Período
                              </DropdownMenuItem>
                            )}
                            {canEdit && period.status === "fechado" && (
                              <DropdownMenuItem
                                onClick={() => openReopenDialog(period)}
                                className="text-amber-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reabrir Período
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(period.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialog Criar */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Período</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo período contábil
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, dataInicio: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) =>
                    setFormData({ ...formData, dataFim: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate} className="bg-indigo-600">
                Criar Período
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Editar */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Período</DialogTitle>
              <DialogDescription>
                Altere as informações do período contábil
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-dataInicio">Data de Início</Label>
                <Input
                  id="edit-dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, dataInicio: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-dataFim">Data de Fim</Label>
                <Input
                  id="edit-dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) =>
                    setFormData({ ...formData, dataFim: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-observacoes">Observações</Label>
                <Textarea
                  id="edit-observacoes"
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleEdit} className="bg-indigo-600">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Fechar Período */}
        <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fechar Período</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja fechar este período? Após fechar, não
                será possível adicionar novos lançamentos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="close-observacoes">
                  Observações (opcional)
                </Label>
                <Textarea
                  id="close-observacoes"
                  placeholder="Adicione observações sobre o fechamento..."
                  value={closeData.observacoes}
                  onChange={(e) =>
                    setCloseData({ observacoes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCloseDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleClosePeriod} className="bg-indigo-600">
                <Lock className="w-4 h-4 mr-2" />
                Fechar Período
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Reabrir Período */}
        <Dialog open={isReopenDialogOpen} onOpenChange={setIsReopenDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reabrir Período</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja reabrir este período? Isso permitirá
                novos lançamentos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reopen-motivo">Motivo da Reabertura</Label>
                <Textarea
                  id="reopen-motivo"
                  placeholder="Informe o motivo da reabertura..."
                  value={reopenData.motivo}
                  onChange={(e) => setReopenData({ motivo: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsReopenDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleReopenPeriod} className="bg-amber-600">
                <Unlock className="w-4 h-4 mr-2" />
                Reabrir Período
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este período? Esta ação não pode
                ser desfeita e todos os lançamentos associados também serão
                afetados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

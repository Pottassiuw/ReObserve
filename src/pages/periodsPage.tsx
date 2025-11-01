import { useState, useEffect, useMemo, useCallback } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Lock,
  Unlock,
  Trash2,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  listarPeriodos,
  buscarPeriodo,
  criarPeriodo,
  fecharPeriodo,
  reabrirPeriodo,
  deletarPeriodo,
  buscarLancamentosDisponiveis,
  type Period,
} from "@/api/endpoints/periods";

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [availableReleases, setAvailableReleases] = useState<any[]>([]);
  const [selectedReleases, setSelectedReleases] = useState<number[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [releaseSearchTerm, setReleaseSearchTerm] = useState("");

  const [createForm, setCreateForm] = useState({
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  });

  const [closeForm, setCloseForm] = useState({
    observacoes: "",
  });

  const [reopenForm, setReopenForm] = useState({
    motivo: "",
  });

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    setIsLoading(true);
    try {
      const data = await listarPeriodos();
      setPeriods(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadPeriods();
      toast.success("Períodos atualizados!");
    } catch (error) {
      toast.error("Erro ao atualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredPeriods = useMemo(() => {
    if (!searchTerm.trim()) return periods;

    const term = searchTerm.toLowerCase();
    return periods.filter((period) => {
      const id = period.id.toString();
      const inicio = new Date(period.dataInicio).toLocaleDateString("pt-BR");
      const fim = new Date(period.dataFim).toLocaleDateString("pt-BR");
      const status = period.fechado ? "fechado" : "aberto";
      const obs = period.observacoes?.toLowerCase() || "";

      return (
        id.includes(term) ||
        inicio.includes(term) ||
        fim.includes(term) ||
        status.includes(term) ||
        obs.includes(term)
      );
    });
  }, [periods, searchTerm]);

  const filteredAvailableReleases = useMemo(() => {
    if (!releaseSearchTerm.trim()) return availableReleases;

    const term = releaseSearchTerm.toLowerCase();
    return availableReleases.filter((release) => {
      const numero = release.notaFiscal?.numero?.toString() || "";
      const valor = release.notaFiscal?.valor?.toString() || "";

      return numero.toLowerCase().includes(term) || valor.includes(term);
    });
  }, [availableReleases, releaseSearchTerm]);

  const handleCreate = useCallback(async () => {
    if (!createForm.dataInicio || !createForm.dataFim) {
      toast.error("Preencha as datas");
      return;
    }

    try {
      await criarPeriodo(createForm);
      toast.success("Período criado!");
      setIsCreateOpen(false);
      setCreateForm({ dataInicio: "", dataFim: "", observacoes: "" });
      loadPeriods();
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [createForm]);

  const handleView = useCallback(async (period: Period) => {
    try {
      const detailed = await buscarPeriodo(period.id);
      setSelectedPeriod(detailed);
      setIsViewOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const handleOpenClose = useCallback(async (period: Period) => {
    try {
      setSelectedPeriod(period);
      const releases = await buscarLancamentosDisponiveis();
      setAvailableReleases(releases);
      setSelectedReleases([]);
      setReleaseSearchTerm("");
      setIsCloseOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const handleClose = async () => {
    if (!selectedPeriod) return;

    try {
      await fecharPeriodo(selectedPeriod.id, {
        lancamentosIds: selectedReleases,
        observacoes: closeForm.observacoes,
      });
      toast.success("Período fechado!");
      setIsCloseOpen(false);
      setCloseForm({ observacoes: "" });
      setSelectedReleases([]);
      loadPeriods();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReopen = async () => {
    if (!selectedPeriod) return;

    if (!reopenForm.motivo.trim()) {
      toast.error("Informe o motivo");
      return;
    }

    try {
      await reabrirPeriodo(selectedPeriod.id, reopenForm.motivo);
      toast.success("Período reaberto!");
      setIsReopenOpen(false);
      setReopenForm({ motivo: "" });
      loadPeriods();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedPeriod) return;

    try {
      await deletarPeriodo(selectedPeriod.id);
      toast.success("Período deletado!");
      setIsDeleteOpen(false);
      loadPeriods();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleRelease = useCallback((id: number) => {
    setSelectedReleases((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const toggleAllReleases = useCallback(() => {
    if (selectedReleases.length === filteredAvailableReleases.length) {
      setSelectedReleases([]);
    } else {
      setSelectedReleases(filteredAvailableReleases.map((r) => r.id));
    }
  }, [selectedReleases.length, filteredAvailableReleases]);

  const stats = useMemo(
    () => ({
      total: periods.length,
      abertos: periods.filter((p) => !p.fechado).length,
      fechados: periods.filter((p) => p.fechado).length,
    }),
    [periods],
  );

  if (isLoading && periods.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Períodos
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Gerencie os períodos contábeis
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
              className="flex-1 sm:flex-initial"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-indigo-600 flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas -  */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Abertos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.abertos}
                  </p>
                </div>
                <Unlock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fechados</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {stats.fechados}
                  </p>
                </div>
                <Lock className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Principal */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <CardTitle>Períodos Cadastrados</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {filteredPeriods.length} de {periods.length} períodos
                </CardDescription>
              </div>

              {/* Busca */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar períodos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredPeriods.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                {searchTerm
                  ? "Nenhum período encontrado"
                  : "Nenhum período cadastrado"}
              </p>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Fim</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lançamentos</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPeriods.map((period) => (
                        <TableRow key={period.id}>
                          <TableCell className="font-medium">
                            {period.id}
                          </TableCell>
                          <TableCell>
                            {new Date(period.dataInicio).toLocaleDateString(
                              "pt-BR",
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(period.dataFim).toLocaleDateString(
                              "pt-BR",
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                period.fechado
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-green-100 text-green-700"
                              }
                            >
                              {period.fechado ? (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  Fechado
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3 mr-1" />
                                  Aberto
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {period.lancamentos?.length || 0}
                          </TableCell>
                          <TableCell>
                            R$ {(period.valorTotal || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(period)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              {!period.fechado && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenClose(period)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}

                              {period.fechado && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPeriod(period);
                                    setIsReopenOpen(true);
                                  }}
                                  className="text-amber-600"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPeriod(period);
                                  setIsDeleteOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden space-y-3">
                  {filteredPeriods.map((period) => (
                    <Card key={period.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              Período #{period.id}
                            </p>
                            <Badge
                              className={`mt-1 ${
                                period.fechado
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {period.fechado ? "Fechado" : "Aberto"}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(period)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!period.fechado && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenClose(period)}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            {period.fechado && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPeriod(period);
                                  setIsReopenOpen(true);
                                }}
                              >
                                <XCircle className="w-4 h-4 text-amber-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPeriod(period);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Início</p>
                            <p className="font-medium">
                              {new Date(period.dataInicio).toLocaleDateString(
                                "pt-BR",
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fim</p>
                            <p className="font-medium">
                              {new Date(period.dataFim).toLocaleDateString(
                                "pt-BR",
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Lançamentos</p>
                            <p className="font-semibold">
                              {period.lancamentos?.length || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor Total</p>
                            <p className="font-semibold text-green-600">
                              R$ {(period.valorTotal || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialog Criar */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Criar Período</DialogTitle>
              <DialogDescription>
                Preencha os dados do período
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={createForm.dataInicio}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, dataInicio: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={createForm.dataFim}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, dataFim: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={createForm.observacoes}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      observacoes: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-indigo-600 w-full sm:w-auto"
              >
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Visualizar */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Detalhes do Período</DialogTitle>
            </DialogHeader>
            {selectedPeriod && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Início</Label>
                    <p className="font-medium">
                      {new Date(selectedPeriod.dataInicio).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Fim</Label>
                    <p className="font-medium">
                      {new Date(selectedPeriod.dataFim).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Status</Label>
                    <p>
                      <Badge
                        className={
                          selectedPeriod.fechado
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-700"
                        }
                      >
                        {selectedPeriod.fechado ? "Fechado" : "Aberto"}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Valor Total</Label>
                    <p className="font-medium">
                      R$ {(selectedPeriod.valorTotal || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {selectedPeriod.observacoes && (
                  <div>
                    <Label className="text-sm text-gray-600">Observações</Label>
                    <p className="text-sm mt-1">{selectedPeriod.observacoes}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Lançamentos ({selectedPeriod.lancamentos?.length || 0})
                  </Label>
                  {selectedPeriod.lancamentos &&
                  selectedPeriod.lancamentos.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>NF-e</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Valor</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedPeriod.lancamentos.map((lanc: any) => (
                              <TableRow key={lanc.id}>
                                <TableCell>{lanc.notaFiscal?.numero}</TableCell>
                                <TableCell>
                                  {new Date(
                                    lanc.data_lancamento,
                                  ).toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell>
                                  R$ {(lanc.notaFiscal?.valor || 0).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum lançamento</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog Fechar*/}
        <Dialog open={isCloseOpen} onOpenChange={setIsCloseOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Fechar Período</DialogTitle>
              <DialogDescription>
                Selecione os lançamentos para incluir ({selectedReleases.length}{" "}
                selecionados)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Lançamentos Disponíveis</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllReleases}
                  >
                    {selectedReleases.length ===
                    filteredAvailableReleases.length
                      ? "Desmarcar Todos"
                      : "Selecionar Todos"}
                  </Button>
                </div>

                {/* Busca dentro do modal */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar lançamentos..."
                    value={releaseSearchTerm}
                    onChange={(e) => setReleaseSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  {filteredAvailableReleases.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      {releaseSearchTerm
                        ? "Nenhum lançamento encontrado"
                        : "Nenhum lançamento disponível"}
                    </p>
                  ) : (
                    filteredAvailableReleases.map((release) => (
                      <div
                        key={release.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => toggleRelease(release.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedReleases.includes(release.id)}
                          onChange={() => toggleRelease(release.id)}
                          className="w-4 h-4"
                        />
                        <span className="flex-1 text-sm">
                          NF-e: {release.notaFiscal?.numero} - R${" "}
                          {(release.notaFiscal?.valor || 0).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={closeForm.observacoes}
                  onChange={(e) =>
                    setCloseForm({ observacoes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCloseOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleClose}
                className="bg-indigo-600 w-full sm:w-auto"
              >
                Fechar Período
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Reabrir */}
        <Dialog open={isReopenOpen} onOpenChange={setIsReopenOpen}>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Reabrir Período</DialogTitle>
              <DialogDescription>
                Informe o motivo da reabertura
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label>Motivo *</Label>
              <Textarea
                value={reopenForm.motivo}
                onChange={(e) => setReopenForm({ motivo: e.target.value })}
                placeholder="Descreva o motivo..."
              />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsReopenOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleReopen}
                className="bg-amber-600 w-full sm:w-auto"
              >
                Reabrir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Deletar */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent className="max-w-md mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza? Os lançamentos não serão deletados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
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

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Search,
  X,
  RefreshCw,
} from "lucide-react";
import ReleaseModal from "@/components/releaseModal";
import { useReleasesManagement } from "@/hooks/useReleasesManagement";
import { toast } from "sonner";

type ModalMode = "view" | "edit" | "create";

export default function ReleasesPage() {
  const {
    releases,
    isLoading,
    loadReleases,
    createRelease,
    deleteRelease,
    setCurrentRelease,
    canCreate,
    canEdit,
    canDelete,
    canView,
    empresaId,
    usuarioId,
  } = useReleasesManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (canView) {
      loadReleases();
    }
  }, [canView, loadReleases]);

  const filteredReleases = useMemo(() => {
    if (!searchTerm.trim()) return releases;

    const term = searchTerm.toLowerCase();
    return releases.filter((release) => {
      const numero = release.notaFiscal?.numero?.toString() || "";
      const valor = release.notaFiscal?.valor?.toString() || "";
      const lat = release.latitude?.toFixed(4) || "";
      const lng = release.longitude?.toFixed(4) || "";

      return (
        numero.toLowerCase().includes(term) ||
        valor.includes(term) ||
        lat.includes(term) ||
        lng.includes(term)
      );
    });
  }, [releases, searchTerm]);

  const openModal = useCallback(
    (mode: ModalMode, release = null) => {
      setModalMode(mode);
      setSelectedRelease(release);
      setCurrentRelease(release);
      setIsModalOpen(true);
    },
    [setCurrentRelease],
  );

  const handleCreate = useCallback(() => {
    if (!canCreate) {
      toast.error("Você não tem permissão para criar lançamentos");
      return;
    }
    openModal("create");
  }, [canCreate, openModal]);

  const handleView = useCallback(
    (release: any) => {
      openModal("view", release);
    },
    [openModal],
  );
  const handleEdit = useCallback(
    (release: any) => {
      if (!canEdit) {
        toast.error("Você não tem permissão para editar lançamentos");
        return;
      }
      openModal("edit", release);
    },
    [canEdit, openModal],
  );
  const handleDeleteClick = useCallback(
    (id: number) => {
      if (!canDelete) {
        toast.error("Você não tem permissão para deletar lançamentos");
        return;
      }
      setReleaseToDelete(id);
      setDeleteDialogOpen(true);
    },
    [canDelete],
  );

  const confirmDelete = async () => {
    if (!releaseToDelete) return;
    try {
      await deleteRelease(releaseToDelete);
      setDeleteDialogOpen(false);
      setReleaseToDelete(null);
      toast.success("Lançamento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao excluir lançamento");
    }
  };

  const handleModalSave = async (data: any) => {
    try {
      await createRelease(data);
      setIsModalOpen(false);
      setSelectedRelease(null);
      loadReleases();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadReleases();
      toast.success("Dados atualizados!");
    } catch (error) {
      toast.error("Erro ao atualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearSearch = () => setSearchTerm("");
  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Você não tem permissão para visualizar lançamentos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header Responsivo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Lançamentos
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Gerencie seus lançamentos de notas fiscais
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
            {canCreate && (
              <Button
                onClick={handleCreate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <CardTitle>Lista de Lançamentos</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {filteredReleases.length} de {releases.length} lançamentos
                </CardDescription>
              </div>

              {/* Busca */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, valor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
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
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredReleases.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm
                    ? "Nenhum lançamento encontrado com esse filtro"
                    : "Nenhum lançamento cadastrado"}
                </p>
                {searchTerm && (
                  <Button variant="link" onClick={clearSearch} className="mt-2">
                    Limpar filtro
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* VERSÃO DESKTOP - Tabela */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número da Nota</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReleases.map((release) => (
                        <TableRow key={release.id}>
                          <TableCell className="font-medium">
                            {release.notaFiscal?.numero ||
                              release.notaFiscalId ||
                              "-"}
                          </TableCell>
                          <TableCell>
                            {release.notaFiscal?.valor
                              ? `R$ ${release.notaFiscal.valor.toFixed(2)}`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {release.latitude?.toFixed(4)},{" "}
                            {release.longitude?.toFixed(4)}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              release.data_lancamento,
                            ).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleView(release)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Visualizar
                                </DropdownMenuItem>
                                {canEdit && (
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(release)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                )}
                                {canDelete && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteClick(release.id)
                                      }
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
                </div>

                {/* VERSÃO MOBILE - Cards */}
                <div className="md:hidden space-y-3">
                  {filteredReleases.map((release) => (
                    <Card key={release.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">
                              Nota Fiscal
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {release.notaFiscal?.numero ||
                                release.notaFiscalId ||
                                "-"}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleView(release)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              {canEdit && (
                                <DropdownMenuItem
                                  onClick={() => handleEdit(release)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              {canDelete && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteClick(release.id)
                                    }
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Valor</p>
                            <p className="font-semibold text-green-600">
                              {release.notaFiscal?.valor
                                ? `R$ ${release.notaFiscal.valor.toFixed(2)}`
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Data</p>
                            <p className="font-medium">
                              {new Date(
                                release.data_lancamento,
                              ).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-600">Localização</p>
                            <p className="font-mono text-xs text-gray-700">
                              {release.latitude?.toFixed(4)},{" "}
                              {release.longitude?.toFixed(4)}
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
        {/* Modal de Lançamento */}
        <ReleaseModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          release={selectedRelease}
          mode={modalMode}
          onSave={handleModalSave}
          usuarioId={usuarioId}
          empresaId={empresaId}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este lançamento? Esta ação não
                pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
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

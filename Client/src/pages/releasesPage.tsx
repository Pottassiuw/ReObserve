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
import { Plus, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import ReleaseModal from "@/components/releaseModal";
import { useReleasesManagement } from "@/hooks/useReleasesManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function ReleasesPage() {
  const {
    releases,
    isLoading,
    error,
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
  const [editingRelease, setEditingRelease] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (canView) {
      loadReleases();
    }
  }, [canView, loadReleases]);

  const handleNew = () => {
    if (!canCreate) {
      toast.error("Você não tem permissão para criar lançamentos");
      return;
    }
    setEditingRelease(null);
    setCurrentRelease(null);
    setIsModalOpen(true);
  };

  const handleEdit = (release: any) => {
    if (!canEdit) {
      toast.error("Você não tem permissão para editar lançamentos");
      return;
    }
    setEditingRelease(release);
    setCurrentRelease(release);
    setIsModalOpen(true);
  };

  const handleView = (release: any) => {
    setEditingRelease(release);
    setCurrentRelease(release);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (!canDelete) {
      toast.error("Você não tem permissão para deletar lançamentos");
      return;
    }
    setReleaseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (releaseToDelete) {
      try {
        await deleteRelease(releaseToDelete);
        setDeleteDialogOpen(false);
        setReleaseToDelete(null);
        toast.success("Lançamento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar:", error);
        toast.error("Erro ao excluir lançamento");
      }
    }
  };

  const handleModalSave = async (dados: any) => {
    try {
      await createRelease(dados);
      setIsModalOpen(false);
      setEditingRelease(null);
      loadReleases();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      // O erro já é tratado no hook e exibido via toast
    }
  };

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Você não tem permissão para visualizar lançamentos.
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
            <h1 className="text-3xl font-bold text-gray-900">Lançamentos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie seus lançamentos de notas fiscais
            </p>
          </div>
          {canCreate && (
            <Button
              onClick={handleNew}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Lançamento
            </Button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabela de Lançamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Lançamentos</CardTitle>
            <CardDescription>
              Todos os lançamentos de notas fiscais realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : releases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum lançamento encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Nota Fiscal</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {releases.map((release) => (
                    <TableRow key={release.id}>
                      <TableCell className="font-medium">
                        {release.id}
                      </TableCell>
                      <TableCell>
                        {new Date(release.data_lancamento).toLocaleDateString(
                          "pt-BR",
                        )}
                      </TableCell>
                      <TableCell>
                        {release.notaFiscal?.numero ||
                          release.notaFiscalId ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        {release.notaFiscal?.valor
                          ? `R$ ${release.notaFiscal.valor.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {release.latitude?.toFixed(4)},{" "}
                        {release.longitude?.toFixed(4)}
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
                                  onClick={() => handleDeleteClick(release.id)}
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

        {/* Modal - CORRIGIDO: Passar empresaId e usuarioId do hook */}
        <ReleaseModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          lancamento={editingRelease}
          onSalvar={handleModalSave}
          usuarioId={usuarioId}
          empresaId={empresaId}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este lançamento? Esta ação não
                pode ser desfeita.
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

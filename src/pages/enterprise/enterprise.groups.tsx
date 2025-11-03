import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Shield, Trash2, Check, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Permissoes } from "@/stores/permissionsStore";
import { criarGrupo, deletarGrupo, listarGrupos } from "@/api/endpoints/groups";
import type { Grupo } from "@/types";

const grupoSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .trim(),
  permissoes: z
    .array(z.nativeEnum(Permissoes))
    .min(1, "Selecione pelo menos uma permissão"),
});

const permissoesLabels: Record<Permissoes, string> = {
  [Permissoes.admin]: "Administrador",
  [Permissoes.lancamento]: "Criar Lançamentos",
  [Permissoes.periodo]: "Criar Períodos",
  [Permissoes.verLancamentos]: "Visualizar Lançamentos",
  [Permissoes.editarLancamentos]: "Editar Lançamentos",
  [Permissoes.verPeriodos]: "Visualizar Períodos",
  [Permissoes.editarPeriodos]: "Editar Períodos",
  [Permissoes.deletarLancamentos]: "Deletar Lançamentos",
  [Permissoes.deletarPeriodos]: "Deletar Períodos",
};

const permissoesDescricoes: Record<Permissoes, string> = {
  [Permissoes.admin]: "Acesso total ao sistema",
  [Permissoes.lancamento]: "Permite criar novos lançamentos",
  [Permissoes.periodo]: "Permite criar novos períodos",
  [Permissoes.verLancamentos]: "Permite visualizar lançamentos existentes",
  [Permissoes.editarLancamentos]: "Permite modificar lançamentos",
  [Permissoes.verPeriodos]: "Permite visualizar períodos",
  [Permissoes.editarPeriodos]: "Permite modificar períodos",
  [Permissoes.deletarLancamentos]: "Permite excluir lançamentos",
  [Permissoes.deletarPeriodos]: "Permite excluir períodos",
};

export default function EnterpriseGroups() {
  const { userId } = useAuthStore();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [grupoToDelete, setGrupoToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    permissoes: [] as string[],
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (userId) {
      loadGrupos();
    }
  }, [userId]);

  const loadGrupos = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await listarGrupos(userId);
      setGrupos(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar grupos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ nome: "", permissoes: [] });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ nome: "", permissoes: [] });
    setValidationErrors({});
  };

  const togglePermissao = (permissao: string) => {
    setFormData((prev: any) => ({
      ...prev,
      permissoes: prev.permissoes.includes(permissao)
        ? prev.permissoes.filter((p: string) => p !== permissao)
        : [...prev.permissoes, permissao],
    }));
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    const toastId = toast.loading("Criando grupo...");

    try {
      grupoSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as string] = error.message;
          }
        });
        setValidationErrors(errors);
        toast.dismiss(toastId);
        return;
      }
    }

    try {
      if (!userId) throw new Error("ID não existe");

      await criarGrupo({
        nome: formData.nome,
        permissoes: formData.permissoes,
        empresaId: userId,
      });

      toast.success("Grupo criado!", { id: toastId });
      handleCloseModal();
      loadGrupos();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar grupo", { id: toastId });
    }
  };

  const handleDeleteClick = (id: number) => {
    setGrupoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!grupoToDelete) return;

    const toastId = toast.loading("Deletando grupo...");
    try {
      await deletarGrupo(grupoToDelete);
      toast.success("Grupo deletado!", { id: toastId });
      setDeleteDialogOpen(false);
      setGrupoToDelete(null);
      loadGrupos();
    } catch (err: any) {
      toast.error(err.message || "Erro ao deletar grupo", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Grupos e Permissões
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Gerencie os grupos de usuários e suas permissões
            </p>
          </div>
          <Button
            onClick={handleOpenModal}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Grupo
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Card de Resumo */}
        <div className="mb-6 md:mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Grupos
                  </p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {grupos.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100">
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Grupos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-500">Carregando grupos...</p>
            </div>
          ) : grupos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gray-100">
                  <Shield className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-500 font-medium">
                Nenhum grupo encontrado
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Crie seu primeiro grupo para organizar permissões
              </p>
            </div>
          ) : (
            grupos.map((grupo: any) => (
              <Card
                key={grupo.id}
                className="hover:shadow-lg transition-all border-0"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-indigo-900">
                      {grupo.nome}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(grupo.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {grupo.permissoes?.length || 0} permissões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {grupo.permissoes?.slice(0, 4).map((perm: any) => (
                      <div
                        key={perm}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {permissoesLabels[perm as Permissoes] || perm}
                        </span>
                      </div>
                    ))}
                    {grupo.permissoes && grupo.permissoes.length > 4 && (
                      <p className="text-sm text-indigo-600 font-medium mt-2">
                        +{grupo.permissoes.length - 4} mais...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-indigo-900">
                      Novo Grupo
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure o nome e as permissões
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Grupo *</label>
                  <input
                    type="text"
                    placeholder="Ex: Gerentes, Operadores"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      validationErrors.nome ? "border-red-500" : ""
                    }`}
                  />
                  {validationErrors.nome && (
                    <p className="text-sm text-red-600">
                      {validationErrors.nome}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Permissões *</label>
                  <div
                    className={`border rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto ${
                      validationErrors.permissoes ? "border-red-500" : ""
                    }`}
                  >
                    {Object.values(Permissoes).map((permissao) => (
                      <div
                        key={permissao}
                        className="flex items-start space-x-3 p-3 bg-white rounded-md border hover:border-indigo-300 transition-colors cursor-pointer"
                        onClick={() => togglePermissao(permissao)}
                      >
                        <div className="flex items-center h-5 mt-0.5">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              formData.permissoes.includes(permissao)
                                ? "bg-indigo-600 border-indigo-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.permissoes.includes(permissao) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="text-sm font-medium text-gray-900 cursor-pointer block">
                            {permissoesLabels[permissao]}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {permissoesDescricoes[permissao]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {validationErrors.permissoes && (
                    <p className="text-sm text-red-600">
                      {validationErrors.permissoes}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 md:p-6 border-t flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                >
                  Criar Grupo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este grupo? Esta ação não pode
                ser desfeita.
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

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Shield, Users, Edit, Trash2, Check, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Permissoes } from "@/stores/permissionsStore";
import { deletarGrupo, listarGrupos } from "@/api/endpoints/groups";
import type { Grupo } from "@/types";
import { useGroups } from "@/hooks/useGroups";
import { useEnterpriseStore } from "@/stores/enterpriseStore";
// Schema de validação com Zod
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
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [grupoToDelete, setGrupoToDelete] = useState<number | null>(null);
  const { enterprise } = useEnterpriseStore();
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

  const handleOpenModal = (grupo?: Grupo) => {
    if (grupo) {
      setEditingGrupo(grupo);
      setFormData({
        nome: grupo.nome,
        permissoes: grupo.permissoes || [],
      });
    } else {
      setEditingGrupo(null);
      setFormData({
        nome: "",
        permissoes: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGrupo(null);
    setFormData({
      nome: "",
      permissoes: [],
    });
    setValidationErrors({});
  };

  const togglePermissao = (permissao: string) => {
    setFormData((prev) => ({
      ...prev,
      permissoes: prev.permissoes.includes(permissao)
        ? prev.permissoes.filter((p) => p !== permissao)
        : [...prev.permissoes, permissao],
    }));
  };

  const handleSubmit = async () => {
    // Limpar erros anteriores
    setValidationErrors({});
    setError(null);

    // Validação com Zod
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
        return;
      }
    }

    try {
      // TODO: Implementar criarGrupo e atualizarGrupo
      // if (editingGrupo) {
      //   await atualizarGrupo(editingGrupo.id, formData);
      // } else {
      //   await criarGrupo(userId, formData);
      // }

      console.log("✅ Salvando grupo:", formData);
      handleCloseModal();
      loadGrupos();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar grupo");
    }
  };

  const handleDeleteClick = (id: number) => {
    setGrupoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (grupoToDelete) {
      try {
        if (!enterprise) {
          setError("Erro ao deletar grupo");
          return;
        }
        await deletarGrupo(grupoToDelete);
        console.log("Deletando grupo:", grupoToDelete);
        setDeleteDialogOpen(false);
        setGrupoToDelete(null);
        loadGrupos();
      } catch (err: any) {
        setError(err.message || "Erro ao deletar grupo");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Grupos e Permissões
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os grupos de usuários e suas permissões
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Grupo
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Grupos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {grupos.length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Grupos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Carregando grupos...</p>
            </div>
          ) : grupos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum grupo encontrado</p>
              <p className="text-sm text-gray-400 mt-2">
                Crie seu primeiro grupo para organizar permissões
              </p>
            </div>
          ) : (
            grupos.map((grupo) => (
              <Card
                key={grupo.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{grupo.nome}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(grupo)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(grupo.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {grupo.permissoes?.length || 0} permissões configuradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {grupo.permissoes?.slice(0, 4).map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-green-600 mr-2" />
                        {permissoesLabels[perm as Permissoes] || perm}
                      </div>
                    ))}
                    {grupo.permissoes && grupo.permissoes.length > 4 && (
                      <p className="text-sm text-gray-500 mt-2">
                        +{grupo.permissoes.length - 4} mais...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de Criar/Editar Grupo */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-indigo-600">
                      {editingGrupo ? "Editar Grupo" : "Novo Grupo"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure o nome e as permissões do grupo
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

              <div className="p-6 space-y-6">
                {/* Nome do Grupo */}
                <div className="space-y-2">
                  <label className="text-md font-medium">Nome do Grupo *</label>
                  <input
                    type="text"
                    placeholder="Ex: Gerentes, Operadores, etc."
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className={`w-full px-3 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      validationErrors.nome ? "border-red-500" : ""
                    }`}
                  />
                  {validationErrors.nome && (
                    <p className="text-sm text-red-600">
                      {validationErrors.nome}
                    </p>
                  )}
                </div>

                {/* Permissões */}
                <div className="space-y-3">
                  <label className="text-md font-medium">Permissões *</label>
                  <div
                    className={`border rounded-lg mt-2 p-5 space-y-3 bg-gray-50 max-h-96 overflow-y-auto ${
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
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
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
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900 cursor-pointer">
                            {permissoesLabels[permissao]}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {permissoesDescricoes[permissao]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {validationErrors.permissoes ? (
                    <p className="text-sm text-red-600">
                      {validationErrors.permissoes}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Selecione as permissões que este grupo terá acesso
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingGrupo ? "Salvar Alterações" : "Criar Grupo"}
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
                Tem certeza que deseja excluir este grupo? Usuários associados a
                este grupo perderão suas permissões. Esta ação não pode ser
                desfeita.
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

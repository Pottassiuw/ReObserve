import { useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
import { Users, Mail, Calendar, Shield, Trash2, AlertTriangle } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import {
  retornarUsuario,
  deletarUsuarioEmpresa,
  deletarTodosUsuariosEmpresa,
} from "@/api/endpoints/users";
import { toast } from "sonner";

export default function UserView() {
  const { user, isLoading, retornarUsuarios } = useUserStore();
  const { userId, userType } = useAuthStore();
  const { isAdmin } = usePermissionsStore();

  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("");
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [empresaId, setEmpresaId] = useState<number | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!userId) return;

      if (userType === "user" && !isAdmin()) {
        console.log("Usuário não tem permissão de admin para visualizar outros usuários");
        return;
      }

      try {
        let targetId = userId;
        if (userType === "enterprise") {
          targetId = userId;
          setEmpresaId(userId);
        } 
        else if (userType === "user") {
          const userData = await retornarUsuario(userId);
          targetId = userData.empresaId || userId;
          setEmpresaId(userData.empresaId || null);
        }

        console.log("Buscando usuários para empresa:", targetId);
        retornarUsuarios(targetId);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    loadUsers();
  }, [userId, userType]);

  const reloadUsers = useCallback(async () => {
    if (!empresaId) return;
    try {
      await retornarUsuarios(empresaId);
    } catch (error) {
      console.error("Erro ao recarregar usuários:", error);
    }
  }, [empresaId, retornarUsuarios]);

  const handleDeleteUser = useCallback((usuarioId: number) => {
    // Verificar se o usuário está tentando se deletar
    if (userType === "user" && usuarioId === userId) {
      toast.error("Você não pode deletar a si mesmo. Entre em contato com um administrador da empresa.");
      return;
    }
    setUserToDelete(usuarioId);
    setDeleteUserDialogOpen(true);
  }, [userId, userType]);

  const confirmDeleteUser = useCallback(async () => {
    if (!userToDelete || !empresaId) return;

    // Verificação adicional antes de deletar
    if (userType === "user" && userToDelete === userId) {
      toast.error("Você não pode deletar a si mesmo.");
      setDeleteUserDialogOpen(false);
      setUserToDelete(null);
      return;
    }

    setIsDeleting(true);
    try {
      await deletarUsuarioEmpresa(empresaId, userToDelete);
      toast.success("Usuário deletado com sucesso!");
      setDeleteUserDialogOpen(false);
      setUserToDelete(null);
      await reloadUsers();
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar usuário");
    } finally {
      setIsDeleting(false);
    }
  }, [userToDelete, empresaId, userId, userType, reloadUsers]);

  const handleDeleteAll = useCallback(() => {
    setDeleteAllConfirmText("");
    setDeleteAllDialogOpen(true);
  }, []);

  const confirmDeleteAll = useCallback(async () => {
    if (!empresaId) return;

    if (deleteAllConfirmText !== "DELETAR TODOS") {
      toast.error('Digite "DELETAR TODOS" para confirmar');
      return;
    }

    setIsDeleting(true);
    try {
      await deletarTodosUsuariosEmpresa(empresaId);
      
      // Se for usuário admin, informar que ele não foi deletado
      if (userType === "user") {
        toast.success("Todos os usuários foram deletados com sucesso! (Você não foi deletado por motivos de segurança)");
      } else {
        toast.success("Todos os usuários foram deletados com sucesso!");
      }
      
      setDeleteAllDialogOpen(false);
      setDeleteAllConfirmText("");
      await reloadUsers();
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar usuários");
    } finally {
      setIsDeleting(false);
    }
  }, [empresaId, deleteAllConfirmText, userType, reloadUsers]);

  const users = Array.isArray(user) ? user : [];
  const adminCount = users.filter((u) => u.grupo?.nome === "admin").length;
  const regularCount = users.length - adminCount;
  const canDelete = userType === "enterprise" || isAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header Responsivo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
              Usuários
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Visualize e gerencie todos os usuários da sua empresa
            </p>
          </div>
          {canDelete && users.length > 0 && (
            <Button
              onClick={handleDeleteAll}
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar Todos
            </Button>
          )}
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    Total de Usuários
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-indigo-900">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      users.length
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    Administradores
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-purple-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      adminCount
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    Usuários Regulares
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      regularCount
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg md:text-xl">Lista de Usuários</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {isLoading ? (
                  "Carregando..."
                ) : (
                  `${users.length} ${users.length === 1 ? "usuário cadastrado" : "usuários cadastrados"}`
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            {isLoading && users.length === 0 ? (
              <div className="space-y-3 p-4 md:p-0">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm md:text-base text-muted-foreground">
                  Nenhum usuário encontrado
                </p>
              </div>
            ) : (
              <>
                {/* Versão Desktop - Tabela */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead className="w-[150px]">Data de Criação</TableHead>
                        {canDelete && <TableHead className="w-[100px] text-right">Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((usuario) => (
                        <TableRow key={usuario.id} className="hover:bg-slate-50/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                                <span className="text-indigo-700 font-semibold text-sm">
                                  {usuario.nome?.charAt(0).toUpperCase() || "U"}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">
                                {usuario.nome}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{usuario.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                usuario.grupo?.nome === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                usuario.grupo?.nome === "admin"
                                  ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                              }
                            >
                              {usuario.grupo?.nome || "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {usuario.dataCriacao
                                  ? new Date(
                                      usuario.dataCriacao,
                                    ).toLocaleDateString("pt-BR")
                                  : "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          {canDelete && (
                            <TableCell className="text-right">
                              {userType === "user" && usuario.id === userId ? (
                                <span className="text-xs text-muted-foreground italic">
                                  Você
                                </span>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(usuario.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Versão Mobile - Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {users.map((usuario) => (
                    <Card
                      key={usuario.id}
                      className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-indigo-700 font-semibold text-base">
                              {usuario.nome?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate mb-1">
                              {usuario.nome}
                            </h3>
                            <Badge
                              variant={
                                usuario.grupo?.nome === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                usuario.grupo?.nome === "admin"
                                  ? "bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs"
                              }
                            >
                              {usuario.grupo?.nome || "Pendente"}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                              {usuario.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600">
                              {usuario.dataCriacao
                                ? new Date(
                                    usuario.dataCriacao,
                                  ).toLocaleDateString("pt-BR")
                                : "N/A"}
                            </span>
                          </div>
                          {canDelete && (userType !== "user" || usuario.id !== userId) && (
                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(usuario.id)}
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Deletar Usuário
                              </Button>
                            </div>
                          )}
                          {canDelete && userType === "user" && usuario.id === userId && (
                            <div className="pt-2">
                              <p className="text-xs text-muted-foreground italic text-center">
                                Você não pode deletar a si mesmo
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Confirmação - Deletar Usuário */}
        <AlertDialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen}>
          <AlertDialogContent className="max-w-md mx-4">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <AlertDialogTitle className="text-xl">
                  Confirmar Exclusão
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-base pt-2">
                {userToDelete === userId && userType === "user" ? (
                  <span className="text-red-600 font-semibold">
                    Você não pode deletar a si mesmo. Esta ação é bloqueada por motivos de segurança.
                  </span>
                ) : (
                  "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita e todos os dados relacionados a este usuário serão perdidos permanentemente."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              <AlertDialogCancel 
                className="w-full sm:w-auto"
                disabled={isDeleting}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteUser}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting || (userToDelete === userId && userType === "user")}
              >
                {userToDelete === userId && userType === "user" ? (
                  "Bloqueado"
                ) : isDeleting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Deletando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sim, Deletar
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de Confirmação Dupla - Deletar Todos */}
        <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
          <AlertDialogContent className="max-w-md mx-4">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl text-red-600">
                    Atenção: Ação Irreversível
                  </AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="text-base pt-2 space-y-3">
                <p className="font-semibold text-red-600">
                  Você está prestes a deletar TODOS os usuários da empresa!
                </p>
                <p>
                  Esta ação irá remover permanentemente <strong>{userType === "user" ? users.length - 1 : users.length} {userType === "user" ? (users.length - 1 === 1 ? "usuário" : "usuários") : (users.length === 1 ? "usuário" : "usuários")}</strong> e todos os dados relacionados.
                  {userType === "user" && (
                    <span className="block mt-2 text-amber-600 font-semibold">
                      ⚠️ Você não será deletado por motivos de segurança.
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground pt-2 border-t">
                  Para confirmar, digite <strong className="text-red-600">DELETAR TODOS</strong> no campo abaixo:
                </p>
                <div className="pt-2">
                  <Label htmlFor="confirm-text" className="text-sm font-medium">
                    Confirmação
                  </Label>
                  <Input
                    id="confirm-text"
                    value={deleteAllConfirmText}
                    onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                    placeholder="Digite: DELETAR TODOS"
                    className="mt-1.5"
                    disabled={isDeleting}
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              <AlertDialogCancel 
                className="w-full sm:w-auto"
                disabled={isDeleting}
                onClick={() => setDeleteAllConfirmText("")}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteAll}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting || deleteAllConfirmText !== "DELETAR TODOS"}
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Deletando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar Todos os Usuários
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
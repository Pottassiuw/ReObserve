import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Mail, Calendar } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { retornarUsuario } from "@/api/endpoints/users";

export default function UserView() {
  const { user, isLoading, retornarUsuarios } = useUserStore();
  const { userId, userType } = useAuthStore();
  const { isAdmin } = usePermissionsStore();

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
        } 
        else if (userType === "user") {
          const userData = await retornarUsuario(userId);
          targetId = userData.empresaId || userId;
        }

        console.log("Buscando usuários para empresa:", targetId);
        retornarUsuarios(targetId);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    loadUsers();
  }, [userId, userType]);

  const users = Array.isArray(user) ? user : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600 mt-2">
              Visualize todos os usuários da sua empresa
            </p>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Usuários
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Administradores
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.grupo?.nome === "admin").length}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>
              Todos os usuários cadastrados na sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Nome
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Função
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Data de Criação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usuario) => (
                      <tr
                        key={usuario.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                              <span className="text-indigo-600 font-semibold text-sm">
                                {usuario.nome?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                            <span className="font-medium">{usuario.nome}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {usuario.email}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400">
                            {usuario.grupo?.nome
                              ? usuario.grupo.nome
                              : "Pendente..."}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {usuario.dataCriacao
                              ? new Date(
                                  usuario.dataCriacao,
                                ).toLocaleDateString("pt-BR")
                              : "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileEdit,
  Lock,
  UserPlus,
  Users,
  Boxes,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Logo from "@/assets/ProjectLogo.png";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { useAppNavigator } from "@/hooks/useAppNavigator";
import { useUserStore } from "@/stores/userStore";
import { useEnterpriseStore } from "@/stores/enterpriseStore";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { userType, logout } = useAuthStore();
  const { canViewRelease, canViewPeriod, isAdmin, permissionsLoaded } =
    usePermissionsStore();
  const { navigateToLogin } = useAppNavigator();
  const { user } = useUserStore();
  const { enterprise } = useEnterpriseStore();
  if (!permissionsLoaded) return null;
  const permissions = useMemo(
    () => ({
      canAccessDashboard: userType === "enterprise" || isAdmin(),
      canManageUsers: userType === "enterprise",
      showManagement: canViewRelease() || canViewPeriod(),
    }),
    [userType, isAdmin, canViewRelease, canViewPeriod],
  );

  const mainMenuItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        show: permissions.canAccessDashboard,
      },
      {
        id: "settings",
        label: "Configurações",
        icon: Settings,
        path: "/user/settings",
        show: true,
      },
    ],
    [permissions.canAccessDashboard],
  );

  const managementItems = useMemo(
    () => [
      {
        id: "releases",
        label: "Lançamentos",
        icon: FileEdit,
        path: "/releases",
        show: canViewRelease(),
      },
      {
        id: "periods",
        label: "Períodos",
        icon: Lock,
        path: "/periods",
        show: canViewPeriod(),
      },
    ],
    [canViewRelease, canViewPeriod],
  );

  const userManagementItems = useMemo(
    () => [
      {
        id: "create-user",
        label: "Criar Usuário",
        icon: UserPlus,
        path: "/user/create",
        show: permissions.canManageUsers,
      },
      {
        id: "manage-users",
        label: "Gerenciar Usuários",
        icon: Users,
        path: "/users/view",
        show: permissions.canManageUsers,
      },
      {
        id: "groups",
        label: "Grupos",
        icon: Boxes,
        path: "/groups",
        show: permissions.canManageUsers,
      },
    ],
    [permissions.canManageUsers],
  );

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout(userType === "enterprise" ? "enterprise" : "user");
      navigateToLogin();
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, [logout, userType, navigateToLogin]);

  const currentUser = useMemo(
    () => (Array.isArray(user) ? user[0] : user),
    [user],
  );

  const userDisplayName = useMemo(
    () =>
      userType === "enterprise"
        ? enterprise?.cnpj || "Empresa"
        : currentUser?.nome || "Usuário",
    [userType, enterprise, currentUser],
  );

  return (
    <Sidebar collapsible="icon">
      {/* Header com Logo */}
      <SidebarHeader className="border-b p-4">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavigation("/")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md group-hover:shadow-lg transition-all">
            <img src={Logo} alt="logo" className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-indigo-900">ReObserve</span>
            <span className="text-xs text-muted-foreground">
              Sistema de Gestão
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems
                .filter((item) => item.show)
                .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      className="group relative hover:bg-indigo-50 data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700 data-[active=true]:font-semibold transition-all rounded-lg"
                      onClick={() => handleNavigation(item.path)}
                      isActive={location.pathname === item.path}
                      tooltip={item.label}
                    >
                      <item.icon className="h-4 w-4 group-data-[active=true]:text-indigo-600" />
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gerenciamento */}
        {permissions.showManagement && (
          <>
            <Separator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                Gerenciamento
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {managementItems
                    .filter((item) => item.show)
                    .map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          className="group relative hover:bg-indigo-50 data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700 data-[active=true]:font-semibold transition-all rounded-lg"
                          onClick={() => handleNavigation(item.path)}
                          isActive={location.pathname.includes(item.path)}
                          tooltip={item.label}
                        >
                          <item.icon className="h-4 w-4 text-indigo-600" />
                          <span>{item.label}</span>
                          <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Usuários  */}
        {permissions.canManageUsers && (
          <>
            <Separator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                Usuários
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userManagementItems
                    .filter((item) => item.show)
                    .map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          className="group relative hover:bg-indigo-50 data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700 data-[active=true]:font-semibold transition-all rounded-lg"
                          onClick={() => handleNavigation(item.path)}
                          isActive={location.pathname === item.path}
                          tooltip={item.label}
                        >
                          <item.icon className="h-4 w-4 text-indigo-600" />
                          <span>{item.label}</span>
                          <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer com Perfil */}
      <SidebarFooter className="border-t p-4">
        <div className="space-y-3">
          {/* Card do Usuário */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-md flex-shrink-0">
              {userType === "enterprise" ? "E" : "U"}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate text-indigo-900">
                  {userType === "enterprise" ? "Empresa" : "Perfil"}
                </span>
                {isAdmin() && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-indigo-200 text-indigo-900"
                  >
                    Admin
                  </Badge>
                )}
              </div>
              <span className="text-xs text-indigo-700/70 truncate font-medium">
                {userDisplayName}
              </span>
            </div>
          </div>

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all group"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sair da conta</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

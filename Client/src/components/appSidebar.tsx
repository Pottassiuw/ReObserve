import { useNavigate, useLocation } from "react-router-dom";
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
  Search,
  History,
  Settings,
  BarChart3,
  FileEdit,
  LayoutDashboard,
  Lock,
} from "lucide-react";
import Logo from "@/assets/ProjectLogo.png";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { useAppNavigator } from "@/hooks/useAppNavigator";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { userType, logout } = useAuthStore();
  const { canViewRelease, canViewPeriod, isAdmin } = usePermissionsStore();
  const { navigateToLogin } = useAppNavigator();

  // Define quais páginas o usuário pode acessar
  const canAccessReports = userType === "enterprise" || isAdmin();
  const canAccessHistory = userType === "enterprise" || isAdmin();
  const canAccessSearch = userType === "enterprise" || isAdmin();
  const canAccessDashboard = userType === "enterprise" || isAdmin();

  const mainMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      show: canAccessDashboard,
    },
    {
      id: "search",
      label: "Consultar Notas",
      icon: Search,
      path: "/search",
      show: canAccessSearch,
    },
    {
      id: "history",
      label: "Histórico",
      icon: History,
      path: "/history",
      show: canAccessHistory,
    },
    {
      id: "reports",
      label: "Relatórios",
      icon: BarChart3,
      path: "/reports",
      show: canAccessReports,
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: "/user/settings",
      show: true,
    },
  ];

  // Mostrar seção de gerenciamento se tiver alguma permissão
  const showManagement = canViewRelease() || canViewPeriod();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate("/")}
            className="flex h-10 w-10 items-center justify-center rounded-lg shadow-sm cursor-pointer"
          >
            <img src={Logo} alt="logo" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-indigo-600">
              Lançamentos NF
            </span>
            <span className="text-xs text-muted-foreground">
              Gestão de Notas
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems
                .filter((item) => item.show)
                .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      className="hover:bg-indigo-50 data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700"
                      onClick={() => navigate(item.path)}
                      isActive={location.pathname === item.path}
                      tooltip={item.label}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showManagement && (
          <SidebarGroup>
            <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {canViewRelease() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-indigo-50 data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700"
                      onClick={() => navigate("/features/release")}
                      isActive={location.pathname.includes("/releases")}
                      tooltip="Lançamentos"
                    >
                      <FileEdit className="h-4 w-4 text-indigo-600" />
                      <span>Lançamentos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {canViewPeriod() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-indigo-50 data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700"
                      onClick={() => navigate("/features/period")}
                      isActive={location.pathname.includes("/periods")}
                      tooltip="Períodos"
                    >
                      <Lock className="h-4 w-4 text-indigo-600" />
                      <span>Períodos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {canAccessDashboard && (
          <SidebarGroup>
            <SidebarGroupLabel>Estatísticas Rápidas</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-3">
                <div className="flex justify-between items-center text-sm p-2 rounded-md bg-indigo-50/50">
                  <span className="text-muted-foreground">Hoje</span>
                  <span className="font-semibold text-indigo-700">
                    12 notas
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-md bg-indigo-50/50">
                  <span className="text-muted-foreground">Este mês</span>
                  <span className="font-semibold text-indigo-700">
                    284 notas
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-md bg-gradient-to-r from-indigo-50 to-indigo-100/50">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-indigo-700">
                    R$ 1.234.567,89
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-sm font-semibold shadow-md">
            {userType === "enterprise" ? "E" : "U"}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate text-indigo-900">
              {userType === "enterprise" ? "Minha Empresa" : "Meu Perfil"}
            </span>
            <span className="text-xs text-indigo-600/70 truncate">
              {isAdmin() && "Admin • "}
              {userType === "enterprise"
                ? "CNPJ: 12.345.678/0001-90"
                : "Usuário"}
            </span>
            <div>
              <span className="text-xs text-indigo-600/70 truncate">Sair</span>
              <button
                className="border-2 border-red-500 bg-transparent text-red-400"
                onClick={async () => {
                  try {
                    await logout(userType ? "user" : "enterprise");
                    navigateToLogin();
                  } catch (error: any) {
                    console.error(error);
                  }
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

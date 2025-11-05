import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useCallback, useEffect } from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  UserPlus,
  Users,
  FolderTree,
  Settings,
  LogOut,
  Building2,
  User,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { useAppNavigator } from "@/hooks/useAppNavigator";
import { useUserStore } from "@/stores/userStore";
import { useEnterpriseStore } from "@/stores/enterpriseStore";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setOpen, isMobile } = useSidebar();

  const { userType, logout, userId } = useAuthStore();
  const {
    canViewRelease,
    canViewPeriod,
    isAdmin,
    permissionsLoaded,
    permissions,
  } = usePermissionsStore();
  const { navigateToLogin } = useAppNavigator();
  const { user } = useUserStore();
  const { enterprise } = useEnterpriseStore();

  useEffect(() => {
    if (permissionsLoaded) {
      console.log("Permissões carregadas:", permissions);
    }
  }, [permissionsLoaded, permissions]);

  if (!permissionsLoaded || !userId) {
    return null;
  }

  const isAdminUser = isAdmin();
  const canSeeReleases = canViewRelease();
  const canSeePeriods = canViewPeriod();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      show: userType === "enterprise" || isAdminUser,
      group: "main",
    },
    {
      id: "releases",
      label: "Lançamentos",
      icon: FileText,
      path: "/releases",
      show: canSeeReleases,
      group: "management",
    },
    {
      id: "periods",
      label: "Períodos",
      icon: Calendar,
      path: "/periods",
      show: canSeePeriods,
      group: "management",
    },
    {
      id: "create-user",
      label: "Criar Usuário",
      icon: UserPlus,
      path: "/user/create",
      show: userType === "enterprise",
      group: "users",
    },
    {
      id: "manage-users",
      label: "Gerenciar Usuários",
      icon: Users,
      path: "/users/view",
      show: userType === "enterprise" || isAdminUser,
      group: "users",
    },
    {
      id: "groups",
      label: "Grupos",
      icon: FolderTree,
      path: "/groups",
      show: userType === "enterprise",
      group: "users",
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: userType === "enterprise" ? "/enterprise/settings" : "/user/settings",
      show: true,
      group: "main",
    },
  ];

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      // Fecha sidebar em mobile após navegação
      if (isMobile) {
        setOpen(false);
      }
    },
    [navigate, isMobile, setOpen],
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

  const getGroupItems = (group: string) => {
    return menuItems.filter((item) => item.show && item.group === group);
  };

  const hasManagement = getGroupItems("management").length > 0;
  const hasUsers = getGroupItems("users").length > 0;

  const isCollapsed = state === "collapsed";

  const renderMenuButton = (item: any) => {
    const isActive =
      item.group === "management"
        ? location.pathname.includes(item.path)
        : location.pathname === item.path;

    const button = (
      <SidebarMenuButton
        className={`group cursor-pointer relative transition-all duration-200
          ${isCollapsed 
            ? "w-10 h-10 justify-center rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50" 
            : "w-full justify-start rounded-lg"
          }
          ${
            isActive
              ? "bg-indigo-100 border-indigo-200 text-indigo-900 font-medium shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
          }`}
        onClick={() => handleNavigation(item.path)}
        isActive={isActive}
      >
        <item.icon
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-700"
          }`}
        />
        {!isCollapsed && <span className="text-sm ml-3">{item.label}</span>}
        {!isCollapsed && isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
        )}
      </SidebarMenuButton>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <Sidebar 
        collapsible="icon" 
        className="border-r bg-white h-screen"
      >
        <SidebarHeader className="border-b px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md flex-shrink-0">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-base text-slate-900">
                  ReObserve
                </span>
                <span className="text-xs text-slate-500">
                  Sistema de Gestão
                </span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          {/* Menu Principal */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className={isCollapsed ? "space-y-2" : "space-y-1"}>
                {getGroupItems("main").map((item) => (
                  <SidebarMenuItem key={item.id}>
                    {renderMenuButton(item)}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Gerenciamento */}
          {hasManagement && (
            <SidebarGroup className="mt-6">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                  Gerenciamento
                </SidebarGroupLabel>
              )}
              {isCollapsed && <div className="h-px bg-slate-200 mx-2 mb-2" />}
              <SidebarGroupContent>
                <SidebarMenu className={isCollapsed ? "space-y-2" : "space-y-1"}>
                  {getGroupItems("management").map((item) => (
                    <SidebarMenuItem key={item.id}>
                      {renderMenuButton(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Usuários */}
          {hasUsers && (
            <SidebarGroup className="mt-6">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                  Usuários
                </SidebarGroupLabel>
              )}
              {isCollapsed && <div className="h-px bg-slate-200 mx-2 mb-2" />}
              <SidebarGroupContent>
                <SidebarMenu className={isCollapsed ? "space-y-2" : "space-y-1"}>
                  {getGroupItems("users").map((item) => (
                    <SidebarMenuItem key={item.id}>
                      {renderMenuButton(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t p-4 bg-slate-50/50">
          <div className="space-y-2">
            {/* Perfil do Usuário */}
            {!isCollapsed ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex-shrink-0 shadow-sm">
                  {userType === "enterprise" ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-900 truncate">
                      {userType === "enterprise" ? "Empresa" : "Usuário"}
                    </span>
                    {isAdminUser && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 bg-indigo-100 text-indigo-700 border-0"
                      >
                        Admin
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 truncate">
                    {userDisplayName}
                  </span>
                </div>
              </div>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-2 border-slate-200 shadow-sm">
                      {userType === "enterprise" ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-center">
                    <div className="font-medium">
                      {userType === "enterprise" ? "Empresa" : "Usuário"}
                    </div>
                    <div className="text-xs opacity-80">{userDisplayName}</div>
                    {isAdminUser && (
                      <div className="text-xs mt-1 text-indigo-400">Admin</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Botão Sair */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200 ${
                    isCollapsed
                      ? "w-10 h-10 justify-center"
                      : "w-full px-3 py-2"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Sair</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Sair</TooltipContent>
              )}
            </Tooltip>
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
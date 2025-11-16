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
  ChevronRight,
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
import { cn } from "@/lib/utils";

export default function AppSidebarRedesigned() {
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
  const isCollapsed = state === "collapsed";

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
      group: "settings",
    },
  ];

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
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

  const renderMenuButton = (item: any) => {
    const isActive =
      item.group === "management"
        ? location.pathname.includes(item.path)
        : location.pathname === item.path;

    const button = (
      <SidebarMenuButton
        className={cn(
          "group relative flex items-center",
          "min-h-[44px] h-11",
          
          isCollapsed 
            ? "w-11 h-11 justify-center rounded-lg mx-auto" 
            : "w-full px-3 py-2.5 rounded-lg",
          
          isActive
            ? "bg-indigo-50 text-indigo-900"
            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
        )}
        onClick={() => handleNavigation(item.path)}
        isActive={isActive}
      >
        <item.icon
          className={cn(
            "w-5 h-5",
            isActive 
              ? "text-indigo-600" 
              : "text-slate-500 group-hover:text-indigo-600"
          )}
        />
        
        {!isCollapsed && (
          <span className="ml-3 text-sm">
            {item.label}
          </span>
        )}
      </SidebarMenuButton>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
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
        className="border-r border-slate-200 bg-white"
      >
        <SidebarHeader className={cn(
          "border-b border-slate-200",
          isCollapsed ? "px-3 py-4" : "px-4 py-4"
        )}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">
                  ReObserve
                </span>
                <span className="text-xs text-slate-500">
                  Sistema de Gestão
                </span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className={cn(
          isCollapsed ? "px-2 py-4" : "px-3 py-4"
        )}>
          <SidebarGroup className="mb-4">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {getGroupItems("main").map((item) => (
                  <SidebarMenuItem key={item.id}>
                    {renderMenuButton(item)}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {hasManagement && (
            <SidebarGroup className="mb-4">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-medium text-slate-500 px-3 mb-2">
                  Gerenciamento
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {getGroupItems("management").map((item) => (
                    <SidebarMenuItem key={item.id}>
                      {renderMenuButton(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {hasUsers && (
            <SidebarGroup className="mb-4">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-medium text-slate-500 px-3 mb-2">
                  Usuários
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {getGroupItems("users").map((item) => (
                    <SidebarMenuItem key={item.id}>
                      {renderMenuButton(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          <div className="mt-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {getGroupItems("settings").map((item) => (
                    <SidebarMenuItem key={item.id}>
                      {renderMenuButton(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>

        <SidebarFooter className={cn(
          "border-t border-slate-200",
          isCollapsed ? "p-3" : "p-4"
        )}>
          <div className="space-y-3">
            {!isCollapsed ? (
              <div className="flex items-center gap-3 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  {userType === "enterprise" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {userType === "enterprise" ? "Empresa" : "Usuário"}
                    </span>
                    {isAdminUser && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 bg-indigo-100 text-indigo-700"
                      >
                        Admin
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 truncate">
                    {userDisplayName}
                  </span>
                </div>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                      {userType === "enterprise" ? (
                        <Building2 className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <div className="font-medium">
                      {userType === "enterprise" ? "Empresa" : "Usuário"}
                    </div>
                    <div className="text-xs text-slate-500">{userDisplayName}</div>
                    {isAdminUser && (
                      <div className="text-xs text-indigo-600">Admin</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className={cn(
                    "flex items-center gap-3 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50",
                    isCollapsed
                      ? "w-8 h-8 justify-center mx-auto"
                      : "w-full px-2 py-2"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Sair</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  Sair
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
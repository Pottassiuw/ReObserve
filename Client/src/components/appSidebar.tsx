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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Search,
  History,
  Settings,
  BarChart3,
  ChevronDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileEdit,
  LayoutDashboard,
  Lock,
  CheckCircle,
} from "lucide-react";
import Logo from "@/assets/ProjectLogo.png";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Simular permissões do usuário
  const permissions = {
    canCreate: true,
    canView: true,
    canEdit: true,
    canDelete: false,
    canClosePeriod: true,
  };

  const mainMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "search", label: "Consultar Notas", icon: Search, path: "/search" },
    { id: "history", label: "Histórico", icon: History, path: "/history" },
    { id: "reports", label: "Relatórios", icon: BarChart3, path: "/reports" },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: "/user/settings",
    },
  ];

  const handleReleaseAction = (action) => {
    switch (action) {
      case "create":
        navigate("/features/release/new");
        break;
      case "view":
        navigate("/features/release/view");
        break;
      case "edit":
        navigate("/features/release/edit");
        break;
      case "delete":
        console.log("Deletar lançamento");
        break;
    }
  };

  const handlePeriodAction = (action) => {
    switch (action) {
      case "close":
        navigate("/features/period/close");
        break;
      case "view":
        navigate("/features/period/view");
        break;
      case "reopen":
        console.log("Reabrir período");
        break;
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate("/")}
            className="flex h-10 w-10 items-center justify-center rounded-lg  shadow-sm cursor-pointer"
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
              {mainMenuItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:bg-indigo-50 data-[state=open]:bg-indigo-50">
                      <FileEdit className="h-4 w-4 text-indigo-600" />
                      <span>Lançamentos</span>
                      <ChevronDown className="ml-auto h-4 w-4 text-indigo-600" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56"
                    side="right"
                  >
                    {permissions.canCreate && (
                      <DropdownMenuItem
                        onClick={() => handleReleaseAction("create")}
                        className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Lançamento
                      </DropdownMenuItem>
                    )}
                    {permissions.canView && (
                      <DropdownMenuItem
                        onClick={() => handleReleaseAction("view")}
                        className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                    )}
                    {permissions.canEdit && (
                      <DropdownMenuItem
                        onClick={() => handleReleaseAction("edit")}
                        className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {permissions.canDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleReleaseAction("delete")}
                          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:bg-indigo-50 data-[state=open]:bg-indigo-50">
                      <Lock className="h-4 w-4 text-indigo-600" />
                      <span>Períodos</span>
                      <ChevronDown className="ml-auto h-4 w-4 text-indigo-600" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56"
                    side="right"
                  >
                    {permissions.canClosePeriod && (
                      <DropdownMenuItem
                        onClick={() => handlePeriodAction("close")}
                        className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Fechar Período
                      </DropdownMenuItem>
                    )}
                    {permissions.canView && (
                      <DropdownMenuItem
                        onClick={() => handlePeriodAction("view")}
                        className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Períodos
                      </DropdownMenuItem>
                    )}
                    {permissions.canClosePeriod && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handlePeriodAction("reopen")}
                          className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-600"
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Reabrir Período
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Estatísticas Rápidas</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 space-y-3">
              <div className="flex justify-between items-center text-sm p-2 rounded-md bg-indigo-50/50">
                <span className="text-muted-foreground">Hoje</span>
                <span className="font-semibold text-indigo-700">12 notas</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 rounded-md bg-indigo-50/50">
                <span className="text-muted-foreground">Este mês</span>
                <span className="font-semibold text-indigo-700">284 notas</span>
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
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-sm font-semibold shadow-md">
            ME
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate text-indigo-900">
              Minha Empresa
            </span>
            <span className="text-xs text-indigo-600/70 truncate">
              CNPJ: 12.345.678/0001-90
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

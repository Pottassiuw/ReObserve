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
  FileText,
  Upload,
  Search,
  History,
  Settings,
  BarChart3,
} from "lucide-react";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "release", label: "Novo Lançamento", icon: Upload, path: "/release" },
    { id: "search", label: "Consultar Notas", icon: Search, path: "/search" },
    { id: "history", label: "Histórico", icon: History, path: "/history" },
    { id: "reports", label: "Relatórios", icon: BarChart3, path: "/reports" },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Lançamento NF-e</span>
            <span className="text-xs text-muted-foreground">
              Gestão de Notas
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
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
          <SidebarGroupLabel>Estatísticas Rápidas</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Hoje</span>
                <span className="font-semibold">12 notas</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Este mês</span>
                <span className="font-semibold">284 notas</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">R$ 1.234.567,89</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-semibold">
            ME
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">Minha Empresa</span>
            <span className="text-xs text-muted-foreground truncate">
              CNPJ: 12.345.678/0001-90
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

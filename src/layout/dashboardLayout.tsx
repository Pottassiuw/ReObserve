import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/appSidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="relative flex min-h-screen w-full">
        <div className="shrink-0">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm sticky top-0 z-10">
            <SidebarTrigger className="hover:bg-slate-100 transition-colors rounded-md" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto bg-slate-50">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
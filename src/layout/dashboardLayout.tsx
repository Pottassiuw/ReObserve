import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from "@/components/appSidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useEffect } from "react";

function DashboardContent() {
  const { open, setOpen, isMobile } = useSidebar();

  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      const trigger = document.querySelector('[data-sidebar-trigger]');
      
      if (
        open &&
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        trigger &&
        !trigger.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside as any);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as any);
    };
  }, [open, isMobile, setOpen]);

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="relative flex min-h-screen w-full">
        <div className={`${isMobile ? "fixed inset-y-0 left-0 z-50" : "shrink-0"}`}>
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {isMobile && !open && (
            <div className="fixed top-4 left-4 z-30 lg:hidden">
              <SidebarTrigger 
                className="bg-white hover:bg-slate-100 transition-colors rounded-lg p-3 shadow-lg border border-slate-200"
                data-sidebar-trigger
              >
                <Menu className="h-5 w-5 text-slate-700" />
              </SidebarTrigger>
            </div>
          )}

          <main className="flex-1 overflow-auto bg-slate-50 mt-10">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardContent />
    </SidebarProvider>
  );
}
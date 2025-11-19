import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { usePermissionsLoader } from "@/hooks/usePermissionsLoader";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function App() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);
  usePermissionsLoader();
  return (
    <>
      <Toaster position="top-center" richColors />
      <Outlet />
    </>
  );
}

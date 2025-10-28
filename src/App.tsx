import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { usePermissionsLoader } from "./hooks/usePermissionsLoader";
function App() {
  usePermissionsLoader();
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" richColors closeButton duration={4000} />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" richColors closeButton duration={4000} />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default App;

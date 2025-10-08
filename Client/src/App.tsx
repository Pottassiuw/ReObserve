import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import NavBar from "./components/common/navbar";
function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={4000} />
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;

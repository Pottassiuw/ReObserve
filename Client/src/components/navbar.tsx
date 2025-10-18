import { Button } from "@/components/ui/button";
import { Building2, User } from "lucide-react";
import Logo from "@/assets/ProjectLogo.png";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const handleCompanyLogin = () => {
    navigate("/enterprise/login");
  };
  const handleUserLogin = () => {
    navigate("/user/login");
  };
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Logo" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-indigo-900">
                ReObserve
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Gestão de Notas Fiscais
              </span>
            </div>
          </div>

          {/* Botões de Login */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCompanyLogin}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Login Empresa
            </Button>
            <Button
              onClick={handleUserLogin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer"
            >
              <User className="h-4 w-4 mr-2" />
              Login Usuário
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

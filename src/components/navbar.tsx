import { Button } from "@/components/ui/button";
import { Building2, User, Menu, X } from "lucide-react";
import Logo from "@/assets/ProjectLogo.png";
import { useState } from "react";
import { useAppNavigator } from "@/hooks/useAppNavigator";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigateToHome, navigateToLogin, navigateToEnterpriseLogin } =
    useAppNavigator();
  return (
    <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Sempre visível */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={navigateToHome}
          >
            <div className="relative">
              <img
                src={Logo}
                alt="Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-indigo-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold text-indigo-900 tracking-tight">
                ReObserve
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5 hidden xs:block">
                Gestão de Notas Fiscais
              </span>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={navigateToEnterpriseLogin}
              className="text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-all"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Empresa
            </Button>
            <Button
              onClick={navigateToLogin}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all"
            >
              <User className="h-4 w-4 mr-2" />
              Usuário
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-indigo-900" />
            ) : (
              <Menu className="h-6 w-6 text-indigo-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={navigateToEnterpriseLogin}
                className="w-full justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Login Empresa
              </Button>
              <Button
                onClick={navigateToLogin}
                className="w-full justify-start bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login Usuário
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import homeHeaderImage from "@/assets/homeHeader.jpg";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
export default function Home() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      {/* Hero Section*/}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeHeaderImage})`,
            filter: "brightness(0.5)",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            Simplifique seus{" "}
            <span className="text-indigo-400">laudos de perdas</span>
          </h1>

          <p className="text-gray-200 text-lg md:text-xl mt-4">
            Automatize o processo de geração de relatórios e reduza erros. Mais
            precisão, menos retrabalho.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate("/dashboard")}
              className="relative bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-8 py-6 rounded-xl shadow-md transition-all
                      hover:cursor-pointer "
            >
              Novo Relatório
            </Button>

            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl backdrop-blur-sm hover:cursor-pointer"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto mt-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-2">
          <h3 className="flex gap-4 font-semibold text-indigo-500 text-lg">
            Rápido
            <Check />
          </h3>
          <p className="text-gray-600">
            Gere laudos completos em minutos, com campos automáticos e histórico
            de auditoria.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="flex gap-4 font-semibold text-indigo-500 text-lg">
            Confiável
            <Check />
          </h3>
          <p className="text-gray-600">
            Todos os relatórios são salvos e organizados, garantindo integridade
            e fácil acesso.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="flex gap-4 font-semibold text-indigo-500 text-lg">
            Colaborativo <Check />
          </h3>
          <p className="text-gray-600">
            Trabalhe com sua equipe em tempo real e compartilhe análises de
            forma segura.
          </p>
        </div>
      </section>

      <Separator className="my-20 w-3/4 mx-auto" />

      <footer className="text-sm text-gray-500 text-center mb-6">
        © {new Date().getFullYear()} ReObserve — Sistema de Laudos Inteligentes
      </footer>
    </main>
  );
}

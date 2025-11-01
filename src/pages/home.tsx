import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import homeHeaderImage from "@/assets/homeHeader.jpg";
import { Check, Zap, Shield, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const navigate = useNavigate();

  const handleDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleLearnMore = useCallback(() => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  const features = useMemo(
    () => [
      {
        icon: Zap,
        title: "Rápido",
        description:
          "Gere laudos completos em minutos, com campos automáticos e histórico de auditoria.",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
      {
        icon: Shield,
        title: "Confiável",
        description:
          "Todos os relatórios são salvos e organizados, garantindo integridade e fácil acesso.",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
      {
        icon: Users,
        title: "Colaborativo",
        description:
          "Trabalhe com sua equipe em tempo real e compartilhe análises de forma segura.",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
    ],
    [],
  );

  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeHeaderImage})`,
          }}
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-indigo-900/50" />

        {/* Efeito radial */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.15),transparent_50%)]" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="space-y-6 md:space-y-8">
            {/* Badge de status  */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Sistema em operação
            </div>

            {/* Título com gradiente */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Simplifique seus{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">
                laudos de perdas
              </span>
            </h1>

            <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Automatize o processo de geração de relatórios e reduza erros.
              Mais precisão, menos retrabalho.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
              <Button
                onClick={handleDashboard}
                size="lg"
                className="group relative bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <span className="flex items-center gap-2">
                  Novo Relatório
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <Button
                onClick={handleLearnMore}
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl backdrop-blur-sm transition-all"
              >
                Saiba Mais
              </Button>
            </div>

            {/* Social Proof - Opcional */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 text-white/80 text-sm">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  500+
                </div>
                <div className="text-xs sm:text-sm">Empresas confiam</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  10k+
                </div>
                <div className="text-xs sm:text-sm">Laudos gerados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header da seção */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Por que escolher o ReObserve?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnologia de ponta para simplificar a gestão de laudos
            </p>
          </div>

          {/* Grid de features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Overlay gradiente no hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />

                <div className="relative space-y-3 sm:space-y-4">
                  {/* Ícone */}
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  {/* Título com check */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {feature.title}
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section  */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Pronto para transformar sua gestão?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8">
            Junte-se a centenas de empresas que já otimizaram seus processos
          </p>
          <Button
            size="lg"
            onClick={handleDashboard}
            className="group bg-white text-indigo-700 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Começar Agora
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                ReObserve
              </h3>
              <p className="text-xs sm:text-sm">
                Sistema inteligente de gestão de laudos e notas fiscais.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Produto
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Suporte
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Empresa
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            © {new Date().getFullYear()} ReObserve – Sistema de Laudos
            Inteligentes. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}

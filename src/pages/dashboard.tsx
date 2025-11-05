import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { buscarDadosDashboard } from "@/api/endpoints/dashboard";
import type { DashboardData } from "@/api/endpoints/dashboard";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function Dashboard() {
  const { userId, userType } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
    if (!userId) {
      setError("Usuário ou empresa não autenticado");
      setLoading(false);
      return;
    }
    if (userType !== "enterprise" && userType !== "user") {
      setError("Tipo de usuário inválido");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const dadosDashboard = await buscarDadosDashboard();
      setData(dadosDashboard);
    } catch (err) {
      setError("Erro ao carregar dados do dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, userType]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await carregarDados();
      toast.success("Dashboard atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatarMoeda = useMemo(() => {
    return (valor: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    };
  }, []);

  const stats = useMemo(() => {
    if (!data) return [];

    return [
      {
        title: "Receita Total",
        value: formatarMoeda(data.stats.receitaTotal),
        change: "+12.5%",
        trend: "up" as const,
        icon: DollarSign,
        bgColor: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      {
        title: "Notas Emitidas",
        value: data.stats.notasEmitidas.toString(),
        change: "+8.2%",
        trend: "up" as const,
        icon: FileText,
        bgColor: "bg-cyan-50",
        iconColor: "text-cyan-600",
      },
      {
        title: "Período Atual",
        value: data.stats.periodoAtual?.nome || "Nenhum",
        change: data.stats.periodoAtual?.status || "-",
        trend: "neutral" as const,
        icon: Calendar,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        title: "Pendências",
        value: data.stats.pendencias.toString(),
        change: data.stats.pendencias > 0 ? "Requer atenção" : "Tudo ok",
        trend: data.stats.pendencias > 0 ? ("up" as const) : ("down" as const),
        icon: AlertCircle,
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
      },
    ];
  }, [data, formatarMoeda]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-4 md:p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="lg:col-span-2 border-0 shadow-md">
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600 mb-4">
            {error || "Erro ao carregar dados"}
          </p>
          <Button onClick={carregarDados} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header Responsivo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Visão geral dos lançamentos e estatísticas da empresa
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
            className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-indigo-900 truncate">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" && (
                        <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
                      )}
                      {stat.trend === "down" && (
                        <TrendingDown className="h-3 w-3 text-green-600 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs font-medium truncate ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                              ? "text-green-600"
                              : "text-indigo-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-2 md:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}
                  >
                    <stat.icon
                      className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Line Chart */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg text-indigo-900">
                Fluxo de Caixa
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Entradas e saídas nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.dadosMensais}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="mes"
                      stroke="#6366f1"
                      fontSize={12}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#6366f1"
                      fontSize={12}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e0e7ff",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => formatarMoeda(value)}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
                    <Line
                      type="monotone"
                      dataKey="entradas"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      name="Entradas"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="saidas"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Saídas"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg text-indigo-900">
                Atividades Recentes
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Últimas movimentações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2">
                {data.atividadesRecentes.length > 0 ? (
                  data.atividadesRecentes.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-indigo-50/50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`p-1.5 md:p-2 rounded-full flex-shrink-0 ${
                          activity.type === "success"
                            ? "bg-green-100"
                            : activity.type === "warning"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {activity.type === "success" && (
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                        )}
                        {activity.type === "warning" && (
                          <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
                        )}
                        {activity.type === "info" && (
                          <Clock className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-indigo-900 line-clamp-2">
                          {activity.message}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs md:text-sm text-gray-500">
                      Nenhuma atividade recente
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Bar Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg text-indigo-900">
                Notas por Mês
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Volume de notas fiscais emitidas
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-[200px] md:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.dadosMensais}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="mes"
                      stroke="#6366f1"
                      fontSize={12}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#6366f1"
                      fontSize={12}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e0e7ff",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => formatarMoeda(value)}
                    />
                    <Bar
                      dataKey="entradas"
                      fill="#4f46e5"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Rápido */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg text-indigo-900">
                Resumo do Período
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Indicadores principais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 transition-colors">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Receita Mensal
                    </p>
                    <p className="text-lg md:text-xl font-bold text-indigo-900">
                      {formatarMoeda(data.stats.receitaTotal / 6)}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-cyan-100/50 hover:from-cyan-100 hover:to-cyan-200/50 transition-colors">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Média por Nota
                    </p>
                    <p className="text-lg md:text-xl font-bold text-cyan-900">
                      {formatarMoeda(
                        data.stats.notasEmitidas > 0
                          ? data.stats.receitaTotal / data.stats.notasEmitidas
                          : 0,
                      )}
                    </p>
                  </div>
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-cyan-600" />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 transition-colors">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Status Geral
                    </p>
                    <p className="text-base md:text-lg font-semibold text-purple-900">
                      {data.stats.pendencias === 0
                        ? "Em dia"
                        : `${data.stats.pendencias} pendências`}
                    </p>
                  </div>
                  {data.stats.pendencias === 0 ? (
                    <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-amber-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
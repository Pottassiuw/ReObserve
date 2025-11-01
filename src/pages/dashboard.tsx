import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  Loader2,
} from "lucide-react";
import { buscarDadosDashboard } from "@/api/endpoints/dashboard";
import type { DashboardData } from "@/api/endpoints/dashboard";

interface DashboardProps {
  empresaId: number; // Recebe o ID da empresa como prop
}

export default function Dashboard({ empresaId }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ["#4f46e5", "#06b6d4", "#8b5cf6"];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        const dadosDashboard = await buscarDadosDashboard(empresaId);
        setData(dadosDashboard);
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [empresaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-lg text-indigo-900">
            Carregando dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600">
            {error || "Erro ao carregar dados"}
          </p>
        </div>
      </div>
    );
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const stats = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-indigo-900">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos lançamentos e estatísticas da empresa
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" && (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      )}
                      {stat.trend === "down" && (
                        <TrendingDown className="h-3 w-3 text-green-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
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
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-900">Fluxo de Caixa</CardTitle>
              <CardDescription>
                Entradas e saídas nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.dadosMensais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="mes" stroke="#6366f1" />
                  <YAxis stroke="#6366f1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e7ff",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatarMoeda(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="entradas"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    name="Entradas"
                  />
                  <Line
                    type="monotone"
                    dataKey="saidas"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="Saídas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-900">Por Categoria</CardTitle>
              <CardDescription>Distribuição de notas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.categorias}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { name, percent } = props;
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.categorias.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-900">Notas por Mês</CardTitle>
              <CardDescription>
                Volume de notas fiscais emitidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.dadosMensais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="mes" stroke="#6366f1" />
                  <YAxis stroke="#6366f1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e7ff",
                      borderRadius: "8px",
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
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-900">
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas movimentações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.atividadesRecentes.length > 0 ? (
                  data.atividadesRecentes.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50/50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "success"
                            ? "bg-green-100"
                            : activity.type === "warning"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {activity.type === "success" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === "warning" && (
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                        )}
                        {activity.type === "info" && (
                          <Clock className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-indigo-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma atividade recente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

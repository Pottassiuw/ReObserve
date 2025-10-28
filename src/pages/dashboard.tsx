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
} from "lucide-react";

export default function Dashboard() {
  // Dados de exemplo
  const monthlyData = [
    { mes: "Jan", entradas: 45000, saidas: 38000 },
    { mes: "Fev", entradas: 52000, saidas: 41000 },
    { mes: "Mar", entradas: 48000, saidas: 39000 },
    { mes: "Abr", entradas: 61000, saidas: 47000 },
    { mes: "Mai", entradas: 55000, saidas: 43000 },
    { mes: "Jun", entradas: 67000, saidas: 51000 },
  ];

  const categoryData = [
    { name: "Produtos", value: 45 },
    { name: "Serviços", value: 30 },
    { name: "Mercadorias", value: 25 },
  ];

  const COLORS = ["#4f46e5", "#06b6d4", "#8b5cf6"];

  const stats = [
    {
      title: "Receita Total",
      value: "R$ 1.234.567,89",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Notas Emitidas",
      value: "284",
      change: "+8.2%",
      trend: "up",
      icon: FileText,
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: "Período Atual",
      value: "Junho/2024",
      change: "Aberto",
      trend: "neutral",
      icon: Calendar,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Pendências",
      value: "3",
      change: "-2 desde ontem",
      trend: "down",
      icon: AlertCircle,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "success",
      message: "NF-e 12345 emitida com sucesso",
      time: "5 min atrás",
    },
    {
      id: 2,
      type: "warning",
      message: "Período de Maio aguardando fechamento",
      time: "2 horas atrás",
    },
    {
      id: 3,
      type: "success",
      message: "Período de Abril fechado",
      time: "1 dia atrás",
    },
    {
      id: 4,
      type: "info",
      message: "15 notas importadas do sistema",
      time: "2 dias atrás",
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
          {/* Line Chart - Entradas vs Saídas */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-900">Fluxo de Caixa</CardTitle>
              <CardDescription>
                Entradas e saídas nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="mes" stroke="#6366f1" />
                  <YAxis stroke="#6366f1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e7ff",
                      borderRadius: "8px",
                    }}
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

          {/* Pie Chart - Categorias */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-900">Por Categoria</CardTitle>
              <CardDescription>Distribuição de notas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
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
                    {categoryData.map((_, index) => (
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
          {/* Bar Chart - Últimos 6 meses */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-900">Notas por Mês</CardTitle>
              <CardDescription>
                Volume de notas fiscais emitidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="mes" stroke="#6366f1" />
                  <YAxis stroke="#6366f1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e7ff",
                      borderRadius: "8px",
                    }}
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
                {recentActivities.map((activity) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

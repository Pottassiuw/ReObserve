import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "@/App";
import DashboardLayout from "@/layout/dashboardLayout";
import ProtectedRoute from "./protectedRoutes";
import { Loader2 } from "lucide-react";

const Home = lazy(() => import("@/pages/home"));
const UserLogin = lazy(() => import("@/pages/user/user.login"));
const EnterpriseLogin = lazy(
  () => import("@/pages/enterprise/enterprise.login"),
);
const EnterpriseRegister = lazy(
  () => import("@/pages/enterprise/enterprise.register"),
);
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ReleasesPage = lazy(() => import("@/pages/releasesPage"));
const PeriodsPage = lazy(() => import("@/pages/periodsPage"));
const UserSettingsPage = lazy(() => import("@/pages/user/user.config"));
const CreateUserPage = lazy(() => import("@/pages/user/user.register"));
const UserView = lazy(() => import("@/pages/user/user.view"));
const EnterpriseGroups = lazy(
  () => import("@/pages/enterprise/enterprise.groups"),
);
const PageNotFound = lazy(() => import("@/pages/notFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="text-sm text-gray-600">Carregando...</p>
    </div>
  </div>
);

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user/login",
    element: <UserLogin />,
  },
  {
    path: "/enterprise/login",
    element: <EnterpriseLogin />,
  },
  {
    path: "/enterprise/register",
    element: <EnterpriseRegister />,
  },
];

const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    name: "Dashboard",
  },
  {
    path: "/releases",
    element: <ReleasesPage />,
    name: "Lançamentos",
  },
  {
    path: "/periods",
    element: <PeriodsPage />,
    name: "Períodos",
  },
  {
    path: "/user/settings",
    element: <UserSettingsPage />,
    name: "Configurações",
  },
  {
    path: "/user/create",
    element: <CreateUserPage />,
    name: "Criar Usuário",
  },
  {
    path: "/users/view",
    element: <UserView />,
    name: "Gerenciar Usuários",
  },
  {
    path: "/groups",
    element: <EnterpriseGroups />,
    name: "Grupos",
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <SuspenseWrapper>
        <PageNotFound />
      </SuspenseWrapper>
    ),
    children: [
      ...publicRoutes.map((route) => ({
        ...route,
        element: <SuspenseWrapper>{route.element}</SuspenseWrapper>,
      })),

      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            path: "/dashboard",
            element: (
              <SuspenseWrapper>
                <Dashboard />
              </SuspenseWrapper>
            ),
          },
          ...protectedRoutes
            .filter((route) => route.path !== "/dashboard")
            .map((route) => ({
              ...route,
              element: <SuspenseWrapper>{route.element}</SuspenseWrapper>,
            })),
        ],
      },

      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <PageNotFound />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
export const getRouteConfig = () => ({
  public: publicRoutes,
  protected: protectedRoutes,
});
export const isValidRoute = (path: string): boolean => {
  const allPaths = [
    ...publicRoutes.map((r) => r.path),
    ...protectedRoutes.map((r) => r.path),
  ];
  return allPaths.includes(path);
};

import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import App from "@/App";
import UserLogin from "@/pages/user/user.login";
import EnterpriseLogin from "@/pages/enterprise/enterprise.login";
import EnterpriseRegister from "@/pages/enterprise/enterprise.register";
import ReleasesPage from "@/pages/releasesPage";
import DashboardLayout from "@/layout/dashboardLayout";
import Dashboard from "@/pages/dashboard";
import UserSettingsPage from "@/pages/user/user.config";
import PeriodsPage from "@/pages/periodsPage";
import PageNotFound from "@/pages/notFound";
import ProtectedRoute from "./protectedRoutes";
import CreateUserPage from "@/pages/user/user.register";
import UserView from "@/pages/user/user.view";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/user/login", element: <UserLogin /> },
      { path: "/enterprise/login", element: <EnterpriseLogin /> },
      { path: "/enterprise/register", element: <EnterpriseRegister /> },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, path: "/dashboard", element: <Dashboard /> },
          { path: "/releases", element: <ReleasesPage /> },
          { path: "/user/settings", element: <UserSettingsPage /> },
          { path: "/periods", element: <PeriodsPage /> },
          { path: "/user/create", element: <CreateUserPage /> },
          { path: "/users/view", element: <UserView /> },
        ],
      },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import App from "@/App";
import UserLogin from "@/pages/user/user.login";
import EnterpriseLogin from "@/pages/enterprise/enterprise.login";
import EnterpriseRegister from "@/pages/enterprise/enterprise.register";
import Release from "@/pages/features/create.release";
import DashboardLayout from "@/layout/dashboardLayout";
import Dashboard from "@/pages/dashboard";
import UserSettingsPage from "@/pages/user/user.config";
import CreatePeriodPage from "@/pages/features/create.period";
import PageNotFound from "@/pages/notFound";
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
        element: <DashboardLayout />,
        children: [
          { index: true, path: "/dashboard", element: <Dashboard /> },
          { path: "/features/release/new", element: <Release /> },
          { path: "/user/settings", element: <UserSettingsPage /> },
          { path: "/features/period/close", element: <CreatePeriodPage /> },
        ],
      },
    ],
  },
]);

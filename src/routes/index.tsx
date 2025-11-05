import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import DashboardLayout from "@/layout/dashboardLayout";
import ProtectedRoute from "./protectedRoutes";
import Home from "@/pages/home";
import UserLogin from "@/pages/user/user.login";
import EnterpriseLogin from "@/pages/enterprise/enterprise.login";
import EnterpriseRegister from "@/pages/enterprise/enterprise.register";
import Dashboard from "@/pages/dashboard";
import ReleasesPage from "@/pages/releasesPage";
import PeriodsPage from "@/pages/periodsPage";
import UserSettingsPage from "@/pages/user/user.config";
import EnterpriseSettingsPage from "@/pages/enterprise/enterprise.config";
import CreateUserPage from "@/pages/user/user.register";
import UserView from "@/pages/user/user.view";
import EnterpriseGroups from "@/pages/enterprise/enterprise.groups";
import AuthError from "@/components/authError";
import NotFound from "@/components/notFound";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { useAuthStore } from "@/stores/authStore";
import type { JSX } from "react";

// Helper para criar route com proteção
const createProtectedRoute = (
  element: JSX.Element,
  options?: {
    requirePermission?: () => boolean;
    requireEnterprise?: boolean;
    requireAdmin?: boolean;
  }
) => {
  return (
    <ProtectedRoute
      requirePermission={options?.requirePermission}
      requireEnterprise={options?.requireEnterprise}
      requireAdmin={options?.requireAdmin}
    >
      {element}
    </ProtectedRoute>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <AuthError />,
    children: [
      // públicas
      { index: true, element: <Home /> },
      { path: "user/login", element: <UserLogin /> },
      { path: "enterprise/login", element: <EnterpriseLogin /> },
      { path: "enterprise/register", element: <EnterpriseRegister /> },

      // protegidas
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { 
            index: true, 
            element: createProtectedRoute(<Dashboard />, {
              requirePermission: () => {
                const { userType } = useAuthStore.getState();
                const { isAdmin } = usePermissionsStore.getState();
                return userType === "enterprise" || isAdmin();
              }
            })
          },
          { 
            path: "dashboard", 
            element: createProtectedRoute(<Dashboard />, {
              requirePermission: () => {
                const { userType } = useAuthStore.getState();
                const { isAdmin } = usePermissionsStore.getState();
                return userType === "enterprise" || isAdmin();
              }
            })
          },
          { 
            path: "releases", 
            element: createProtectedRoute(<ReleasesPage />, {
              requirePermission: () => {
                const { canViewRelease } = usePermissionsStore.getState();
                return canViewRelease();
              }
            })
          },
          { 
            path: "periods", 
            element: createProtectedRoute(<PeriodsPage />, {
              requirePermission: () => {
                const { canViewPeriod } = usePermissionsStore.getState();
                return canViewPeriod();
              }
            })
          },
          { 
            path: "user/settings", 
            element: createProtectedRoute(<UserSettingsPage />, {
              requirePermission: () => {
                const { userType } = useAuthStore.getState();
                return userType === "user";
              }
            })
          },
          { 
            path: "enterprise/settings", 
            element: createProtectedRoute(<EnterpriseSettingsPage />, {
              requireEnterprise: true
            })
          },
          { 
            path: "user/create", 
            element: createProtectedRoute(<CreateUserPage />, {
              requireEnterprise: true
            })
          },
          { 
            path: "users/view", 
            element: createProtectedRoute(<UserView />, {
              requirePermission: () => {
                const { userType } = useAuthStore.getState();
                const { isAdmin } = usePermissionsStore.getState();
                return userType === "enterprise" || isAdmin();
              }
            })
          },
          { 
            path: "groups", 
            element: createProtectedRoute(<EnterpriseGroups />, {
              requireEnterprise: true
            })
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import App from "@/App";
import UserLogin from "@/pages/user/user.login";
import EnterpriseLogin from "@/pages/enterprise/enterprise.login";
import EnterpriseRegister from "@/pages/enterprise/enterprise.register";
import Release from "@/pages/release";
import DashboardLayout from "@/layout/dashboardLayout";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <Error404 />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/user/login", element: <UserLogin /> },
      { path: "/enterprise/login", element: <EnterpriseLogin /> },
      { path: "/enterprise/register", element: <EnterpriseRegister /> },
      {
        element: <DashboardLayout />,
        children: [{ index: true, path: "/releases", element: <Release /> }],
      },
    ],
  },
]);

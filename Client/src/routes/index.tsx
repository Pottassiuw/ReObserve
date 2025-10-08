import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import App from "@/App";
import UserLogin from "@/components/features/auth/user.login";
import EnterpriseLogin from "@/components/features/auth/enterprise.login";
import EnterpriseRegister from "@/components/features/auth/enterprise.register";
import UserRegister from "@/components/features/auth/user.register";
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
      { path: "/user/register", element: <UserRegister /> },
    ],
  },
]);

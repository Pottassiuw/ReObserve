import { useNavigate } from "react-router-dom";

export const useAppNavigator = () => {
  const navigate = useNavigate();

  return {
    navigateTo: (path: string) => {
      navigate(path);
    },
    navigateToDashboard: () => {
      navigate("/dashboard");
    },
    navigateToLogin: () => {
      navigate("/user/login");
    },
    navigateToRegisterEnterprise: () => {
      navigate("/enterprise/register");
    },
    navigateToHome: () => {
      navigate("/");
    },
    goBack: () => {
      navigate(-1);
    },
  };
};

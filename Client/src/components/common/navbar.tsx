import { Button } from "@/components/ui/button";
import Logo from "@/assets/ProjectLogo.png";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToUserLogin = () => {
    navigate("/user/login");
  };

  const navigateToEnterpriseLogin = () => {
    navigate("/enterprise/login");
  };

  return (
    <nav className="flex justify-between items-center  h-20 w-screen border-b-3 z-999 bg-white">
      <div className="flex justify-center items-center gap-4">
        <img
          onClick={navigateToHome}
          src={Logo}
          width={80}
          className="rounded"
          alt="Sem imagem meu amigo!"
        />

        <h1 onClick={navigateToHome} className="text-3xl hover:cursor-pointer">
          Re<span className="text-indigo-700">Observe</span>
        </h1>
      </div>
      <div className="flex gap-4 mr-10">
        <Button
          onClick={navigateToUserLogin}
          size="lg"
          className="bg-indigo-500 cursor-pointer hover:bg-indigo-600"
        >
          Logar Usuário
        </Button>
        <Button
          onClick={navigateToEnterpriseLogin}
          size="lg"
          className="bg-indigo-500 cursor-pointer hover:bg-indigo-600"
        >
          Logar Empresa
        </Button>
      </div>
    </nav>
  );
}

export default NavBar;

import { Router } from "express";
import  {criarUsuario} from "../Controllers/auth/register/createUser";
import loginUsuario from "../Controllers/auth/login/loginUser";
import { deletarUsuario, retornarUsuarioId, retornarUsuarios} from "../Controllers/userController";

const router = Router();

router.post("/auth/register", criarUsuario);
router.post("/auth/login", loginUsuario);
router.get("/", retornarUsuarios); 
router.get("/:id", retornarUsuarioId);
router.delete("/:id", deletarUsuario);
export default router;
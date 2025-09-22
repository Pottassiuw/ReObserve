import { Router } from "express";
import  {criarUsuario} from "../../controllers/auth/register/createUser";
import loginUsuario from "../../controllers/auth/login/loginUser";
import {deletarTodosUsuarios, deletarUsuario, retornarUsuarioId, retornarUsuarios} from "../../controllers/userController";

const router = Router();

router.post("/auth/register", criarUsuario);
router.post("/auth/login", loginUsuario);
router.get("/", retornarUsuarios); 
router.get("/:id", retornarUsuarioId);
router.delete("/", deletarTodosUsuarios);
router.delete("/:id", deletarUsuario);
export default router;

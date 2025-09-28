import { Router } from "express";
import { loginUsuario, logoutUsuario } from "../Controllers/auth/User";
import {
  retornarUsuarioId,
  retornarUsuarios,
} from "../Controllers/userController";
import { criarUsuario } from "../Controllers/auth/User";
import { deletarUsuario } from "../Controllers/enterpriseController";
const router = Router();

//Usuarios
router.post("/auth/register", criarUsuario);
router.get("/", retornarUsuarios);
router.get("/:id", retornarUsuarioId);
router.delete("/:id", deletarUsuario);
router.post("/auth/login", loginUsuario);
router.post("/auth/logout", logoutUsuario);

export default router;

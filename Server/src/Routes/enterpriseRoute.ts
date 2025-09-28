import { Router } from "express";
import { criarEmpresa } from "../Controllers/auth/Enterprise";
import {
  deletarTodosUsuariosEmpresa,
  retornarEmpresas,
  retornarEmpresasId,
  deletarUsuario,
} from "../Controllers/enterpriseController";

import { loginEmpresa, logoutEmpresa } from "../Controllers/auth/Enterprise";

const router = Router();

//Empresa
router.post("/auth/register", criarEmpresa);
router.post("/auth/login", loginEmpresa);
router.post("/auth/logout", logoutEmpresa);
router.get("/", retornarEmpresas);
router.get("/:id", retornarEmpresasId);

//Deletar todos os usuários da empresa
router.delete("/:id/users/delete/", deletarTodosUsuariosEmpresa);
//Deltar usuário específico da empresa
router.delete("/:id/users/delete/:userId", deletarUsuario);

export default router;

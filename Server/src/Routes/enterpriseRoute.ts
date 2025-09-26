import { Router } from "express";
import { criarEmpresa } from "../Controllers/auth/register/createEnterprise";
import {deletarTodosUsuariosEmpresa, retornarEmpresas, retornarEmpresasId, deletarUsuario} from "../Controllers/enterpriseController";
import loginEmpresa from "../Controllers/auth/login/loginEnterprise";

const router = Router();

router.post("/auth/register", criarEmpresa);
router.post("/auth/login", loginEmpresa);
router.get("/", retornarEmpresas);
router.get("/:id", retornarEmpresasId);

//Deletar todos os usuários da empresa
router.delete("/:id/users/delete/", deletarTodosUsuariosEmpresa);
//Deltar usuário específico da empresa
router.delete("/:id/users/delete/:userId", deletarUsuario);

export default router;

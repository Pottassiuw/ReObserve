import { Router } from "express";
import { criarEmpresa } from "../../controllers/auth/register/createEnterprise";
import { retornarEmpresas, retornarEmpresasId } from "../../controllers/enterpriseController";
import loginEmpresa from "../../controllers/auth/login/loginEnterprise";

const router = Router();

router.post("/auth/register", criarEmpresa);
router.post("/auth/login", loginEmpresa);
router.get("/", retornarEmpresas);
router.get("/:id", retornarEmpresasId);

export default router;

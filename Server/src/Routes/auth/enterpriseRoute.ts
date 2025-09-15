import { Router } from "express";
import { criarEmpresa } from "../../controllers/auth/register/createEnterprise";

const router = Router();

router.post("/auth/register", criarEmpresa);

export default router;

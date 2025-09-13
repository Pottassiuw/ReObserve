import { Router } from "express";
import { criarEmpresa } from "../controllers/createEnterprise";

const router = Router();

router.post("/", criarEmpresa);

export default router;
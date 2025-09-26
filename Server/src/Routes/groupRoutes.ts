import { Router } from "express";
import { CriarGrupo } from "../Controllers/groupController";

const router = Router();

router.post("/:empresaId/add", CriarGrupo)

export default router;
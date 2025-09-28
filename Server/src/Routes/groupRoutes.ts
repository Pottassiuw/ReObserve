import { Router } from "express";
import {
    colocarUsuarioGrupo,
  CriarGrupo,
  deletarGrupoEmpresa,
  deletarTodosGruposEmpresa,
  verGruposEmpresa,
} from "../Controllers/groupController";

const router = Router();

router.post("/enterprises/:empresaId/add", CriarGrupo);
router.get("/enterprises/:empresaId", verGruposEmpresa);
router.post("/enterprises/:empresaId/groups/:grupoId/users/:usuarioId", colocarUsuarioGrupo)
router.delete("/enterprises/:empresaId/groups/:grupoId", deletarGrupoEmpresa);
router.delete("/enterprises/:empresaId/groups", deletarTodosGruposEmpresa);
export default router;

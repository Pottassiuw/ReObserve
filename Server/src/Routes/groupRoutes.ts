import { Router } from "express";
import {
  colocarUsuarioGrupo,
  CriarGrupo,
  deletarGrupoEmpresa,
  deletarTodosGruposEmpresa,
  verGruposEmpresa,
} from "../Controllers/groupController";
import { authSession } from "../Middlewares/authMiddleware";

const router = Router();

router.post("/enterprises/:empresaId/add", authSession, CriarGrupo);
router.get("/enterprises/:empresaId", authSession, verGruposEmpresa);
router.post(
  "/enterprises/:empresaId/groups/:grupoId/users/:usuarioId",
  authSession,
  colocarUsuarioGrupo
);
router.delete(
  "/enterprises/:empresaId/groups/:grupoId",
  authSession,
  deletarGrupoEmpresa
);
router.delete(
  "/enterprises/:empresaId/groups",
  authSession,
  deletarTodosGruposEmpresa
);
export default router;

import { Router } from "express";
import  {criarUsuario} from "../../controllers/auth/register/createUser";

const router = Router();

router.post("/auth/register", criarUsuario);

export default router;

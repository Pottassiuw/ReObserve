import { Router } from "express";
import  {criarUsuario} from "../../controllers/auth/register/createUser";
import loginUser from "../../controllers/auth/login/loginEnterprise";

const router = Router();

router.post("/auth/register", criarUsuario);
router.post("/auth/login", loginUser);

export default router;

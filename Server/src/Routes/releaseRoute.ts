import { Router } from "express";   
import { criarLancamento } from "../Controllers/releaseController";

const router = Router();


router.post("/", criarLancamento);
export default router;
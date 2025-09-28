import {Request, Response} from "express";
import prisma from "../Database/prisma/prisma";

export const criarLancamento = async (req: Request, res: Response):Promise<Response | void> => {
    try {
        const body = req.body;
        console.log(body);
    } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      errorType: error.constructor.name,
    });
  }
}
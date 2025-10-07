import { Request, Response } from "express";
import prisma from "../Database/prisma/prisma";

const criarPeriodo = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const empresaId = req.auth!.enterprise?.id;
    return res.status(200).json({
      success: true,
      message: "Periodo criado com sucesso",
      // Periodo: periodo
    });
  } catch (error: any) {}
};

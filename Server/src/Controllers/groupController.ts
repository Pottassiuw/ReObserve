import { Request, Response } from "express";
import prisma from "../Prisma/prisma";
import { GroupPermitions } from "../@types/types";
import { success } from "zod";

export const CriarGrupo = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const empresaId = req.params.empresaId;
    
    if (!empresaId) {
      return res.status(400).json({
        error: "ID não fornecido",
        success: false,
      });
    }
    const parsedEmpresaId = parseInt(empresaId);
    if (isNaN(parsedEmpresaId)) {
      return res.status(400).json({
        error: "ID deve ser um número",
        success: false,
        receivedId: empresaId,
      });
    }
    const permissoes:GroupPermitions = req.body;
    const grupo = await prisma.grupo.create({
      data: {
        empresaId: parsedEmpresaId,
      },
    });
    if (!permissoes) {
      return res.status(400).json({
        code: "PERMITIONS_NOT_FOUND",
        error: "Permissão não existe",
        success: false
      });
    }
    if (!grupo) {
      return res.status(400).json({
        code: "GROUP_NOT_FOUND",
        error: "Grupo não existe",
        success: false
      });
    }
    return res.status(200).json({
      message: "Grupo criado com sucesso!",
      code: "GROUP_CREATED",
      success: true,
      grupo,
      permissoes
    });
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
};

export const usuarioGrupo = async (
  req: Request,
  res: Response,
  empresaId: number,
  userId: number
): Promise<Response | void> => {
  try {
    if (!empresaId && !userId) {
      return res.status(400).json({
        message: "Error message",
      });
    }
    const empresa = await prisma.grupo.findFirst({
      where: {
        empresaId,
      },
    });
    console.log(empresa);
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
};

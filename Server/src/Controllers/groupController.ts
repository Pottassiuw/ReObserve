import { Request, Response } from "express";
import prisma from "../Prisma/prisma";
import { GroupPermitions } from "../@types/types";

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

export const colocarUsuarioGrupo = async (
  req: Request,
  res: Response,
  groupId: number,
  empresaId: number,
  userId: number
): Promise<Response> => {
  try {
    if (!empresaId && !userId && !groupId) {
      return res.status(400).json({
        code: "USERS_AND_ENTERPRISES_AND_GROUPS_NOT_FOUND",
        error: "Doensn't exists"
      });
    }
    const user = await prisma.usuario.findUnique({
      where: {id: userId}
    })

    if(!user || user.empresaId !== empresaId){
      return res.status(400).json({
        error: "Usuário não encontrado ou não pertence à empresa",
        code: "NO_USER_OR_USER_DOESN'T_BELONG_TO_ENTERPRISE"
      })
    }
    const group = await prisma.grupo.findUnique({
      where: {id: groupId}
    })

    if(!group || group.empresaId !== empresaId) {
      return res.status(400).json({
        error: "Grupo não encontrado ou não pertence à empresa",
        code: "NO_GROUP_OR_USER_DOESN'T_BELONG_TO_ENTERPRISE"
      })
    }

    await prisma.usuario.update({
      where: {id: userId},
      data: {grupoId: group.id}
    })

    return res.status(200).json({
      message: "Usuário agora pertençe ao grupo",
      success: true,
      code: "USER_BELONGS_TO_GROUP",
    })
  
   
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

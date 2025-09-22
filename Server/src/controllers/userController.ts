import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const retornarUsuarios = async (req: Request, res: Response) => {
  try {
    const user = await prisma.usuario.findMany();
    if (!user) {
      res.status(401).json({
        error: "Usuário não existe",
        success: false,
        code: "NO_USERS",
      });
    }
    return res.status(200).json({
      message: "Usuários encontrados!",
      success: true,
      code: "ALL_USERS",
      users: user,
    });
  } catch (error) {
    console.error("Erro no servidor:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const retornarUsuarioId = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    
    const idParam = req.params.id;
    
    if (!idParam) {
      return res.status(400).json({
        error: "ID não fornecido",
        success: false
      });
    }
    
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID deve ser um número",
        success: false,
        receivedId: idParam
      });
    }
    
    console.log("Buscando Usuário com ID:", id);
    
    // Versão mais simples da query
    const usuario = await prisma.usuario.findFirst({
      where: { id: id }
    });
    
    if (!usuario) {
      return res.status(404).json({
        error: "Empresa não encontrada",
        success: false,
        searchedId: id
      });
    }
    
    return res.status(200).json({
      message: "Empresa encontrada!",
      success: true,
      usuario
    });
    
  } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    
    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      errorType: error.constructor.name
    });
  }
};


export const deletarTodosUsuarios = async(res: Response):Promise<Response | void> => {
  try {
    await prisma.usuario.deleteMany();
    return res.status(200).json({
      success: true,
      message: "TODOS Usuários deletados!",
      code: "USERS_DELETED"
    })
  } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    
    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      errorType: error.constructor.name
    });
  }
}

export const deletarUsuario = async (res: Response, req: Request):Promise<Response | void> => {
  try {
    const idParam = req.params.id;
    
    if (!idParam) {
      return res.status(400).json({
        error: "ID não fornecido",
        success: false
      });
    }
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID deve ser um número",
        success: false,
        receivedId: idParam
      });
    }
    console.log(id);

    await prisma.usuario.delete({where: {id: id}});
    return res.status(200).json({
      success: true,
      code: "USER_DELETED",
      message: "Usuário deletado com sucesso!"
    });
  } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    
    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      errorType: error.constructor.name
    });
  }
}
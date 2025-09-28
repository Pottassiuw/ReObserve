 import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../Helpers/authservice";
import prisma from "../Database/prisma/prisma";
import { Permissoes } from "../generated/prisma";

// Estender a interface Request para incluir os dados do usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        tipo: string;
        email: string;
        nome: string;
        empresaId: number;
        grupoId?: number | null;
        permissoes?: Permissoes[];
      };
    }
  }
}

interface JWTPayload {
  type: "user"| "enterprise";
  id: number;

}


export const authSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Buscar token no cookie
    const token = req.cookies["auth-user-token"];

    if (!token) {
      return res.status(401).json({
        error: "Token não fornecido",
        success: false,
        code: "NO_TOKEN",
      });
    }

    // Verificar e decodificar o token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as JWTPayload;
    } catch (jwtError: any) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expirado",
          success: false,
          code: "TOKEN_EXPIRED",
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Token inválido",
          success: false,
          code: "INVALID_TOKEN",
        });
      }
      throw jwtError;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: {
        empresa: true,
        grupo: true,
        },
      },
    );

    if (!usuario) {
      return res.status(401).json({
        error: "Usuário não encontrado",
        success: false,
        code: "USER_NOT_FOUND",
      });
    }

    // Adicionar dados d usuário na requisição
    req.user = {
      id: usuario.id,
      tipo: decoded.type,
      email: usuario.email,
      nome: usuario.nome,
      empresaId: usuario.empresaId,
      grupoId: usuario.grupoId,
      permissoes: usuario.grupo?.permissoes
    };

    next();
  } catch (error: any) {
    console.error("Erro na autenticação:", error);

    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      code: "AUTH_ERROR",
      errorType: error.constructor.name,
    });
  }
};

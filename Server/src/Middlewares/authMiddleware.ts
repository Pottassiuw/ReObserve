// authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../Database/prisma/prisma";
import { Empresa, Permissoes, Usuario, Grupo } from "../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        type: "user" | "enterprise";
        id: number;
        user?: Usuario & { grupo: Grupo | null };
        enterprise?: Empresa;
        permissoes?: Permissoes[];
      };
    }
  }
}

interface JWTPayload {
  type: "user" | "enterprise";
  id: number;
}

export const authSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["auth-token"];

    if (!token) {
      return res.status(401).json({
        error: "Token não fornecido",
        success: false,
        code: "NO_TOKEN",
      });
    }

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

    req.auth = {
      type: decoded.type,
      id: decoded.id,
    };

    if (decoded.type === "user") {
      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.id },
        include: {
          empresa: true,
          grupo: true,
        },
      });

      if (!usuario) {
        return res.status(401).json({
          error: "Usuário não encontrado",
          success: false,
          code: "USER_NOT_FOUND",
        });
      }

      req.auth.user = usuario;
      // Extrair permissões do grupo (ou array vazio se não tiver grupo)
      req.auth.permissoes = usuario.grupo?.permissoes || [];
    } else if (decoded.type === "enterprise") {
      const empresa = await prisma.empresa.findUnique({
        where: { id: decoded.id },
        include: {
          usuarios: true,
          grupo: true,
        },
      });

      if (!empresa) {
        return res.status(401).json({
          error: "Empresa não encontrada",
          success: false,
          code: "ENTERPRISE_NOT_FOUND",
        });
      }

      req.auth.enterprise = empresa;
      // Empresas têm todas as permissões (admin)
      req.auth.permissoes = Object.values(Permissoes);
    }

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
export const requirePermissions = (...permissoesNecessarias: Permissoes[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        error: "Usuário não autenticado",
        success: false,
        code: "NOT_AUTHENTICATED",
      });
    }

    const permissoesUsuario = req.auth.permissoes || [];

    // permissão de admin (bypass)
    if (permissoesUsuario.includes(Permissoes.admin)) {
      return next();
    }

    // Verificar se tem TODAS as permissões necessárias
    const temTodasPermissoes = permissoesNecessarias.every((permissao) =>
      permissoesUsuario.includes(permissao)
    );

    if (!temTodasPermissoes) {
      const faltantes = permissoesNecessarias.filter(
        (p) => !permissoesUsuario.includes(p)
      );

      return res.status(403).json({
        error: "Permissão negada",
        success: false,
        code: "FORBIDDEN",
        permissoesFaltantes: faltantes,
        permissoesNecessarias: permissoesNecessarias,
      });
    }

    next();
  };
};
export const requireAnyPermission = (...permissoes: Permissoes[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        error: "Usuário não autenticado",
        success: false,
        code: "NOT_AUTHENTICATED",
      });
    }

    const permissoesUsuario = req.auth.permissoes || [];

    // Admin sempre passa
    if (permissoesUsuario.includes(Permissoes.admin)) {
      return next();
    }

    // Verificar se tem PELO MENOS UMA permissão
    const temAlgumaPermissao = permissoes.some((permissao) =>
      permissoesUsuario.includes(permissao)
    );

    if (!temAlgumaPermissao) {
      return res.status(403).json({
        error: "Permissão negada",
        success: false,
        code: "FORBIDDEN",
        permissoesNecessarias: permissoes,
      });
    }

    next();
  };
};
export const requireAdmin = requirePermissions(Permissoes.admin);

export const hasPermission = (req: Request, permissao: Permissoes): boolean => {
  const permissoes = req.auth?.permissoes || [];
  return (
    permissoes.includes(Permissoes.admin) || permissoes.includes(permissao)
  );
};
export const hasAllPermissions = (
  req: Request,
  ...permissoesNecessarias: Permissoes[]
): boolean => {
  const permissoes = req.auth?.permissoes || [];

  if (permissoes.includes(Permissoes.admin)) return true;

  return permissoesNecessarias.every((p) => permissoes.includes(p));
};

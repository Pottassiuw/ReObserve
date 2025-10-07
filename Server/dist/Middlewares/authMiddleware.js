"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAllPermissions = exports.hasPermission = exports.requireAdmin = exports.requireAnyPermission = exports.requirePermissions = exports.authSession = void 0;
// authMiddleware.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../Database/prisma/prisma"));
const prisma_2 = require("../generated/prisma");
const authSession = async (req, res, next) => {
    try {
        const token = req.cookies["auth-token"];
        if (!token) {
            return res.status(401).json({
                error: "Token não fornecido",
                success: false,
                code: "NO_TOKEN",
            });
        }
        console.log(token);
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        }
        catch (jwtError) {
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
            const usuario = await prisma_1.default.usuario.findUnique({
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
        }
        else if (decoded.type === "enterprise") {
            const empresa = await prisma_1.default.empresa.findUnique({
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
            req.auth.permissoes = Object.values(prisma_2.Permissoes);
        }
        next();
    }
    catch (error) {
        console.error("Erro na autenticação:", error);
        return res.status(500).json({
            error: "Erro interno do servidor",
            success: false,
            code: "AUTH_ERROR",
            errorType: error.constructor.name,
        });
    }
};
exports.authSession = authSession;
const requirePermissions = (...permissoesNecessarias) => {
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).json({
                error: "Usuário não autenticado",
                success: false,
                code: "NOT_AUTHENTICATED",
            });
        }
        const permissoesUsuario = req.auth.permissoes || [];
        // permissão de admin (bypass)
        if (permissoesUsuario.includes(prisma_2.Permissoes.admin)) {
            return next();
        }
        // Verificar se tem TODAS as permissões necessárias
        const temTodasPermissoes = permissoesNecessarias.every((permissao) => permissoesUsuario.includes(permissao));
        if (!temTodasPermissoes) {
            const faltantes = permissoesNecessarias.filter((p) => !permissoesUsuario.includes(p));
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
exports.requirePermissions = requirePermissions;
const requireAnyPermission = (...permissoes) => {
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).json({
                error: "Usuário não autenticado",
                success: false,
                code: "NOT_AUTHENTICATED",
            });
        }
        const permissoesUsuario = req.auth.permissoes || [];
        // Admin sempre passa
        if (permissoesUsuario.includes(prisma_2.Permissoes.admin)) {
            return next();
        }
        // Verificar se tem PELO MENOS UMA permissão
        const temAlgumaPermissao = permissoes.some((permissao) => permissoesUsuario.includes(permissao));
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
exports.requireAnyPermission = requireAnyPermission;
exports.requireAdmin = (0, exports.requirePermissions)(prisma_2.Permissoes.admin);
const hasPermission = (req, permissao) => {
    const permissoes = req.auth?.permissoes || [];
    return (permissoes.includes(prisma_2.Permissoes.admin) || permissoes.includes(permissao));
};
exports.hasPermission = hasPermission;
const hasAllPermissions = (req, ...permissoesNecessarias) => {
    const permissoes = req.auth?.permissoes || [];
    if (permissoes.includes(prisma_2.Permissoes.admin))
        return true;
    return permissoesNecessarias.every((p) => permissoes.includes(p));
};
exports.hasAllPermissions = hasAllPermissions;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSession = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../Database/prisma/prisma"));
const authSession = async (req, res, next) => {
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
        // Adicionar dados do usuário na requisição
        req.user = {
            id: usuario.id,
            tipo: decoded.tipo,
            email: usuario.email,
            nome: usuario.nome,
            empresaId: usuario.empresaId,
            grupoId: usuario.grupoId,
        };
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

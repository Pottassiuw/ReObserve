"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authservice_1 = require("../../../helper/authservice");
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
const loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;
        console.log("=== LOGIN DEBUG ===");
        console.log("Request body:", req.body);
        // Validação de entrada
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                error: "Email e senha são obrigatórios",
                code: "MISSING_CREDENTIALS",
            });
        }
        const user = await prisma_1.default.usuario.findUnique({
            where: { email: email },
        });
        // Verificar se usuário existe
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Credenciais inválidas",
                code: "INVALID_CREDENTIALS",
            });
        }
        // Verificar senha
        const isPasswordValid = await authservice_1.AuthService.VerifyHash(user.senha, senha);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Credenciais inválidas",
                code: "INVALID_CREDENTIALS",
            });
        }
        // Gerar token
        const token = authservice_1.AuthService.generateToken("user", user.id);
        // Configurar cookie com todas as opções de segurança
        res.cookie("auth-token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Dias
            sameSite: "strict", // Proteção CSRF
        });
        // Resposta de sucesso com dados úteis para o frontend
        return res.json({
            success: true,
            message: "Login realizado com sucesso!",
            user: {
                id: user.id,
                email: user.email,
                nome: user.nome,
                tipo: "user",
            },
        });
    }
    catch (error) {
        console.error("Erro no login do usuário:", error);
        return res.status(500).json({
            success: false,
            error: "Erro interno do servidor. Tente novamente.",
            code: "INTERNAL_ERROR",
        });
    }
};
exports.default = loginUsuario;

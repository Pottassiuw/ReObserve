"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authservice_1 = require("../../../Helpers/authservice");
const prisma_1 = __importDefault(require("../../../Prisma/prisma"));
const loginEmpresa = async (req, res) => {
    try {
        const { cnpj, senha } = req.body;
        console.log("=== LOGIN DEBUG ===");
        console.log("Request body:", req.body);
        // Validação de entrada
        if (!cnpj || !senha) {
            return res.status(400).json({
                success: false,
                error: "CNPJ e senha são obrigatórios",
                code: "MISSING_CREDENTIALS",
            });
        }
        const cnpjFiltrado = cnpj.replace(/[^\d]+/g, "");
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { cnpj: cnpjFiltrado },
        });
        console.log("CREDENCIAIS DA EMPRESA:", empresa);
        // Verificar se usuário existe
        if (!empresa) {
            return res.status(401).json({
                success: false,
                error: "Credenciais inválidas",
                code: "INVALID_CREDENTIALS",
            });
        }
        // Verificar senha
        const isPasswordValid = await authservice_1.AuthService.VerifyHash(empresa.senha, senha);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Credenciais inválidas",
                code: "INVALID_CREDENTIALS",
            });
        }
        // Gerar token
        const token = authservice_1.AuthService.generateToken("enterprise", empresa.id);
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
            empresa: {
                id: empresa.id,
                nome: empresa.nomeFantasia,
                naturezaJuridica: empresa.naturezaJuridica,
                tipo: "empresa",
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
exports.default = loginEmpresa;

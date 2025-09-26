"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarUsuario = void 0;
const prisma_1 = __importDefault(require("../../../Prisma/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const userSchemas_1 = require("../../../Schemas/userSchemas");
//schema Zod para validação de dados
const criarUsuario = async (req, res) => {
    try {
        const validatedUserData = userSchemas_1.criarUsuarioSchema.parse(req.body);
        const hashedUserPassword = await bcrypt_1.default.hash(validatedUserData.senha, 12);
        const user = await prisma_1.default.usuario.create({
            data: {
                nome: validatedUserData.nome,
                senha: hashedUserPassword,
                email: validatedUserData.email,
                cpf: validatedUserData.cpf,
                empresaId: req.body.empresaId
            }
        });
        const { senha: _, ...userResponse } = user;
        return res.status(200).json({
            success: true,
            data: userResponse,
            message: "Usuário criado com sucesso!",
        });
    }
    catch (error) {
        // Erro de validação do Zod
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Dados inválidos",
                errors: error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        // Erro de constraint unique do Prisma (CPF duplicado)
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: "CPF já está cadastrado"
            });
        }
        // Erro genérico
        console.error('Erro ao criar Usuário:', error);
        return res.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }
};
exports.criarUsuario = criarUsuario;

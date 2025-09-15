"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarUsuarioSchema = exports.criarUsuario = void 0;
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
//schema Zod para validação de dados
const criarUsuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(1).max(48),
    cpf: zod_1.z.string().refine((cpf) => {
        if (typeof cpf !== "string")
            return false;
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/))
            return false;
        const cpfDigits = cpf.split("").map((el) => +el);
        const rest = (count) => {
            return (((cpfDigits.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10);
        };
        return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
    }, "Digite um cpf válido."),
    senha: zod_1.z
        .string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número"),
    email: zod_1.z.email({ message: "Por favor, insira um email válido!" })
    //Espaço para validação (se necessária da FK Empresa)
});
const criarUsuario = async (req, res) => {
    try {
        const validatedUserData = criarUsuarioSchema.parse(req.body);
        const hashedUserPassword = await bcrypt_1.default.hash(validatedUserData.senha, 12);
        const user = await prisma_1.default.usuario.create({
            data: {
                nome: validatedUserData.nome,
                senha: validatedUserData.senha,
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
// Schema para atualização (campos opcionais)
exports.atualizarUsuarioSchema = criarUsuarioSchema.partial().omit({
    cpf: true // CPF não pode ser alterado
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarEmpresa = void 0;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../Prisma/prisma"));
const enterPriseSchemas_1 = require("../../../Schemas/enterPriseSchemas");
const criarEmpresa = async (req, res) => {
    try {
        // Validação dos dados de entrada
        const validatedData = enterPriseSchemas_1.criarEmpresaSchema.parse(req.body);
        // Hash da senha
        const hashedPassword = await bcrypt_1.default.hash(validatedData.senha, 12);
        // Criação da empresa
        const empresa = await prisma_1.default.empresa.create({
            data: {
                cnpj: validatedData.cnpj,
                senha: hashedPassword,
                nomeFantasia: validatedData.nomeFantasia,
                razaoSocial: validatedData.razaoSocial,
                endereco: validatedData.endereco,
                situacaoCadastral: validatedData.situacaoCadastral,
                naturezaJuridica: validatedData.naturezaJuridica,
                CNAES: validatedData.CNAES
            }
        });
        // Resposta sem retornar a senha
        const { senha: _, ...empresaResponse } = empresa;
        return res.status(201).json({
            success: true,
            data: empresaResponse,
            message: "Empresa criada com sucesso!"
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
        // Erro de constraint unique do Prisma (CNPJ duplicado)
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: "CNPJ já está cadastrado"
            });
        }
        // Erro genérico
        console.error('Erro ao criar empresa:', error);
        return res.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }
};
exports.criarEmpresa = criarEmpresa;

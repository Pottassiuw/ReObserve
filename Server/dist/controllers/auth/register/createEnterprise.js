"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarEmpresaSchema = exports.criarEmpresa = void 0;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
// Função auxiliar para validar CNPJ
function isValidCNPJ(cnpj) {
    // Remove formatação (pontos, barras, hífens)
    cnpj = cnpj.replace(/[^\d]+/g, '');
    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14)
        return false;
    // Verifica se não são todos iguais (11111111111111, etc)
    if (/^(\d)\1+$/.test(cnpj))
        return false;
    // Validação dos dígitos verificadores
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseInt(digitos.charAt(0)))
        return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseInt(digitos.charAt(1)))
        return false;
    return true;
}
// Schema de validação Zod para criação de empresa
const criarEmpresaSchema = zod_1.z.object({
    cnpj: zod_1.z
        .string()
        .min(1, "CNPJ é obrigatório")
        .transform((val) => val.replace(/[^\d]+/g, '')) // Remove formatação
        .refine((val) => val.length === 14, "CNPJ deve ter 14 dígitos")
        .refine((val) => isValidCNPJ(val), "CNPJ inválido"),
    senha: zod_1.z
        .string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número"),
    nomeFantasia: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "" ? undefined : val), // Converte string vazia para undefined
    razaoSocial: zod_1.z
        .string()
        .min(1, "Razão social é obrigatória")
        .max(200, "Razão social deve ter no máximo 200 caracteres"),
    endereco: zod_1.z
        .string()
        .min(1, "Endereço é obrigatório")
        .max(300, "Endereço deve ter no máximo 300 caracteres"),
    situacaoCadastral: zod_1.z
        .string()
        .min(1, "Situação cadastral é obrigatória")
        .max(50, "Situação cadastral deve ter no máximo 50 caracteres"),
    naturezaJuridica: zod_1.z
        .string()
        .min(1, "Natureza jurídica é obrigatória")
        .max(100, "Natureza jurídica deve ter no máximo 100 caracteres"),
    CNAES: zod_1.z
        .string()
        .min(1, "CNAE é obrigatório")
        .max(500, "CNAE deve ter no máximo 500 caracteres")
});
const criarEmpresa = async (req, res) => {
    try {
        // Validação dos dados de entrada
        const validatedData = criarEmpresaSchema.parse(req.body);
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
// Schema para atualização (campos opcionais)
exports.atualizarEmpresaSchema = criarEmpresaSchema.partial().omit({
    cnpj: true // CNPJ não pode ser alterado
});

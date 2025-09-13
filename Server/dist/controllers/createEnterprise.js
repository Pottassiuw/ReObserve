"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarEmpresa = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const criarEmpresa = async (req, res) => {
    try {
        const { cnpj, nomeFantasia, razaoSocial, endereco, situacaoCadastral, naturezaJuridica, CNAES } = req.body;
        const empresa = await prisma_1.default.empresa.create({
            data: {
                cnpj,
                nomeFantasia,
                razaoSocial,
                endereco,
                situacaoCadastral,
                naturezaJuridica,
                CNAES
            }
        });
        return res.status(200).json({
            sucess: true,
            data: empresa,
            message: "Empresa criada"
        });
    }
    catch (error) {
        console.error("Error de cadastro da Empresa", error);
    }
};
exports.criarEmpresa = criarEmpresa;

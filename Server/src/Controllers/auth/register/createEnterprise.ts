import { Request, Response } from "express";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from "../../../Prisma/prisma";
import { CriarEmpresaInput, criarEmpresaSchema } from "../../../Schemas/enterPriseSchemas";

export const criarEmpresa = async (req: Request, res: Response) => {
  try {
    // Validação dos dados de entrada
    const validatedData: CriarEmpresaInput = criarEmpresaSchema.parse(req.body);
    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.senha, 12);
    // Criação da empresa
    const empresa = await prisma.empresa.create({
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
   } catch (error: unknown) {
    // Erro de validação do Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.issues.map((err: z.ZodIssue) => ({
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



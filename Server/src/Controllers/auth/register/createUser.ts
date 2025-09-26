import {Request, Response} from "express"
import prisma from "../../../Prisma/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"
import  { criarUsuarioInput, criarUsuarioSchema } from "../../../Schemas/userSchemas"
//schema Zod para validação de dados
export const criarUsuario = async (req: Request, res: Response) => {
    try {
	const validatedUserData: criarUsuarioInput = criarUsuarioSchema.parse(req.body);

	const hashedUserPassword = await bcrypt.hash(validatedUserData.senha, 12);

	const user = await prisma.usuario.create({
	    data: { 
        nome: validatedUserData.nome,
        senha: hashedUserPassword,
        email: validatedUserData.email,
        cpf: validatedUserData.cpf,
        empresaId: validatedUserData.empresaId,
        grupoId: validatedUserData.grupoId
	    }

	});
	const {senha: _, ...userResponse} = user;

	return res.status(200).json({
	    success: true,
	    data: userResponse,
	    message: "Usuário criado com sucesso!",
	})

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


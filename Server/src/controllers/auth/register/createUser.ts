import {Request, Response} from "express"
import prisma from "../../../prisma/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"


//schema Zod para validação de dados
const criarUsuarioSchema = z.object({
    nome: z.string().min(1).max(48),
    cpf: z.string().refine((cpf: string) => {
	if (typeof cpf !== "string") return false;
	cpf = cpf.replace(/[^\d]+/g, "");
	if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
	const cpfDigits = cpf.split("").map((el) => +el);
	const rest = (count: number): number => {
	    return (((cpfDigits.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10);
	};
	return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
    }, "Digite um cpf válido."),
    senha: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
	"Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número"),
    email: z.email({message: "Por favor, insira um email válido!"})
    //Espaço para validação (se necessária da FK Empresa)
});

type criarUsuarioInput = z.infer<typeof criarUsuarioSchema>;
export const criarUsuario = async (req: Request, res: Response) => {
    try {
	const validatedUserData: criarUsuarioInput = criarUsuarioSchema.parse(req.body);

	const hashedUserPassword = await bcrypt.hash(validatedUserData.senha, 12);

	const user = await prisma.usuario.create({
	    data: { 
		nome: validatedUserData.nome,
		senha: validatedUserData.senha,
		email: validatedUserData.email,
		cpf: validatedUserData.cpf,
		empresaId: req.body.empresaId
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

// Schema para atualização (campos opcionais)
export const atualizarUsuarioSchema = criarUsuarioSchema.partial().omit({
  cpf: true // CPF não pode ser alterado
});

export type AtualizarUsuarioInput = z.infer<typeof atualizarUsuarioSchema>;

import {Request, Response} from "express"
import prisma from "../prisma/prisma"
import type { Empresa } from "../@types/types";

export const criarEmpresa = async (req:Request, res:Response) => {
    try {
        const {cnpj, nomeFantasia,razaoSocial, endereco, situacaoCadastral, naturezaJuridica, CNAES }:Empresa = req.body;

        const empresa = await prisma.empresa.create({
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
            message: "Empresa criada com sucesso!"
        })

    } catch (error)  {
        console.error("Error de cadastro da Empresa", error)
    }
}
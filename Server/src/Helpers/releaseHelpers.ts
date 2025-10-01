import { NotaFiscal, Imagem } from "../generated/prisma";
import { Request, Response } from "express";
import prisma from "../Database/prisma/prisma";
import supabase from "../Database/supabase/supabase";

export const criarNotaFiscal = async (
  nota: NotaFiscal
): Promise<NotaFiscal | void> => {
  try {
    const notaFiscal = await prisma.notaFiscal.create({
      data: {
        numero: nota.numero,
        dataEmissao: nota.dataEmissao,
        valor: nota.valor,
        xmlPath: nota.xmlPath,
        empresaId: nota.empresaId,
      },
    });
    if (!notaFiscal) {
      console.error("TAX_NOTE_NOT_CREATED");
      console.log(
        "Informações incorretas ou não recebidas, verifique as informações inseridas"
      );
    }

    return notaFiscal;
  } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
  }
};

export const retornarImagem = async (): Promise<Imagem | void> => {
  try {
    const { data } = supabase.storage
      .from("Lancamentos")
      .getPublicUrl("imagens/sixSenveennnn.jpg");
    console.log(data);
  } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
  }
};

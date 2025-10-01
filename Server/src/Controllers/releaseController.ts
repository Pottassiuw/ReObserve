import { Request, Response } from "express";
import prisma from "../Database/prisma/prisma";
import supabase from "../Database/supabase/supabase";
import { Lancamento, NotaFiscal } from "../generated/prisma";
import { criarNotaFiscal } from "../Helpers/releaseHelpers";

export const criarLancamento = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const enterpriseId = parseInt(req.params.empresaId);
    const userId = parseInt(req.params.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "USER_NOT_FOUND",
      });
    }

    if (!enterpriseId) {
      return res.status(401).json({
        success: false,
        error: "ENTERPRISE_NOT_FOUND",
      });
    }
    const nota: NotaFiscal = req.body;
    const release: Lancamento = req.body;

    if (!nota) {
      return res.status(401).json({
        success: false,
        error: "TAX_NOTE_INFORMATIONS_NOT_FOUND",
        message:
          "A nota fiscal não foi criada, verifique as informações inseridas!",
      });
    }
    if (!release) {
      return res.status(401).json({
        success: false,
        error: "RELEASE_INFORMATIONS_NOT_FOUND",
        message:
          "O lançamento não foi criado, verifique as informações inseridas!",
      });
    }
    const notaFiscal = await criarNotaFiscal(nota);

    const lancamento = await prisma.lancamento.create({
      data: {
        latitude: release.latitude,
        longitude: release.longitude,
        notaFiscalId: release.notaFiscalId,
        usuarioId: release.usuarioId,
        data_lancamento: release.data_lancamento,
      },
    });
  } catch (error: any) {
    console.error("Tipo do erro:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      error: "Erro interno do servidor",
      success: false,
      errorType: error.constructor.name,
    });
  }
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarLancamento = void 0;
const prisma_1 = __importDefault(require("../Database/prisma/prisma"));
const releaseHelpers_1 = require("../Helpers/releaseHelpers");
const criarLancamento = async (req, res) => {
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
        const nota = req.body;
        const release = req.body;
        if (!nota) {
            return res.status(401).json({
                success: false,
                error: "TAX_NOTE_INFORMATIONS_NOT_FOUND",
                message: "A nota fiscal não foi criada, verifique as informações inseridas!",
            });
        }
        if (!release) {
            return res.status(401).json({
                success: false,
                error: "RELEASE_INFORMATIONS_NOT_FOUND",
                message: "O lançamento não foi criado, verifique as informações inseridas!",
            });
        }
        const notaFiscal = await (0, releaseHelpers_1.criarNotaFiscal)(nota);
        const lancamento = await prisma_1.default.lancamento.create({
            data: {
                latitude: release.latitude,
                longitude: release.longitude,
                notaFiscalId: release.notaFiscalId,
                usuarioId: release.usuarioId,
                data_lancamento: release.data_lancamento,
            },
        });
    }
    catch (error) {
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
exports.criarLancamento = criarLancamento;

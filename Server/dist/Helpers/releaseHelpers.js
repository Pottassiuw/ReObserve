"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retornarImagem = exports.criarNotaFiscal = void 0;
const prisma_1 = __importDefault(require("../Database/prisma/prisma"));
const supabase_1 = __importDefault(require("../Database/supabase/supabase"));
const criarNotaFiscal = async (nota) => {
    try {
        const notaFiscal = await prisma_1.default.notaFiscal.create({
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
            console.log("Informações incorretas ou não recebidas, verifique as informações inseridas");
        }
        return notaFiscal;
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
    }
};
exports.criarNotaFiscal = criarNotaFiscal;
const retornarImagem = async () => {
    try {
        const { data } = supabase_1.default.storage
            .from("Lancamentos")
            .getPublicUrl("imagens/sixSenveennnn.jpg");
        console.log(data);
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
    }
};
exports.retornarImagem = retornarImagem;

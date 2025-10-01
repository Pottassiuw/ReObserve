"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarLancamento = void 0;
const supabase_1 = __importDefault(require("../Database/supabase/supabase"));
const criarLancamento = async (req, res) => {
    try {
        const { data, error } = await supabase_1.default.storage.getBucket("Lancamentos");
        console.log(data);
        console.log("i hate niggas!");
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

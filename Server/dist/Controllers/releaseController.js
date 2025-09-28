"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarLancamento = void 0;
const criarLancamento = async (req, res) => {
    try {
        const body = req.body;
        console.log(body);
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

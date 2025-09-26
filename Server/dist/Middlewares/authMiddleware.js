"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authSession = (req, res, next) => {
    try {
        const token = req.cookies;
        console.log(token);
    }
    catch (error) {
        console.error("Erro no Servidor: ", error);
    }
};

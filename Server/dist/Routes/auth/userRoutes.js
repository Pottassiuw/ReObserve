"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createUser_1 = require("../../controllers/auth/register/createUser");
const router = (0, express_1.Router)();
router.post("/auth/register", createUser_1.criarUsuario);
exports.default = router;

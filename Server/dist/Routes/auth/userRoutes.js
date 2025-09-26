"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createUser_1 = require("../../controllers/auth/register/createUser");
const loginEnterprise_1 = __importDefault(require("../../controllers/auth/login/loginEnterprise"));
const router = (0, express_1.Router)();
router.post("/auth/register", createUser_1.criarUsuario);
router.post("/auth/login", loginEnterprise_1.default);
exports.default = router;

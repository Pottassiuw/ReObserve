"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createEnterprise_1 = require("../../controllers/auth/register/createEnterprise");
const enterpriseController_1 = require("../../controllers/enterpriseController");
const loginEnterprise_1 = __importDefault(require("../../controllers/auth/login/loginEnterprise"));
const router = (0, express_1.Router)();
router.post("/auth/register", createEnterprise_1.criarEmpresa);
router.post("/auth/login", loginEnterprise_1.default);
router.get("/", enterpriseController_1.retornarEmpresas);
router.get("/:id", enterpriseController_1.retornarEmpresasId);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createEnterprise_1 = require("../../controllers/auth/register/createEnterprise");
const router = (0, express_1.Router)();
router.post("/register", createEnterprise_1.criarEmpresa);
exports.default = router;

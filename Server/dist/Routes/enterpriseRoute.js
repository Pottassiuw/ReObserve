"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createEnterprise_1 = require("../controllers/createEnterprise");
const router = (0, express_1.Router)();
router.post("/", createEnterprise_1.criarEmpresa);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const releaseController_1 = require("../Controllers/releaseController");
const router = (0, express_1.Router)();
router.post("/", releaseController_1.criarLancamento);
exports.default = router;

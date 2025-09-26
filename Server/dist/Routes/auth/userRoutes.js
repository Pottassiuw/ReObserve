"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
<<<<<<< HEAD
const createUser_1 = require("../../controllers/auth/register/createUser");
const loginEnterprise_1 = __importDefault(require("../../controllers/auth/login/loginEnterprise"));
const router = (0, express_1.Router)();
router.post("/auth/register", createUser_1.criarUsuario);
router.post("/auth/login", loginEnterprise_1.default);
=======
const createUser_1 = require("../../Controllers/auth/register/createUser");
const loginUser_1 = __importDefault(require("../../Controllers/auth/login/loginUser"));
const userController_1 = require("../../Controllers/userController");
const router = (0, express_1.Router)();
router.post("/auth/register", createUser_1.criarUsuario);
router.post("/auth/login", loginUser_1.default);
router.get("/", userController_1.retornarUsuarios);
router.get("/:id", userController_1.retornarUsuarioId);
router.delete("/:id", userController_1.deletarUsuario);
>>>>>>> 354c4f05804d9add1f1bc1a7a93c6835f28d7839
exports.default = router;

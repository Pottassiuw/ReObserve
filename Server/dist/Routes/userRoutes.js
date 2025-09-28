"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../Controllers/auth/User");
const userController_1 = require("../Controllers/userController");
const User_2 = require("../Controllers/auth/User");
const enterpriseController_1 = require("../Controllers/enterpriseController");
const router = (0, express_1.Router)();
//Usuarios
router.post("/auth/register", User_2.criarUsuario);
router.get("/", userController_1.retornarUsuarios);
router.get("/:id", userController_1.retornarUsuarioId);
router.delete("/:id", enterpriseController_1.deletarUsuario);
router.post("/auth/login", User_1.loginUsuario);
router.post("/auth/logout", User_1.logoutUsuario);
exports.default = router;

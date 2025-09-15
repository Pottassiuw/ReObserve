"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./Routes/auth/userRoutes"));
const enterpriseRoute_1 = __importDefault(require("./Routes/auth/enterpriseRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// rotas
app.use("/users", userRoutes_1.default);
app.use("/enterprises", enterpriseRoute_1.default);
exports.default = app;

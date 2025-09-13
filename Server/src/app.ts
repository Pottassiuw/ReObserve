import express from "express";
import empresaRoutes from "./Routes/enterpriseRoute";

const app = express();
app.use(express.json());

// rotas
app.use("/empresas", empresaRoutes);

export default app;

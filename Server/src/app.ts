import express from "express";
import userAuth from "./Routes/auth/userRoutes";
import enterpriseRoute from "./Routes/auth/enterpriseRoute";

const app = express();
app.use(express.json());

// rotas
app.use("/users", userAuth);
app.use("/enterprises", enterpriseRoute);

export default app

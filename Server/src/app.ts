import express from "express";
import userAuth from "./Routes/userRoutes";
import enterpriseRoute from "./Routes/enterpriseRoute";
import groupRoutes from "./Routes/groupRoutes";
const app = express();
app.use(express.json());

// rotas
app.use("/users", userAuth);
app.use("/enterprises", enterpriseRoute);
app.use("/groups", groupRoutes)
export default app

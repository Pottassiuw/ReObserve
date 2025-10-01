import express from "express";
import userAuth from "./Routes/userRoutes";
import enterpriseRoute from "./Routes/enterpriseRoute";
import groupRoutes from "./Routes/groupRoutes";
import releaseRoutes from "./Routes/releaseRoute";
const app = express();
app.use(express.json());
// rotas
app.use("/users", userAuth);
app.use("/enterprises", enterpriseRoute);
app.use("/groups", groupRoutes)
app.use("/releases", releaseRoutes);
export default app

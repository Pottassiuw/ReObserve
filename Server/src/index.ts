import dotenv from "dotenv";
import app from "./app";
import cors from "cors";

dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Escutando a porta ${port}`);
});

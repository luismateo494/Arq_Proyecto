import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool } from "./db/sqlserver.js";
import { registro, login } from "./controllers/auth.controller.js";
import { conectarRabbit } from "./rabbitmq.js"; // <-- 1. DEBE ESTAR AQUÍ
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ servicio: "Auth", status: "OK" });
});

app.post("/api/auth/registro", registro);
app.post("/api/auth/login", login);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await getPool();
    await conectarRabbit(); // <-- 2. DEBE ESTAR AQUÍ
    console.log(`🔐 Microservicio de Auth escuchando en el puerto ${PORT}`);
  } catch (error) {
    console.error("❌ Error al iniciar Auth:", error.message);
  }
});
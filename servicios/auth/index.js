import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool } from "./db/sqlserver.js";
import { registro, login } from "./controllers/auth.controller.js"; // <-- IMPORTAMOS
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ servicio: "Auth", status: "OK" });
});

// RUTAS REALES
app.post("/api/auth/registro", registro);
app.post("/api/auth/login", login);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await getPool(); // Conectamos a BD al iniciar
    console.log(`🔐 Microservicio de Auth escuchando en el puerto ${PORT}`);
  } catch (error) {
    console.error("❌ Error al conectar a SQL Server:", error.message);
  }
});
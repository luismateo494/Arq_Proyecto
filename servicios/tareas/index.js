import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool } from "./db/sqlserver.js";
import { connectMongo } from "./db/mongo.js"; // O como tengas tu conexión a Mongo
import tareasRoutes from "./modules/tareas/infrastructure/tareasRoutes.js";
import { escucharEventos } from "./rabbitmq.js";

// 1. IMPORTAR EL CONTROLADOR DE RESEÑAS
import { listarResenas, crearResena } from "./controllers/resenas.controller.js";
import { verificarToken } from "./middlewares/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ servicio: "Tareas", status: "OK" });
});

app.use("/api/tareas", tareasRoutes);

// 2. AGREGAR LAS RUTAS (Asegúrate de que estén aquí)
app.get("/api/resenas", listarResenas);
app.post("/api/resenas", verificarToken, crearResena);

const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  try {
    await getPool();
    await connectMongo();
    await escucharEventos();
    console.log(`📋 Microservicio de Tareas escuchando en el puerto ${PORT}`);
  } catch (error) {
    console.error("❌ Error al iniciar Tareas:", error.message);
  }
});
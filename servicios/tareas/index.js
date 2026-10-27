import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool } from "./db/sqlserver.js"; // <-- Importante
import tareasRoutes from "./modules/tareas/infrastructure/tareasRoutes.js"; 
import { escucharEventos } from "./rabbitmq.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ servicio: "Tareas", status: "OK" });
});

app.use("/api/tareas", tareasRoutes);

const PORT = process.env.PORT || 3002;

// ESTO ES LO QUE FALTA:
app.listen(PORT, async () => { 
  try {
    await getPool(); // <-- Obliga a conectar a SQL antes de decir que está listo
    await escucharEventos();  //llama a Rabbit
    console.log(`📋 Microservicio de Tareas escuchando en el puerto ${PORT}`);
  } catch (error) {
    console.error("❌ Error al conectar a SQL Server:", error.message);
  }
});
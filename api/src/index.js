import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import auth from "./routes/auth.routes.js";
import tareas from "./routes/tareas.routes.js";
import resenas from "./routes/resenas.routes.js";
import { errores } from "./middlewares/errores.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ ok: true, message: "API TaskFlow funcionando" });
});

app.use('/api/auth', auth);
app.use('/api/tareas', tareas);
app.use('/api/resenas', resenas);

app.use(errores);

// Conexión a MongoDB
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Conectado a MongoDB");

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`🚀 Servidor TaskFlow escuchando en el puerto ${Port}`);
});
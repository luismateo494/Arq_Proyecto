import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ servicio: "Auth", status: "OK" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Microservicio de Auth escuchando en el puerto ${PORT}`);
});
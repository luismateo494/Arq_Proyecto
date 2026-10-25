import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

// 1. Si la petición empieza con /api/auth, la mandamos a Auth (3001)
app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL, 
  changeOrigin: true 
}));

// 2. Si la petición empieza con /api/tareas, la mandamos a Tareas (3002)
app.use('/api/tareas', createProxyMiddleware({ 
  target: process.env.TAREAS_SERVICE_URL, 
  changeOrigin: true 
}));

// 3. Si la petición empieza con /api/resenas, también va a Tareas (3002)
app.use('/api/resenas', createProxyMiddleware({ 
  target: process.env.TAREAS_SERVICE_URL, 
  changeOrigin: true 
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚦 API Gateway escuchando en el puerto ${PORT}`);
});
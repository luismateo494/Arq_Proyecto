import { Router } from "express";
import * as ctrl from "../controllers/resenas.controller.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();
router.get('/', ctrl.listarResenas);
router.post('/', verificarToken, ctrl.crearResena);

export default router;
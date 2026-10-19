import { Router } from "express";
import * as ctrl from "../controllers/tareas.controller.js";
import { verificarToken } from "../middlewares/auth.js";
const router = Router();

// Todas las rutas de tareas requieren token
router.get('/', verificarToken, ctrl.listarTareas);
router.get('/:id', verificarToken, ctrl.obtenerTarea);
router.post('/', verificarToken, ctrl.crearTarea);
router.put('/:id', verificarToken, ctrl.actualizarTarea);
router.delete('/:id', verificarToken, ctrl.eliminarTarea);

export default router;
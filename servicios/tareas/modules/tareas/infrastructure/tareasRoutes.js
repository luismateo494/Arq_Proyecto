import { Router } from 'express';
import { TareasUseCases } from '../application/tareasUseCases.js';
import { SQLTareaRepository } from './SQLTareaRepository.js';
import { verificarToken } from '../../../middlewares/auth.js';

const router = Router();

// INYECCIÓN DE DEPENDENCIAS
// Le pasamos el repositorio SQL al caso de uso. 
// Si mañana hacemos un MongoTareaRepository, solo cambiamos esta línea.
const tareaRepository = new SQLTareaRepository();
const tareasUseCases = new TareasUseCases(tareaRepository);

// GET /api/tareas
router.get('/', verificarToken, async (req, res) => {
  try {
    const tareas = await tareasUseCases.listarTareas(req.usuarios.id);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tareas/:id
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const tarea = await tareasUseCases.obtenerTarea(req.params.id, req.usuarios.id);
    res.json(tarea);
  } catch (error) {
    res.status(404).json({ error: error.message }); // El caso de uso lanza error si no existe
  }
});

// POST /api/tareas
router.post('/', verificarToken, async (req, res) => {
  try {
    const tarea = await tareasUseCases.crearTarea(req.body, req.usuarios.id);
    res.status(201).json(tarea);
  } catch (error) {
    res.status(400).json({ error: error.message }); // 400 si el dominio falla (ej. título vacío)
  }
});

// PUT /api/tareas/:id
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const tarea = await tareasUseCases.actualizarTarea(req.params.id, req.body, req.usuarios.id);
    res.json(tarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/tareas/:id
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await tareasUseCases.eliminarTarea(req.params.id, req.usuarios.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
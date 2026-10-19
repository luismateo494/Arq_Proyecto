import { Resena } from '../models/resena.model.js';

// GET /api/resenas
export async function listarResenas(req, res) {
  try {
    const filtro = {};
    if (req.query.tareaId) {
      filtro.tareaId = Number(req.query.tareaId);
    }
    const resenas = await Resena.find(filtro).sort({ createdAt: -1 });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ msg: 'Error al listar reseñas' });
  }
}

// POST /api/resenas
export async function crearResena(req, res) {
  try {
    const resena = await Resena.create(req.body);
    res.status(201).json(resena);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Error de validación', detalles: error.message });
    }
    res.status(500).json({ msg: 'Error al crear reseña' });
  }
}
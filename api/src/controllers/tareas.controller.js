import { pool } from '../db/sqlserver.js';
import sql from "mssql";

// GET /api/tareas
export async function listarTareas(req, res) {
  try {
    const result = await pool.request()
      .input('usuario_id', sql.Int, req.usuarios.id)
      .query('SELECT * FROM Tareas WHERE usuario_id = @usuario_id ORDER BY id DESC');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ msg: 'Error al listar tareas' });
  }
}

// GET /api/tareas/:id
export async function obtenerTarea(req, res) {
  try {
    const r = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('usuario_id', sql.Int, req.usuarios.id)
      .query('SELECT * FROM Tareas WHERE id = @id AND usuario_id = @usuario_id');
      
    if (!r.recordset[0]) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    res.json(r.recordset[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener la tarea' });
  }
}

// POST /api/tareas
export async function crearTarea(req, res) {
  try {
    const { titulo, descripcion, estado = 'pendiente', prioridad = 'media' } = req.body;
    if (!titulo) {
      return res.status(400).json({ msg: 'El título es obligatorio' });        
    }

    const r = await pool.request()
      .input('titulo', sql.VarChar, titulo)
      .input('descripcion', sql.Text, descripcion || null)
      .input('estado', sql.VarChar, estado)
      .input('prioridad', sql.VarChar, prioridad)
      .input('usuario_id', sql.Int, req.usuarios.id)
      .query(`INSERT INTO Tareas (titulo, descripcion, estado, prioridad, usuario_id) 
              OUTPUT INSERTED.* 
              VALUES (@titulo, @descripcion, @estado, @prioridad, @usuario_id)`);
              
    res.status(201).json(r.recordset[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear la tarea' });
  }
}

// PUT /api/tareas/:id
export async function actualizarTarea(req, res) {
  try {
    const { titulo, descripcion, estado, prioridad } = req.body;
    const r = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('usuario_id', sql.Int, req.usuarios.id)
      .input('titulo', sql.VarChar, titulo)
      .input('descripcion', sql.Text, descripcion)
      .input('estado', sql.VarChar, estado)
      .input('prioridad', sql.VarChar, prioridad)
      .query(`UPDATE Tareas 
              SET titulo = @titulo, descripcion = @descripcion, estado = @estado, prioridad = @prioridad, updated_at = CURRENT_TIMESTAMP
              OUTPUT INSERTED.* 
              WHERE id = @id AND usuario_id = @usuario_id`);
              
    if (!r.recordset[0]) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    res.json(r.recordset[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar la tarea' });
  }
}

// DELETE /api/tareas/:id
export async function eliminarTarea(req, res) {
  try {
    const r = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('usuario_id', sql.Int, req.usuarios.id)
      .query('DELETE FROM Tareas WHERE id = @id AND usuario_id = @usuario_id');
      
    if (!r.rowsAffected[0]) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar la tarea' });
  }
}

import { pool } from '../../../db/sqlserver.js';
import sql from "mssql";
import { TareaRepository } from '../application/TareaRepository.js';

// Extendemos del Puerto para cumplir el contrato
export class SQLTareaRepository extends TareaRepository {
  
  async listar(usuario_id) {
    const result = await pool.request()
      .input('usuario_id', sql.Int, usuario_id)
      .query('SELECT * FROM Tareas WHERE usuario_id = @usuario_id ORDER BY id DESC');
    return result.recordset;
  }

  async obtener(id, usuario_id) {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('usuario_id', sql.Int, usuario_id)
      .query('SELECT * FROM Tareas WHERE id = @id AND usuario_id = @usuario_id');
    return result.recordset[0];
  }

  async crear(tarea) {
    const r = await pool.request()
      .input('titulo', sql.VarChar, tarea.titulo)
      .input('descripcion', sql.Text, tarea.descripcion || null)
      .input('estado', sql.VarChar, tarea.estado)
      .input('prioridad', sql.VarChar, tarea.prioridad)
      .input('usuario_id', sql.Int, tarea.usuario_id)
      .query(`INSERT INTO Tareas (titulo, descripcion, estado, prioridad, usuario_id) 
              OUTPUT INSERTED.* 
              VALUES (@titulo, @descripcion, @estado, @prioridad, @usuario_id)`);
    return r.recordset[0];
  }

  async actualizar(id, tarea) {
    const r = await pool.request()
      .input('id', sql.Int, id)
      .input('usuario_id', sql.Int, tarea.usuario_id)
      .input('titulo', sql.VarChar, tarea.titulo)
      .input('descripcion', sql.Text, tarea.descripcion)
      .input('estado', sql.VarChar, tarea.estado)
      .input('prioridad', sql.VarChar, tarea.prioridad)
      .query(`UPDATE Tareas 
              SET titulo = @titulo, descripcion = @descripcion, estado = @estado, prioridad = @prioridad, updated_at = CURRENT_TIMESTAMP
              OUTPUT INSERTED.* 
              WHERE id = @id AND usuario_id = @usuario_id`);
    return r.recordset[0];
  }

  async eliminar(id, usuario_id) {
    const r = await pool.request()
      .input('id', sql.Int, id)
      .input('usuario_id', sql.Int, usuario_id)
      .query('DELETE FROM Tareas WHERE id = @id AND usuario_id = @usuario_id');
    return r.rowsAffected[0] > 0;
  }
}

import { Tarea } from '../domain/Tarea.js';

export class TareasUseCases {
  constructor(tareaRepository) {
    // Aquí guardamos el "contrato" (el puerto) que nos pasen desde afuera
    this.tareaRepository = tareaRepository; 
  }

  async listarTareas(usuario_id) {
    return await this.tareaRepository.listar(usuario_id);
  }

  async obtenerTarea(id, usuario_id) {
    const tarea = await this.tareaRepository.obtener(id, usuario_id);
    if (!tarea) throw new Error('Tarea no encontrada');
    return tarea;
  }

  async crearTarea(datos, usuario_id) {
    // 1. Instanciamos la entidad (Dominio) para validar
    const nuevaTarea = new Tarea(
      null, 
      datos.titulo, 
      datos.descripcion, 
      datos.estado || 'pendiente', 
      datos.prioridad || 'media', 
      usuario_id
    );
    
    // 2. Validamos las reglas de negocio puras (si falla, lanza error)
    nuevaTarea.validar();

    // 3. Enviamos al repositorio para que se guarde en la BD real
    return await this.tareaRepository.crear(nuevaTarea);
  }

  async actualizarTarea(id, datos, usuario_id) {
    // Validamos primero que la tarea exista y sea del usuario
    await this.obtenerTarea(id, usuario_id); 

    const tareaActualizada = new Tarea(
      id,
      datos.titulo,
      datos.descripcion,
      datos.estado,
      datos.prioridad,
      usuario_id
    );
    
    tareaActualizada.validar();
    
    return await this.tareaRepository.actualizar(id, tareaActualizada);
  }

  async eliminarTarea(id, usuario_id) {
    await this.obtenerTarea(id, usuario_id);
    return await this.tareaRepository.eliminar(id, usuario_id);
  }
}
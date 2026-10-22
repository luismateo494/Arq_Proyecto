export class Tarea {
  constructor(id, titulo, descripcion, estado, prioridad, usuario_id) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.estado = estado;
    this.prioridad = prioridad;
    this.usuario_id = usuario_id;
  }

  // Regla de negocio pura
  validar() {
    if (!this.titulo || this.titulo.trim() === '') {
      throw new Error('El título es obligatorio');
    }
  }
}
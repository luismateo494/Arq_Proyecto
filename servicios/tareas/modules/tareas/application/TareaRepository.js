// Este es el "Puerto". Es un contrato (interfaz) que dice QUÉ debe hacer un repositorio,
// pero no dice CÓMO. No tiene SQL, ni Mongoose, ni Express.
export class TareaRepository {
  async listar(usuario_id) {
    throw new Error('El método listar() no está implementado');
  }

  async obtener(id, usuario_id) {
    throw new Error('El método obtener() no está implementado');
  }

  async crear(tarea) {
    throw new Error('El método crear() no está implementado');
  }

  async actualizar(id, tarea) {
    throw new Error('El método actualizar() no está implementado');
  }

  async eliminar(id, usuario_id) {
    throw new Error('El método eliminar() no está implementado');
  }
}
import { describe, it, expect, jest } from '@jest/globals';
import { TareasUseCases } from '../modules/tareas/application/tareasUseCases.js';

describe('Pruebas Unitarias - Casos de Uso de Tareas', () => {
  // Creamos un repositorio falso (Mock)
  const mockRepo = {
    crear: jest.fn(),
    listar: jest.fn(),
    obtener: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  };

  const useCases = new TareasUseCases(mockRepo);

  it('Debería lanzar un error si el título de la tarea está vacío', async () => {
    await expect(useCases.crearTarea({ titulo: '' }, 1))
      .rejects.toThrow('El título es obligatorio');
  });

  it('Debería crear una tarea correctamente si los datos son válidos', async () => {
    mockRepo.crear.mockResolvedValue({ id: 1, titulo: 'Prueba' });
    const resultado = await useCases.crearTarea({ titulo: 'Prueba' }, 1);
    
    expect(resultado.titulo).toBe('Prueba');
    expect(mockRepo.crear).toHaveBeenCalledTimes(1);
  });
});

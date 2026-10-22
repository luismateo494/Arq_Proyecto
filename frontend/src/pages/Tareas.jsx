import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Tareas() {
  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. LISTAR (useQuery)
  const { data: tareas, isLoading, error } = useQuery({
    queryKey: ['tareas'],
    queryFn: () => api('/tareas')
  });

  // 2. CREAR (useMutation)
  const mutationCrear = useMutation({
    mutationFn: (nuevaTarea) => api('/tareas', { method: 'POST', body: nuevaTarea }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      setTitulo(""); 
    }
  });

  // 3. ELIMINAR (useMutation)
  const mutationEliminar = useMutation({
    mutationFn: (id) => api(`/tareas/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    }
  });

  // 4. ACTUALIZAR ESTADO (useMutation)
  const mutationActualizar = useMutation({
    mutationFn: ({ id, estado }) => {
        // Buscamos la tarea actual para no sobreescribir campos vacíos
        const tareaActual = tareas.find(t => t.id === id);
        return api(`/tareas/${id}`, { 
            method: 'PUT', 
            body: { ...tareaActual, estado } // Cambiamos solo el estado
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    }
  });

  const handleCrear = (e) => {
    e.preventDefault();
    if (!titulo) return;
    mutationCrear.mutate({ titulo, prioridad });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando tareas...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Error al cargar: {error.message}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Mis Tareas (TaskFlow)</h2>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <form onSubmit={handleCrear} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Nueva tarea..." value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}/>
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <button type="submit" disabled={mutationCrear.isPending} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {mutationCrear.isPending ? 'Creando...' : 'Crear'}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas?.map((tarea) => (
          <li key={tarea.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
            
            {/* Info de la tarea */}
            <div>
              <strong style={{ display: 'block', textDecoration: tarea.estado === 'completada' ? 'line-through' : 'none', color: tarea.estado === 'completada' ? '#888' : 'black'}}>
                {tarea.titulo}
              </strong>
              <span style={{ fontSize: '0.85em', color: '#666' }}>Prioridad: {tarea.prioridad} | Estado: {tarea.estado}</span>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => mutationActualizar.mutate({ id: tarea.id, estado: tarea.estado === 'pendiente' ? 'completada' : 'pendiente' })}
                style={{ padding: '6px 10px', backgroundColor: tarea.estado === 'pendiente' ? '#17a2b8' : '#ffc107', color: tarea.estado === 'pendiente' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}
              >
                {tarea.estado === 'pendiente' ? 'Completar' : 'Reabrir'}
              </button>

              <button 
                onClick={() => {
                  if(window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
                    mutationEliminar.mutate(tarea.id);
                  }
                }}
                style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}
              >
                Eliminar
              </button>
            </div>

          </li>
        ))}
        {tareas?.length === 0 && <p style={{ textAlign: 'center' }}>No hay tareas aún.</p>}
      </ul>
    </div>
  );
}

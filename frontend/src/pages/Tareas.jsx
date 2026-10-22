import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Tareas() {
  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  
  // Estado para el buscador
  const [busqueda, setBusqueda] = useState("");
  
  // Estados para el modo edición
  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editPrioridad, setEditPrioridad] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. LISTAR
  const { data: tareas, isLoading, error } = useQuery({
    queryKey: ['tareas'],
    queryFn: () => api('/tareas')
  });

  // 2. CREAR
  const mutationCrear = useMutation({
    mutationFn: (nuevaTarea) => api('/tareas', { method: 'POST', body: nuevaTarea }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      setTitulo(""); 
    }
  });

  // 3. ELIMINAR
  const mutationEliminar = useMutation({
    mutationFn: (id) => api(`/tareas/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tareas'] })
  });

  // 4. ACTUALIZAR ESTADO (Completar / Reabrir)
  const mutationActualizarEstado = useMutation({
    mutationFn: ({ tarea, nuevoEstado }) => {
        return api(`/tareas/${tarea.id}`, { 
            method: 'PUT', 
            body: { ...tarea, estado: nuevoEstado } 
        });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tareas'] })
  });

  // 5. EDITAR TAREA COMPLETA
  const mutationEditar = useMutation({
    mutationFn: ({ id, datos }) => api(`/tareas/${id}`, { method: 'PUT', body: datos }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      setEditandoId(null);
    }
  });

  // --- Handlers ---
  const handleCrear = (e) => {
    e.preventDefault();
    if (!titulo) return;
    mutationCrear.mutate({ titulo, prioridad });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleGuardarEdicion = (tareaOriginal) => {
    mutationEditar.mutate({
        id: tareaOriginal.id,
        datos: { ...tareaOriginal, titulo: editTitulo, prioridad: editPrioridad }
    });
  };

  const handleEmpezarEdicion = (tarea) => {
      setEditandoId(tarea.id);
      setEditTitulo(tarea.titulo);
      setEditPrioridad(tarea.prioridad);
  };

  // 🚀 LÓGICA DEL BUSCADOR: Filtramos las tareas que coincidan con la búsqueda
  const tareasFiltradas = tareas?.filter((tarea) => 
    tarea.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando tareas...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Error al cargar: {error.message}</p>;

  return (
    <div style={{ maxWidth: '750px', margin: '50px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Mis Tareas (TaskFlow)</h2>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      {/* BUSCADOR */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar tarea por título..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
        />
      </div>

      {/* FORMULARIO CREAR */}
      <form onSubmit={handleCrear} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
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

      {/* LISTA DE TAREAS (Filtrada) */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareasFiltradas?.map((tarea) => (
          <li key={tarea.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
            
            {/* MODO EDICIÓN */}
            {editandoId === tarea.id ? (
              <div style={{ display: 'flex', flex: 1, gap: '10px', alignItems: 'center' }}>
                <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} style={{ flex: 1, padding: '6px' }}/>
                <select value={editPrioridad} onChange={(e) => setEditPrioridad(e.target.value)} style={{ padding: '6px' }}>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
                <button onClick={() => handleGuardarEdicion(tarea)} style={{ backgroundColor: '#007bff', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                <button onClick={() => setEditandoId(null)} style={{ backgroundColor: '#6c757d', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            ) : (
              /* MODO LECTURA */
              <>
                <div>
                  <strong style={{ display: 'block', textDecoration: tarea.estado === 'completada' ? 'line-through' : 'none', color: tarea.estado === 'completada' ? '#888' : 'black'}}>
                    {tarea.titulo}
                  </strong>
                  <span style={{ fontSize: '0.85em', color: '#666' }}>Prioridad: {tarea.prioridad} | Estado: {tarea.estado}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEmpezarEdicion(tarea)} style={{ padding: '6px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}>Editar</button>

                  <button onClick={() => mutationActualizarEstado.mutate({ tarea, nuevoEstado: tarea.estado === 'pendiente' ? 'completada' : 'pendiente' })} style={{ padding: '6px 10px', backgroundColor: tarea.estado === 'pendiente' ? '#17a2b8' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}>
                    {tarea.estado === 'pendiente' ? 'Completar' : 'Reabrir'}
                  </button>

                  <button onClick={() => { if(window.confirm('¿Eliminar tarea?')) mutationEliminar.mutate(tarea.id); }} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}>Eliminar</button>
                </div>
              </>
            )}

          </li>
        ))}
        {/* Mensaje si el buscador no encuentra nada */}
        {tareasFiltradas?.length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>No se encontraron tareas con ese título.</p>}
      </ul>
    </div>
  );
}
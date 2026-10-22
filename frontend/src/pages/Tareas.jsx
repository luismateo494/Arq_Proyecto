import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Tareas() {
  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: tareas, isLoading, error } = useQuery({
    queryKey: ['tareas'],
    queryFn: () => api('/tareas')
  });

  const mutation = useMutation({
    mutationFn: (nuevaTarea) => api('/tareas', { method: 'POST', body: nuevaTarea }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      setTitulo(""); 
    }
  });

  const handleCrear = (e) => {
    e.preventDefault();
    if (!titulo) return;
    mutation.mutate({ titulo, prioridad });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando tareas...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Error al cargar: {error.message}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Mis Tareas (TaskFlow)</h2>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <form onSubmit={handleCrear} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Nueva tarea..." value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ flex: 1, padding: '8px' }}/>
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={{ padding: '8px' }}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <button type="submit" disabled={mutation.isPending} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {mutation.isPending ? 'Creando...' : 'Crear'}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas?.map((tarea) => (
          <li key={tarea.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#fafafa' }}>
            <span><strong>{tarea.titulo}</strong></span>
            <span style={{ fontSize: '0.9em', color: '#666' }}>Prioridad: {tarea.prioridad}</span>
          </li>
        ))}
        {tareas?.length === 0 && <p style={{ textAlign: 'center' }}>No hay tareas aún.</p>}
      </ul>
    </div>
  );
}
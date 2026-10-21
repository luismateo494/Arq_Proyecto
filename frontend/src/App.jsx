const API = 'http://localhost:3000/api';

// Cuando Login  y Tarea necesitan datos llama este archivo  y inyecta el token 

export async function api(ruta, opciones = {}) {
     const token = localStorage.getItem('token'); 

     const res = await fetch(API + ruta, {
          method: opciones.method || 'GET',
          headers: {
               'Content-Type': 'application/json',
               ...(token && { Authorization: `Bearer ${token}` }), 
          },
          body: opciones.body ? JSON.stringify(opciones.body) : undefined
     });

     if (res.status === 204) return null;
     
     const data = await res.json();
     if (!res.ok) throw new Error(data.message || 'Error en la peticion');
     return data;
}


import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />
    return children;
}

//Este archivo es llamado por el archivo app  revisa si hay toke en localstorage
///usa el componente navigate para mandarlo a login si no hay pero si hay  devuelve childre que seria paginas tareas.
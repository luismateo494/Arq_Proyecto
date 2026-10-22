import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Tareas from "./pages/Tareas.jsx";
import RutaProtegida from "./rutaProtegida.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <RutaProtegida>
          <Tareas />
        </RutaProtegida>
      } />
    </Routes>
  );
}
//Este archivo es el enrutador principal. Interactúa importando a Login, Tareas y RutaProtegida
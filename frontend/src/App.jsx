import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx"; // Importamos la nueva vista
import Tareas from "./pages/Tareas.jsx";
import RutaProtegida from "./rutaProtegida.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} /> {/* Nueva ruta pública */}
      <Route path="/" element={
        <RutaProtegida>
          <Tareas />
        </RutaProtegida>
      } />
    </Routes>
  );
}

//Este archivo es el enrutador principal. Interactúa importando a Login, Tareas y RutaProtegida
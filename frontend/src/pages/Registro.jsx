import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(false);
    
    try {
      // Llamamos al endpoint de registro de nuestro backend
      await api('/auth/registro', {
        method: 'POST',
        body: { nombre, email, password }
      });
      
      setExito(true);
      // Esperamos 2 segundos para que el usuario lea el mensaje y lo mandamos al login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2>Crear Cuenta - TaskFlow</h2>
      
      {error && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{error}</p>}
      {exito && <p style={{ color: 'green', backgroundColor: '#e6ffe6', padding: '10px', borderRadius: '4px' }}>¡Usuario creado con éxito! Redirigiendo al login...</p>}
      
      <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Nombre completo" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          Registrarse
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#007bff' }}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
}
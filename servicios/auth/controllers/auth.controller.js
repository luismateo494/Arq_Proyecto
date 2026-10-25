import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool, sql } from "../db/sqlserver.js";
// import { publicarEvento } from "../rabbitmq.js"; // Lo activaremos después

export async function registro(req, res) {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Completa todos los campos" });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const pool = await getPool();
    
    const r = await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("email", sql.VarChar, email)
      .input("password_hash", sql.VarChar, hash)
      .query(`INSERT INTO Usuarios (nombre, email, password_hash) 
              OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.email 
              VALUES (@nombre, @email, @password_hash)`);
              
    const nuevoUsuario = r.recordset[0];

    // AQUÍ PUBLICAREMOS EL EVENTO EN RABBITMQ LUEGO
    // publicarEvento('usuario.creado', nuevoUsuario);

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    if (error.number === 2627) return res.status(409).json({ message: "Email ya registrado" });
    res.status(500).json({ message: "Error interno" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const pool = await getPool();
    
    const r = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Usuarios WHERE email = @email");
      
    const usuario = r.recordset[0];
    const ok = usuario && await bcrypt.compare(password, usuario.password_hash);
    
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    
    const { id, nombre } = usuario;
    const token = jwt.sign({ id, nombre }, process.env.JWT_SECRET, { expiresIn: "1h" });   
    res.json({ token, nombre });
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
}

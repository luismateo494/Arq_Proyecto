import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/sqlserver.js";
import sql from "mssql";

// POST /api/auth/registro
export async function resgistro(req, res) {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Por favor, completa todos los campos" });
    }
  
    const hash = await bcrypt.hash(password, 10);
    
    // Enviamos tipos de datos de mssql para evitar inyecciones
    const r = await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("email", sql.VarChar, email)
      .input("password_hash", sql.VarChar, hash)
      .query(`INSERT INTO Usuarios (nombre, email, password_hash) 
              OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.email 
              VALUES (@nombre, @email, @password_hash)`);
              
    res.status(201).json(r.recordset[0]);
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({ message: "Este email ya está registrado" });
    }
    res.status(500).json({ message: "Error interno" });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Por favor completa todos los campos" });
    }   
    
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

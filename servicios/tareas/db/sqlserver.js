import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

// Configuración para conectarse al "master" e inicializar todo
const masterConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  port: Number(process.env.SQL_PORT),
  database: 'master', // Nos conectamos a master primero
  options: { encrypt: false, trustServerCertificate: true },
};

const dbConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  port: Number(process.env.SQL_PORT),
  database: process.env.SQL_DATABASE, // Aquí usará TaskFlowTareasDB
  options: { encrypt: false, trustServerCertificate: true },
};

let pool;

export async function getPool() {
  if (!pool) {
    try {
      // 1. Conectar a master para crear la BD
      const masterPool = await sql.connect(masterConfig);
      await masterPool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${process.env.SQL_DATABASE}')
        BEGIN
          CREATE DATABASE ${process.env.SQL_DATABASE};
        END
      `);
      await masterPool.close();

      // 2. Conectar a la BD real
      pool = await sql.connect(dbConfig);

      // 3. Crear la tabla Tareas si no existe
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tareas' and xtype='U')
        BEGIN
          CREATE TABLE Tareas (
            id INT IDENTITY(1,1) PRIMARY KEY,
            titulo VARCHAR(200) NOT NULL,
            descripcion TEXT,
            estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
            prioridad VARCHAR(20) NOT NULL DEFAULT 'media',
            usuario_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        END
      `);

      console.log(`✅ Conectado a SQL Server (Tareas) y base de datos inicializada`);
    } catch (err) {
      console.error("❌ Error conectando a SQL Server (Tareas):", err.message);
      throw err;
    }
  }
  return pool;
}

export { sql };
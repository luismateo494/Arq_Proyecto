import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: Number(process.env.SQL_PORT),
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: { encrypt: false, trustServerCertificate: true },
};

let pool;
export async function getPool() {
  if (!pool) {
    pool = await sql.connect(sqlConfig);
    console.log("✅ Conectado a SQL Server (Tareas)");
  }
  return pool;
}
export { sql };
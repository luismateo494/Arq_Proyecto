import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: Number(process.env.SQL_PORT),
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const pool = await sql.connect(config);
console.log("✅ Conectado a SQL Server");
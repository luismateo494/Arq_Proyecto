CREATE DATABASE TaskFlowDB;
GO

USE TaskFlowDB;
GO

-- 1. Tabla de Usuarios
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Tareas (Equivalente a tu tabla Team/Tareas)
CREATE TABLE Tareas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    prioridad VARCHAR(20) NOT NULL DEFAULT 'media',
    usuario_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- La actualización se maneja desde Node.js
    CONSTRAINT fk_tarea_usuario FOREIGN KEY (usuario_id) 
        REFERENCES Usuarios(id) ON DELETE CASCADE
);
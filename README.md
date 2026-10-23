# TaskFlow - Gestor de Tareas Full Stack

TaskFlow es una aplicación web Full Stack para la gestión de tareas personales. Permite a los usuarios registrarse, iniciar sesión, y administrar sus propias tareas (crear, listar, editar, completar y eliminar).

# Tecnologías Usadas

**Backend (API):**
 Node.js + Express
 SQL Server (Base de datos relacional para Usuarios y Tareas)
 MongoDB + Mongoose (Base de datos NoSQL para Reseñas)
 JSON Web Tokens (JWT) para autenticación
 Bcrypt.js para encriptación de contraseñas
 Arquitectura Hexagonal para el módulo de Tareas

**Frontend:**
 React (creado con Vite)
 React Router DOM (Manejo de rutas protegidas)
 React Query (`@tanstack/react-query` para manejo de estado del servidor y caché)
 Fetch API (Cliente HTTP nativo)

## Pasos para correr el proyecto

 Levantar las bases de datos (Docker)
 Configurar variables de entorno entra a la caperta api/.env.example  y renombralo .env

## Ejecutar backend 
npm install
npm run dev

## Ejecutar frontend
npm install
npm run dev

## Arquitectura del Proyecto

Para el módulo de tareas en el backend, implementé una Arquitectura Hexagonal (Puertos y Adaptadores) con el fin de separar la lógica de negocio de las herramientas externas (frameworks y bases de datos).

Dominio (domain): Contiene la entidad Tarea y las reglas de validación puras (ej. el título no puede estar vacío). Es JavaScript puro, sin dependencias de SQL ni Express.

Aplicación (application): Contiene los casos de uso (TareasUseCases) y el puerto (TareaRepository). Los casos de uso orquestan las acciones.

nfraestructura (infrastructure): Contiene los adaptadores concretos. Aquí sí importamos SQL Server (SQLTareaRepository) para implementar el contrato del puerto, y Express (tareasRoutes.js) como punto de entrada para las peticiones HTTP.

Esta separación permite que si el día de mañana se decide migrar de SQL Server a otra base de datos solo sea necesario crear un nuevo adaptador en la capa de infraestructura, sin necesidad de modificar la lógica de negocio.
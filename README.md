# TaskFlow - Gestor de Tareas Full Stack

TaskFlow es una aplicación Full Stack basada en microservicios. Permite a los usuarios registrarse, iniciar sesión y administrar tareas personales. Utiliza mensajería asíncrona (RabbitMQ) para comunicar eventos entre servicios.

# Tecnologías Usadas

**Backend (API):**
 Node.js + Express
 SQL Server (Base de datos relacional para Usuarios y Tareas)
 MongoDB + Mongoose (Base de datos NoSQL para Reseñas)
 JSON Web Tokens (JWT) para autenticación
 Bcrypt.js para encriptación de contraseñas
 Arquitectura Hexagonal para el módulo de Tareas
RabbitMQ.

**Frontend:**
 React (creado con Vite)
 React Router DOM (Manejo de rutas protegidas)
 React Query (`@tanstack/react-query` para manejo de estado del servidor y caché)
 Fetch API (Cliente HTTP nativo)

 **Pruebas**
 Vitest
 Jest

## Pasos para correr el proyecto

 Levantar las bases de datos (Docker)
 Configurar variables de entorno entra a la caperta api/.env.example  y renombralo .env

En la carpeta raiz ejecuta en la terminal 

docker compose up --build -d

## Para levantar el frontend:

npm install
npm run dev

**Correr las pruebas***

## Backend (Jest):

cd servicios/tareas
npm test

## Frontend (Vitest):

cd frontend
npm test -- --run

## Arquitectura de Microservicios

     [ Frontend React ] (Puerto 5173)

                 │
                  (HTTP)
 [ API Gateway ] (Puerto 3000)
             │
             │_ [ Auth Service ] (Puerto 3001) ──▶ SQL Server (TaskFlowAuthDB)
             │
             │_ [ Tareas Service ] (Puerto 3002) ──▶ SQL Server (TaskFlowTareasDB)
                                             │
                                             │_ MongoDB (Reseñas)

                    

   [ Mensajería RabbitMQ ] ----- (Evento: usuario.creado) ─── Auth Service
                                                         │__Tareas Service
                                                         

                                                         
**Endpoint principales**

## Auth Service (Público):

POST /api/auth/registro - Crea un usuario y publica el evento usuario.creado.

POST /api/auth/login - Devuelve el token JWT (dura 1 hora).

##  Tareas Service (Requiere Bearer Token en el Header):

GET /api/tareas - Lista las tareas del usuario.

POST /api/tareas - Crea una nueva tarea.

PUT /api/tareas/:id - Actualiza una tarea.

DELETE /api/tareas/:id - Elimina una tarea.

##  Reseñas (MongoDB):


GET /api/resenas - Lista las reseñas.

POST /api/resenas - Crea una reseña (protegido).


**Mensajería (RabbitMQ)**

Publica: El microservicio de Auth al registrar un usuario (usuario.creado).

Consume: El microservicio de Tareas, que escucha el evento y reacciona en consola.



## Arquitectura del Proyecto

Para el módulo de tareas en el backend, implementé una Arquitectura Hexagonal (Puertos y Adaptadores) con el fin de separar la lógica de negocio de las herramientas externas (frameworks y bases de datos).

Dominio (domain): Contiene la entidad Tarea y las reglas de validación puras (ej. el título no puede estar vacío). Es JavaScript puro, sin dependencias de SQL ni Express.

Aplicación (application): Contiene los casos de uso (TareasUseCases) y el puerto (TareaRepository). Los casos de uso orquestan las acciones.

nfraestructura (infrastructure): Contiene los adaptadores concretos. Aquí sí importamos SQL Server (SQLTareaRepository) para implementar el contrato del puerto, y Express (tareasRoutes.js) como punto de entrada para las peticiones HTTP.

Esta separación permite que si el día de mañana se decide migrar de SQL Server a otra base de datos solo sea necesario crear un nuevo adaptador en la capa de infraestructura, sin necesidad de modificar la lógica de negocio.
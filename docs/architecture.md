# Arquitectura — JuampyZel

Este documento define la arquitectura que deben seguir todos los desarrolladores y agentes de IA que trabajen en el sistema web de **JuampyZel**.

## Propósito

JuampyZel es una empresa dedicada a la producción y comercialización de diferentes tipos de helados. El sistema permitirá centralizar y administrar las operaciones de la empresa.

## Tecnologías

### Frontend
- React
- JavaScript
- HTML5
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Base de datos
- MySQL

## Patrón arquitectónico

El proyecto utiliza una arquitectura **MVC (Model-View-Controller)**:

```text
Frontend
    │ HTTP / API REST
    ▼
Backend
    ├── Routes
    ├── Controllers
    ├── Models
    └── Services
            │
            ▼
        MySQL
```

## Arquitectura general

El sistema se divide en dos aplicaciones:

```text
JuampyZel
├── frontend/    → React
└── backend/     → Node.js + Express + MVC
```

## Estructura del proyecto

```text
juampyzel/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── assets/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── database/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── api.md
├── .gitignore
└── README.md
```

## Separación de responsabilidades

- **Frontend (React):** Interfaz, formularios, navegación, visualización, interacción del usuario, estado de la interfaz.
- **Routes:** Definir endpoints de la API.
- **Controllers:** Recibir solicitudes HTTP, coordinar operaciones y enviar respuestas.
- **Services:** Reglas de negocio, procesos y validaciones de negocio.
- **Models:** Acceso a MySQL, consultas y persistencia.
- **MySQL:** Almacenar información, relaciones e integridad de datos.

## Flujo de una solicitud

```text
React → API REST → Controller → Service → Model → MySQL
MySQL → Model → Service → Controller → HTTP Response → React
```

## Reglas arquitectónicas

- El frontend **nunca** debe conectarse directamente a MySQL.
- Las credenciales de MySQL deben almacenarse en variables de entorno.
- No almacenar contraseñas en texto plano (usar bcrypt).
- Utilizar consultas parametrizadas.
- Validar información en el backend, sin confiar en el frontend.
- Controlar permisos mediante middleware.

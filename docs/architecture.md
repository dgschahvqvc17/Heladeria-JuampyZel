# Arquitectura — JuampyZel

Este documento define la arquitectura que deben seguir todos los desarrolladores y agentes de IA que trabajen en el sistema web de **JuampyZel**.

## Propósito

JuampyZel es una empresa dedicada a la producción y comercialización de helados. El sistema web centraliza y administra las operaciones de la empresa: sucursales, ventas, abastecimiento de tiendas, inventario, clientes, usuarios y roles, y reportes.

## Tecnologías

### Frontend
- React
- JavaScript (ES2022+)
- HTML5
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- JavaScript (ES2022+)

### Base de datos
- MySQL (InnoDB)

## Patrón arquitectónico

MVC con capa adicional de Services:

```text
Routes → Controllers → Services → Models → MySQL
```

## Arquitectura general

```text
JuampyZel
├── frontend/   → React (View + Interacción)
└── backend/    → Node.js + Express + MVC + MySQL
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
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
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

- **Frontend (React):** Interfaz, formularios, navegación, visualización, interacción, estado de UI.
- **Routes:** Definir endpoints de la API.
- **Controllers:** Recibir solicitudes, validar básicamente, llamar al Service, enviar respuestas.
- **Services:** Lógica de negocio, validaciones de negocio.
- **Models:** Acceso a MySQL con consultas parametrizadas.
- **Middlewares:** Autenticación, autorización, manejo de errores.
- **MySQL:** Almacenamiento, relaciones, integridad.

## Seguridad

- El frontend nunca se conecta directamente a MySQL.
- Las contraseñas se almacenan como hashes bcrypt (cost factor 10).
- Las credenciales MySQL y JWT secrets van en `.env`, nunca en el código.
- Todas las consultas SQL usan consultas parametrizadas (prevenir SQL injection).
- La validación de datos se realiza nuevamente en el backend.
- Los permisos se verifican mediante middleware (`authMiddleware`, `roleMiddleware`).

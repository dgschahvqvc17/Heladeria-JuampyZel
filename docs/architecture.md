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
- @supabase/supabase-js (cliente para funcionalidades futuras)

### Backend
- Node.js
- Express.js
- JavaScript (ES2022+)
- @supabase/supabase-js (acceso a la base de datos)

### Base de datos
- Supabase (PostgreSQL)

## Patrón arquitectónico

MVC con capa adicional de Services:

```text
Routes → Controllers → Services → Models → Supabase (PostgreSQL)
```

## Arquitectura general

```text
JuampyZel
├── frontend/   → React (View + Interacción)
└── backend/    → Node.js + Express + MVC + Supabase
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
│   │   ├── lib/
│   │   │   └── supabase.js        → Cliente Supabase (publishable key)
│   │   ├── context/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── supabase/
│   └── schema.sql                 → Esquema, vistas, RPC, RLS y seed
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js        → Cliente Supabase (service role key)
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js              → Punto de entrada (verifica conexión a Supabase)
│   ├── .env
│   └── package.json
├── database/
│   └── README.md                  → Apunta a supabase/schema.sql
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
- **Models:** Acceso a Supabase (consultas a tablas/vistas y llamadas RPC).
- **Middlewares:** Autenticación, autorización, manejo de errores.
- **Supabase (PostgreSQL):** Almacenamiento, relaciones, integridad, RLS y funciones RPC atómicas.

## Acceso a la base de datos

- El backend opera con la **SERVICE ROLE key** (ignora RLS). Está configurada en `backend/src/config/supabase.js` mediante `@supabase/supabase-js`.
- Las **operaciones atómicas** (venta + detalle + stock, pedido + detalle + historial, movimientos de inventario, cambios de estado) se ejecutan como funciones `plpgsql` definidas en `supabase/schema.sql` e invocadas por los Services (`supabase.rpc(...)`). No se usan transacciones manuales desde Node.
- Se usa la **publishable (anon) key** solo en el frontend (`frontend/src/lib/supabase.js`) y en el backend como *fallback*. Con RLS habilitado, no tiene permisos de escritura.

## Seguridad

- El frontend no se conecta directamente a la base de datos para escrituras; consume la API REST del backend.
- RLS está habilitado en todas las tablas. Sólo existen políticas `SELECT` públicas para el catálogo activo.
- La SERVICE ROLE key permanece únicamente en `backend/.env`, nunca en el código o el frontend.
- Las contraseñas se almacenan como hashes bcrypt (cost factor 10).
- Las credenciales de Supabase y JWT secrets van en `.env`, nunca en el código.
- La validación de datos se realiza nuevamente en el backend.
- Los permisos se verifican mediante middleware (`authMiddleware`, `roleMiddleware`).
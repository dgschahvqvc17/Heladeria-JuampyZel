# JuampyZel

Sistema web empresarial para la gestión de la heladería JuampyZel.

## Descripción

JuampyZel es una empresa dedicada a la producción y comercialización de diferentes tipos de helados. Este sistema permite centralizar y administrar las operaciones de la empresa, incluyendo:

- Gestión de sucursales.
- Venta de helados en sucursales.
- Atención a tiendas que realizan pedidos para abastecerse.
- Gestión de productos por categorías.
- Inventario.
- Clientes y tiendas.
- Pedidos y ventas.
- Usuarios y roles.
- Reportes y operaciones administrativas.

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

## Arquitectura

El sistema utiliza una arquitectura **MVC (Model-View-Controller)** separada en dos aplicaciones:

```text
JuampyZel
│
├── frontend/   → React (View + Interacción)
└── backend/    → Node.js + Express + MVC + MySQL
```

Consulte la [documentación de arquitectura](docs/architecture.md) para más detalles.

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

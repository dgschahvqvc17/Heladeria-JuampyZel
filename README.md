# JuampyZel

Sistema web empresarial para la gestión de la heladería **JuampyZel**.

La aplicación centraliza y administra las operaciones de la empresa: sucursales, ventas, pedidos de abastecimiento de tiendas, inventario, clientes, usuarios y roles, y reportes.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React, JavaScript, HTML5, Tailwind CSS, Vite |
| Backend | Node.js, Express.js, JavaScript |
| Base de datos | MySQL (InnoDB) |
| Auth | bcrypt (hashing), JWT (tokens) |

## Arquitectura

El sistema sigue una arquitectura **MVC con capa de Services**:

```text
Frontend (React)
    │ HTTP / API REST
    ▼
Backend (Express)
    ├── Routes → Controllers → Services → Models → MySQL
    └── Middlewares (auth, roles, errores)
```

Consulta la [documentación de arquitectura](docs/architecture.md) para más detalles.

---

## Estructura del proyecto

```text
juampyzel/
├── frontend/                 → React + Vite + Tailwind
│   ├── src/
│   │   ├── components/common/  → Button, Input, Alert
│   │   ├── context/            → AuthContext (gestión de sesión)
│   │   ├── pages/Login/        → Pantalla de inicio de sesión
│   │   ├── pages/Dashboard/    → Dashboard tras login
│   │   ├── routes/             → AppRoutes, ProtectedRoute, PublicRoute
│   │   ├── services/           → authService (HTTP calls)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                  → Node.js + Express + MySQL
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     → Pool de conexiones MySQL
│   │   │   └── jwt.js          → Configuración JWT
│   │   ├── controllers/
│   │   │   └── authController.js → Login, logout, me
│   │   ├── services/
│   │   │   └── authService.js    → Lógica de negocio de auth
│   │   ├── models/
│   │   │   └── User.js           → Consultas a tabla usuario
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js → Verificación de JWT
│   │   ├── routes/
│   │   │   └── authRoutes.js     → Endpoints /api/auth/*
│   │   ├── app.js              → Express app + middleware + rutas
│   │   └── server.js           → Punto de entrada
│   ├── .env                   → Variables de entorno
│   └── package.json
├── database/
│   ├── schema.sql             → Definición de tablas
│   ├── seed.sql               → Datos semilla (bcrypt hashes)
│   └── README.md
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── api.md
├── rules/                     → Documentos de reglas del proyecto
│   ├── architecture.md
│   ├── backend.md
│   ├── coding-standards.md
│   ├── frontend.md
│   ├── project-context.md
│   └── sprints.md
├── juampyzel_database.sql     → Script completo (schema + seed)
├── .gitignore
└── README.md
```

---

## Requisitos

- **Node.js** v18+ (recomendado v20+)
- **npm** (incluido con Node.js)
- **MySQL** 8.0 (instalado mediante MySQL Installer / Workbench)

---

## Configuración

### 1. Base de datos

La base de datos debe estar corriendo en `localhost:3306` con el nombre `juampyzel`.

Para crear la base de datos y cargar los datos semilla:

```bash
# Desde el directorio del proyecto
mysql -u root -p < juampyzel_database.sql
```

El script `juampyzel_database.sql` incluye:
- Creación de la base de datos y todas las tablas
- Relaciones y constraints
- Datos semilla con contraseñas hasheadas con bcrypt

### 2. Variables de entorno (Backend)

Copia el archivo de ejemplo y configura las variables:

```bash
cd backend/
cp .env.example .env  # o edita .env directamente
```

Contenido del `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=juampyzel
DB_USER=root
DB_PASSWORD=admin123

JWT_SECRET=juampyzel_secret_key_2024
JWT_EXPIRES_IN=24h
PORT=5000
```

> **Nota:** Nunca comparta ni suba el archivo `.env` a GitHub. El `.gitignore` ya lo excluye.

### 3. Credenciales iniciales

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| `admin@juampyzel.com` | `admin123` | ADMINISTRADOR |
| `vendedor@juampyzel.com` | `vendedor123` | VENDEDOR |
| `inventario@juampyzel.com` | `inventario123` | INVENTARIO |

---

## Cómo ejecutar el sistema

### Instalación de dependencias

```bash
# Backend
cd backend/
npm install

# Frontend
cd ../frontend/
npm install
```

### Ejecución (modo desarrollo)

```bash
# Terminal 1 — Backend (API REST en http://localhost:5000)
cd backend/
npm run dev

# Terminal 2 — Frontend (React + Vite en http://localhost:5173)
cd frontend/
npm run dev
```

### Endpoints de autenticación (HU01)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión (recibe `correo` y `password`) |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/me` | Obtener usuario autenticado (requiere token) |

**Ejemplo de login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@juampyzel.com","password":"admin123"}'
```

**Respuesta:**

```json
{
    "success": true,
    "message": "Inicio de sesión exitoso.",
    "data": {
        "token": "<jwt_token>",
        "user": {
            "id": 1,
            "nombre": "Administrador",
            "apellido": "JuampyZel",
            "correo": "admin@juampyzel.com",
            "rol": "ADMINISTRADOR"
        }
    }
}
```

Usa el token en el header de las peticiones protegidas:

```
Authorization: Bearer <jwt_token>
```

---

## Historias de usuario implementadas

| HU | Nombre | Estado |
|----|--------|--------|
| **HU01** | Iniciar sesión | ✅ Implementada |
| HU02 | Gestionar usuarios y roles | Pendiente |
| HU03 | Gestionar productos y categorías | Pendiente |
| HU04 | Gestionar sucursales | Pendiente |
| HU05–HU12 | (Sprints 2 y 3) | Pendientes |

---

## Documentación adicional

- [Arquitectura del sistema](docs/architecture.md)
- [Base de datos](docs/database.md)
- [API REST](docs/api.md)
- [Plan de sprints](rules/sprints.md)
- [Especificaciones backend](rules/backend.md)
- [Especificaciones frontend](rules/frontend.md)
- [Normas de código](rules/coding-standards.md)

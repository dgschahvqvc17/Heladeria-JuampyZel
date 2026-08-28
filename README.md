# JuampyZel

Sistema web empresarial para la gestion de la heladeria **JuampyZel**.

La aplicacion centraliza y administra las operaciones de la empresa: sucursales, ventas, pedidos de abastecimiento de tiendas, inventario, clientes, usuarios y roles, y reportes.

---

## Tecnologias

| Capa | Tecnologia |
|------|-----------|
| Frontend | React, JavaScript, HTML5, Tailwind CSS, Vite |
| Backend | Node.js, Express.js, JavaScript |
| Base de datos | MySQL (InnoDB) |
| Auth | bcrypt (hashing), JWT (tokens) |

## Arquitectura

El sistema sigue una arquitectura **MVC con capa de Services**:

```text
Frontend (React)
    | HTTP / API REST
    v
Backend (Express)
    |-- Routes -> Controllers -> Services -> Models -> MySQL
    +-- Middlewares (auth, roles, errores)
```

Consulta la [documentacion de arquitectura](docs/architecture.md) para mas detalles.

---

## Estructura del proyecto

```text
juampyzel/
|-- frontend/                 -> React + Vite + Tailwind
|   |-- src/
|   |   |-- components/common/  -> Button, Input, Alert
|   |   |-- context/            -> AuthContext (gestion de sesion)
|   |   |-- pages/Login/        -> Pantalla de inicio de sesion
|   |   |-- pages/Dashboard/    -> Dashboard tras login
|   |   |-- pages/Usuarios/     -> Gestion de usuarios (HU02)
|   |   |-- pages/Sucursales/   -> Gestion de sucursales (HU04)
|   |   |-- pages/Clientes/     -> Gestion de clientes (HU05)
|   |   |-- pages/Productos/    -> Gestion de productos y categorias (HU03)
|   |   |-- routes/             -> AppRoutes, ProtectedRoute, PublicRoute
|   |   |-- services/           -> authService, userService, branchService, customerService, productService, categoryService (HTTP calls)
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   +-- index.css
|   |-- public/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   |-- tailwind.config.js
|   +-- postcss.config.js
|-- backend/                  -> Node.js + Express + MySQL
|   |-- migrations/            -> Migraciones SQL versionadas
|   |-- src/
|   |   |-- config/
|   |   |   |-- database.js     -> Pool de conexiones MySQL
|   |   |   +-- jwt.js          -> Configuracion JWT
|   |   |-- controllers/
|   |   |   |-- authController.js -> Login, logout, me
|   |   |   |-- userController.js -> CRUD de usuarios (HU02)
|   |   |   |-- branchController.js -> CRUD de sucursales (HU04)
|   |   |   |-- customerController.js -> CRUD de clientes (HU05)
|   |   |   +-- productController.js -> CRUD de productos (HU03)
|   |   |   +-- categoryController.js -> CRUD de categorias (HU03)
|   |   |-- services/
|   |   |   |-- authService.js    -> Logica de negocio de auth
|   |   |   |-- userService.js    -> Logica de negocio de usuarios (HU02)
|   |   |   |-- branchService.js  -> Logica de negocio de sucursales (HU04)
|   |   |   |-- customerService.js -> Logica de negocio de clientes (HU05)
|   |   |   +-- productService.js  -> Logica de negocio de productos (HU03)
|   |   |   +-- categoryService.js -> Logica de negocio de categorias (HU03)
|   |   |-- models/
|   |   |   |-- User.js           -> Consultas a tabla usuario
|   |   |   |-- Branch.js         -> Consultas a tabla sucursal
|   |   |   |-- Customer.js       -> Consultas a tabla cliente
|   |   |   +-- Product.js        -> Consultas a tabla producto
|   |   |   +-- Category.js       -> Consultas a tabla categoria
|   |   |-- middlewares/
|   |   |   |-- authMiddleware.js -> Verificacion de JWT
|   |   |   +-- roleMiddleware.js -> Verificacion de roles (HU02)
|   |   |-- utils/
|   |   |   +-- migrations.js     -> Runner de migraciones
|   |   |-- routes/
|   |   |   |-- authRoutes.js     -> Endpoints /api/auth/*
|   |   |   |-- userRoutes.js     -> Endpoints /api/users/* (HU02)
|   |   |   |-- branchRoutes.js   -> Endpoints /api/branches/* (HU04)
|   |   |   |-- customerRoutes.js -> Endpoints /api/customers/* (HU05)
|   |   |   +-- productRoutes.js  -> Endpoints /api/products/* (HU03)
|   |   |   +-- categoryRoutes.js -> Endpoints /api/categories/* (HU03)
|   |   |-- app.js              -> Express app + middleware + rutas
|   |   +-- server.js           -> Punto de entrada (ejecuta migraciones)
|   |-- .env                   -> Variables de entorno
|   +-- package.json
|-- database/
|   |-- schema.sql             -> Definicion de tablas
|   |-- seed.sql               -> Datos semilla (bcrypt hashes)
|   +-- README.md
|-- docs/
|   |-- architecture.md
|   |-- database.md
|   +-- api.md
|-- rules/                     -> Documentos de reglas del proyecto
|   |-- architecture.md
|   |-- backend.md
|   |-- coding-standards.md
|   |-- frontend.md
|   |-- project-context.md
|   +-- sprints.md
|-- juampyzel_database.sql     -> Script completo (schema + seed)
|-- setup-database.bat         -> Script de setup (Windows CMD)
|-- setup-database.ps1         -> Script de setup (PowerShell)
|-- .gitignore
+-- README.md
```

---

## Requisitos

- **Node.js** v18+ (recomendado v20+)
- **npm** (incluido con Node.js)
- **MySQL** 8.0 (instalado mediante MySQL Installer / Workbench)

---

## Instalacion y configuracion

### Paso 1: Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Heladeria_JuampyZel
```

### Paso 2: Configurar la base de datos

#### Opcion A: Ejecutar script automatico (Recomendado)

**Windows CMD:**

```bash
setup-database.bat
```

**PowerShell:**

```powershell
.\setup-database.ps1
```

El script:
- Verifica que MySQL este instalado y accesible
- Verifica la conexion a MySQL
- Crea la base de datos `juampyzel` si no existe
- Ejecuta el schema con todas las tablas
- Inserta los datos semilla (usuarios, categorias)

#### Opcion B: Ejecutar manualmente

```bash
mysql -u root -p < juampyzel_database.sql
```

#### Opcion C: Usar MySQL Workbench

1. Abrir MySQL Workbench
2. Conectarse a MySQL
3. Ir a File -> Open SQL Script
4. Seleccionar `juampyzel_database.sql`
5. Ejecutar el script (boton de rayo)

### Paso 3: Configurar variables de entorno (Backend)

```bash
cd backend/
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de MySQL:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=juampyzel
DB_USER=root
DB_PASSWORD=tu_password_aqui

JWT_SECRET=juampyzel_secret_key_2024
JWT_EXPIRES_IN=24h
PORT=5000
```

> **Nota:** Nunca comparta ni suba el archivo `.env` a GitHub. El `.gitignore` ya lo excluye.

### Paso 4: Instalar dependencias

```bash
# Backend
cd backend/
npm install

# Frontend
cd ../frontend/
npm install
```

### Paso 5: Ejecutar el sistema

Abrir **dos terminales**:

```bash
# Terminal 1 — Backend (API REST en http://localhost:5000)
cd backend/
npm run dev
```

```bash
# Terminal 2 — Frontend (React + Vite en http://localhost:5173)
cd frontend/
npm run dev
```

### Paso 6: Acceder al sistema

Abrir en el navegador:

```
http://localhost:5173
```

---

## Credenciales iniciales

| Correo | Contrasena | Rol |
|--------|-----------|-----|
| `admin@juampyzel.com` | `admin123` | ADMINISTRADOR |
| `encargado@juampyzel.com` | `encargado123` | ENCARGADO_SUCURSAL |
| `encargado2@juampyzel.com` | `encargado123` | ENCARGADO_SUCURSAL |
| `vendedor@juampyzel.com` | `vendedor123` | VENDEDOR |
| `inventario@juampyzel.com` | `inventario123` | INVENTARIO |

---

## Endpoints de autenticacion (HU01)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesion (recibe `correo` y `password`) |
| POST | `/api/auth/logout` | Cerrar sesion |
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
    "message": "Inicio de sesion exitoso.",
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

## Endpoints de usuarios (HU02)

> Todos los endpoints requieren autenticacion (Bearer token) y rol `ADMINISTRADOR`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/users` | Listar todos los usuarios |
| GET | `/api/users/:id` | Obtener detalle de un usuario |
| POST | `/api/users` | Registrar nuevo usuario |
| PUT | `/api/users/:id` | Editar datos de un usuario |
| PATCH | `/api/users/:id/status` | Activar o desactivar usuario |

**Roles disponibles:**

| Valor | Descripcion |
|-------|-------------|
| `ADMINISTRADOR` | Acceso total al sistema |
| `ENCARGADO_SUCURSAL` | Gestion de sucursal asignada |
| `VENDEDOR` | Registro de ventas |
| `INVENTARIO` | Gestion de inventario |

**Ejemplo — Registrar usuario:**

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Maria",
    "apellido": "Garcia",
    "correo": "maria@juampyzel.com",
    "password": "pass123",
    "rol": "VENDEDOR"
  }'
```

---

## Endpoints de sucursales (HU04)

> Los endpoints de consulta requieren autenticacion (Bearer token). Crear, editar y cambiar estado requieren rol `ADMINISTRADOR`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/branches` | Listar todas las sucursales |
| GET | `/api/branches/managers/disponibles` | Listar usuarios `ENCARGADO_SUCURSAL` y su sucursal asignada |
| GET | `/api/branches/:id` | Obtener detalle de una sucursal |
| POST | `/api/branches` | Registrar nueva sucursal |
| PUT | `/api/branches/:id` | Editar datos de una sucursal |
| PATCH | `/api/branches/:id/status` | Activar o desactivar sucursal |

### Responsable de sucursal

Al registrar o editar una sucursal, el campo `id_responsable` referencia a un usuario con rol `ENCARGADO_SUCURSAL`:

- Solo se muestran los usuarios con rol `ENCARGADO_SUCURSAL`, presentando su **nombre y apellido**.
- Un encargado de sucursal **solo puede estar a cargo de una unica sucursal** (constraint `UNIQUE` en la base de datos).
- El backend valida que el responsable exista, este activo y tenga el rol correcto.

**Ejemplo — Registrar sucursal:**

```bash
curl -X POST http://localhost:5000/api/branches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Sucursal Centro",
    "direccion": "Av. Principal 123",
    "telefono": "7485961",
    "id_responsable": 6
  }'
```

---

## Endpoints de clientes (HU05)

> Todos los endpoints requieren autenticacion (Bearer token). Crear y editar requiere rol `ADMINISTRADOR` o `VENDEDOR`; consultar esta disponible para todos los roles autenticados.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/customers` | Listar todos los clientes |
| GET | `/api/customers?q=termino` | Buscar clientes por nombre, apellido, correo o telefono |
| GET | `/api/customers/:id` | Obtener detalle de un cliente |
| POST | `/api/customers` | Registrar nuevo cliente |
| PUT | `/api/customers/:id` | Editar datos de un cliente |

**Campos del cliente:**

| Campo | Descripcion |
|-------|-------------|
| `nombres` | Nombres del cliente (obligatorio, minimo 2 caracteres) |
| `apellidos` | Apellidos del cliente (obligatorio, minimo 2 caracteres) |
| `telefono` | Telefono de contacto |
| `correo` | Correo electronico (unico, formato valido) |
| `direccion` | Direccion del cliente |

**Ejemplo — Registrar cliente:**

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombres": "Maria",
    "apellidos": "Garcia",
    "telefono": "70012345",
    "correo": "maria@juampyzel.com",
    "direccion": "Av. Central 100"
  }'
```

---

## Endpoints de productos (HU03)

> Los endpoints de consulta requieren autenticacion (Bearer token). Registrar, editar y cambiar estado requieren rol `ADMINISTRADOR`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/products` | Listar todos los productos |
| GET | `/api/products?q=termino` | Buscar productos por nombre, descripcion o categoria |
| GET | `/api/products/active` | Listar unicamente los productos activos (disponibles) |
| GET | `/api/products/:id` | Obtener detalle de un producto |
| POST | `/api/products` | Registrar nuevo producto |
| PUT | `/api/products/:id` | Editar datos de un producto |
| PATCH | `/api/products/:id/status` | Activar o desactivar producto |

**Campos del producto:**

| Campo | Descripcion |
|-------|-------------|
| `nombre` | Nombre del producto (obligatorio, minimo 2 caracteres) |
| `descripcion` | Descripcion del producto |
| `id_categoria` | Categoria a la que pertenece (obligatoria y debe estar activa) |
| `precio` | Precio en Bs (obligatorio, mayor a cero) |
| `stock_minimo` | Stock minimo (por defecto 5, no negativo) |
| `imagen` | URL de la imagen del producto (opcional) |
| `estado` | Disponibilidad del producto (activo/inactivo) |

**Ejemplo — Registrar producto:**

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Helado de Fresa",
    "descripcion": "Helado de crema sabor fresa",
    "id_categoria": 1,
    "precio": 12.00,
    "stock_minimo": 5,
    "imagen": "",
    "estado": true
  }'
```

---

## Endpoints de categorias (HU03)

> Los endpoints de consulta requieren autenticacion (Bearer token). Registrar, editar y cambiar estado requieren rol `ADMINISTRADOR`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/categories` | Listar todas las categorias |
| GET | `/api/categories/active` | Listar unicamente las categorias activas |
| GET | `/api/categories/:id` | Obtener detalle de una categoria |
| POST | `/api/categories` | Registrar nueva categoria |
| PUT | `/api/categories/:id` | Editar datos de una categoria |
| PATCH | `/api/categories/:id/status` | Activar o desactivar categoria |

**Ejemplo — Registrar categoria:**

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Helados de crema",
    "descripcion": "Helados elaborados a base de crema"
  }'
```

---

## Migraciones de base de datos

El backend incluye un sistema de **migraciones versionadas** que se ejecuta automaticamente al iniciar el servidor:

- Cada migracion es un archivo `.sql` en `backend/migrations/`.
- Se registran en la tabla `schema_migrations` y solo se aplican las pendientes.
- Para anadir un cambio de esquema, crea un nuevo archivo `backend/migrations/<fecha>_<nombre>.sql`.

```text
backend/
|-- migrations/
|   +-- 202608270001_add_responsable_fk.sql
+-- src/utils/migrations.js   -> Runner de migraciones
```

---

## Base de datos

### Tablas del sistema

```text
usuario         -> Usuarios del sistema con roles
categoria       -> Categorias de productos
producto        -> Productos de helados
sucursal        -> Sucursales de JuampyZel
cliente         -> Clientes que compran en sucursales
tienda          -> Tiendas que piden abastecimiento
inventario      -> Stock por producto y sucursal
venta           -> Ventas realizadas en sucursales
detalle_venta   -> Productos de cada venta
pedido          -> Pedidos de tiendas
detalle_pedido  -> Productos de cada pedido
```

### Script SQL

El archivo `juampyzel_database.sql` contiene:

- Creacion de la base de datos `juampyzel`
- Todas las tablas con relaciones y constraints
- Datos semilla (usuarios, categorias)

---

## Historias de usuario implementadas

| HU | Nombre | Estado |
|----|--------|--------|
| **HU01** | Iniciar sesion | Implementada |
| **HU02** | Gestionar usuarios y roles | Implementada |
| **HU03** | Gestionar productos y categorias | Implementada |
| **HU04** | Gestionar sucursales | Implementada |
| **HU05** | Gestionar clientes | Implementada |
| HU06-HU12 | (Sprints 2 y 3) | Pendientes |

---

## Solucion de problemas

### MySQL no se encuentra

```
[ERROR] MySQL no se encuentra en el PATH.
```

**Solucion:** Instalar MySQL 8.0 desde https://dev.mysql.com/downloads/installer/ y agregar la ruta al PATH.

### Error de conexion a MySQL

```
[ERROR] No se pudo conectar a MySQL.
```

**Solucion:**
1. Verificar que el servicio de MySQL este ejecutandose
2. Verificar las credenciales en `.env`
3. Probar conexion: `mysql -u root -p`

### Puerto 5000 ocupado

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solucion:** Cambiar el puerto en `.env` o cerrar la aplicacion que usa ese puerto.

### Puerto 5173 ocupado

```bash
# Usar otro puerto
cd frontend/
npm run dev -- --port 3000
```

---

## Documentacion adicional

- [Arquitectura del sistema](docs/architecture.md)
- [Base de datos](docs/database.md)
- [API REST](docs/api.md)
- [Plan de sprints](rules/sprints.md)
- [Especificaciones backend](rules/backend.md)
- [Especificaciones frontend](rules/frontend.md)
- [Normas de codigo](rules/coding-standards.md)

# JuampyZel

Sistema web empresarial para la gestion de la heladeria **JuampyZel**.

La aplicacion centraliza y administra las operaciones de la empresa: sucursales, tiendas, pedidos de abastecimiento, ventas, inventario, alertas de stock, clientes, usuarios y roles, dashboard con metricas y reportes exportables. Incluye ademas un modulo de **Mi Perfil** para que cada usuario consulte sus datos y cambie su contrasena.

---

## Tecnologias

| Capa | Tecnologia |
|------|-----------|
| Frontend | React, JavaScript, HTML5, Tailwind CSS, Vite |
| Graficas | Recharts (dashboard y reportes) |
| Exportacion | jsPDF + jspdf-autotable (PDF), SheetJS xlsx (Excel) |
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
|   |   |-- pages/Login/        -> Pantalla de inicio de sesion (estadisticas publicas)
|   |   |-- pages/Dashboard/    -> Dashboard con KPIs y graficas tras login
|   |   |-- pages/Usuarios/     -> Gestion de usuarios (HU02)
|   |   |-- pages/Sucursales/   -> Gestion de sucursales (HU04)
|   |   |-- pages/Clientes/     -> Gestion de clientes (HU05)
|   |   |-- pages/Ventas/       -> Registro de ventas y punto de venta (HU07)
|   |   |-- pages/Pedidos/      -> Gestion de pedidos y actualizacion de estado (HU08/HU10)
|   |   |-- pages/Tienda/       -> Portal de tienda: catalogo, pedido y mis pedidos (HU08)
|   |   |-- pages/Inventario/   -> Stock, movimientos y edicion de stock (HU09)
|   |   |-- pages/Productos/    -> Catalogo tipo marketplace (vista de tarjetas) (HU03)
|   |   |-- pages/Alertas/      -> Alertas de stock bajo (HU11)
|   |   |-- pages/Reportes/     -> Reportes basicos con graficas y exportacion (HU12)
|   |   |-- pages/MiPerfil/     -> Mi perfil: ver datos y cambiar contrasena
|   |   |-- routes/             -> AppRoutes, ProtectedRoute, PublicRoute
|   |   |-- services/           -> authService, userService, branchService, customerService, productService, categoryService, saleService, orderService, inventoryService, reportService, publicService (HTTP calls)
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
|   |   |   |-- authController.js -> Login, logout, me, cambiar contrasena
|   |   |   |-- userController.js -> CRUD de usuarios (HU02)
|   |   |   |-- branchController.js -> CRUD de sucursales (HU04)
|   |   |   |-- customerController.js -> CRUD de clientes (HU05)
|   |   |   |-- productController.js -> CRUD de productos (HU03)
|   |   |   |-- categoryController.js -> CRUD de categorias (HU03)
|   |   |   |-- saleController.js  -> Registro y consulta de ventas (HU07)
|   |   |   |-- orderController.js -> Consulta, creacion y estado de pedidos (HU08)
|   |   |   |-- inventoryController.js -> Stock, movimientos y ajuste de stock (HU09)
|   |   |   |-- alertController.js -> Consulta y atencion de alertas (HU11)
|   |   |   |-- reportController.js -> Reportes y dashboard (HU12)
|   |   |   |-- storeController.js -> Gestion de tiendas (HU06)
|   |   |   +-- publicController.js -> Estadisticas publicas (login)
|   |   |-- services/
|   |   |   |-- authService.js    -> Logica de negocio de auth
|   |   |   |-- userService.js    -> Logica de negocio de usuarios (HU02)
|   |   |   |-- branchService.js  -> Logica de negocio de sucursales (HU04)
|   |   |   |-- customerService.js -> Logica de negocio de clientes (HU05)
|   |   |   |-- productService.js  -> Logica de negocio de productos (HU03)
|   |   |   |-- categoryService.js -> Logica de negocio de categorias (HU03)
|   |   |   |-- saleService.js     -> Logica de negocio de ventas (HU07)
|   |   |   |-- orderService.js    -> Consulta, creacion y estado de pedidos (HU08)
|   |   |   |-- inventoryService.js -> Logica de stock y movimientos (HU09)
|   |   |   |-- alertService.js    -> Logica de alertas de stock (HU11)
|   |   |   |-- reportService.js   -> Logica de reportes (HU12)
|   |   |   |-- storeService.js    -> Logica de tiendas (HU06)
|   |   |   +-- publicService.js   -> Logica de estadisticas publicas
|   |   |-- models/
|   |   |   |-- User.js           -> Consultas a tabla usuario
|   |   |   |-- Branch.js         -> Consultas a tabla sucursal
|   |   |   |-- Customer.js       -> Consultas a tabla cliente
|   |   |   |-- Product.js        -> Consultas a tabla producto
|   |   |   |-- Category.js       -> Consultas a tabla categoria
|   |   |   |-- Sale.js           -> Consultas a tablas venta/detalle_venta (HU07)
|   |   |   |-- Store.js          -> Consultas a tabla tienda (HU08)
|   |   |   |-- Order.js          -> Consultas a tablas pedido/detalle_pedido (HU08)
|   |   |   |-- Inventory.js      -> Consultas a tablas inventario/movimiento_inventario (HU09)
|   |   |   |-- Alert.js          -> Consultas a tabla alerta_stock (HU11)
|   |   |   |-- Report.js         -> Agregaciones para reportes y dashboard (HU12)
|   |   |   +-- PublicStats.js    -> Estadisticas publicas para el login
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
|   |   |   |-- productRoutes.js  -> Endpoints /api/products/* (HU03)
|   |   |   |-- categoryRoutes.js -> Endpoints /api/categories/* (HU03)
|   |   |   |-- saleRoutes.js     -> Endpoints /api/sales/* (HU07)
|   |   |   |-- orderRoutes.js    -> Endpoints /api/orders/* (HU08)
|   |   |   |-- inventoryRoutes.js -> Endpoints /api/inventory/* (HU09)
|   |   |   |-- alertRoutes.js    -> Endpoints /api/alerts/* (HU11)
|   |   |   |-- reportRoutes.js   -> Endpoints /api/reports/* (HU12)
|   |   |   |-- storeRoutes.js    -> Endpoints /api/stores/* (HU06)
|   |   |   +-- publicRoutes.js   -> Endpoints /api/public/*
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
| PUT | `/api/auth/change-password` | Cambiar contrasena (recibe `password_actual` y `password_nueva`) |

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

### Cambiar contrasena (Mi Perfil)

Disponible para todos los usuarios autenticados desde la seccion **Mi Perfil** (`/configuracion`). El campo `password_actual` debe ser correcto y `password_nueva` debe tener al menos 6 caracteres y ser distinta a la actual.

```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "password_actual": "admin123",
    "password_nueva": "nueva123456"
  }'
```

### Estadisticas publicas (pantalla de login)

El panel de inicio de sesion muestra datos reales de la base de datos (sabores de helado, sucursales y clientes):

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/public/stats` | Contadores publicos: `total_sabores`, `total_sucursales`, `total_clientes` (sin autenticacion) |

```bash
curl http://localhost:5000/api/public/stats
```

```json
{
  "success": true,
  "data": {
    "total_sabores": 1,
    "total_sucursales": 1,
    "total_clientes": 1
  }
}
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
| `TIENDA` | Portal de tienda: catalogo, pedidos y abastecimiento |

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

## Endpoints de ventas (HU07)

> Todos los endpoints requieren autenticacion (Bearer token) y rol `ADMINISTRADOR`, `ENCARGADO_SUCURSAL` o `VENDEDOR`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/sales` | Listar todas las ventas realizadas |
| GET | `/api/sales?branch=:id` | Listar ventas de una sucursal especifica |
| GET | `/api/sales/products?sucursal=:id` | Listar productos activos con su stock disponible en una sucursal |
| GET | `/api/sales/:id` | Obtener detalle de una venta (incluye productos) |
| POST | `/api/sales` | Registrar una nueva venta |

**Ejemplo — Registrar venta:**

```bash
curl -X POST http://localhost:5000/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "id_cliente": 2,
    "id_sucursal": 1,
    "detalles": [
      { "id_producto": 1, "cantidad": 2 },
      { "id_producto": 3, "cantidad": 1 }
    ]
  }'
```

El backend:
- Valida que la sucursal exista y este activa.
- Valida que los productos esten activos y exista stock suficiente en la sucursal.
- Calcula automaticamente el subtotal de cada linea y el total de la venta.
- Registra la venta, su detalle y actualiza (descuenta) el stock en la tabla `inventario`, todo dentro de una transaccion.
- Registra automaticamente la fecha/hora y el usuario que realiza la venta.

---

## Endpoints de pedidos (HU08)

> Requieren autenticacion (Bearer token). Crear pedidos es exclusivo del rol `TIENDA`; consultar y actualizar estado corresponde a `ADMINISTRADOR`, `ENCARGADO_SUCURSAL` e `INVENTARIO` (la tienda solo ve sus propios pedidos).

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/orders` | Listar pedidos (admin/encargado/inventario: todos; tienda: solo los suyos) |
| GET | `/api/orders/catalog/products` | Catalogo de productos activos con su stock disponible (rol `TIENDA`) |
| GET | `/api/orders/:id` | Obtener detalle de un pedido (incluye productos) |
| POST | `/api/orders` | Crear un pedido para la tienda del usuario autenticado (rol `TIENDA`) |
| PATCH | `/api/orders/:id/status` | Actualizar el estado de un pedido |

**Estados validos del pedido:**

| Estado | Descripcion |
|--------|-------------|
| `PENDIENTE` | Pedido registrado, pendiente de atencion |
| `CONFIRMADO` | Pedido confirmado |
| `PREPARANDO` | Pedido en preparacion |
| `LISTO` | Pedido listo para entrega |
| `ENTREGADO` | Pedido entregado |
| `CANCELADO` | Pedido cancelado |

**Ejemplo — Crear pedido (tienda):**

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "detalles": [
      { "id_producto": 1, "cantidad": 10 },
      { "id_producto": 3, "cantidad": 5 }
    ]
  }'
```

El backend valida que los productos esten activos y que exista disponibilidad segun el inventario, calcula el subtotal de cada linea y el total, y registra el pedido y su detalle dentro de una transaccion. **No descuenta inventario** al crear el pedido (eso corresponde a la etapa de despacho).

**Ejemplo — Actualizar estado (administrador/encargado/inventario):**

```bash
curl -X PATCH http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "estado": "CONFIRMADO" }'
```

---

## Endpoints de inventario (HU09)

> Todos los endpoints requieren autenticacion (Bearer token) y rol `ADMINISTRADOR` o `INVENTARIO`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/inventory` | Listar stock actual de todos los productos (suma por sucursales) |
| GET | `/api/inventory?q=termino` | Buscar productos del inventario por nombre, descripcion o categoria |
| GET | `/api/inventory/low-stock` | Listar productos cuyo stock actual es menor a su `stock_minimo` |
| GET | `/api/inventory/movements` | Listar movimientos de inventario (filtros por `producto`, `sucursal` y `tipo`) |
| GET | `/api/inventory/movements/:id` | Obtener detalle de un movimiento |
| POST | `/api/inventory/movements` | Registrar un movimiento (entrada, salida o ajuste) |
| PUT | `/api/inventory/:id/stock` | Ajustar el stock total de un producto (recibe `nuevo_stock` y `motivo`) |
| PUT | `/api/inventory/:id/stock-minimo` | Editar el stock minimo de un producto (recibe `stock_minimo`) |

**Tipos de movimiento:**

| Tipo | Comportamiento |
|------|----------------|
| `ENTRADA` | Incrementa el stock del producto en la sucursal |
| `SALIDA` | Reduce el stock; no puede superar el stock disponible (se guarda como cantidad negativa) |
| `AJUSTE` | Fija el stock al valor indicado; requiere un `motivo` |

**Ejemplo — Registrar salida:**

```bash
curl -X POST http://localhost:5000/api/inventory/movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "id_producto": 1,
    "id_sucursal": 1,
    "tipo": "SALIDA",
    "cantidad": 4
  }'
```

El backend valida el tipo de movimiento, el producto, la sucursal y la existencia de stock suficiente, y registra el movimiento junto con la actualizacion del stock (`stock_anterior`, `stock_resultante`) dentro de una transaccion. Los movimientos registran automaticamente el usuario y la fecha/hora.

### Edicion de stock desde el modulo de inventario

Desde cada fila de la tabla de stock se puede editar:
- **Stock actual (total)**: fija un nuevo valor de stock total; el backend lo reparte proporcionalmente entre las sucursales donde el producto ya tiene inventario y registra un movimiento `AJUSTE` por cada sucursal modificada.
- **Stock minimo**: edita el campo `stock_minimo` del producto (nivel de alerta).

**Ejemplo — Ajustar stock total:**

```bash
curl -X PUT http://localhost:5000/api/inventory/1/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "nuevo_stock": 50, "motivo": "Conteo fisico" }'
```

**Ejemplo — Editar stock minimo:**

```bash
curl -X PUT http://localhost:5000/api/inventory/1/stock-minimo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "stock_minimo": 10 }'
```

---

## Endpoints de alertas de stock (HU11)

> Todos los endpoints requieren autenticacion (Bearer token) y rol `ADMINISTRADOR` o `INVENTARIO`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/alerts` | Listar alertas de bajo stock (se generan al comparar stock actual con `stock_minimo`) |
| GET | `/api/alerts/:id` | Obtener detalle de una alerta |
| PATCH | `/api/alerts/:id/attend` | Marcar una alerta como atendida |

---

## Endpoints de reportes (HU12)

> Requieren autenticacion (Bearer token). Los reportes de ventas, pedidos, productos e inventario son exclusivos del rol `ADMINISTRADOR`. El dashboard esta disponible para `ADMINISTRADOR`, `ENCARGADO_SUCURSAL`, `INVENTARIO` y `VENDEDOR`.

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/reports/sales` | Reporte de ventas (filtros `fecha_inicio`, `fecha_fin`, `sucursal`) |
| GET | `/api/reports/orders` | Reporte de pedidos (filtros `fecha_inicio`, `fecha_fin`, `estado`) |
| GET | `/api/reports/products` | Reporte de productos (incluye bajo stock) |
| GET | `/api/reports/inventory` | Reporte de movimientos de inventario |
| GET | `/api/reports/dashboard` | KPIs y datos para graficas del dashboard |

El modulo de **Reportes** (`/reportes`) permite consultar la informacion en tablas, filtrarla por fechas y estados, y **exportarla a PDF (jsPDF) o Excel (SheetJS)**. El **Dashboard** (`/`) muestra KPIs (ventas, ingresos, pedidos, productos, unidades, sucursales, clientes) y graficas de tipo pastel (ventas por sucursal, pedidos por estado, productos por categoria) ademas de un panel de productos con bajo stock.

---

## Migraciones de base de datos

El backend incluye un sistema de **migraciones versionadas** que se ejecuta automaticamente al iniciar el servidor:

- Cada migracion es un archivo `.sql` en `backend/migrations/`.
- Se registran en la tabla `schema_migrations` y solo se aplican las pendientes.
- Para anadir un cambio de esquema, crea un nuevo archivo `backend/migrations/<fecha>_<nombre>.sql`.

```text
backend/
|-- migrations/
|   |-- 202608270001_add_responsable_fk.sql
|   |-- 202608290001_crear_movimiento_inventario.sql
|   +-- 202608300003_seed_usuarios_categorias_iniciales.sql
+-- src/utils/migrations.js   -> Runner de migraciones
```

### Seed automatico de usuarios y categorias

En la **primera ejecucion** del servidor, si la base de datos no tiene datos (tablas `usuario` y `categoria` vacias), una migracion de seed inserta automaticamente los **usuarios iniciales** y las **categorias base**. Esto garantiza que el sistema arranque siempre con las credenciales del README disponibles sin necesidad de ejecutar `seed.sql` manualmente.

El seed se aplica solo cuando las tablas estan vacias (no duplica ni pisa datos existentes).

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
movimiento_inventario -> Historia de entradas, salidas y ajustes de stock
alerta_stock    -> Alertas de productos con bajo stock
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
| **HU06** | Gestionar tiendas | Implementada |
| **HU07** | Registrar venta | Implementada |
| **HU08** | Gestionar pedidos de tiendas (portal de tienda) | Implementada |
| **HU09** | Gestionar inventario | Implementada |
| **HU10** | Gestionar estados de pedidos | Implementada |
| **HU11** | Gestionar alertas de stock | Implementada |
| **HU12** | Consultar reportes basicos | Implementada |

> **Nota:** Todas las historias de usuario planificadas en los 3 Sprints estan **implementadas**. Ademas, el sistema incluye funciones adicionales como el modulo **Mi Perfil** (cambio de contrasena) y las **estadisticas publicas** en la pantalla de login.

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

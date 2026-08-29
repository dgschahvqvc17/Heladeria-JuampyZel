# Base de datos — JuampyZel

El sistema utiliza **MySQL 8.0** como sistema de gestión de base de datos.

## Archivos de base de datos

| Archivo | Descripción |
|---------|-------------|
| `juampyzel_database.sql` | Script completo: creación de la base de datos, tablas, relaciones, constraints y datos semilla. |
| `database/schema.sql` | Definición del esquema (tablas, índices, constraints, relaciones). |
| `database/seed.sql` | Datos semilla (usuarios iniciales y categorías con bcrypt hashes). |

## Entidades y tablas

| Entidad | Tabla | Descripción |
|---------|-------|-------------|
| Usuario | `usuario` | Usuarios del sistema con autenticación. Incluye `rol` (ENUM) y `estado`. |
| Categoría | `categoria` | Clasificación de productos. |
| Producto | `producto` | Helados y productos de la heladería. |
| Sucursal | `sucursal` | Locales físicos de venta. Cada sucursal tiene un responsable (`id_responsable`) que referencia a un usuario con rol `ENCARGADO_SUCURSAL`. Un encargado solo puede estar a cargo de una única sucursal. |
| Cliente | `cliente` | Clientes que compran en sucursales. |
| Tienda | `tienda` | Negocios externos que solicitan abastecimiento. |
| Inventario | `inventario` | Stock de productos por sucursal. |
| MovimientoInventario | `movimiento_inventario` | Historial de entradas, salidas y ajustes de stock. |
| Venta | `venta` | Transacciones de venta en sucursales. |
| DetalleVenta | `detalle_venta` | Líneas detalladas de una venta. |
| Pedido | `pedido` | Pedidos realizados por tiendas. |
| DetallePedido | `detalle_pedido` | Líneas detalladas de un pedido. |

## Tabla `movimiento_inventario`

Registra cada entrada, salida o ajuste de stock (HU09). La tabla se crea mediante la migración `backend/migrations/202608290001_crear_movimiento_inventario.sql`.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_movimiento` | INT (PK, auto) | Identificador del movimiento. |
| `id_producto` | INT (FK) | Producto afectado. |
| `id_sucursal` | INT (FK) | Sucursal donde se realiza el movimiento. |
| `id_usuario` | INT (FK) | Usuario que registró el movimiento. |
| `tipo` | ENUM | `ENTRADA`, `SALIDA` o `AJUSTE`. |
| `cantidad` | INT | Cantidad movida (positiva para ENTRADA/AJUSTE, negativa para SALIDA). |
| `stock_anterior` | INT | Stock antes del movimiento. |
| `stock_resultante` | INT | Stock después del movimiento. |
| `motivo` | VARCHAR(255) | Motivo (obligatorio para `AJUSTE`). |
| `fecha_movimiento` | DATETIME | Fecha/hora automática del movimiento. |

## Roles de usuario

El campo `rol` en la tabla `usuario` es un ENUM con los siguientes valores:

- `ADMINISTRADOR` — Acceso completo al sistema.
- `ENCARGADO_SUCURSAL` — Gestión de una sucursal específica.
- `VENDEDOR` — Registro de ventas y atención a clientes.
- `INVENTARIO` — Control de inventario y abastecimiento.
- `TIENDA` — Portal de tienda: consulta el catálogo, crea pedidos y visualiza sus propios pedidos.

## Credenciales iniciales

Las contraseñas están hasheadas con **bcrypt** (cost factor 10).

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| `admin@juampyzel.com` | `admin123` | ADMINISTRADOR |
| `vendedor@juampyzel.com` | `vendedor123` | VENDEDOR |
| `inventario@juampyzel.com` | `inventario123` | INVENTARIO |
| `encargado@juampyzel.com` | `encargado123` | ENCARGADO_SUCURSAL |
| `encargado2@juampyzel.com` | `encargado2_123` | ENCARGADO_SUCURSAL |

## Configuración de conexión

La información de conexión se almacena en variables de entorno (`backend/.env`):

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

Las credenciales de MySQL deben permanecer únicamente en el backend. El frontend React nunca debe conectarse directamente a MySQL.

## Cómo cargar la base de datos

```bash
mysql -u root -p < juampyzel_database.sql
```

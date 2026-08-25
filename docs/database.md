# Base de datos — JuampyZel

El sistema utiliza **MySQL** como sistema de gestión de base de datos.

## Entidades principales

| Entidad | Descripción |
|---------|-------------|
| Usuario | Usuarios del sistema con autenticación. |
| Rol | Roles con permisos asociados. |
| Producto | Helados y productos de la heladería. |
| Categoría | Clasificación de productos. |
| Sucursal | Locales físicos de venta. |
| Cliente | Clientes que compran en sucursales. |
| Tienda | Establecimientos que realizan pedidos de abastecimiento. |
| Pedido | Pedidos realizados por tiendas. |
| DetallePedido | Líneas detalladas de un pedido. |
| Venta | Transacciones de venta en sucursales. |
| DetalleVenta | Líneas detalladas de una venta. |
| Inventario | Stock de productos por sucursal. |

## Relaciones

- Un **Usuario** pertenece a un **Rol**.
- Un **Producto** pertenece a una **Categoría**.
- Un **Pedido** pertenece a una **Tienda**.
- Un **Pedido** contiene múltiples **DetallePedido**.
- Una **Venta** pertenece a una **Sucursal**, un **Cliente** y un **Usuario**.
- Una **Venta** contiene múltiples **DetalleVenta**.
- Un **Inventario** asocia **Sucursal** y **Producto**.

## Configuración de conexión

La información de conexión se almacena en variables de entorno (`backend/.env`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=juampyzel
DB_USER=root
DB_PASSWORD=
```

Las credenciales de MySQL deben permanecer únicamente en el backend. El frontend React nunca debe conectarse directamente a MySQL.

Consulte los scripts en `database/schema.sql` y `database/seed.sql`.

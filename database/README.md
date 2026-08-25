# Base de datos JuampyZel

Esta carpeta contiene los scripts de base de datos para el sistema JuampyZel.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `schema.sql` | Definición del esquema de la base de datos (tablas, relaciones, constraints). |
| `seed.sql` | Datos semilla para inicializar la base de datos con información básica. |

## Entidades

- **Usuario** — usuarios del sistema con autenticación y autorización.
- **Rol** — roles con permisos asociados (Administrador, Empleado, Tienda).
- **Producto** — helados yProductos de la heladería.
- **Categoría** — clasificación de productos.
- **Sucursal** — locales físicos de venta.
- **Cliente** — clientes que compran en sucursales.
- **Tienda** — establecimientos que realizan pedidos de abastecimiento.
- **Pedido** — pedidos realizados por tiendas.
- **DetallePedido** — productos asociados a un pedido.
- **Venta** — transacciones de venta en sucursales.
- **DetalleVenta** — productos asociados a una venta.
- **Inventario** — stock de productos por sucursal.

## Cómo usar

1. Crear la base de datos con el script `schema.sql`.
2. Cargar los datos semilla con `seed.sql`.
3. Configurar las credenciales en `backend/.env`.

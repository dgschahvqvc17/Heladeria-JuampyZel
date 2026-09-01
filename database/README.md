# Base de datos JuampyZel

Este proyecto utiliza **Supabase (PostgreSQL)** como sistema de base de datos.
El esquema se administra como archivo SQL versionado y se aplica una sola vez.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| [`supabase/schema.sql`](../supabase/schema.sql) | Esquema completo: tablas, constraints, índices, vistas, funciones (RPC), trigger y datos semilla. |

> El esquema anterior de MySQL (`database/schema.sql`, `database/seed.sql`,
> `juampyzel_database.sql` y los scripts `setup-database.*`) ha sido eliminado.

## Entidades

- **Usuario** — usuarios del sistema con autenticación y autorización.
- **Categoría** — clasificación de productos.
- **Producto** — helados y productos de la heladería.
- **Sucursal** — locales físicos de venta.
- **Cliente** — clientes que compran en sucursales.
- **Tienda** — establecimientos que realizan pedidos de abastecimiento.
- **Inventario** — stock de productos por sucursal.
- **MovimientoInventario** — historial de entradas, salidas y ajustes de stock.
- **AlertaStock** — alertas de productos con bajo stock.
- **Venta** / **DetalleVenta** — transacciones de venta en sucursales.
- **Pedido** / **DetallePedido** / **HistorialPedido** — pedidos de tiendas.

## Cómo aplicar el esquema

1. Crear el proyecto en [Supabase](https://supabase.com/dashboard).
2. Abrir **SQL Editor** y pegar el contenido de `supabase/schema.sql`.
3. Ejecutar. El script crea tablas, vistas, funciones, datos semilla y activa RLS.

También se puede aplicar localmente con `supabase db push` si se usa el CLI.

## Configuración del backend

Copiar las credenciales del proyecto a `backend/.env` (ver `backend/.env.example`):

```env
SUPABASE_URL=<project-url>
SUPABASE_PUBLISHABLE_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```
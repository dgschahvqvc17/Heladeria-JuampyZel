# API REST — JuampyZel

El backend expone una API REST bajo la base `/api`.

## Estructura de respuestas

### Éxito (200/201)

```json
{
    "success": true,
    "message": "Operación realizada correctamente",
    "data": {}
}
```

### Error

```json
{
    "success": false,
    "message": "No se pudo completar la operación"
}
```

## Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK — Operación exitosa. |
| 201 | Created — Recurso creado. |
| 204 | No Content. |
| 400 | Bad Request — Solicitud incorrecta. |
| 401 | Unauthorized — No autenticado. |
| 403 | Forbidden — Sin permisos. |
| 404 | Not Found — Recurso no encontrado. |
| 409 | Conflict — Conflicto. |
| 422 | Validation Error — Error de validación. |
| 500 | Internal Server Error. |

## Autenticación

### Iniciar sesión

```
POST /api/auth/login
```

**Body:**

```json
{
    "correo": "admin@juampyzel.com",
    "password": "admin123"
}
```

**Respuesta 200:**

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

Cuando el usuario tiene rol `TIENDA`, la respuesta de login incluye además la tienda vinculada:

```json
{
    "success": true,
    "message": "Inicio de sesión exitoso.",
    "data": {
        "token": "<jwt_token>",
        "user": {
            "id": 5,
            "nombre": "Maria",
            "apellido": "Lopez",
            "correo": "tienda@ejemplo.com",
            "rol": "TIENDA",
            "tienda": {
                "id_tienda": 1,
                "nombre": "Tienda Centro"
            }
        }
    }
}
```

### Cerrar sesión

```
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

### Obtener usuario actual

```
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

---

## Endpoints

### Productos

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Categorías

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Sucursales

```text
GET    /api/branches
GET    /api/branches/:id
POST   /api/branches
PUT    /api/branches/:id
DELETE /api/branches/:id
```

### Tiendas

```text
GET    /api/stores
GET    /api/stores/:id
POST   /api/stores
PUT    /api/stores/:id
DELETE /api/stores/:id
```

### Clientes

```text
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Pedidos

```text
GET    /api/orders
GET    /api/orders/catalog/products
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status
```

- `GET /api/orders`: `ADMINISTRADOR`, `ENCARGADO_SUCURSAL`, `INVENTARIO` ven todos los pedidos; el rol `TIENDA` ve únicamente los suyos.
- `GET /api/orders/catalog/products`: catálogo de productos activos con el stock disponible (`TIENDA`).
- `POST /api/orders`: crea un pedido para la tienda del usuario autenticado (rol `TIENDA`). Valida productos activos y disponibilidad de inventario, calcula el total y registra el detalle dentro de una transacción. No descuenta inventario (eso corresponde al despacho).
- `PATCH /api/orders/:id/status`: actualiza el estado de un pedido. Estados válidos: `PENDIENTE`, `CONFIRMADO`, `PREPARANDO`, `LISTO`, `ENTREGADO`, `CANCELADO`. Solo `ADMINISTRADOR`, `ENCARGADO_SUCURSAL` e `INVENTARIO`.

Roles para crear: `TIENDA`.

### Ventas

```text
GET    /api/sales
GET    /api/sales?branch=:id
GET    /api/sales/products?sucursal=:id
GET    /api/sales/:id
POST   /api/sales
```

El registro de venta (`POST /api/sales`) valida la sucursal, los productos y el stock disponible, calcula el total, y actualiza el inventario dentro de una transacción. Roles permitidos: `ADMINISTRADOR`, `ENCARGADO_SUCURSAL`, `VENDEDOR`.

### Inventario

```text
GET    /api/inventory
GET    /api/inventory/:id
PUT    /api/inventory/:id
```

### Usuarios

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## Autenticación en endpoints protegidos

Los endpoints que requieren autenticación deben incluir el header:

```
Authorization: Bearer <jwt_token>
```

El token expira en 24 horas por defecto.

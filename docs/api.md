# API REST — JuampyZel

El backend expone una API REST siguiendo la nomenclatura RESTful.

## Estructura de respuestas

### Éxito

```json
{
    "success": true,
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
| 200 | Operación exitosa. |
| 201 | Recurso creado. |
| 400 | Solicitud incorrecta. |
| 401 | No autenticado. |
| 403 | Sin permisos. |
| 404 | Recurso no encontrado. |
| 409 | Conflicto. |
| 500 | Error interno. |

## Endpoints

### Autenticación

```text
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register
```

### Productos

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Sucursales

```text
GET    /api/branches
GET    /api/branches/:id
POST   /api/branches
PUT    /api/branches/:id
```

### Tiendas

```text
GET    /api/stores
GET    /api/stores/:id
POST   /api/stores
PUT    /api/stores/:id
```

### Pedidos

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
```

### Ventas

```text
GET    /api/sales
GET    /api/sales/:id
POST   /api/sales
```

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

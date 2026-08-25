# Backend Standards — JuampyZel

## 1. Objetivo

El backend de JuampyZel será responsable de proporcionar la API REST que permitirá al frontend React comunicarse con la lógica de negocio y la base de datos MySQL.

El backend debe ser:

* Seguro.
* Modular.
* Escalable.
* Mantenible.
* Fácil de probar.
* Fácil de comprender.
* Consistente.

---

# 2. Tecnologías

El backend utilizará:

* Node.js
* Express.js
* JavaScript
* MySQL

No agregar frameworks backend adicionales sin justificación.

---

# 3. Arquitectura

El backend utilizará MVC con una capa adicional de Services.

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MySQL
```

Cada capa tiene responsabilidades específicas.

---

# 4. Routes

Las Routes únicamente deben definir endpoints.

Ejemplo:

```javascript
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);
```

No colocar lógica de negocio en Routes.

---

# 5. Controllers

Los Controllers reciben solicitudes HTTP.

Responsabilidades:

* Leer parámetros.
* Leer body.
* Obtener usuario autenticado.
* Llamar al Service.
* Enviar respuestas HTTP.

No deben contener consultas SQL.

No deben contener lógica de negocio compleja.

---

# 6. Services

Los Services contienen la lógica de negocio.

Ejemplos:

```text
productService.js
orderService.js
inventoryService.js
saleService.js
branchService.js
storeService.js
```

Los Services pueden coordinar diferentes Models.

Ejemplo:

```text
orderService
      │
      ├── Order Model
      ├── OrderDetail Model
      ├── Product Model
      └── Inventory Model
```

Esto permite implementar operaciones complejas manteniendo los Controllers limpios.

---

# 7. Models

Los Models serán responsables de interactuar con MySQL.

Ejemplo:

```text
Product.js
Order.js
OrderDetail.js
Inventory.js
```

Las consultas SQL deben mantenerse en esta capa.

Nunca colocar SQL directamente en React.

Nunca colocar SQL directamente en Routes.

---

# 8. Base de datos

MySQL será la fuente principal de persistencia.

El backend debe utilizar una conexión segura y reutilizable.

No crear una nueva conexión manualmente para cada operación si puede utilizarse un pool de conexiones.

---

# 9. Variables de entorno

Utilizar `.env`.

Ejemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=juampyzel
DB_USER=root
DB_PASSWORD=

JWT_SECRET=change_this_secret
```

Nunca subir `.env` a GitHub.

---

# 10. API

La API debe utilizar una estructura consistente.

Base:

```text
/api
```

Ejemplo:

```text
/api/auth
/api/products
/api/categories
/api/branches
/api/stores
/api/customers
/api/orders
/api/sales
/api/inventory
/api/users
```

---

# 11. CRUD

Las operaciones CRUD deben seguir convenciones REST.

Ejemplo:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

No crear endpoints inconsistentes como:

```text
/getProducts
/saveProduct
/deleteProduct
```

Preferir recursos REST.

---

# 12. Validación

Todo dato recibido desde el frontend debe validarse nuevamente en el backend.

Nunca confiar únicamente en React.

Validar:

* Campos obligatorios.
* Tipos.
* Longitudes.
* Valores permitidos.
* IDs.
* Cantidades.
* Precios.
* Estados.

---

# 13. Reglas de negocio

Las reglas importantes deben implementarse en Services.

Ejemplo:

Un pedido de una tienda no debe registrarse si:

```text
Producto no existe
        ↓
Pedido rechazado

Stock insuficiente
        ↓
Pedido rechazado

Tienda inactiva
        ↓
Pedido rechazado
```

Estas validaciones deben realizarse en backend.

---

# 14. Inventario

El inventario debe manejarse cuidadosamente.

Una operación que modifique stock debe considerar:

```text
Producto
    ↓
Stock actual
    ↓
Cantidad solicitada
    ↓
Validación
    ↓
Actualización
```

No permitir que el stock quede negativo salvo que una regla de negocio explícita lo permita.

---

# 15. Pedidos

Un pedido debe manejarse como una operación completa.

Ejemplo:

```text
Crear pedido
    ↓
Validar tienda
    ↓
Validar productos
    ↓
Validar cantidades
    ↓
Validar stock
    ↓
Calcular total
    ↓
Registrar pedido
    ↓
Registrar detalles
    ↓
Actualizar inventario
    ↓
Confirmar operación
```

Cuando varias operaciones dependan entre sí, considerar el uso de transacciones MySQL.

---

# 16. Transacciones

Las operaciones críticas deben utilizar transacciones.

Especialmente:

* Pedidos.
* Ventas.
* Movimientos de inventario.
* Operaciones que actualicen varias tablas.

Ejemplo conceptual:

```text
BEGIN TRANSACTION

Registrar pedido
Registrar detalle
Actualizar inventario

Si todo funciona:
    COMMIT

Si ocurre un error:
    ROLLBACK
```

Nunca dejar una operación parcialmente registrada.

---

# 17. Autenticación

La autenticación debe implementarse en backend.

El sistema debe verificar:

```text
Usuario
   ↓
Credenciales
   ↓
Autenticación
   ↓
Sesión / Token
```

Las contraseñas nunca deben almacenarse en texto plano.

Deben utilizarse algoritmos de hashing apropiados.

---

# 18. Autorización

El backend debe verificar los permisos del usuario.

Ejemplo:

```text
Administrador
Empleado
Vendedor
Encargado de sucursal
Tienda
```

Los roles definitivos dependerán de los requisitos funcionales.

Nunca confiar únicamente en que React oculte botones.

Si un usuario no tiene permiso, el backend debe rechazar la operación.

---

# 19. Middleware de autenticación

Las rutas protegidas deben utilizar middleware.

Ejemplo:

```javascript
router.get(
    "/",
    authMiddleware,
    productController.getAll
);
```

Para permisos:

```javascript
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    productController.remove
);
```

---

# 20. Respuestas HTTP

Utilizar códigos HTTP apropiados.

```text
200 → OK
201 → Created
204 → No Content
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
409 → Conflict
422 → Validation Error
500 → Internal Server Error
```

---

# 21. Formato de respuestas

Respuesta exitosa:

```json
{
    "success": true,
    "message": "Operación realizada correctamente",
    "data": {}
}
```

Respuesta con error:

```json
{
    "success": false,
    "message": "No se pudo completar la operación"
}
```

No devolver información sensible.

---

# 22. Manejo de errores

Utilizar middleware global de errores.

Ejemplo conceptual:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Error
   ↓
Error Middleware
   ↓
HTTP Response
```

No repetir innecesariamente lógica de manejo de errores.

---

# 23. Seguridad SQL

Nunca construir consultas SQL concatenando directamente datos del usuario.

Incorrecto:

```javascript
const sql = `SELECT * FROM products WHERE id = ${id}`;
```

Utilizar consultas parametrizadas.

Ejemplo:

```javascript
const [rows] = await connection.execute(
    "SELECT * FROM products WHERE id = ?",
    [id]
);
```

Esto ayuda a prevenir SQL Injection.

---

# 24. Seguridad de credenciales

Nunca almacenar:

```text
Contraseñas
API Keys
JWT Secrets
Credenciales MySQL
Tokens
```

directamente en el código.

Utilizar variables de entorno.

---

# 25. Logs

Los logs deben ayudar a diagnosticar problemas.

No registrar:

* Contraseñas.
* Tokens.
* Credenciales.
* Información sensible.

Ejemplo válido:

```text
[INFO] Pedido #1024 creado correctamente
[ERROR] No se pudo actualizar inventario
```

---

# 26. Estructura de módulos

El backend debe organizarse por responsabilidades.

```text
src/
│
├── config/
│   └── database.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── inventoryRoutes.js
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── inventoryController.js
│
├── services/
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   └── inventoryService.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Inventory.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── validators/
│
├── utils/
│
├── app.js
└── server.js
```

---

# 27. Regla de comunicación Frontend → Backend

El frontend nunca debe conocer:

* Credenciales MySQL.
* Consultas SQL.
* Estructura interna de Models.
* Reglas internas de Services.

El frontend únicamente debe consumir la API.

```text
React
  ↓
HTTP
  ↓
API
  ↓
Backend
  ↓
MySQL
```

---

# 28. Regla para agentes de IA

Antes de crear o modificar una funcionalidad backend, el agente debe:

1. Revisar las Routes existentes.
2. Revisar el Controller.
3. Revisar el Service.
4. Revisar el Model.
5. Revisar las tablas relacionadas.
6. Revisar las validaciones.
7. Revisar los permisos.
8. Reutilizar código existente.
9. Mantener MVC.
10. No duplicar lógica.

---

# 29. Regla para nuevas funcionalidades

Una nueva funcionalidad debe implementarse siguiendo:

```text
Frontend
    ↓
Service HTTP
    ↓
API Route
    ↓
Controller
    ↓
Business Service
    ↓
Model
    ↓
MySQL
```

No saltarse capas sin una razón técnica válida.

---

# 30. Principio principal

El backend de JuampyZel debe cumplir:

```text
SEPARACIÓN
   +
SEGURIDAD
   +
CONSISTENCIA
   +
ESCALABILIDAD
   +
MANTENIBILIDAD
```

El código debe estar preparado para que JuampyZel pueda agregar nuevas sucursales, productos, tiendas, usuarios, pedidos y funcionalidades sin tener que reconstruir la arquitectura.

La prioridad será mantener una arquitectura clara donde cada componente tenga una responsabilidad definida.

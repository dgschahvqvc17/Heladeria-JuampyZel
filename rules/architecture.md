# Architecture — JuampyZel

## 1. Propósito

Este documento define la arquitectura que deben seguir todos los desarrolladores y agentes de IA que trabajen en el sistema web de **JuampyZel**.

JuampyZel es una empresa dedicada a la producción y comercialización de diferentes tipos de helados.

La empresa cuenta con:

* Diferentes sucursales.
* Venta de helados en sus sucursales.
* Atención a tiendas que realizan pedidos para abastecerse.
* Productos de diferentes categorías.
* Inventario.
* Clientes.
* Tiendas.
* Pedidos.
* Ventas.
* Usuarios y roles.
* Reportes y operaciones administrativas.

El sistema será una aplicación web empresarial que permitirá centralizar y administrar estas operaciones.

---

# 2. Tecnologías

La arquitectura utilizará las siguientes tecnologías principales:

### Frontend

* React
* JavaScript
* HTML5
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Base de datos

* MySQL

### Control de versiones

* Git
* GitHub

---

# 3. Patrón arquitectónico

El proyecto utilizará una arquitectura basada en **MVC (Model-View-Controller)**.

La arquitectura se dividirá en:

```text
Frontend
    │
    │ HTTP / API REST
    ▼
Backend
    │
    ├── Routes
    ├── Controllers
    ├── Models
    └── Services
            │
            ▼
          MySQL
```

La separación de responsabilidades es obligatoria.

Cada capa debe tener una función específica y no debe asumir responsabilidades pertenecientes a otra capa.

---

# 4. Arquitectura general

El sistema se dividirá principalmente en dos aplicaciones:

```text
JuampyZel
│
├── frontend/
│   └── React
│
└── backend/
    └── Node.js + Express + MVC
```

El frontend será responsable de la interfaz y la interacción con el usuario.

El backend será responsable de:

* Lógica de negocio.
* Validación.
* Autenticación.
* Autorización.
* Acceso a datos.
* Reglas del sistema.
* Comunicación con MySQL.
* API REST.

---

# 5. Frontend

El frontend será desarrollado con React.

React será responsable principalmente de la **View** y de la interacción del usuario.

La estructura recomendada será:

```text
frontend/
│
├── src/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   ├── layouts/
│   │
│   ├── hooks/
│   │
│   ├── services/
│   │
│   ├── context/
│   │
│   ├── utils/
│   │
│   ├── assets/
│   │
│   ├── routes/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── ...
```

---

# 6. Components

Los componentes representan elementos reutilizables de la interfaz.

Ejemplos:

```text
components/
│
├── common/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Table.jsx
│   └── Alert.jsx
│
├── products/
│   ├── ProductCard.jsx
│   ├── ProductForm.jsx
│   └── ProductTable.jsx
│
├── branches/
│   ├── BranchCard.jsx
│   └── BranchForm.jsx
│
└── orders/
    ├── OrderForm.jsx
    ├── OrderTable.jsx
    └── OrderDetails.jsx
```

Los componentes deben ser reutilizables.

No colocar lógica de negocio compleja dentro de componentes visuales.

---

# 7. Pages

Las páginas representan funcionalidades completas del sistema.

Ejemplo:

```text
pages/
│
├── Login/
│   └── Login.jsx
│
├── Dashboard/
│   └── Dashboard.jsx
│
├── Products/
│   ├── Products.jsx
│   └── ProductDetails.jsx
│
├── Branches/
│   └── Branches.jsx
│
├── Customers/
│   └── Customers.jsx
│
├── Stores/
│   └── Stores.jsx
│
├── Orders/
│   ├── Orders.jsx
│   └── OrderDetails.jsx
│
├── Sales/
│   └── Sales.jsx
│
├── Inventory/
│   └── Inventory.jsx
│
└── Users/
    └── Users.jsx
```

Las páginas deben coordinar componentes, servicios y navegación.

No deben contener toda la lógica del sistema.

---

# 8. Services del frontend

Los servicios del frontend serán responsables de comunicarse con el backend mediante HTTP.

Ejemplo:

```text
services/
│
├── authService.js
├── productService.js
├── branchService.js
├── customerService.js
├── storeService.js
├── orderService.js
├── saleService.js
├── inventoryService.js
└── userService.js
```

Ejemplo:

```javascript
export async function getProducts() {
    const response = await fetch("/api/products");

    if (!response.ok) {
        throw new Error("Error al obtener productos");
    }

    return response.json();
}
```

Los componentes React no deben realizar directamente toda la lógica de las peticiones.

---

# 9. Backend

El backend utilizará:

```text
Node.js
+
Express.js
+
MVC
+
MySQL
```

Su responsabilidad será procesar las solicitudes provenientes del frontend.

Flujo:

```text
React
  │
  ▼
HTTP Request
  │
  ▼
Route
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Model
  │
  ▼
MySQL
```

La respuesta seguirá el camino inverso:

```text
MySQL
  │
  ▼
Model
  │
  ▼
Service
  │
  ▼
Controller
  │
  ▼
HTTP Response
  │
  ▼
React
```

---

# 10. Estructura del Backend

La estructura recomendada será:

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │
│   ├── routes/
│   │
│   ├── controllers/
│   │
│   ├── models/
│   │
│   ├── services/
│   │
│   ├── middlewares/
│   │
│   ├── validators/
│   │
│   ├── utils/
│   │
│   ├── database/
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── ...
```

---

# 11. Model

Los Models representan la interacción con la base de datos MySQL.

Los modelos serán responsables de:

* Consultar registros.
* Insertar registros.
* Actualizar registros.
* Eliminar registros.
* Ejecutar consultas relacionadas con una entidad.

Ejemplos:

```text
models/
│
├── User.js
├── Role.js
├── Product.js
├── Category.js
├── Branch.js
├── Customer.js
├── Store.js
├── Order.js
├── OrderDetail.js
├── Sale.js
├── SaleDetail.js
└── Inventory.js
```

Los Models no deben contener lógica relacionada con la interfaz.

---

# 12. Controller

Los Controllers reciben las solicitudes HTTP y coordinan la respuesta.

Responsabilidades:

* Recibir parámetros.
* Validar información básica.
* Llamar al Service correspondiente.
* Determinar el código HTTP.
* Enviar la respuesta al frontend.

Ejemplo:

```javascript
export async function getProducts(req, res) {
    try {
        const products = await productService.getAll();

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener productos"
        });
    }
}
```

Los Controllers no deben contener grandes cantidades de lógica de negocio.

---

# 13. Services

Los Services contienen la lógica de negocio de la aplicación.

Ejemplo:

```text
services/
│
├── authService.js
├── productService.js
├── orderService.js
├── inventoryService.js
└── saleService.js
```

Ejemplo conceptual:

```javascript
async function createOrder(orderData) {

    // Validar disponibilidad

    // Calcular cantidades

    // Verificar tienda

    // Registrar pedido

    // Actualizar inventario

}
```

La lógica importante del negocio debe estar en Services y no directamente en Controllers.

---

# 14. Routes

Las Routes definen los endpoints de la API.

Ejemplo:

```text
routes/
│
├── authRoutes.js
├── productRoutes.js
├── branchRoutes.js
├── customerRoutes.js
├── storeRoutes.js
├── orderRoutes.js
├── saleRoutes.js
├── inventoryRoutes.js
└── userRoutes.js
```

Ejemplo:

```javascript
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
```

Las Routes no deben contener lógica de negocio.

---

# 15. Middlewares

Los Middlewares serán utilizados para funcionalidades transversales.

Ejemplos:

```text
middlewares/
│
├── authMiddleware.js
├── roleMiddleware.js
├── errorMiddleware.js
└── validationMiddleware.js
```

Responsabilidades:

* Autenticación.
* Autorización.
* Validación.
* Manejo global de errores.
* Procesamiento de solicitudes.

---

# 16. Base de datos MySQL

El sistema utilizará **MySQL** como sistema de gestión de base de datos.

La base de datos debe estar correctamente normalizada y utilizar relaciones entre las entidades.

La información relacionada con:

* Usuarios.
* Roles.
* Productos.
* Categorías.
* Sucursales.
* Clientes.
* Tiendas.
* Pedidos.
* Detalles de pedidos.
* Ventas.
* Inventario.

debe almacenarse en MySQL.

---

# 17. Regla de acceso a MySQL

El frontend React **nunca debe conectarse directamente a MySQL**.

Flujo obligatorio:

```text
React
  │
  ▼
API REST
  │
  ▼
Node.js / Express
  │
  ▼
Models / Services
  │
  ▼
MySQL
```

Nunca:

```text
React
  │
  ▼
MySQL
```

Las credenciales de MySQL deben permanecer únicamente en el backend.

---

# 18. Configuración de base de datos

La información de conexión debe almacenarse mediante variables de entorno.

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=juampyzel
DB_USER=root
DB_PASSWORD=
```

Nunca escribir las credenciales directamente en los archivos `.js`.

---

# 19. Entidades principales

La arquitectura debe considerar inicialmente las siguientes entidades:

```text
Usuario
Rol
Producto
Categoría
Sucursal
Cliente
Tienda
Pedido
DetallePedido
Venta
DetalleVenta
Inventario
```

Estas entidades pueden modificarse durante el análisis del sistema.

Los agentes no deben asumir que esta lista es definitiva si posteriormente se define un modelo de datos diferente.

---

# 20. Operaciones principales

El sistema debe contemplar principalmente:

### Gestión de productos

* Registrar productos.
* Consultar productos.
* Actualizar productos.
* Desactivar productos.
* Consultar disponibilidad.

### Gestión de sucursales

* Registrar sucursales.
* Consultar sucursales.
* Actualizar información.
* Controlar estado.

### Gestión de tiendas

* Registrar tiendas.
* Consultar tiendas.
* Actualizar información.
* Gestionar pedidos.

### Gestión de pedidos

* Registrar pedidos.
* Consultar pedidos.
* Consultar detalles.
* Cambiar estados.
* Verificar disponibilidad.

### Gestión de ventas

* Registrar ventas.
* Consultar ventas.
* Consultar detalles.
* Generar información para reportes.

### Gestión de inventario

* Consultar stock.
* Registrar movimientos.
* Actualizar existencias.
* Controlar disponibilidad.

---

# 21. Flujo de un pedido de tienda

Un pedido realizado por una tienda debe seguir un flujo similar a:

```text
Tienda
   │
   ▼
Crear pedido
   │
   ▼
Validar productos
   │
   ▼
Validar disponibilidad
   │
   ▼
Calcular pedido
   │
   ▼
Registrar pedido
   │
   ▼
Actualizar estado
   │
   ▼
Preparar abastecimiento
```

La lógica completa debe implementarse en el backend.

El frontend únicamente debe mostrar y solicitar las acciones correspondientes.

---

# 22. Separación de responsabilidades

### React

Responsable de:

* Interfaz.
* Formularios.
* Navegación.
* Visualización.
* Interacción del usuario.
* Estado de la interfaz.

### Routes

Responsables de:

* Definir endpoints.

### Controllers

Responsables de:

* Recibir solicitudes.
* Coordinar operaciones.
* Enviar respuestas.

### Services

Responsables de:

* Reglas de negocio.
* Procesos.
* Validaciones de negocio.

### Models

Responsables de:

* Acceso a MySQL.
* Consultas.
* Persistencia.

### MySQL

Responsable de:

* Almacenar información.
* Relaciones.
* Integridad de datos.

---

# 23. API REST

El backend debe exponer una API REST.

Ejemplo:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Para pedidos:

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
```

Para sucursales:

```text
GET    /api/branches
GET    /api/branches/:id
POST   /api/branches
PUT    /api/branches/:id
```

Los endpoints deben utilizar nombres consistentes y RESTful.

---

# 24. Respuestas de la API

Las respuestas deben mantener una estructura consistente.

Éxito:

```json
{
    "success": true,
    "data": {}
}
```

Error:

```json
{
    "success": false,
    "message": "No se pudo completar la operación"
}
```

Cuando sea necesario pueden incluirse detalles adicionales:

```json
{
    "success": true,
    "message": "Producto registrado correctamente",
    "data": {}
}
```

---

# 25. Manejo de errores

Los errores deben manejarse de forma centralizada cuando sea posible.

No repetir innecesariamente la misma lógica de manejo de errores en todos los Controllers.

El backend debe devolver códigos HTTP apropiados:

```text
200 → Operación exitosa
201 → Recurso creado
400 → Solicitud incorrecta
401 → No autenticado
403 → Sin permisos
404 → Recurso no encontrado
409 → Conflicto
500 → Error interno
```

---

# 26. Autenticación y autorización

El sistema debe diferenciar entre:

* Autenticación.
* Autorización.

La autenticación determina quién es el usuario.

La autorización determina qué puede hacer.

Ejemplo:

```text
Administrador
    ↓
Gestionar usuarios
Gestionar productos
Gestionar sucursales
Gestionar inventario
Consultar reportes

Empleado
    ↓
Consultar productos
Registrar ventas
Gestionar determinadas operaciones

Tienda
    ↓
Consultar productos
Crear pedidos
Consultar sus pedidos
```

Los permisos definitivos serán establecidos durante el análisis funcional.

---

# 27. Seguridad arquitectónica

La arquitectura debe cumplir las siguientes reglas:

* No conectar React directamente con MySQL.
* No almacenar contraseñas en texto plano.
* No almacenar credenciales en Git.
* Utilizar variables de entorno.
* Validar información recibida.
* Controlar permisos mediante middleware.
* Utilizar consultas parametrizadas.
* No confiar en la validación del frontend.
* Validar nuevamente la información en el backend.

---

# 28. Regla para agentes de IA

Antes de crear una nueva funcionalidad, el agente debe:

1. Revisar la arquitectura existente.
2. Identificar el módulo relacionado.
3. Revisar Models existentes.
4. Revisar Services existentes.
5. Revisar Controllers existentes.
6. Revisar Routes existentes.
7. Revisar componentes React existentes.
8. Reutilizar código cuando sea posible.
9. Evitar duplicaciones.
10. Mantener la separación MVC.

No crear lógica de negocio directamente en componentes React.

No crear consultas MySQL directamente dentro de Controllers.

No colocar lógica de negocio dentro de Routes.

---

# 29. Regla de cambios

Cuando se agregue una nueva funcionalidad, se debe modificar únicamente las capas necesarias.

Por ejemplo, para agregar la gestión de productos:

```text
Frontend
│
├── ProductPage
├── ProductForm
├── ProductTable
└── productService.js
        │
        ▼
Backend
│
├── productRoutes.js
├── productController.js
├── productService.js
└── Product.js
        │
        ▼
MySQL
└── products
```

No modificar módulos no relacionados sin necesidad.

---

# 30. Estructura final recomendada

La estructura general del proyecto será:

```text
juampyzel/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── assets/
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── database/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── api.md
│
├── .gitignore
└── README.md
```

---

# 31. Principio arquitectónico principal

Toda funcionalidad nueva de JuampyZel debe respetar el siguiente flujo:

```text
┌─────────────────────────┐
│       USUARIO            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      REACT / UI          │
│      Presentation        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       API REST           │
│       Express            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      CONTROLLER          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        SERVICE           │
│    Business Logic        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         MODEL            │
│      Data Access         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         MySQL            │
│       Database           │
└─────────────────────────┘
```

Esta separación debe mantenerse durante todo el desarrollo del sistema.

El objetivo no es únicamente construir una aplicación que funcione, sino construir una aplicación **organizada, mantenible, escalable y preparada para incorporar nuevas funcionalidades de JuampyZel en el futuro**.

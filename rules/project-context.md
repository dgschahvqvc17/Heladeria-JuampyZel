# Project Context — JuampyZel

## 1. Información general del proyecto

### Nombre de la empresa

**JuampyZel**

### Actividad

JuampyZel es una empresa dedicada a la elaboración y comercialización de helados y productos relacionados.

La empresa ofrece diferentes variedades de helados para sus clientes y comercializa sus productos mediante sus diferentes sucursales.

Además de atender a clientes directamente en sus sucursales, JuampyZel también recibe pedidos de tiendas que necesitan abastecerse de sus productos.

### Ubicación principal

La empresa se encuentra ubicada en la ciudad de Cochabamba, Bolivia, en la zona de la **Avenida América y Avenida Melchor Pérez**.

La empresa cuenta con diferentes sucursales distribuidas en distintos puntos para facilitar la comercialización de sus productos.

---

# 2. Historia y contexto de la empresa

JuampyZel nace como una empresa dedicada a la producción y venta de helados, buscando ofrecer productos de buena calidad y diferentes opciones para sus consumidores.

Con el crecimiento de la empresa, JuampyZel comenzó a trabajar mediante diferentes sucursales, permitiendo que los clientes puedan adquirir sus productos en distintos puntos de la ciudad.

Además de las ventas realizadas directamente en las sucursales, la empresa atiende a diferentes tiendas que requieren productos de JuampyZel para abastecer sus propios negocios.

Este crecimiento genera la necesidad de mejorar la forma en que se administra la información de la empresa.

Actualmente, las operaciones relacionadas con productos, sucursales, clientes, tiendas, pedidos e inventario pueden generar una cantidad considerable de información.

Por esta razón, se plantea desarrollar un sistema web que permita centralizar y organizar las principales operaciones de JuampyZel.

---

# 3. Situación actual

JuampyZel maneja diferentes operaciones relacionadas con:

* Productos.
* Helados.
* Sucursales.
* Clientes.
* Tiendas.
* Pedidos.
* Ventas.
* Inventario.
* Usuarios.

A medida que aumenta la cantidad de productos, sucursales y pedidos, resulta más difícil mantener toda la información organizada si se utilizan procesos manuales o sistemas separados.

La empresa necesita contar con una herramienta que permita consultar y administrar la información de manera centralizada.

---

# 4. Problema identificado

El principal problema es la falta de un sistema centralizado que permita gestionar de manera organizada las operaciones principales de JuampyZel.

Esto puede provocar problemas como:

* Dificultad para conocer el stock disponible.
* Dificultad para controlar productos.
* Información dispersa entre diferentes registros.
* Dificultad para consultar pedidos de tiendas.
* Dificultad para controlar las ventas.
* Dificultad para conocer información de las sucursales.
* Mayor posibilidad de errores al registrar información.
* Dificultad para obtener información para la toma de decisiones.

El problema no consiste únicamente en registrar información, sino en conseguir que las diferentes áreas de la empresa puedan trabajar con información centralizada y consistente.

---

# 5. Problema central

> **JuampyZel necesita centralizar la gestión de sus productos, sucursales, clientes, tiendas, ventas, pedidos e inventario mediante un sistema web que permita administrar la información de manera organizada, segura y accesible.**

---

# 6. Solución propuesta

Se desarrollará una aplicación web para JuampyZel que permita gestionar las principales operaciones de la empresa.

El sistema permitirá:

* Administrar productos.
* Administrar categorías.
* Gestionar sucursales.
* Registrar clientes.
* Registrar tiendas.
* Gestionar pedidos de tiendas.
* Registrar ventas.
* Controlar inventario.
* Administrar usuarios.
* Consultar información mediante reportes básicos.

El sistema no busca automatizar absolutamente todas las operaciones de la empresa.

El objetivo es desarrollar un sistema de tamaño controlado que resuelva las principales necesidades administrativas y comerciales.

---

# 7. Alcance del sistema

El sistema estará enfocado principalmente en:

```text
Productos
    ↓
Sucursales
    ↓
Clientes
    ↓
Tiendas
    ↓
Pedidos
    ↓
Ventas
    ↓
Inventario
    ↓
Usuarios
```

No se implementarán inicialmente funcionalidades empresariales demasiado complejas como:

* Contabilidad completa.
* Nómina.
* Recursos humanos.
* Facturación electrónica avanzada.
* Gestión de proveedores completa.
* Producción industrial avanzada.
* Inteligencia empresarial avanzada.
* Aplicación móvil independiente.

Estas funcionalidades podrían considerarse en futuras versiones.

---

# 8. Actores del sistema

El sistema tendrá **6 actores principales**, además de un actor general denominado **Usuario**.

Los actores principales serán:

1. Administrador.
2. Encargado de Sucursal.
3. Vendedor.
4. Encargado de Inventario.
5. Cliente.
6. Tienda.

Además:

7. Usuario.

---

# 9. Actor general: Usuario

**Usuario** representa cualquier persona que tenga acceso al sistema.

Este actor sirve como actor general para las funcionalidades comunes.

### Funciones

* Iniciar sesión.
* Cerrar sesión.
* Consultar su perfil.
* Actualizar información básica de su perfil.
* Cambiar su contraseña.
* Acceder únicamente a las funciones permitidas según su rol.

Los permisos específicos dependerán del rol asignado al usuario.

---

# 10. Actor 1 — Administrador

El Administrador es el responsable de gestionar las principales configuraciones y operaciones administrativas del sistema.

### Funciones

#### Usuarios

* Registrar usuarios.
* Consultar usuarios.
* Editar usuarios.
* Activar o desactivar usuarios.
* Asignar roles.

#### Productos

* Registrar productos.
* Editar productos.
* Activar o desactivar productos.
* Consultar productos.

#### Categorías

* Registrar categorías.
* Editar categorías.
* Activar o desactivar categorías.

#### Sucursales

* Registrar sucursales.
* Editar sucursales.
* Activar o desactivar sucursales.
* Consultar información de sucursales.

#### Reportes

* Consultar ventas.
* Consultar pedidos.
* Consultar inventario.
* Consultar información general del sistema.

El Administrador tendrá acceso a la mayor cantidad de funcionalidades del sistema.

---

# 11. Actor 2 — Encargado de Sucursal

El Encargado de Sucursal administra las operaciones relacionadas con una sucursal específica.

### Funciones

#### Productos

* Consultar productos disponibles.
* Consultar precios.
* Consultar disponibilidad.

#### Ventas

* Consultar ventas de su sucursal.
* Registrar operaciones de venta cuando corresponda.
* Consultar detalles de ventas.

#### Inventario

* Consultar stock de su sucursal.
* Registrar solicitudes de reposición.
* Consultar movimientos relacionados con su sucursal.

#### Pedidos

* Consultar pedidos relacionados con su sucursal.
* Actualizar estados de pedidos cuando corresponda.

El Encargado de Sucursal no debe tener acceso a configuraciones generales del sistema.

---

# 12. Actor 3 — Vendedor

El Vendedor se encarga principalmente de atender las ventas realizadas a clientes en las sucursales.

### Funciones

#### Productos

* Consultar productos.
* Consultar precios.
* Consultar disponibilidad.

#### Ventas

* Registrar ventas.
* Agregar productos a una venta.
* Modificar cantidades antes de confirmar.
* Consultar ventas realizadas.

#### Clientes

* Registrar clientes cuando sea necesario.
* Consultar clientes.

El Vendedor tendrá acceso limitado a la información administrativa.

No podrá administrar usuarios ni modificar configuraciones generales.

---

# 13. Actor 4 — Encargado de Inventario

El Encargado de Inventario administra el control de existencias de productos.

### Funciones

#### Inventario

* Consultar stock.
* Registrar entradas.
* Registrar salidas.
* Registrar ajustes de inventario.
* Consultar movimientos.
* Identificar productos con bajo stock.

#### Productos

* Consultar productos.
* Consultar categorías.
* Consultar información relacionada con existencias.

#### Pedidos

* Consultar pedidos de tiendas.
* Verificar disponibilidad de productos.
* Preparar pedidos para abastecimiento.

El Encargado de Inventario no podrá modificar usuarios ni configuraciones administrativas.

---

# 14. Actor 5 — Cliente

El Cliente representa a una persona que compra productos de JuampyZel.

Dependiendo de la implementación final, el cliente podrá interactuar con el sistema para consultar productos y registrar pedidos o compras.

### Funciones

* Registrarse.
* Iniciar sesión.
* Consultar productos.
* Consultar precios.
* Consultar disponibilidad.
* Realizar pedidos cuando esta funcionalidad esté habilitada.
* Consultar sus pedidos.
* Consultar el estado de sus pedidos.
* Consultar su historial de compras.
* Actualizar su información básica.

El Cliente únicamente podrá acceder a su propia información.

No podrá consultar información de otros clientes.

---

# 15. Actor 6 — Tienda

La Tienda representa a un negocio externo que compra productos de JuampyZel para abastecerse.

Este actor es especialmente importante porque JuampyZel no solamente vende directamente a consumidores, sino que también abastece a otras tiendas.

### Funciones

#### Productos

* Consultar catálogo.
* Consultar precios.
* Consultar disponibilidad.

#### Pedidos

* Crear pedidos.
* Agregar productos.
* Modificar cantidades antes de confirmar.
* Confirmar pedidos.
* Consultar pedidos realizados.
* Consultar estado de pedidos.

#### Perfil

* Consultar información de la tienda.
* Actualizar información básica.

Una tienda solamente podrá consultar sus propios pedidos.

---

# 16. Relación entre los actores

El funcionamiento general puede representarse de la siguiente manera:

```text
                         JUAMPYZEL
                            │
              ┌─────────────┴─────────────┐
              │                           │
        Administración               Operaciones
              │                           │
        Administrador              ┌──────┼──────┐
                                   │      │      │
                              Sucursal Vendedor Inventario
                                   │      │      │
                                   └──────┼──────┘
                                          │
                                     Productos
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                           Cliente                  Tienda
                              │                       │
                           Compra                  Pedido
                                                      │
                                                      ▼
                                                 Abastecimiento
```

---

# 17. Principales módulos del sistema

El sistema estará compuesto por módulos pequeños y controlables.

### 1. Autenticación

* Inicio de sesión.
* Cierre de sesión.
* Gestión de sesión.
* Recuperación o cambio de contraseña.

### 2. Usuarios

* Registro.
* Consulta.
* Edición.
* Activación/desactivación.
* Roles.

### 3. Productos

* Registro.
* Consulta.
* Edición.
* Estado.
* Categorías.

### 4. Sucursales

* Registro.
* Consulta.
* Edición.
* Estado.

### 5. Clientes

* Registro.
* Consulta.
* Edición.

### 6. Tiendas

* Registro.
* Consulta.
* Edición.
* Estado.

### 7. Pedidos

* Crear pedido.
* Consultar pedidos.
* Consultar detalles.
* Actualizar estado.

### 8. Ventas

* Registrar venta.
* Consultar ventas.
* Consultar detalles.

### 9. Inventario

* Consultar stock.
* Registrar movimientos.
* Consultar productos con bajo stock.

### 10. Reportes básicos

* Ventas.
* Pedidos.
* Inventario.
* Productos.

---

# 18. Flujo de venta en sucursal

Una venta realizada en una sucursal seguirá aproximadamente:

```text
Cliente
   ↓
Vendedor
   ↓
Consultar productos
   ↓
Seleccionar productos
   ↓
Definir cantidades
   ↓
Calcular total
   ↓
Confirmar venta
   ↓
Registrar venta
   ↓
Actualizar inventario
```

---

# 19. Flujo de pedido de una tienda

Una tienda podrá realizar un pedido para abastecerse:

```text
Tienda
   ↓
Iniciar sesión
   ↓
Consultar productos
   ↓
Seleccionar productos
   ↓
Definir cantidades
   ↓
Confirmar pedido
   ↓
JuampyZel recibe pedido
   ↓
Inventario verifica disponibilidad
   ↓
Pedido preparado
   ↓
Actualizar estado
   ↓
Tienda consulta estado
```

---

# 20. Estados de pedido

Los pedidos podrán manejar estados básicos:

```text
PENDIENTE
    ↓
CONFIRMADO
    ↓
PREPARANDO
    ↓
LISTO
    ↓
ENTREGADO
```

También podrá existir:

```text
CANCELADO
```

Los estados definitivos pueden ajustarse durante el análisis del sistema.

---

# 21. Estados de productos

Los productos podrán tener estados como:

```text
ACTIVO
INACTIVO
```

Un producto inactivo no debe aparecer como disponible para nuevas ventas o pedidos.

---

# 22. Estados de usuarios

Los usuarios podrán manejar:

```text
ACTIVO
INACTIVO
```

Un usuario inactivo no podrá iniciar sesión.

---

# 23. Reglas generales del negocio

### Regla 1

Solo usuarios autenticados podrán acceder a las funcionalidades protegidas.

### Regla 2

Cada usuario tendrá un rol.

### Regla 3

Los permisos dependerán del rol.

### Regla 4

Los productos inactivos no podrán utilizarse en nuevos pedidos o ventas.

### Regla 5

No se debe permitir registrar cantidades negativas.

### Regla 6

No se debe permitir vender o abastecer productos sin disponibilidad suficiente.

### Regla 7

Las tiendas solamente podrán consultar sus propios pedidos.

### Regla 8

Los clientes solamente podrán consultar su propia información.

### Regla 9

Los usuarios administrativos podrán consultar información según sus permisos.

### Regla 10

Las operaciones que modifiquen inventario deben quedar registradas.

---

# 24. Información principal del sistema

El sistema debe manejar principalmente:

```text
Usuarios
Roles
Productos
Categorías
Sucursales
Clientes
Tiendas
Pedidos
Detalles de pedidos
Ventas
Detalles de ventas
Inventario
Movimientos de inventario
```

No agregar entidades innecesarias sin una necesidad funcional.

---

# 25. Alcance controlado

El sistema debe mantenerse en un tamaño razonable.

La prioridad es desarrollar correctamente las funcionalidades principales antes de agregar características avanzadas.

No implementar inicialmente:

* Contabilidad.
* Recursos humanos.
* Nómina.
* Proveedores complejos.
* Producción industrial.
* Facturación electrónica.
* Aplicaciones móviles.
* Inteligencia artificial para predicciones.
* Sistemas de puntos avanzados.
* Integración con múltiples plataformas externas.

Estas funcionalidades pueden considerarse como futuras mejoras.

---

# 26. Objetivo general

El objetivo del sistema es:

> **Desarrollar una aplicación web para JuampyZel que permita centralizar y facilitar la gestión de productos, sucursales, clientes, tiendas, ventas, pedidos e inventario, proporcionando información organizada para mejorar las operaciones de la empresa.**

---

# 27. Objetivos específicos

El sistema busca:

1. Centralizar la información de los productos.
2. Facilitar la administración de las sucursales.
3. Mejorar el registro de ventas.
4. Facilitar la gestión de pedidos de tiendas.
5. Permitir controlar las existencias.
6. Reducir errores en el registro de información.
7. Facilitar la consulta de información.
8. Controlar el acceso mediante usuarios y roles.
9. Proporcionar reportes básicos para apoyar la toma de decisiones.
10. Mantener la información organizada en una única plataforma.

---

# 28. Principio de diseño funcional

El sistema debe mantenerse simple.

Cada funcionalidad debe responder a una necesidad real de JuampyZel.

Antes de implementar una nueva funcionalidad, se debe preguntar:

```text
¿Esta funcionalidad resuelve un problema real?
        │
        ├── Sí → Implementar si está dentro del alcance.
        │
        └── No → No agregarla innecesariamente.
```

El objetivo no es crear el sistema empresarial más grande posible, sino crear un sistema funcional, coherente y escalable que resuelva las necesidades principales de JuampyZel.

---

# 29. Regla para agentes de IA

Los agentes deben utilizar este documento como contexto empresarial del proyecto.

Antes de implementar una funcionalidad deben considerar:

* La naturaleza de JuampyZel.
* Sus sucursales.
* Sus clientes.
* Sus tiendas.
* La venta de helados.
* Los pedidos de abastecimiento.
* El inventario.
* Los roles definidos.
* El alcance controlado del proyecto.

Los agentes no deben inventar procesos empresariales que no estén definidos.

Si una nueva funcionalidad requiere una decisión de negocio que no está especificada, debe solicitarse una definición antes de asumirla.

---

# 30. Resumen del sistema

```text
JUAMPYZEL
│
├── Usuarios
│   ├── Administrador
│   ├── Encargado de Sucursal
│   ├── Vendedor
│   └── Encargado de Inventario
│
├── Clientes
│
├── Tiendas
│
├── Productos
│   └── Categorías
│
├── Sucursales
│
├── Ventas
│
├── Pedidos
│   └── Detalles
│
└── Inventario
    └── Movimientos
```

El sistema debe proporcionar una solución web centralizada para las operaciones principales de JuampyZel, manteniendo un alcance controlado y evitando funcionalidades innecesariamente complejas.

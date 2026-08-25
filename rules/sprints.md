# Plan de Sprints — JuampyZel

## Información general

El desarrollo del sistema web de **JuampyZel** se organizará en tres Sprints.

La planificación busca desarrollar primero las funcionalidades fundamentales del sistema y posteriormente incorporar las operaciones comerciales y de control.

### Distribución

| Sprint   | Enfoque                             | Historias |
| -------- | ----------------------------------- | --------: |
| Sprint 1 | Usuarios, productos y sucursales    |         4 |
| Sprint 2 | Clientes, tiendas, ventas y pedidos |         4 |
| Sprint 3 | Inventario, seguimiento y reportes  |         4 |

---

# Sprint 1 — Fundamentos y gestión de la empresa

## Descripción

El primer Sprint estará enfocado en construir la base funcional del sistema JuampyZel.

Durante este Sprint se implementará el acceso de los usuarios y la administración de la información principal de la empresa. Se trabajará con usuarios y roles, productos, categorías y sucursales.

El objetivo es dejar preparada la estructura inicial para que los demás módulos puedan utilizar productos y sucursales correctamente.

### Historias incluidas

* HU01 — Iniciar sesión
* HU02 — Gestionar usuarios y roles
* HU03 — Gestionar productos y categorías
* HU04 — Gestionar sucursales

---

# HU01 — Iniciar sesión

**Prioridad:** Alta
**Story Points:** 5
**Tiempo estimado:** 8 horas

## Historia de usuario

**Como usuario registrado, quiero iniciar sesión en el sistema utilizando mis credenciales para acceder a las funcionalidades correspondientes a mi rol.**

### Contexto:

El usuario posee una cuenta previamente registrada en el sistema y se encuentra habilitada para acceder a la aplicación.

### Evento:

El usuario ingresa su correo electrónico o nombre de usuario y contraseña desde la pantalla de inicio de sesión.

### Resultado:

El sistema valida las credenciales y permite el acceso al sistema según el rol asignado al usuario.

### Criterios de aceptación:

* Mostrar una pantalla de inicio de sesión.
* Permitir ingresar usuario o correo electrónico.
* Permitir ingresar contraseña.
* Validar que los campos obligatorios estén completos.
* Validar las credenciales ingresadas.
* Verificar que el usuario se encuentre activo.
* Mostrar un mensaje cuando las credenciales sean incorrectas.
* Impedir el acceso a usuarios inactivos.
* Crear la sesión o mecanismo de autenticación correspondiente.
* Identificar el rol del usuario autenticado.
* Redirigir al usuario al módulo correspondiente.
* Mantener la sesión mientras el usuario se encuentre autenticado.
* Permitir cerrar sesión.
* Proteger las funcionalidades que requieran autenticación.

---

# HU02 — Gestionar usuarios y roles

**Prioridad:** Alta
**Story Points:** 8
**Tiempo estimado:** 12 horas

## Historia de usuario

**Como administrador, quiero gestionar los usuarios y sus roles para controlar quién puede acceder al sistema y qué funcionalidades puede utilizar.**

### Contexto:

El administrador necesita controlar las cuentas de las personas que utilizan el sistema JuampyZel.

### Evento:

El administrador accede al módulo de usuarios para registrar, consultar o modificar una cuenta.

### Resultado:

El sistema permite administrar los usuarios y asignarles el rol correspondiente.

### Criterios de aceptación:

* Mostrar una lista de usuarios registrados.
* Permitir registrar un nuevo usuario.
* Permitir ingresar nombre y datos básicos del usuario.
* Permitir registrar correo electrónico.
* Permitir establecer una contraseña.
* Permitir seleccionar un rol.
* Permitir asignar roles como administrador, encargado de sucursal, vendedor o encargado de inventario.
* Validar que los campos obligatorios estén completos.
* Evitar registrar correos electrónicos duplicados.
* Permitir editar los datos de un usuario.
* Permitir activar o desactivar usuarios.
* Permitir consultar el detalle de un usuario.
* Mostrar el estado actual del usuario.
* Restringir la gestión de usuarios al administrador.
* Registrar los usuarios en la base de datos.

---

# HU03 — Gestionar productos y categorías

**Prioridad:** Alta
**Story Points:** 8
**Tiempo estimado:** 14 horas

## Historia de usuario

**Como administrador, quiero gestionar los productos y categorías de helados para mantener actualizado el catálogo de productos que comercializa JuampyZel.**

### Contexto:

JuampyZel comercializa diferentes variedades de helados que necesitan estar registradas y organizadas por categorías.

### Evento:

El administrador accede al módulo de productos para registrar, consultar o modificar un producto.

### Resultado:

El sistema mantiene actualizado el catálogo de productos y permite consultar su información.

### Criterios de aceptación:

* Mostrar la lista de productos registrados.
* Permitir registrar un producto.
* Permitir ingresar el nombre del producto.
* Permitir ingresar una descripción.
* Permitir seleccionar una categoría.
* Permitir registrar el precio.
* Permitir registrar información de disponibilidad.
* Permitir registrar una imagen del producto cuando corresponda.
* Permitir crear categorías.
* Permitir editar categorías.
* Permitir editar productos.
* Permitir activar o desactivar productos.
* Validar los campos obligatorios.
* Validar que el precio sea mayor a cero.
* Evitar registrar información inválida.
* Permitir consultar el detalle de un producto.
* Registrar la información en la base de datos.
* Mostrar únicamente productos activos cuando corresponda.

---

# HU04 — Gestionar sucursales

**Prioridad:** Alta
**Story Points:** 5
**Tiempo estimado:** 10 horas

## Historia de usuario

**Como administrador, quiero gestionar las sucursales de JuampyZel para mantener registrada y organizada la información de los diferentes puntos de venta de la empresa.**

### Contexto:

JuampyZel cuenta con diferentes sucursales donde comercializa sus productos.

### Evento:

El administrador accede al módulo de sucursales para registrar o modificar la información de una sucursal.

### Resultado:

El sistema mantiene actualizada la información de las sucursales y permite consultar su estado.

### Criterios de aceptación:

* Mostrar las sucursales registradas.
* Permitir registrar una sucursal.
* Permitir ingresar el nombre de la sucursal.
* Permitir registrar la dirección.
* Permitir registrar teléfono.
* Permitir registrar información del responsable.
* Permitir editar una sucursal.
* Permitir activar o desactivar una sucursal.
* Mostrar el estado de cada sucursal.
* Permitir consultar el detalle de una sucursal.
* Validar los campos obligatorios.
* Evitar registrar sucursales con información incompleta.
* Registrar la información en la base de datos.

---

# Sprint 2 — Ventas, clientes y pedidos

## Descripción

El segundo Sprint estará enfocado en las operaciones comerciales de JuampyZel.

Una vez que el sistema cuenta con usuarios, productos y sucursales, se implementarán las funcionalidades necesarias para gestionar clientes, tiendas, ventas y pedidos.

Este Sprint permitirá representar las dos principales formas de comercialización de JuampyZel: las ventas realizadas en sus sucursales y los pedidos realizados por tiendas para abastecerse de productos.

### Historias incluidas

* HU05 — Gestionar clientes
* HU06 — Gestionar tiendas
* HU07 — Registrar ventas
* HU08 — Gestionar pedidos de tiendas

---

# HU05 — Gestionar clientes

**Prioridad:** Media
**Story Points:** 5
**Tiempo estimado:** 8 horas

## Historia de usuario

**Como vendedor, quiero registrar y consultar clientes para mantener organizada la información de las personas que realizan compras en JuampyZel.**

### Contexto:

Los clientes pueden realizar compras en las sucursales de JuampyZel y, cuando sea necesario, sus datos deben quedar registrados.

### Evento:

El vendedor accede al módulo de clientes para registrar o consultar la información de un cliente.

### Resultado:

El sistema registra la información del cliente y permite consultarla posteriormente.

### Criterios de aceptación:

* Mostrar la lista de clientes registrados.
* Permitir registrar un cliente.
* Permitir ingresar nombres.
* Permitir ingresar apellidos.
* Permitir registrar teléfono.
* Permitir registrar correo electrónico.
* Permitir registrar información básica adicional.
* Validar los campos obligatorios.
* Evitar registros duplicados cuando corresponda.
* Permitir editar información del cliente.
* Permitir consultar el detalle de un cliente.
* Permitir buscar clientes.
* Registrar la información en la base de datos.
* Restringir el acceso según los permisos del usuario.

---

# HU06 — Gestionar tiendas

**Prioridad:** Alta
**Story Points:** 5
**Tiempo estimado:** 10 horas

## Historia de usuario

**Como administrador, quiero registrar y gestionar las tiendas que compran productos de JuampyZel para mantener controlados los negocios que solicitan abastecimiento.**

### Contexto:

JuampyZel atiende pedidos de tiendas que necesitan adquirir productos para abastecer sus propios negocios.

### Evento:

El administrador registra una nueva tienda o modifica la información de una tienda existente.

### Resultado:

La tienda queda registrada y puede utilizarse posteriormente para realizar y consultar pedidos de abastecimiento.

### Criterios de aceptación:

* Mostrar las tiendas registradas.
* Permitir registrar una tienda.
* Registrar nombre comercial.
* Registrar responsable.
* Registrar teléfono.
* Registrar dirección.
* Registrar correo electrónico.
* Permitir editar información.
* Permitir activar o desactivar una tienda.
* Mostrar el estado de la tienda.
* Permitir consultar el detalle.
* Validar los campos obligatorios.
* Registrar la información en la base de datos.
* Permitir identificar claramente cada tienda.

---

# HU07 — Registrar venta

**Prioridad:** Alta
**Story Points:** 8
**Tiempo estimado:** 14 horas

## Historia de usuario

**Como vendedor, quiero registrar las ventas realizadas en una sucursal para llevar un control de los productos vendidos y actualizar correctamente la información de las existencias.**

### Contexto:

El vendedor atiende a un cliente en una sucursal de JuampyZel y necesita registrar los productos que forman parte de la compra.

### Evento:

El vendedor selecciona los productos, indica las cantidades y confirma la venta.

### Resultado:

El sistema registra la venta, calcula el total y actualiza las existencias correspondientes.

### Criterios de aceptación:

* Permitir seleccionar la sucursal.
* Permitir buscar productos.
* Mostrar el precio del producto.
* Mostrar la disponibilidad.
* Permitir agregar productos a la venta.
* Permitir indicar cantidades.
* Validar que la cantidad sea válida.
* Validar que exista stock suficiente.
* Calcular automáticamente el subtotal.
* Calcular automáticamente el total.
* Permitir eliminar productos antes de confirmar.
* Permitir modificar cantidades antes de confirmar.
* Registrar la fecha y hora automáticamente.
* Registrar el usuario que realizó la venta.
* Registrar la sucursal.
* Registrar el detalle de la venta.
* Actualizar el stock después de confirmar.
* Registrar la venta en la base de datos.
* Permitir consultar ventas realizadas.

---

# HU08 — Gestionar pedidos de tiendas

**Prioridad:** Alta
**Story Points:** 8
**Tiempo estimado:** 16 horas

## Historia de usuario

**Como tienda, quiero realizar pedidos de productos de JuampyZel para abastecer mi negocio y consultar posteriormente el estado de mis pedidos.**

### Contexto:

Una tienda registrada necesita adquirir diferentes productos de JuampyZel para mantener abastecido su negocio.

### Evento:

La tienda accede al catálogo, selecciona los productos y cantidades que necesita y confirma el pedido.

### Resultado:

El sistema registra el pedido y permite a JuampyZel revisarlo, verificar la disponibilidad y actualizar su estado.

### Criterios de aceptación:

* Permitir a la tienda iniciar sesión.
* Mostrar el catálogo de productos disponibles.
* Mostrar precios.
* Mostrar disponibilidad.
* Permitir seleccionar productos.
* Permitir indicar cantidades.
* Validar que las cantidades sean mayores a cero.
* Validar la disponibilidad de los productos.
* Permitir modificar cantidades antes de confirmar.
* Permitir eliminar productos del pedido.
* Calcular automáticamente el total.
* Registrar la tienda que realizó el pedido.
* Registrar fecha y hora automáticamente.
* Registrar el detalle del pedido.
* Registrar el pedido en la base de datos.
* Asignar un estado inicial de "Pendiente".
* Permitir consultar pedidos realizados.
* Permitir consultar el detalle de un pedido.
* Permitir consultar el estado del pedido.
* Permitir actualizar el estado según el flujo definido.
* Mantener un historial de pedidos.

---

# Sprint 3 — Inventario, seguimiento y reportes

## Descripción

El tercer Sprint estará enfocado en el control de las existencias y en proporcionar información útil para el seguimiento de las operaciones de JuampyZel.

Se implementará la gestión básica de inventario, el seguimiento de pedidos, las alertas de stock y reportes básicos.

El objetivo es cerrar el ciclo de las operaciones principales del sistema: los productos son registrados, vendidos o solicitados por tiendas, el inventario se actualiza y los responsables pueden consultar información para tomar decisiones.

### Historias incluidas

* HU09 — Gestionar inventario
* HU10 — Gestionar estados de pedidos
* HU11 — Gestionar alertas de stock
* HU12 — Consultar reportes básicos

---

# HU09 — Gestionar inventario

**Prioridad:** Alta
**Story Points:** 8
**Tiempo estimado:** 14 horas

## Historia de usuario

**Como encargado de inventario, quiero gestionar las existencias de productos para conocer el stock disponible y mantener actualizado el inventario de JuampyZel.**

### Contexto:

JuampyZel necesita controlar la cantidad disponible de sus productos para poder atender las ventas de las sucursales y los pedidos de las tiendas.

### Evento:

El encargado de inventario accede al módulo de inventario para consultar existencias o registrar un movimiento.

### Resultado:

El sistema mantiene actualizado el stock y registra los movimientos realizados.

### Criterios de aceptación:

* Mostrar los productos con su stock actual.
* Permitir buscar productos.
* Mostrar productos con bajo stock.
* Permitir registrar entradas de inventario.
* Permitir registrar salidas de inventario.
* Permitir registrar ajustes de inventario.
* Permitir indicar la cantidad del movimiento.
* Validar que la cantidad sea válida.
* Registrar automáticamente fecha y hora.
* Registrar el usuario responsable del movimiento.
* Registrar el motivo del ajuste cuando corresponda.
* Actualizar el stock.
* Evitar que el stock sea negativo.
* Registrar los movimientos en la base de datos.
* Permitir consultar el historial de movimientos.
* Permitir consultar el detalle de un movimiento.

---

# HU10 — Gestionar estados de pedidos

**Prioridad:** Alta
**Story Points:** 5
**Tiempo estimado:** 10 horas

## Historia de usuario

**Como encargado de inventario, quiero actualizar el estado de los pedidos de las tiendas para informar el avance de cada solicitud de abastecimiento.**

### Contexto:

Las tiendas realizan pedidos y JuampyZel necesita procesarlos y mantener informado al cliente sobre el avance de su solicitud.

### Evento:

El encargado revisa un pedido y actualiza su estado de acuerdo con el avance del proceso.

### Resultado:

El sistema actualiza el estado del pedido y permite que la tienda consulte el avance de su solicitud.

### Criterios de aceptación:

* Mostrar los pedidos pendientes.
* Permitir consultar el detalle de un pedido.
* Mostrar la tienda que realizó el pedido.
* Mostrar los productos solicitados.
* Mostrar las cantidades.
* Mostrar el total.
* Mostrar el estado actual.
* Permitir cambiar el estado del pedido.
* Utilizar estados definidos por el sistema.
* Permitir pasar un pedido de Pendiente a Confirmado.
* Permitir pasar un pedido a Preparando.
* Permitir marcar un pedido como Listo.
* Permitir marcar un pedido como Entregado.
* Permitir cancelar un pedido cuando corresponda.
* Registrar la fecha de cada cambio de estado.
* Mantener un historial de estados.
* Permitir que la tienda consulte el estado actualizado.

---

# HU11 — Gestionar alertas de stock

**Prioridad:** Media
**Story Points:** 5
**Tiempo estimado:** 8 horas

## Historia de usuario

**Como encargado de inventario, quiero recibir alertas cuando un producto tenga un nivel bajo de stock para identificar oportunamente los productos que necesitan reposición.**

### Contexto:

La cantidad disponible de algunos productos puede disminuir debido a las ventas y pedidos de tiendas.

### Evento:

El stock de un producto alcanza o queda por debajo del límite establecido.

### Resultado:

El sistema identifica el producto con stock bajo y genera una alerta para el encargado correspondiente.

### Criterios de aceptación:

* Permitir establecer un stock mínimo.
* Comparar el stock actual con el stock mínimo.
* Detectar productos con stock bajo.
* Generar una alerta cuando se alcance el límite.
* Mostrar el nombre del producto.
* Mostrar el stock actual.
* Mostrar el stock mínimo.
* Mostrar la fecha de generación de la alerta.
* Mostrar las alertas pendientes.
* Permitir consultar el detalle de una alerta.
* Permitir marcar una alerta como atendida.
* Evitar generar alertas duplicadas innecesariamente.
* Registrar las alertas en la base de datos.

---

# HU12 — Consultar reportes básicos

**Prioridad:** Media
**Story Points:** 5
**Tiempo estimado:** 10 horas

## Historia de usuario

**Como administrador, quiero consultar reportes básicos de ventas, pedidos, productos e inventario para obtener información que facilite el seguimiento de las operaciones de JuampyZel.**

### Contexto:

El administrador necesita consultar información resumida sobre las principales operaciones del sistema.

### Evento:

El administrador accede al módulo de reportes y selecciona el tipo de información que desea consultar.

### Resultado:

El sistema muestra información organizada y comprensible sobre las operaciones registradas.

### Criterios de aceptación:

* Permitir consultar un resumen de ventas.
* Permitir consultar ventas por período.
* Permitir consultar pedidos realizados.
* Permitir consultar pedidos por estado.
* Permitir consultar productos registrados.
* Permitir consultar productos con bajo stock.
* Permitir consultar información de inventario.
* Permitir filtrar información por fechas.
* Mostrar totales cuando corresponda.
* Mostrar información de manera clara.
* Permitir consultar los resultados en tablas.
* Mostrar información actualizada.
* Restringir los reportes según los permisos del usuario.
* Evitar mostrar información que el usuario no tenga autorización para consultar.

---

# Resumen general de los Sprints

## Sprint 1 — Fundamentos y gestión de la empresa

```text
HU01 → Iniciar sesión
HU02 → Gestionar usuarios y roles
HU03 → Gestionar productos y categorías
HU04 → Gestionar sucursales
```

**Objetivo:** construir la base del sistema y permitir administrar la información fundamental de JuampyZel.

---

## Sprint 2 — Ventas, clientes y pedidos

```text
HU05 → Gestionar clientes
HU06 → Gestionar tiendas
HU07 → Registrar venta
HU08 → Gestionar pedidos de tiendas
```

**Objetivo:** implementar las principales operaciones comerciales de JuampyZel, incluyendo ventas en sucursales y pedidos de abastecimiento de tiendas.

---

## Sprint 3 — Inventario, seguimiento y reportes

```text
HU09 → Gestionar inventario
HU10 → Gestionar estados de pedidos
HU11 → Gestionar alertas de stock
HU12 → Consultar reportes básicos
```

**Objetivo:** completar el ciclo operativo mediante el control de inventario, seguimiento de pedidos, alertas y reportes básicos.

---

# Flujo general del sistema

```text
                    JUAMPYZEL
                       │
          ┌────────────┴────────────┐
          │                         │
      Sucursales                 Tiendas
          │                         │
          ▼                         ▼
       Ventas                    Pedidos
          │                         │
          └────────────┬────────────┘
                       ▼
                   INVENTARIO
                       │
                       ▼
                 ALERTAS / STOCK
                       │
                       ▼
                   REPORTES
```

El desarrollo de los tres Sprints debe mantener el alcance controlado y priorizar las funcionalidades fundamentales del negocio antes de incorporar características adicionales.

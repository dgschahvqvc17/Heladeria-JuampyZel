# Coding Standards — JuampyZel

## 1. Propósito

Este documento define los estándares generales de escritura, organización y calidad del código del proyecto **JuampyZel**.

Estas reglas deben ser respetadas por todos los desarrolladores y agentes de IA.

El objetivo es mantener un código:

* Limpio.
* Legible.
* Consistente.
* Mantenible.
* Reutilizable.
* Predecible.
* Fácil de depurar.
* Fácil de ampliar.

Este documento no define la arquitectura, diseño visual, estructura de base de datos ni reglas específicas del backend o frontend. Esas responsabilidades están definidas en sus respectivos archivos.

---

# 2. Principios generales

Todo código desarrollado para JuampyZel debe seguir estos principios:

### KISS

Mantener las soluciones simples.

No agregar complejidad cuando una solución sencilla sea suficiente.

### DRY

Evitar duplicar código.

Si una lógica se repite, evaluar si debe convertirse en:

* Función reutilizable.
* Componente reutilizable.
* Utilidad.
* Módulo.

### SRP

Cada función, componente o módulo debe tener una responsabilidad clara.

No crear funciones que realicen demasiadas tareas diferentes.

### YAGNI

No desarrollar funcionalidades que todavía no son necesarias.

No agregar código "por si acaso" puede utilizarse en el futuro.

---

# 3. Nombres

Los nombres deben ser descriptivos y representar claramente su propósito.

Evitar nombres genéricos como:

```javascript
data
value
item
temp
thing
x
y
foo
bar
```

Siempre que sea posible, utilizar nombres relacionados con el dominio del sistema.

Ejemplo:

```javascript
const products = [];
const orders = [];
const branchId = 1;
const customerName = "Juan";
const orderTotal = 150;
```

---

# 4. Variables

Utilizar `const` por defecto.

Utilizar `let` únicamente cuando el valor necesite cambiar.

No utilizar `var`.

Correcto:

```javascript
const productName = "Helado de Fresa";
let quantity = 2;

quantity++;
```

Incorrecto:

```javascript
var productName = "Helado de Fresa";
```

---

# 5. camelCase

Las variables y funciones deben utilizar `camelCase`.

Correcto:

```javascript
const productName = "Helado";
const totalPrice = 100;

function calculateTotal() {
    // ...
}
```

Incorrecto:

```javascript
const product_name = "Helado";

function Calculate_Total() {
    // ...
}
```

---

# 6. PascalCase

Las clases y componentes React deben utilizar `PascalCase`.

Ejemplo:

```text
ProductCard.jsx
ProductForm.jsx
OrderDetails.jsx
BranchList.jsx
```

Ejemplo:

```javascript
function ProductCard() {
    return <div>Producto</div>;
}
```

---

# 7. Constantes

Las constantes globales que representen valores fijos pueden utilizar `UPPER_SNAKE_CASE`.

Ejemplo:

```javascript
const MAX_ORDER_ITEMS = 50;
const DEFAULT_PAGE_SIZE = 20;
```

No utilizar `UPPER_SNAKE_CASE` para todas las variables.

Correcto:

```javascript
const productName = "Helado";
const MAX_PRODUCTS = 100;
```

---

# 8. Funciones

Las funciones deben:

* Tener un nombre descriptivo.
* Realizar una tarea específica.
* Evitar demasiados parámetros.
* Evitar demasiada lógica anidada.
* Ser fáciles de probar.

Correcto:

```javascript
function calculateOrderTotal(items) {
    // ...
}
```

Evitar:

```javascript
function processEverything() {
    // cientos de líneas
}
```

---

# 9. Tamaño de las funciones

Evitar funciones excesivamente largas.

Cuando una función crezca demasiado:

1. Identificar responsabilidades independientes.
2. Extraerlas a funciones separadas.
3. Mantener nombres descriptivos.

Ejemplo:

```javascript
function createOrder(orderData) {
    validateOrder(orderData);
    calculateOrderTotal(orderData);
    saveOrder(orderData);
}
```

Es preferible esto a colocar toda la lógica en una única función extensa.

---

# 10. Condicionales

Los condicionales deben mantenerse simples y legibles.

Evitar anidaciones excesivas.

Preferir:

```javascript
if (!product) {
    return;
}

if (!product.isActive) {
    return;
}

processProduct(product);
```

en lugar de:

```javascript
if (product) {
    if (product.isActive) {
        processProduct(product);
    }
}
```

cuando el comportamiento sea equivalente.

---

# 11. Early Return

Utilizar early return cuando ayude a reducir la complejidad.

Ejemplo:

```javascript
function processOrder(order) {
    if (!order) {
        return;
    }

    if (order.items.length === 0) {
        return;
    }

    // Procesar pedido
}
```

Esto ayuda a evitar grandes bloques de código anidados.

---

# 12. Comparaciones

Utilizar comparaciones estrictas:

```javascript
===
!==
```

Evitar:

```javascript
==
!=
```

Ejemplo:

```javascript
if (product.id === selectedId) {
    // ...
}
```

---

# 13. Strings

Utilizar comillas de manera consistente.

Para strings simples se recomienda:

```javascript
const productName = "Helado de Chocolate";
```

Para strings dinámicos utilizar template literals:

```javascript
const message = `El producto ${productName} está disponible`;
```

---

# 14. Arrays

Utilizar métodos modernos de JavaScript cuando mejoren la legibilidad.

Preferir:

```javascript
products.map(product => product.name);
```

```javascript
products.filter(product => product.stock > 0);
```

```javascript
products.find(product => product.id === productId);
```

Evitar ciclos innecesariamente complejos cuando un método de array haga el código más claro.

---

# 15. Destructuring

Utilizar destructuring cuando mejore la legibilidad.

Ejemplo:

```javascript
const { name, price, stock } = product;
```

En React:

```javascript
function ProductCard({ name, price, stock }) {
    // ...
}
```

No utilizar destructuring únicamente por seguir una moda si hace el código menos comprensible.

---

# 16. Optional Chaining

Utilizar optional chaining cuando sea necesario evitar comprobaciones repetitivas.

Ejemplo:

```javascript
const customerName = order.customer?.name;
```

No abusar de esta característica para ocultar errores de lógica.

---

# 17. Nullish Coalescing

Utilizar `??` cuando se necesite proporcionar un valor predeterminado únicamente cuando el valor sea `null` o `undefined`.

Ejemplo:

```javascript
const quantity = product.stock ?? 0;
```

No utilizarlo indiscriminadamente.

---

# 18. Comentarios

Los comentarios deben explicar decisiones o comportamientos que no sean evidentes.

Evitar comentarios innecesarios.

Incorrecto:

```javascript
// Incrementar cantidad
quantity++;
```

Preferir:

```javascript
// Se limita la cantidad para evitar solicitar más unidades
// de las disponibles en inventario.
quantity = Math.min(quantity, availableStock);
```

Los comentarios deben mantenerse actualizados.

---

# 19. Código muerto

No mantener código que ya no se utiliza.

Eliminar:

* Variables sin utilizar.
* Funciones sin utilizar.
* Imports innecesarios.
* Componentes obsoletos.
* Código comentado antiguo.

No utilizar comentarios como forma de conservar código eliminado.

Incorrecto:

```javascript
// function oldFunction() {
//     ...
// }
```

Si el código ya no se necesita, eliminarlo.

---

# 20. Imports

Los imports deben mantenerse organizados y limpios.

Eliminar imports que no se utilizan.

Evitar importar módulos completos cuando únicamente se necesita una parte y la herramienta utilizada permita imports específicos.

Ejemplo:

```javascript
import { useState, useEffect } from "react";
```

---

# 21. Archivos

Cada archivo debe tener una responsabilidad clara.

Evitar archivos que contengan:

* Muchos componentes diferentes.
* Funciones no relacionadas.
* Lógica de diferentes módulos.
* Código duplicado.

Los nombres de los archivos deben ser descriptivos.

Ejemplo:

```text
ProductForm.jsx
OrderDetails.jsx
calculateTotal.js
formatCurrency.js
```

---

# 22. Reutilización

Antes de crear una nueva función, componente o utilidad, revisar si ya existe una implementación equivalente.

No crear:

```text
formatPrice.js
formatProductPrice.js
formatMoney.js
```

si los tres realizan esencialmente la misma tarea.

Debe existir una única implementación reutilizable cuando corresponda.

---

# 23. Funciones utilitarias

Las funciones genéricas que puedan reutilizarse deben mantenerse separadas de la lógica específica.

Ejemplo:

```javascript
function formatCurrency(value) {
    return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB"
    }).format(value);
}
```

Una utilidad no debe depender innecesariamente de componentes específicos.

---

# 24. Manejo de errores

Nunca ignorar errores silenciosamente.

Incorrecto:

```javascript
try {
    await saveOrder();
} catch (error) {}
```

Correcto:

```javascript
try {
    await saveOrder();
} catch (error) {
    console.error(error);
}
```

Cuando corresponda, el error debe:

1. Registrarse.
2. Manejarse.
3. Mostrar un mensaje apropiado al usuario.
4. Permitir que la aplicación continúe funcionando correctamente.

---

# 25. Mensajes de error

Los mensajes destinados al usuario deben ser claros.

Evitar:

```text
Error 500
Exception
Something went wrong
undefined
```

Preferir:

```text
No se pudo registrar el pedido.
Intenta nuevamente.
```

No mostrar información técnica o sensible al usuario final.

---

# 26. Async / Await

Preferir `async/await` para operaciones asíncronas cuando mejore la legibilidad.

Ejemplo:

```javascript
async function loadProducts() {
    try {
        const products = await getProducts();

        return products;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
```

Evitar cadenas excesivamente complejas de `.then()` cuando `async/await` resulte más claro.

---

# 27. Promesas

Las promesas deben manejar correctamente los casos de éxito y error.

No crear promesas innecesariamente.

Evitar:

```javascript
return new Promise(async (resolve, reject) => {
    // ...
});
```

cuando una función `async` sea suficiente.

---

# 28. Inmutabilidad

Evitar modificar directamente objetos o arrays cuando pueda generar efectos secundarios inesperados.

Preferir:

```javascript
const updatedProducts = products.map(product =>
    product.id === id
        ? { ...product, stock: newStock }
        : product
);
```

en lugar de modificar directamente el objeto original cuando no sea necesario.

---

# 29. Efectos secundarios

Mantener los efectos secundarios controlados.

Los efectos secundarios incluyen:

* Peticiones HTTP.
* Modificación de almacenamiento.
* Manipulación directa del DOM.
* Suscripciones.
* Timers.

No ejecutar efectos secundarios inesperadamente dentro de funciones que deberían ser puras.

---

# 30. Funciones puras

Cuando sea posible, utilizar funciones puras.

Una función pura:

* Recibe datos.
* Procesa datos.
* Devuelve un resultado.
* No modifica información externa.

Ejemplo:

```javascript
function calculateTotal(items) {
    return items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}
```

---

# 31. Evitar valores mágicos

No repetir valores importantes directamente en diferentes partes del código.

Evitar:

```javascript
if (stock < 5) {
    // ...
}

if (stock < 5) {
    // ...
}
```

Preferir:

```javascript
const LOW_STOCK_LIMIT = 5;

if (stock < LOW_STOCK_LIMIT) {
    // ...
}
```

Esto facilita futuros cambios.

---

# 32. Tipos de datos

Las funciones deben trabajar con datos claramente definidos.

Antes de utilizar información externa, comprobar que tenga la estructura esperada.

Ejemplo:

```javascript
if (!Array.isArray(products)) {
    return [];
}
```

No asumir que los datos externos siempre serán correctos.

---

# 33. Validaciones

Las validaciones deben realizarse en el punto apropiado.

Las validaciones de interfaz mejoran la experiencia del usuario.

Las validaciones de negocio y seguridad no deben depender únicamente del frontend.

No duplicar validaciones innecesariamente cuando una validación pueda centralizarse correctamente.

---

# 34. Seguridad

Nunca colocar información sensible directamente en el código.

No incluir:

```text
Passwords
API Keys
Tokens
Secrets
Credenciales
```

en archivos que puedan terminar en el repositorio.

No subir información sensible a GitHub.

---

# 35. console.log

No dejar `console.log()` innecesarios en código de producción.

Durante el desarrollo puede utilizarse para depuración, pero debe eliminarse cuando ya no sea necesario.

Los errores importantes deben manejarse mediante mecanismos apropiados de logging.

---

# 36. Formato del código

El código debe mantener un formato consistente.

Se recomienda utilizar un formateador automático como **Prettier**.

El equipo y los agentes deben respetar la configuración existente del proyecto.

No modificar arbitrariamente el formato de archivos existentes.

---

# 37. Linting

Se recomienda utilizar ESLint para detectar problemas de código.

El código debe corregir:

* Variables no utilizadas.
* Imports innecesarios.
* Errores comunes.
* Problemas de sintaxis.
* Prácticas potencialmente peligrosas.

Si el proyecto ya posee una configuración de ESLint, los agentes deben respetarla.

---

# 38. Código generado por IA

Todo código generado por un agente de IA debe ser revisado antes de considerarse terminado.

El agente debe:

1. Comprender el código existente.
2. Evitar duplicaciones.
3. Mantener las convenciones actuales.
4. No modificar archivos innecesariamente.
5. No introducir dependencias sin justificación.
6. No eliminar funcionalidades existentes.
7. Mantener nombres coherentes.
8. Comprobar errores potenciales.
9. Mantener el código simple.
10. Verificar que la solución realmente resuelva el problema solicitado.

---

# 39. Modificaciones existentes

Antes de modificar un archivo, el agente debe analizar su contenido actual.

No reemplazar archivos completos cuando únicamente sea necesario modificar una pequeña sección.

No eliminar código funcional sin una razón.

Cuando una modificación pueda afectar otras funcionalidades, revisar primero las dependencias relacionadas.

---

# 40. Dependencias

No instalar una dependencia nueva para resolver un problema que puede solucionarse fácilmente con las herramientas existentes.

Antes de agregar una dependencia:

1. Verificar si ya existe una solución.
2. Evaluar el tamaño de la dependencia.
3. Evaluar su mantenimiento.
4. Evaluar posibles riesgos.
5. Determinar si realmente es necesaria.

---

# 41. Compatibilidad

El nuevo código debe ser compatible con las versiones y herramientas utilizadas actualmente por el proyecto.

No actualizar automáticamente:

* React.
* Node.js.
* Dependencias.
* Herramientas.

sin una razón y autorización.

---

# 42. Código legible

El código debe poder entenderse sin necesidad de explicaciones extensas.

Preferir:

```javascript
const availableProducts = products.filter(
    product => product.stock > 0
);
```

en lugar de escribir código excesivamente compacto o difícil de interpretar.

La legibilidad tiene prioridad sobre escribir menos líneas.

---

# 43. Regla de simplicidad

Ante dos soluciones funcionalmente equivalentes, elegir la que:

1. Sea más fácil de entender.
2. Tenga menos complejidad.
3. Sea más fácil de mantener.
4. Genere menos dependencias.
5. Sea consistente con el código existente.

---

# 44. Regla final para agentes

Antes de finalizar cualquier tarea de programación, el agente debe comprobar:

```text
[ ] ¿Los nombres son claros?
[ ] ¿Se evita código duplicado?
[ ] ¿Las funciones tienen responsabilidades claras?
[ ] ¿Se eliminaron imports innecesarios?
[ ] ¿Se eliminaron variables sin utilizar?
[ ] ¿Se manejan correctamente los errores?
[ ] ¿Se evitaron valores mágicos?
[ ] ¿Se respetan las convenciones existentes?
[ ] ¿Se evitó introducir dependencias innecesarias?
[ ] ¿El código es fácil de mantener?
```

Si alguna respuesta es "No", el agente debe corregirlo antes de considerar terminada la implementación.

---

# 45. Principio principal

El código de JuampyZel debe seguir esta regla:

> **Código simple, claro, consistente y mantenible antes que código complejo o innecesariamente sofisticado.**

Los agentes deben priorizar la calidad y coherencia del código existente antes de introducir nuevas abstracciones o tecnologías.

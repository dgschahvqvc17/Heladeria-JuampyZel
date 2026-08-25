# Frontend Standards — JuampyZel

## 1. Objetivo

El frontend de **JuampyZel** será una aplicación web moderna, elegante, llamativa y profesional para la gestión de una empresa dedicada a la producción, comercialización y distribución de helados.

La interfaz debe transmitir:

* Frescura.
* Calidad.
* Modernidad.
* Confianza.
* Cercanía.
* Dulzura.
* Tecnología.

El diseño debe diferenciarse de una aplicación empresarial genérica.

Debe existir una identidad visual propia de JuampyZel.

---

# 2. Tecnologías

El frontend utilizará:

* React
* JavaScript
* HTML5
* Tailwind CSS

No utilizar otras tecnologías de frontend sin autorización.

---

# 3. Filosofía de diseño

El diseño debe seguir el concepto:

> **"Una experiencia moderna y tecnológica inspirada en el mundo de los helados."**

La interfaz debe combinar:

* Diseño minimalista.
* Elementos visuales suaves.
* Tarjetas modernas.
* Bordes redondeados.
* Sombras sutiles.
* Gradientes controlados.
* Microanimaciones.
* Espacios amplios.
* Jerarquía visual clara.

No utilizar diseños excesivamente cargados.

La interfaz debe verse profesional tanto en escritorio como en dispositivos móviles.

---

# 4. Identidad visual

La identidad visual de JuampyZel utilizará una combinación de colores inspirados en:

* Crema.
* Vainilla.
* Fresa.
* Chocolate.
* Menta.
* Frutos tropicales.

Los colores deben utilizarse de manera equilibrada.

No utilizar todos los colores simultáneamente en una misma sección.

---

# 5. Paleta principal

## Color primario

```text
#FF6B9A
```

Rosa helado.

Uso:

* Botones principales.
* Elementos activos.
* Links importantes.
* Indicadores.
* Acciones principales.

---

## Color secundario

```text
#7C5CFC
```

Violeta moderno.

Uso:

* Elementos secundarios.
* Gradientes.
* Acciones especiales.
* Destacados.

---

## Color de acento

```text
#FFD166
```

Amarillo vainilla.

Uso:

* Destacados.
* Estadísticas.
* Badges.
* Elementos llamativos.

No utilizarlo como color dominante.

---

## Color verde fresco

```text
#6DD6A0
```

Uso:

* Estados exitosos.
* Stock disponible.
* Confirmaciones.
* Indicadores positivos.

---

## Fondo principal

```text
#FFF9F5
```

El fondo principal debe ser cálido y ligeramente crema.

Evitar utilizar blanco puro como fondo principal de toda la aplicación.

---

## Fondo secundario

```text
#FFFFFF
```

Utilizar para:

* Tarjetas.
* Formularios.
* Modales.
* Paneles.

---

## Texto principal

```text
#252235
```

Debe utilizarse para títulos y contenido principal.

---

## Texto secundario

```text
#6F6B7D
```

Utilizar para:

* Descripciones.
* Información secundaria.
* Labels secundarios.

---

## Bordes

```text
#EDE7E3
```

Los bordes deben ser sutiles.

---

# 6. Gradientes

Los gradientes pueden utilizarse para elementos destacados.

Gradiente principal:

```text
#FF6B9A → #7C5CFC
```

Ejemplo:

```text
Rosa → Violeta
```

Los gradientes deben utilizarse principalmente en:

* Hero sections.
* Encabezados destacados.
* Tarjetas especiales.
* Botones importantes.
* Elementos decorativos.

No utilizar gradientes en todos los componentes.

---

# 7. Tipografía

La aplicación utilizará dos familias tipográficas.

## Títulos

Utilizar:

```text
Plus Jakarta Sans
```

Peso recomendado:

```text
600
700
800
```

Uso:

* Títulos.
* Encabezados.
* Nombres de módulos.
* Dashboard.
* Hero sections.

---

## Texto general

Utilizar:

```text
Inter
```

Pesos:

```text
400
500
600
```

Uso:

* Párrafos.
* Formularios.
* Tablas.
* Botones.
* Navegación.

---

# 8. Jerarquía tipográfica

### H1

```text
32px – 48px
font-weight: 800
```

### H2

```text
26px – 36px
font-weight: 700
```

### H3

```text
20px – 26px
font-weight: 700
```

### Texto

```text
14px – 16px
font-weight: 400
```

### Texto pequeño

```text
12px – 14px
```

No utilizar tamaños excesivamente pequeños.

---

# 9. Barra de navegación

La aplicación tendrá una barra de navegación principal.

En escritorio:

```text
┌──────────────────────────────────────────────────────────────┐
│ 🍦 JUAMPYZEL    Dashboard  Productos  Pedidos  Sucursales   │
│                                             🔔   👤 Usuario   │
└──────────────────────────────────────────────────────────────┘
```

La navegación debe incluir:

* Logo de JuampyZel.
* Nombre de la aplicación.
* Menú principal.
* Indicador de sección activa.
* Notificaciones cuando corresponda.
* Perfil del usuario.
* Menú de usuario.

---

# 10. Navegación lateral

Para el sistema administrativo se recomienda utilizar un **Sidebar** en escritorio.

Estructura:

```text
┌──────────────────────┐
│ 🍦 JUAMPYZEL         │
│                      │
│ 🏠 Dashboard         │
│ 📦 Productos         │
│ 🏪 Sucursales        │
│ 🏬 Tiendas           │
│ 🛒 Pedidos           │
│ 💰 Ventas            │
│ 📊 Inventario        │
│ 👥 Clientes          │
│ 👤 Usuarios          │
│ 📈 Reportes          │
│                      │
│ ⚙ Configuración      │
└──────────────────────┘
```

El elemento seleccionado debe utilizar el color primario o un gradiente suave.

---

# 11. Responsive Navigation

En dispositivos móviles el Sidebar debe transformarse en:

* Menú lateral desplegable.
* Drawer.
* Menú hamburguesa.

No mostrar el Sidebar completo permanentemente en pantallas pequeñas.

---

# 12. Responsive Design

La aplicación debe utilizar un enfoque **Mobile First**.

Debe funcionar correctamente en:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Breakpoints aproximados:

```text
sm → 640px
md → 768px
lg → 1024px
xl → 1280px
2xl → 1536px
```

No diseñar únicamente pensando en 1920x1080.

---

# 13. Dashboard

El Dashboard debe ser uno de los elementos visualmente más importantes.

Debe mostrar información relevante de JuampyZel.

Ejemplo:

```text
┌─────────────────────────────────────────────────────────┐
│ Buenos días, Usuario 👋                                 │
│ Aquí tienes el resumen de JuampyZel                     │
│                                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Ventas   │ │ Pedidos  │ │ Productos│ │ Sucursales│  │
│ │ Bs. ...  │ │   ...    │ │   ...    │ │    ...    │  │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│ ┌───────────────────────┐ ┌──────────────────────────┐ │
│ │ Ventas                │ │ Pedidos recientes        │ │
│ │       Gráfico         │ │                          │ │
│ │                       │ │                          │ │
│ └───────────────────────┘ └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

Las estadísticas deben ser visuales y fáciles de interpretar.

---

# 14. Tarjetas

Las tarjetas deben utilizar:

```text
border-radius: 16px – 24px
```

Sombras suaves.

Ejemplo conceptual:

```text
background: #FFFFFF
border: #EDE7E3
```

Las tarjetas no deben tener sombras demasiado fuertes.

---

# 15. Botones

Los botones principales deben utilizar el color primario.

Ejemplo:

```text
Registrar producto
Crear pedido
Guardar cambios
Confirmar venta
```

Los botones deben tener:

* Bordes redondeados.
* Estados hover.
* Estados active.
* Estado disabled.
* Transiciones suaves.

Ejemplo conceptual:

```text
Normal
   ↓
Hover
   ↓
Active
   ↓
Disabled
```

---

# 16. Formularios

Los formularios deben ser simples y modernos.

Inputs:

```text
border-radius: 10px – 12px
```

Los labels deben estar claramente identificados.

Los errores deben mostrarse debajo del campo correspondiente.

Ejemplo:

```text
Nombre del producto

[________________________]

⚠ El nombre del producto es obligatorio
```

---

# 17. Tablas

Las tablas deben utilizarse para información administrativa.

Ejemplo:

```text
┌──────────────────────────────────────────────────────┐
│ Producto       Categoría    Precio    Stock   Estado │
├──────────────────────────────────────────────────────┤
│ Helado Fresa   Frutal       Bs. 10    25     Activo │
│ Helado Choco   Chocolate    Bs. 12    15     Activo │
└──────────────────────────────────────────────────────┘
```

En dispositivos móviles, las tablas deben:

* Permitir desplazamiento horizontal.
* O convertirse en tarjetas cuando sea apropiado.

Nunca romper el diseño móvil.

---

# 18. Estados visuales

Utilizar estados visuales consistentes.

### Éxito

```text
#6DD6A0
```

### Advertencia

```text
#FFD166
```

### Error

```text
#FF6B6B
```

### Información

```text
#6EA8FE
```

Estos colores deben utilizarse para:

* Badges.
* Alertas.
* Mensajes.
* Estados.
* Indicadores.

---

# 19. Productos

Los productos deben tener una presentación visual atractiva.

Cuando exista imagen:

```text
┌─────────────────────────┐
│                         │
│      Imagen Helado      │
│                         │
├─────────────────────────┤
│ Helado de Fresa 🍓      │
│ Cremoso y refrescante   │
│                         │
│ Bs. 12.00               │
│                         │
│ [Ver producto]          │
└─────────────────────────┘
```

Las imágenes deben utilizar:

```text
object-fit: cover
```

y tener bordes redondeados.

---

# 20. Animaciones

Utilizar microanimaciones.

Ejemplos:

* Hover en botones.
* Aparición de modales.
* Transiciones de navegación.
* Cambio de estados.
* Aparición de tarjetas.
* Loading states.

Las animaciones deben ser rápidas y sutiles.

Evitar animaciones excesivas.

---

# 21. Loading States

Nunca mostrar una pantalla completamente vacía mientras se cargan datos.

Utilizar:

* Skeletons.
* Spinners.
* Loading buttons.

Ejemplo:

```text
[ ⏳ Guardando... ]
```

---

# 22. Empty States

Cuando no existan datos, mostrar un mensaje amigable.

Ejemplo:

```text
        🍦

    No hay pedidos todavía

Los pedidos realizados por las tiendas
aparecerán aquí.

    [Crear pedido]
```

Evitar mostrar simplemente:

```text
No data
```

---

# 23. Modales

Los modales deben:

* Tener fondo de superposición.
* Ser centrados.
* Tener bordes redondeados.
* Ser responsive.
* Poder cerrarse correctamente.
* Mantener una jerarquía visual clara.

No utilizar modales excesivamente grandes para acciones simples.

---

# 24. Accesibilidad

La aplicación debe considerar:

* Contraste adecuado.
* Labels en formularios.
* Navegación mediante teclado.
* Texto alternativo en imágenes.
* Botones claramente identificables.
* Estados de focus.
* Tamaños de interacción adecuados.

No depender únicamente del color para comunicar información.

---

# 25. Imágenes

Las imágenes deben estar optimizadas.

Evitar imágenes innecesariamente grandes.

Las imágenes de productos deben mantener proporciones consistentes.

Utilizar `alt` descriptivo.

Ejemplo:

```jsx
<img
    src={product.image}
    alt={`Helado de ${product.name}`}
/>
```

---

# 26. Arquitectura visual

Todos los módulos deben mantener la misma identidad.

Por ejemplo:

```text
Productos
Sucursales
Tiendas
Pedidos
Ventas
Inventario
Clientes
Usuarios
Reportes
```

deben compartir:

* Misma navegación.
* Misma tipografía.
* Misma paleta.
* Mismos botones.
* Mismos formularios.
* Mismos componentes.
* Mismos estados visuales.

---

# 27. Regla para agentes de IA

Antes de crear una nueva pantalla, el agente debe:

1. Revisar los componentes existentes.
2. Reutilizar componentes.
3. Mantener la paleta definida.
4. Utilizar las tipografías definidas.
5. Mantener el sistema de navegación.
6. Respetar el diseño responsive.
7. No introducir colores arbitrarios.
8. No introducir otra familia tipográfica.
9. No crear un estilo visual completamente diferente.
10. Mantener la identidad de JuampyZel.

---

# 28. Regla principal de diseño

Cada pantalla debe responder visualmente a:

```text
¿Esto parece parte de JuampyZel?
```

Si una pantalla parece pertenecer a otra aplicación, debe rediseñarse para mantener la identidad visual.

La aplicación debe sentirse como un producto digital profesional y moderno de una empresa real de helados.

---

# 29. Resultado esperado

El frontend debe transmitir:

```text
              🍦
        JUAMPYZEL

   Moderno
   Fresco
   Elegante
   Tecnológico
   Amigable
   Profesional
```

El diseño debe ser único, reconocible y consistente en todos los módulos.

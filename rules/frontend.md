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

El Dashboard es la pantalla principal despues del login.

Por el momento el Dashboard esta **vacio** ya que trabajara con informacion de la base de datos.

## Layout general

```text
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR (fijo)           │  HEADER (gradiente, sticky)        │
│                           │                                    │
│  [Logo JuampyZel]         │  Buenos dias, Usuario              │
│  Panel de control         │  Panel de control de JuampyZel     │
│                           │                         [Bell][User│
│  ──────────────           ├────────────────────────────────────┤
│                           │                                    │
│  [Icon] Dashboard *       │                                    │
│  [Icon] Usuarios          │         ┌──────────┐               │
│  [Icon] Productos         │         │ [Icono]  │               │
│  [Icon] Sucursales        │         │          │               │
│  [Icon] Pedidos           │         │ Bienvenido a JuampyZel   │
│  [Icon] Ventas            │         │ Panel estara disponible  │
│  [Icon] Inventario        │         │ cuando se conecte a BD   │
│  [Icon] Reportes          │         └──────────┘               │
│  [Icon] Configuracion     │                                    │
│                           │                                    │
│  ──────────────           │                                    │
│                           │                                    │
│  ┌─────────────────────┐  │                                    │
│  │ [Avatar] Nombre     │  │                                    │
│  │           rol       │  │                                    │
│  │            [Salir]  │  │                                    │
│  └─────────────────────┘  │                                    │
└───────────────────────────┴────────────────────────────────────┘
```

## Sidebar (Navigation Lateral)

El sidebar es **fijo** y no se mueve con el scroll.

```text
┌──────────────────────────────┐
│  Fijo: fixed inset-y-0       │
│  w-72                        │
│  bg-gradient-to-b            │
│    from-primary/10           │
│    via-card                  │
│    to-secondary/10           │
│  border-r border-border/50   │
│                              │
│  Logo:                       │
│  [Logo h-12] + blur sutil    │
│  "JuampyZel" (text-gradient) │
│  "Panel de control"          │
│                              │
│  Nav items:                  │
│  [Icon] Label     [dot]      │
│                              │
│  Activo:                     │
│  bg-gradient primary/15      │
│  text-primary                │
│  dot gradiente               │
│                              │
│  Hover:                      │
│  hover:bg-primary/5          │
│  hover:text-primary          │
│                              │
│  User section:               │
│  [Avatar] Nombre + rol       │
│  [Boton logout]              │
└──────────────────────────────┘
```

### Comportamiento

- Desktop (`lg+`): Sidebar fijo a la izquierda
- Movil: Sidebar oculto, se abre con menu hamburguesa
- Overlay oscuro `bg-black/50 backdrop-blur-sm` en movil
- **No se mueve con el scroll** (position: fixed)

## Header (Barra superior - Gradiente)

El header utiliza el **gradiente principal** de JuampyZel y es **sticky**.

```text
┌──────────────────────────────────────────────────────────────┐
│  sticky top-0 z-30                                           │
│  bg-gradient-to-r from-primary via-secondary to-primary     │
│  animate-gradient-x                                          │
│  shadow-lg                                                   │
│                                                              │
│  [MenuIcon] Buenos dias, Usuario                             │
│             Panel de control de JuampyZel                     │
│                                                              │
│                              [BellIcon + badge] [User info]  │
└──────────────────────────────────────────────────────────────┘
```

### Colores del header

```text
Fondo: bg-gradient-to-r from-primary via-secondary to-primary
Animacion: animate-gradient-x (movimiento sutil)
Texto: text-white
Subtexto: text-white/80
Hover botones: hover:bg-white/20
Badge notificacion: bg-accent border-2 border-primary
Avatar: bg-white/20 backdrop-blur-sm
Bordes: border-white/20
```

### Comportamiento

- **Sticky**: `sticky top-0` se queda fijo arriba al hacer scroll
- **Z-index**: `z-30` para estar sobre el contenido
- **No se mueve** con el scroll del contenido principal

## Contenido principal

Por el momento el contenido esta **vacio** con un empty state:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                   ┌──────────────────┐                       │
│                   │                  │                       │
│                   │   [Icono Helado] │                       │
│                   │   (animado)      │                       │
│                   │                  │                       │
│                   │  Bienvenido a    │                       │
│                   │  JuampyZel       │                       │
│                   │                  │                       │
│                   │  El panel estara │                       │
│                   │  disponible cuando│                      │
│                   │  se conecte a BD │                       │
│                   └──────────────────┘                       │
│                                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Empty state

- Icono de helado: `IceCreamIcon` SVG
- Brillo animado detras: `animate-pulse-glow`
- Titulo: "Bienvenido a JuampyZel"
- Mensaje informativo sobre conexion a BD
- Animacion: `animate-fade-in`

## Sidebar - Colores acorde al formato

```text
Fondo sidebar:
  bg-gradient-to-b from-primary/10 via-card to-secondary/10

Logo:
  Texto: text-gradient (primary → secondary)
  Icono: blur sutil con gradiente

Nav items activos:
  bg-gradient-to-r from-primary/15 to-secondary/15
  text-primary
  Dot: bg-gradient-to-r from-primary to-secondary

Nav items hover:
  hover:bg-primary/5
  hover:text-primary

User section:
  bg-gradient-to-r from-primary/5 to-secondary/5
  Avatar: bg-gradient-to-br from-primary to-secondary
```

## Header - Colores acorde al formato

```text
Fondo header:
  bg-gradient-to-r from-primary via-secondary to-primary
  animate-gradient-x

Texto:
  Titulo: text-white font-bold
  Subtitulo: text-white/80

Botones header:
  text-white/80
  hover:text-white
  hover:bg-white/20

Avatar header:
  bg-white/20 backdrop-blur-sm
  text-white

Badge notificacion:
  bg-accent
  border-2 border-primary
```

## Iconos SVG (no emojis)

Todos los iconos son SVG inline:

```text
Navegacion:
  HomeIcon, UsersIcon, BoxIcon, StoreIcon,
  ShoppingCartIcon, DollarIcon, PackageIcon,
  BarChartIcon, SettingsIcon

Header:
  BellIcon, MenuIcon

Empty state:
  IceCreamIcon
```

## Animaciones

```text
animate-gradient-x  → Header gradiente animado
animate-pulse-glow  → Brillo del icono empty state
animate-fade-in     → Aparicion del empty state
```

## Responsividad

- Desktop (`lg+`): Sidebar fijo a la izquierda + contenido
- Movil: Sidebar oculto, menu hamburguesa, overlay oscuro

## Funcionalidad

- Saludo dinamico segun hora del dia
- Navegacion activa con indicador visual
- Notificaciones con indicador
- Cierre de sesion desde sidebar
- Links a modulos del sistema
- Sidebar se cierra al seleccionar item en movil

---

# 14. Pantalla de inicio de sesión (HU01)

La pantalla de inicio de sesión es la primera interacción del usuario con JuampyZel.

## Diseño general — Layout Split

La pantalla utiliza un **layout dividido** en dos paneles:

```text
┌─────────────────────────────────────────────────────────────────┐
│                        DESKTOP (lg+)                            │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                    │
│   PANEL IZQUIERDO          │   PANEL DERECHO                   │
│   (Branding)               │   (Formulario)                    │
│                            │                                    │
│   Gradiente animado        │   Fondo background                │
│   primary → secondary      │   Decoraciones sutiles            │
│                            │                                    │
│   [Formas flotantes]       │   ┌────────────────────────┐     │
│   [Patrón de puntos]       │   │  [Logo.icono]          │     │
│                            │   │  Bienvenido de vuelta   │     │
│   [Logo 4x grande]         │   │  Ingresa credenciales   │     │
│   [con brillo animado]     │   │                         │     │
│                            │   │  ┌──────────────────┐  │     │
│   JUAMPYZEL                │   │  │ glassmorphism card │  │     │
│   La mejor experiencia...  │   │  │                    │  │     │
│                            │   │  │ [Correo]          │  │     │
│   ★★★★★                    │   │  │ [Contraseña] [Ojo]│  │     │
│                            │   │  │ [Recordarme]      │  │     │
│   100+  15+  50K+          │   │  │ [Botón gradiente] │  │     │
│   Sabores Sucursales Client│   │  │                    │  │     │
│                            │   │  └──────────────────┘  │     │
│                            │   │                         │     │
│                            │   │  Problemas? Contacto    │     │
│                            │   │  © 2025 JuampyZel       │     │
│                            │   └────────────────────────┘     │
└────────────────────────────┴────────────────────────────────────┘
```

```text
┌─────────────────────────────────────────────────────────────────┐
│                        MÓVIL                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              [Logo JuampyZel - h-20]                            │
│              JUAMPYZEL                                          │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐    │
│   │              glassmorphism card                        │    │
│   │                                                       │    │
│   │  [Icono.helado]                                       │    │
│   │  Bienvenido de vuelta                                 │    │
│   │  Ingresa credenciales                                 │    │
│   │                                                       │    │
│   │  ┌─────────────────────────────────────────────┐     │    │
│   │  │ Correo electronico                           │     │    │
│   │  │ [MailIcon] [_______________________________] │     │    │
│   │  └─────────────────────────────────────────────┘     │    │
│   │                                                       │    │
│   │  ┌─────────────────────────────────────────────┐     │    │
│   │  │ Contrasena                                   │     │    │
│   │  │ [LockIcon] [____________________] [EyeIcon]  │     │    │
│   │  └─────────────────────────────────────────────┘     │    │
│   │                                                       │    │
│   │  [Recordarme]              [Olvidaste contrasena?]    │    │
│   │                                                       │    │
│   │  ┌─────────────────────────────────────────────┐     │    │
│   │  │      INICIAR SESION  [>]                     │     │    │
│   │  │      (btn-gradient animado)                  │     │    │
│   │  └─────────────────────────────────────────────┘     │    │
│   │                                                       │    │
│   │  Problemas? Contacta al administrador                 │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                 │
│   Problemas? Contacta al administrador                          │
│   2025 JuampyZel — Todos los derechos reservados                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Panel izquierdo (Branding)

- Gradiente animado: `bg-gradient-to-br from-primary via-secondary to-primary`
- Animación: `animate-gradient-x` (movimiento sutil del gradiente)
- Formas flotantes decorativas: `floating-shape` con `animate-float`
- Patrón de puntos: `radial-gradient` sutil
- Logo: `JuampyZel_Logo.png` con `h-56`, `animate-float`, `drop-shadow-2xl`
- Brillo detrás del logo: `animate-pulse-glow`
- Título: "JuampyZel" con `text-5xl xl:text-6xl font-extrabold drop-shadow-lg`
- Subtitulo: "La mejor experiencia en helados artesanales"
- Estrellas decorativas: `StarIcon` (5 estrellas)
- Estadisticas: 100+ Sabores, 15+ Sucursales, 50K+ Clientes
- Animaciones: `animate-slide-up` con delays escalonados

### Panel derecho (Formulario)

- Fondo: `bg-background` con decoraciones sutiles (circles blur)
- Logo movil: `h-20` solo visible en `lg:hidden`
- Icono decorativo: `IceCreamIcon` en cuadro gradiente
- Titulo: "Bienvenido de vuelta" con `text-3xl font-bold`
- Subtitulo: "Ingresa tus credenciales para acceder"

## Card Glassmorphism

La card principal utiliza efecto glassmorphism:

```text
┌──────────────────────────────────────────────┐
│  glass-card                                  │
│  background: rgba(255,255,255,0.85)          │
│  backdrop-filter: blur(20px)                 │
│  border: 1px solid rgba(255,255,255,0.5)     │
│  rounded-3xl (24px)                          │
│  shadow-xl                                   │
│  p-8                                         │
│                                              │
│  Animación entrada: animate-scale-in         │
└──────────────────────────────────────────────┘
```

Estilos CSS personalizados en `index.css`:

```css
.glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
}
```

## Botones premium

### Botón de login principal

```text
┌──────────────────────────────────────────────┐
│  btn-gradient                                │
│  background: linear-gradient(135deg,         │
│    #FF6B9A 0%, #7C5CFC 50%, #FF6B9A 100%)   │
│  background-size: 200% 200%                  │
│  animation: gradient-x 3s ease infinite      │
│                                              │
│  Hover:                                      │
│  - translateY(-2px)                          │
│  - box-shadow: 0 10px 40px primary/40        │
│                0 4px 15px secondary/30       │
│                                              │
│  Active:                                     │
│  - translateY(0)                             │
│                                              │
│  Interior:                                   │
│  [Iniciar sesion] [Icono.flecha derecha]     │
│                                              │
│  Loading:                                    │
│  [Spinner] [Iniciando sesion...]             │
└──────────────────────────────────────────────┘
```

### Botones sociales

```text
┌──────────────────────────────────────────────┐
│  [Google]              [Apple]                │
│                                              │
│  Estilo:                                     │
│  - border border-border                      │
│  - hover:border-primary/30                   │
│  - hover:bg-primary/5                        │
│  - rounded-2xl                               │
│  - Icono SVG + texto                         │
│  - group hover: texto cambia de color        │
└──────────────────────────────────────────────┘
```

## Iconos SVG (no emojis)

La pantalla de login utiliza iconos SVG inline en lugar de emojis.

### Iconos implementados

```text
Iconos de entrada:
┌──────────────────────────────┐
│  [MailIcon]  → Correo        │
│  [LockIcon]  → Contrasena   │
│  [EyeOpenIcon]  → Ojo abierto│
│  [EyeClosedIcon] → Ojo cerrado│
└──────────────────────────────┘

Iconos decorativos:
┌──────────────────────────────┐
│  [IceCreamIcon] → Helado    │
│  [StarIcon] → Estrella      │
│  [FlechaIcon] → En btn login│
└──────────────────────────────┘
```

Los iconos se definen como componentes funcionales JSX:

```jsx
const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IceCreamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.8 3.7L12 22l2.7-11.8..." />
        <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
);
```

## Campo de contraseña con toggle de visibilidad

```text
┌─────────────────────────────────────────────┐
│ Contrasena                                  │
│ [LockIcon] [____________________] [EyeIcon] │
│              ↑                      ↑        │
│              Input glass            Botón ojo│
│                              (alterna        │
│                               visibilidad)   │
└─────────────────────────────────────────────┘
```

El botón de ojo:
- Se posiciona absolutamente dentro del input (`absolute right-4`).
- Alterna entre `type="password"` y `type="text"`.
- Cambia el icono SVG según el estado (`EyeOpenIcon` / `EyeClosedIcon`).
- Estado activo: `text-primary bg-primary/10` (fondo sutil rosa).
- Estado inactivo: `text-text-secondary hover:text-primary hover:bg-primary/5`.
- Incluye `aria-label` para accesibilidad.

## Inputs Glassmorphism

Los inputs utilizan estilo glassmorphism:

```text
┌─────────────────────────────────────────────┐
│  glass-input                                │
│  background: rgba(255,255,255,0.6)          │
│  backdrop-filter: blur(10px)                │
│  border: 1px solid rgba(237,231,227,0.8)    │
│  rounded-2xl (16px)                         │
│  py-4                                       │
│                                             │
│  Focus:                                     │
│  - background: rgba(255,255,255,0.9)        │
│  - border-color: primary/50                 │
│  - box-shadow: 0 0 0 4px primary/10         │
│                0 4px 20px primary/15        │
└─────────────────────────────────────────────┘
```

- Icono izquierdo cambia de color en focus: `group-focus-within:text-primary`
- Labels reactivos al focus del input

## Animaciones

### Floating shapes (formas decorativas)

```text
.floating-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.3;
    animation: float 6s ease-in-out infinite;
}
```

Tamaños y posiciones:
- `w-96 h-96` top-20 -left-20 (delay 0s)
- `w-64 h-64` bottom-20 right-10 (delay 2s)
- `w-48 h-48` top-1/2 left-1/3 (delay 4s)
- `w-32 h-32` top-10 right-1/4 (delay 1s)
- `w-40 h-40` bottom-1/3 left-10 (delay 3s)

### Animaciones disponibles

```text
animate-float        → Movimiento flotante vertical
animate-float-slow   → Flotante lento (8s)
animate-float-slower → Flotante muy lento (10s)
animate-pulse-glow   → Brillo pulsante
animate-slide-up     → Deslizamiento hacia arriba
animate-fade-in      → Aparición gradual
animate-scale-in     → Escalado con aparición
animate-shimmer      → Efecto brillo continuo
animate-gradient-x   → Movimiento del gradiente
animate-bounce-in    → Rebote a la entrada
```

## Estilos custom en index.css

### Componentes CSS

```css
.glass-card { /* Glassmorphism card */ }
.glass-input { /* Inputs glassmorphism */ }
.btn-gradient { /* Botón gradiente animado */ }
.floating-shape { /* Formas decorativas flotantes */ }
.login-divider { /* Divisor "o continua con" */ }
```

### Utilidades CSS

```css
.text-gradient           /* Texto con gradiente */
.text-gradient-animated  /* Texto con gradiente animado */
.shadow-glow-primary     /* Sombra brillo rosa */
.shadow-glow-secondary   /* Sombra brillo violeta */
```

## Funcionalidad

- Checkbox "Recordarme"
- Link "Olvidaste tu contrasena?"
- Spinner animado en estado de carga
- Icono de flecha en botón de login

## Validación de campos

- Los campos de correo y contraseña son obligatorios.
- Mostrar mensaje de error con `animate-bounce-in`.
- El botón muestra estado de carga con spinner.

## Responsividad

- Desktop (`lg+`): Layout split 50/50 o 55/45.
- Movil: Logo arriba, card centrada, panel izquierdo oculto.
- Logo movil: `h-20` en `lg:hidden`.
- Card: `w-full max-w-md` con padding adaptativo.

---

# 15. Tarjetas

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

# 16. Botones

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

# 17. Formularios

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

# 18. Tablas

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

# 19. Estados visuales

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

# 20. Productos

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

# 21. Animaciones

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

# 22. Loading States

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

# 23. Empty States

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

# 24. Modales

Los modales deben:

* Tener fondo de superposición.
* Ser centrados.
* Tener bordes redondeados.
* Ser responsive.
* Poder cerrarse correctamente.
* Mantener una jerarquía visual clara.

No utilizar modales excesivamente grandes para acciones simples.

---

# 25. Accesibilidad

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

# 26. Imágenes

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

# 27. Arquitectura visual

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

# 28. Regla para agentes de IA

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

# 29. Regla principal de diseño

Cada pantalla debe responder visualmente a:

```text
¿Esto parece parte de JuampyZel?
```

Si una pantalla parece pertenecer a otra aplicación, debe rediseñarse para mantener la identidad visual.

La aplicación debe sentirse como un producto digital profesional y moderno de una empresa real de helados.

---

# 30. Resultado esperado

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

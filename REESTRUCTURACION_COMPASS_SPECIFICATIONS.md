# 🏗️ REESTRUCTURACIÓN ZONA-INNMUEBLE → COMPASS STYLE
## Especificaciones Técnicas y de Diseño Completas

**Fecha**: Junio 2026  
**Proyecto**: Zona INNmueble - Premium Real Estate  
**Objetivo**: Transformar el sitio actual a una arquitectura similar a Compass con navegación mejorada, búsqueda avanzada y experiencia premium

---

## 📋 TABLA DE CONTENIDOS

1. [Análisis Actual vs Compass](#análisis)
2. [Nueva Arquitectura General](#arquitectura)
3. [Navegación y Menús](#navegación)
4. [Estructura de Secciones](#secciones)
5. [Componentes UI](#componentes)
6. [Búsqueda y Filtrado](#búsqueda)
7. [Estilos Visuales](#estilos)
8. [Base de Datos/Estructura de Datos](#datos)
9. [Plan de Implementación](#plan)
10. [Diferenciación para Guatemala](#diferenciacion)

---

## 🔍 ANÁLISIS ACTUAL VS COMPASS {#análisis}

### Estado Actual de Zona INNmueble
- ✅ **Fortalezas**: Diseño elegante, colores premium, tipografía sofisticada
- ✅ **Buena estructura de propiedades** con cards de 3 columnas
- ❌ **Debilidades**: Navegación simple sin suficientes filtros
- ❌ **Sin búsqueda avanzada** combinada con filtros
- ❌ **Categorías limitadas** (no hay exclusivas, coming soon, por segmentación)
- ❌ **Sin secciones de valor agregado** (neighborhood guides, market insights)
- ❌ **Flujo de usuario básico**

### Estructura de Compass
- ✅ **Búsqueda avanzada** (Buy/Rent/Sell con filtros múltiples)
- ✅ **Categorías de propiedades**:
  - Private Exclusives
  - Coming Soon
  - Compass Listings
  - New Developments
- ✅ **Valor agregado**:
  - Neighborhood Guides
  - Market Insights
  - Mortgage Calculator
  - Compass Concierge
- ✅ **Navegación intuitiva** con submenús
- ✅ **Múltiples CTAs** estratégicamente colocados

---

## 🏗️ NUEVA ARQUITECTURA GENERAL {#arquitectura}

### Estructura de Carpetas Recomendada
```
re2/src/zona/
├── index.html                 # Página principal con hero mejorado
├── propiedades.html           # Grid de propiedades con búsqueda
├── propiedades/
│   ├── [property-name].html   # Página detalle (existente)
│   └── ...
├── exclusivas.html            # Propiedades exclusivas
├── proximas.html              # Coming soon (próximas)
├── zonas-premium.html         # Neighborhood guides adaptado
├── mercado.html               # Market insights
├── contacto.html              # Página de contacto mejorada
├── assets/
│   ├── css/
│   │   ├── variables.css      # Variables de colores y tipografía
│   │   ├── components.css     # Componentes reutilizables
│   │   ├── search.css         # Estilos para búsqueda
│   │   └── responsive.css     # Responsive
│   ├── js/
│   │   ├── search.js          # Lógica de búsqueda
│   │   ├── filters.js         # Lógica de filtros
│   │   ├── navigation.js      # Menús y navegación
│   │   └── utils.js           # Utilidades
│   └── images/
│       ├── icons/
│       └── ...
└── templates/
    ├── layout.js              # Layout principal (actualizado)
    └── components.js          # Componentes reutilizables
```

---

## 🧭 NAVEGACIÓN Y MENÚS {#navegación}

### Estructura de Navegación Principal

#### Header Sticky
```
┌─────────────────────────────────────────────────────────┐
│ ZONA INNMUEBLE    [COMPRAR] [ALQUILAR] [VENDER]   [ACC] │
│                                                          │
│ Submenu visible al hover:                               │
│ ├─ Comprar                                              │
│ │  ├─ Todas las propiedades                            │
│ │  ├─ Exclusivas (nuevas)                              │
│ │  ├─ Próximamente                                     │
│ │  └─ Por zona                                         │
│ │                                                       │
│ ├─ Alquilar                                             │
│ │  ├─ Apartamentos                                      │
│ │  └─ Casas                                             │
│ │                                                       │
│ ├─ Vender                                               │
│ │  └─ Vende con nosotros                               │
│ │                                                       │
│ └─ Más                                                  │
│    ├─ Neighborhood Guides (Zonas)                      │
│    ├─ Market Insights                                  │
│    └─ Calculadora de Inversión                         │
└─────────────────────────────────────────────────────────┘
```

#### Megamenú Desplegable (Hover)
- **Comprar section**:
  - Grid de imágenes pequeñas con cada categoría
  - Descripciones cortas
  - Links directos

- **Vender section**:
  - Información sobre el proceso
  - Link para tasación

#### Mobile Menu
- Hamburger icon (fixed)
- Overlay menu con estructura similar

---

## 📑 ESTRUCTURA DE SECCIONES {#secciones}

### 1. PÁGINA PRINCIPAL (index.html)

#### Sección Hero
```
┌─────────────────────────────────────────────────────────┐
│  [Imagen grande/video fondo con overlay]              │
│                                                          │
│  Hay propiedades que simplemente se sienten diferentes. │
│                                                          │
│  [BUSCAR POR:] [COMPRAR ○] [ALQUILAR ○] [VENDER ○]    │
│                                                          │
│  [Input: Ciudad, zona, dirección, precio...]           │
│  [Botón: Buscar] [Filtros avanzados]                   │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│  +31 PROPIEDADES | 10+ AÑOS | 5 ZONAS PREMIUM | 100%   │
└─────────────────────────────────────────────────────────┘
```

**Cambios principales vs actual**:
- ✅ Búsqueda más visual y prominente
- ✅ Radio buttons visibles para Buy/Rent/Sell
- ✅ Input único mejorado con placeholder descriptivo
- ✅ Opción para filtros avanzados
- ✅ Stats bar mejorado

#### Sección "Exclusivas"
- Carrusel de propiedades "Private Exclusives"
- Máximo 6 propiedades destacadas
- Cada card con gallery en carrusel
- Label "Exclusiva"

#### Sección "Próximamente"
- Grid de 3-4 propiedades
- Label "Próximamente"
- Info de fecha de lanzamiento si aplica
- CTA: "Expresar interés"

#### Sección "Portafolio Selectivo"
- Grid de 6 propiedades (3 columnas)
- Mezcla de Venta/Alquiler
- Link "Ver catálogo completo"

#### Sección "Tipos de Propiedades"
- 4 cards: Residencias Premium, Apartamentos, Fincas, Inversión
- Hover effect mejorado
- Descripciones cortas

#### Sección "Neighborhood Guides"
- 6 tarjetas con zonas principales
- Imagen, nombre, descripción corta
- Link "Ver zona"

#### Sección "Market Insights" (NUEVO)
- Datos del mercado actual
- Tendencias de precios
- Gráficos simples
- Link "Explorar análisis completo"

#### Sección de Contacto
- Título impactante
- Subtítulo
- CTA WhatsApp destacado
- CTA secundario

#### Footer
- Similar a actual pero mejorado
- Links adicionales a nuevas secciones
- Social media
- Copyright

---

### 2. PÁGINA DE BÚSQUEDA (propiedades.html)

#### Search Bar Sticky
```
┌─────────────────────────────────────────────────────────┐
│ [COMPRAR ○] [ALQUILAR ○]  [Input búsqueda]  [Filtros ▼] │
└─────────────────────────────────────────────────────────┘
```

#### Sección de Filtros (Sidebar o Collapsible)
```
FILTROS

Zona
  ☐ Zona 10
  ☐ Zona 14
  ☐ Zona 15
  ☐ Zona 16
  ☐ Cayalá
  ☐ Fraijanes

Tipo de Propiedad
  ☐ Casa
  ☐ Apartamento
  ☐ Finca/Terreno

Precio
  [Min: 100,000] — [Max: 5,000,000]

Habitaciones
  ○ 1+ ○ 2+ ○ 3+ ○ 4+ ○ 5+

Estado
  ☐ Venta
  ☐ Alquiler
  ☐ Nueva
  ☐ Usada

Características
  ☐ Piscina
  ☐ Jardín
  ☐ Garage
  ☐ Seguridad
  ☐ Amenidades
  ☐ Vistas

[Aplicar Filtros] [Limpiar Todos]
```

#### Grid de Propiedades
- Responsive: 4 columnas (desktop), 2 (tablet), 1 (mobile)
- Cada card con:
  - Imagen principal (con hover zoom)
  - Gallery mini (4-5 imágenes)
  - Tipo + Ubicación
  - Título
  - Meta: Hab, Baños, m²
  - Precio
  - Badge: Nueva/Usada/Exclusiva
  - Arrow hover effect

#### Contador de Resultados
- "Mostrando 1-24 de 31 propiedades"
- Opciones de ordenamiento: Relevancia, Precio (↑/↓), Fecha (nuevas)

---

### 3. PÁGINA DE EXCLUSIVAS (exclusivas.html)

#### Header
- Título: "Propiedades Exclusivas"
- Subtítulo: "Acceso privado a oportunidades selectas"
- Imagen/video de fondo premium

#### Sección de Propiedades
- Grid similar a propiedades.html
- Todas con label "Exclusiva"
- Máximo 12 propiedades
- Cada una con:
  - Carrusel de imágenes
  - "Disponible solo para clientes selectos"
  - CTA: "Solicitar detalles"

#### CTA Diferenciado
- "Únete a nuestro círculo privado"
- Form simple: Email + Interés específico

---

### 4. PÁGINA PRÓXIMAMENTE (proximas.html)

#### Secciones
- Grid de propiedades "Coming Soon"
- Badge con fecha estimada
- Info de lanzamiento
- CTA: "Recibir notificación"

---

### 5. NEIGHBORHOOD GUIDES (zonas-premium.html)

#### Estructura
- 6 cards grandes (2 columnas en desktop)
- Cada zona:
  - Imagen grande
  - Nombre
  - Estadísticas (precio promedio, propiedades, retorno)
  - Descripción
  - 5 highlights principales
  - Link "Explorar zona"

#### Dentro de cada zona (ej: zona-10.html)
- Mapa interactivo (Google Maps integrado)
- Información demográfica
- Tendencias de mercado
- Propiedades disponibles en esa zona
- Datos de rentabilidad
- Comparativa con otras zonas

---

### 6. MARKET INSIGHTS (mercado.html)

#### Secciones
- **Resumen Ejecutivo**: Estado del mercado
- **Gráficos**:
  - Precios promedio por zona
  - Tendencia de precios (últimos 12 meses)
  - Tipo de propiedades más demandadas
  - Rentabilidad por zona
- **Análisis por Tipo de Propiedad**
- **Oportunidades de Inversión**
- **Predicciones de Mercado**
- **Descargas**: Reportes en PDF

---

### 7. PÁGINA DE CONTACTO (contacto.html)

#### Secciones
- Formulario de contacto mejorado
- Chat en vivo (si es posible)
- Info de oficina (horarios, teléfono, ubicación)
- Mapa de ubicación
- Team members con fotos y info

---

### 8. DETAIL PAGE (propiedades/[property].html)

**Mantener estructura existente pero mejorar:**

#### Hero Section
- Galería mejorada:
  - Imagen principal grande
  - Thumbnails en fila (5-6)
  - Botón fullscreen
  - Conteo: "1 de 24"

#### Sidebar (derecha)
- Información de contacto más destacada
- Botón WhatsApp verde
- Botón "Agendar cita"
- "Live online" indicator
- Form de contacto simple

#### Info Cards Mejoradas
- Specs en 2 columnas
- Tags/características
- Descripción larga
- Ventajas del barrio
- Propiedades relacionadas

---

## 🔎 BÚSQUEDA Y FILTRADO {#búsqueda}

### Arquitectura de Búsqueda

#### Input Principal
```javascript
// Data que se busca:
- Nombre de propiedad
- Zona/ubicación
- Precio
- Tipo (Casa, Apartamento, Finca)
- Características
```

#### Filtros Avanzados (Modal)
```
Modal con:
- Búsqueda por dirección exacta
- Rango de precio (slider)
- Habitaciones (multiple select)
- Baños (multiple select)
- Área (slider)
- Tipo de propiedad (checkboxes)
- Zona (checkboxes)
- Amenidades (checkboxes)
- Estado (Venta/Alquiler)

[Aplicar] [Limpiar] [Guardar búsqueda]
```

#### Implementación (JavaScript)
```javascript
// search.js
// Filtrado en tiempo real
// Ordenamiento dinámico
// Historial de búsquedas (localStorage)
// URL params para compartir búsquedas
```

---

## 🎨 ESTILOS VISUALES {#estilos}

### Paleta de Colores (Mantener existente)
```css
:root {
  --ink: #0D1B3E;           /* Navy oscuro principal */
  --ink2: #142240;          /* Navy más claro */
  --ink3: #1A3060;          /* Navy aún más claro */
  --or: #F5820D;            /* Orange/Gold */
  --or2: #FF9B2E;           /* Orange más claro */
  --bl: #4A90D9;            /* Blue */
  --bl2: #6BAEE8;           /* Blue más claro */
  --wh: #fff;               /* White */
  --cream: #F0EBE1;         /* Cream */
  --sv: #8A9BB0;            /* Silver/Gray */
  --mt: #56647A;            /* Metal/Dark gray */
  --wa: #25D366;            /* WhatsApp green */
}
```

### Tipografía (Mantener)
```css
Headings: 'Cormorant Garamond', serif
Body: 'Montserrat', sans-serif
```

### Nuevos Componentes UI

#### Buttons
```css
.btn-primary        /* Orange buttons */
.btn-secondary      /* Outline buttons */
.btn-tertiary       /* Ghost buttons */
.btn-cta            /* WhatsApp green */
```

#### Cards
```css
.card-property      /* Property card mejorada */
.card-zone          /* Zone card */
.card-feature       /* Feature card */
```

#### Estados
```css
.badge-exclusive    /* Para exclusivas */
.badge-coming-soon  /* Para próximamente */
.badge-new          /* Para nuevas */
.badge-featured     /* Para destacadas */
```

#### Efectos
```css
Hover: Zoom suave + shadow
Transitions: 0.3-0.4s cubic-bezier
Scrolling: Smooth scroll behavior
Animations: Fade-in on scroll (si es necesario)
```

---

## 💾 BASE DE DATOS / ESTRUCTURA DE DATOS {#datos}

### Estructura CSV Mejorada (de Wix)

**Campos necesarios:**
```
id                    | propiedad_id
titulo                | Nombre/título completo
tipo                  | Casa / Apartamento / Finca
zona                  | Zona 10, Zona 14, Zona 15, etc.
ciudad                | Mixco, San José Pinula, etc.
precio                | 1000000
moneda                | Q / USD / EUR
estado                | Venta / Alquiler
estado_propiedad      | Nueva / Usada / Usada/Renovada
habitaciones          | 3
baños                 | 2.5
m2_construidos        | 350
m2_terreno            | 2000
amenidades            | Piscina, Jardín, Garage, ...
descripcion           | Texto largo
descripcion_corta     | Máx 150 caracteres
categoria             | Residencial / Inversión / Premium
exclusiva             | true / false
proximamente          | false / true
fecha_disponible      | YYYY-MM-DD
imagen_principal      | URL
galeria_imagenes      | URL1, URL2, URL3, ...
video_360             | URL (opcional)
coordenadas           | -14.3765, -90.5234
direccion             | Calle X, Casa Y
visitas               | 234
destacada             | true / false
fecha_publicacion     | YYYY-MM-DD
agente                | Nombre del agente
telefono_agente       | +502 XXXX-XXXX
```

### Estrutura JavaScript para Propiedades

```javascript
const property = {
  id: "sancristobal2",
  titulo: "Residencia en San Cristóbal",
  tipo: "Casa",
  zona: "Mixco",
  precio: 1440000,
  moneda: "Q",
  estado: "Venta",
  habitaciones: 2,
  baños: 2,
  m2: 2451,
  amenidades: ["Piscina", "Jardín"],
  imagenes: [...],
  descripcion: "...",
  destacada: true,
  exclusiva: false
}
```

---

## 📊 PLAN DE IMPLEMENTACIÓN {#plan}

### Fase 1: Estructura Base (Semana 1)
- [ ] Crear archivo `variables.css` con estilos compartidos
- [ ] Crear `layout.js` mejorado con navegación
- [ ] Implementar header sticky con mega-menú
- [ ] Crear componentes base (buttons, cards, badges)
- [ ] Implementar footer mejorado

### Fase 2: Página Principal (Semana 2)
- [ ] Mejorar hero section
- [ ] Implementar búsqueda mejorada
- [ ] Crear sección "Exclusivas"
- [ ] Crear sección "Próximamente"
- [ ] Agregar "Neighborhood Guides" section
- [ ] Agregar "Market Insights" teaser

### Fase 3: Páginas de Listados (Semana 3)
- [ ] Crear `propiedades.html` con filtros avanzados
- [ ] Implementar lógica de búsqueda y filtrado
- [ ] Crear `exclusivas.html`
- [ ] Crear `proximas.html`
- [ ] Crear `zonas-premium.html`

### Fase 4: Páginas de Información (Semana 4)
- [ ] Crear `mercado.html` con insights
- [ ] Crear `contacto.html` mejorado
- [ ] Mejorar detail pages
- [ ] Implementar navigation en todas las páginas

### Fase 5: Optimización y Testing (Semana 5)
- [ ] Testing responsive en todos los devices
- [ ] Optimización de performance
- [ ] SEO improvements
- [ ] Testing de búsqueda y filtros
- [ ] Deploy a Cloudflare

---

## 🇬🇹 DIFERENCIACIÓN PARA GUATEMALA {#diferenciacion}

### Elementos Locales

#### Zonas Premium (Adaptadas)
```
- Zona 10 (Capital)
- Zona 14 (Cayalá)
- Zona 15 (Anillo Periférico)
- Zona 16 (Carretera a El Salvador)
- Fraijanes (Investment Zone)
- Carretera a El Salvador
```

#### Copy Localizado
```
En lugar de: "Find your place"
Guatemala: "Encuentra tu lugar perfecto en Guatemala"

En lugar de: "Real Estate Market"
Guatemala: "Mercado Inmobiliario de Guatemala"
```

#### Precios
- Mostrar en Quetzales (Q) como moneda principal
- Opción para ver en USD
- Comparativas de precio por zona

#### Cultural Touches
- Imágenes de zonas icónicas de Guatemala
- Testimonios de clientes locales
- Blog posts sobre tendencias del mercado local
- Guías de inversión en Guatemala

#### Contacto Local
- Número de teléfono prominente
- WhatsApp como CTA principal
- Horario de atención Guatemala time
- Ubicación de oficinas

---

## 🔧 VARIABLES CSS RECOMENDADAS {#variables}

```css
/* colors */
--color-primary: #0D1B3E;
--color-primary-light: #142240;
--color-accent: #F5820D;
--color-accent-light: #FF9B2E;
--color-text: #ffffff;
--color-text-secondary: #8A9BB0;
--color-bg: #0D1B3E;
--color-border: rgba(255, 255, 255, 0.08);

/* spacing */
--sp-xs: 0.5rem;
--sp-sm: 1rem;
--sp-md: 1.5rem;
--sp-lg: 2rem;
--sp-xl: 3rem;
--sp-xxl: 4rem;

/* typography */
--font-serif: 'Cormorant Garamond', serif;
--font-sans: 'Montserrat', sans-serif;
--font-size-xs: 0.65rem;
--font-size-sm: 0.8rem;
--font-size-md: 1rem;
--font-size-lg: 1.25rem;
--font-size-xl: 2rem;

/* transitions */
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.4s ease;

/* z-index */
--z-header: 200;
--z-modal: 300;
--z-tooltip: 400;
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
Ultra-wide: > 1440px
```

### Adjustments por Breakpoint

**Mobile:**
- 1 columna para grids
- Mega menú → hamburger menu
- Filtros → modal/drawer
- Font sizes reducidos 15%

**Tablet:**
- 2 columnas para property grid
- Navigation horizontal compacta
- Sidebar filtros → top filters
- Font sizes normales

**Desktop:**
- 3-4 columnas
- Full navigation
- Sidebar filters
- Font sizes completos

---

## 🎯 MÉTRICAS DE ÉXITO

- [ ] Tiempo de carga < 3s
- [ ] Mobile score > 85 (Lighthouse)
- [ ] Desktop score > 95 (Lighthouse)
- [ ] Conversión de búsqueda: +40% vs actual
- [ ] Tiempo en sitio: +30% vs actual
- [ ] Bounce rate: -20% vs actual
- [ ] Mobile traffic: +50% vs actual

---

## 🚀 PRÓXIMOS PASOS

1. **Revisar especificaciones** con el cliente
2. **Validar estructura de datos** (CSV exports de Wix)
3. **Crear mockups/wireframes** de nuevas secciones
4. **Iniciar desarrollo** de componentes base
5. **Implementar búsqueda mejorada**
6. **Testing extensivo**

---

**Documento generado por:** Estratega de Real Estate  
**Última actualización:** Junio 4, 2026  
**Versión:** 1.0

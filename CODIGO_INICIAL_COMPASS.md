# 💻 CÓDIGO INICIAL - REESTRUCTURACIÓN COMPASS

## Archivos a Crear y Modificar

---

## 1. `variables.css` (NUEVO)

**Ubicación:** `src/zona/assets/css/variables.css`

```css
:root {
  /* ===== COLORES ===== */
  --ink: #0D1B3E;
  --ink2: #142240;
  --ink3: #1A3060;
  --or: #F5820D;
  --or2: #FF9B2E;
  --bl: #4A90D9;
  --bl2: #6BAEE8;
  --wh: #fff;
  --cream: #F0EBE1;
  --sv: #8A9BB0;
  --mt: #56647A;
  --wa: #25D366;
  --wa2: #1ebe5d;
  --bd: rgba(255, 255, 255, 0.08);
  --gl: rgba(245, 130, 13, 0.25);

  /* ===== SPACING ===== */
  --sp-xs: 0.5rem;
  --sp-sm: 1rem;
  --sp-md: 1.5rem;
  --sp-lg: 2rem;
  --sp-xl: 3rem;
  --sp-xxl: 4rem;

  /* ===== TYPOGRAPHY ===== */
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans: 'Montserrat', sans-serif;
  --fs-xs: 0.65rem;
  --fs-sm: 0.8rem;
  --fs-md: 1rem;
  --fs-lg: 1.25rem;
  --fs-xl: 2rem;
  --fs-2xl: 2.5rem;
  --fs-3xl: 3rem;

  /* ===== TRANSITIONS ===== */
  --tr-fast: 0.2s ease;
  --tr-normal: 0.3s ease;
  --tr-slow: 0.4s ease;

  /* ===== Z-INDEX ===== */
  --z-header: 200;
  --z-modal: 300;
  --z-tooltip: 400;
  --z-float: 300;
}
```

---

## 2. Actualizar `index.html` - HEADER MEJORADO

**Cambiar la sección `<nav>` en index.html:**

```html
<nav>
  <div class="nav-inner">
    <a href="/" class="logo"><em>ZONA</em>&nbsp;INNMUEBLE<sub>Real Estate</sub></a>
    
    <!-- MEGA MENU -->
    <ul class="nav-links">
      <!-- COMPRAR DROPDOWN -->
      <li class="nav-item dropdown">
        <a href="/propiedades.html" class="nav-link">Comprar</a>
        <div class="dropdown-menu">
          <div class="dropdown-grid">
            <div class="dropdown-col">
              <h4>Búsqueda</h4>
              <ul>
                <li><a href="/propiedades.html">Todas las propiedades</a></li>
                <li><a href="/propiedades.html?tipo=casa">Casas</a></li>
                <li><a href="/propiedades.html?tipo=apartamento">Apartamentos</a></li>
                <li><a href="/propiedades.html?tipo=finca">Fincas & Terrenos</a></li>
              </ul>
            </div>
            <div class="dropdown-col">
              <h4>Categorías</h4>
              <ul>
                <li><a href="/exclusivas.html">⭐ Exclusivas</a></li>
                <li><a href="/proximas.html">🔔 Próximamente</a></li>
                <li><a href="/propiedades.html?investm=true">📈 Inversión</a></li>
              </ul>
            </div>
            <div class="dropdown-col">
              <h4>Por Zona</h4>
              <ul>
                <li><a href="/propiedades.html?zona=zona10">Zona 10</a></li>
                <li><a href="/propiedades.html?zona=zona14">Zona 14 - Cayalá</a></li>
                <li><a href="/propiedades.html?zona=zona15">Zona 15</a></li>
                <li><a href="/propiedades.html?zona=zona16">Zona 16</a></li>
                <li><a href="/zonas-premium.html">Ver todas las zonas →</a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>

      <!-- ALQUILAR DROPDOWN -->
      <li class="nav-item dropdown">
        <a href="/propiedades.html?modo=alquilar" class="nav-link">Alquilar</a>
        <div class="dropdown-menu">
          <ul>
            <li><a href="/propiedades.html?modo=alquilar&tipo=apartamento">Apartamentos</a></li>
            <li><a href="/propiedades.html?modo=alquilar&tipo=casa">Casas</a></li>
          </ul>
        </div>
      </li>

      <!-- VENDER DROPDOWN -->
      <li class="nav-item dropdown">
        <a href="/contacto.html" class="nav-link">Vender</a>
        <div class="dropdown-menu">
          <ul>
            <li><a href="/contacto.html?tipo=vender">¿Deseas vender tu propiedad?</a></li>
            <li><a href="/contacto.html?tipo=tasacion">Solicitar tasación</a></li>
            <li><a href="/contacto.html?tipo=marketing">Marketing inmobiliario</a></li>
          </ul>
        </div>
      </li>

      <!-- MÁS DROPDOWN -->
      <li class="nav-item dropdown">
        <a href="#" class="nav-link">Más</a>
        <div class="dropdown-menu">
          <ul>
            <li><a href="/zonas-premium.html">Guía de Zonas Premium</a></li>
            <li><a href="/mercado.html">Market Insights</a></li>
            <li><a href="/contacto.html">Contacto</a></li>
          </ul>
        </div>
      </li>
    </ul>

    <!-- CTA BUTTON -->
    <a href="https://wa.me/50245542088?text=Hola%2C%20quiero%20asesor%C3%ADa%20de%20Zona%20INNmueble." target="_blank" rel="noopener" class="nav-cta">Asesoría</a>
  </div>
</nav>

<!-- ESTILOS PARA DROPDOWN (agregar a <style>) -->
<style>
.nav-item {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--ink2);
  border: 1px solid var(--gl);
  border-radius: 4px;
  min-width: 300px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: var(--z-header);
  padding: 20px;
  margin-top: -5px;
}

.nav-item:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 30px;
}

.dropdown-col h4 {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--or);
  margin-bottom: 12px;
}

.dropdown-col ul {
  list-style: none;
}

.dropdown-col li {
  margin-bottom: 8px;
}

.dropdown-col a {
  font-size: 0.75rem;
  color: var(--sv);
  transition: color 0.2s;
}

.dropdown-col a:hover {
  color: var(--or);
}

@media (max-width: 1024px) {
  .dropdown-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .dropdown-menu {
    min-width: 250px;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .dropdown-menu {
    display: none;
  }
}
</style>
```

---

## 3. Crear `propiedades.html` - PÁGINA CON BÚSQUEDA Y FILTROS

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Propiedades | Zona INNmueble</title>
  <meta name="description" content="Busca propiedades premium en Guatemala. Casas, apartamentos y fincas de inversión.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: #0D1B3E;
      --ink2: #142240;
      --ink3: #1A3060;
      --or: #F5820D;
      --or2: #FF9B2E;
      --sv: #8A9BB0;
      --mt: #56647A;
      --wh: #fff;
      --bd: rgba(255, 255, 255, 0.08);
      --gl: rgba(245, 130, 13, 0.25);
      --wa: #25D366;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Montserrat', sans-serif;
      background: var(--ink);
      color: var(--wh);
    }

    /* NAV */
    nav {
      position: sticky;
      top: 0;
      z-index: 200;
      background: rgba(13, 27, 62, 0.96);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--gl);
      padding: 0 6%;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 62px;
    }

    .logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      display: flex;
      align-items: baseline;
      gap: 0;
    }

    .logo em {
      font-style: normal;
      color: var(--or);
    }

    .logo sub {
      font-size: 0.48rem;
      font-weight: 400;
      letter-spacing: 0.24em;
      color: var(--sv);
      margin-left: 8px;
    }

    /* SEARCH BAR */
    .search-bar {
      background: var(--ink2);
      padding: 16px 6%;
      border-bottom: 1px solid var(--bd);
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 250px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--bd);
      color: var(--wh);
      padding: 10px 14px;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.75rem;
      outline: none;
      border-radius: 3px;
    }

    .search-input::placeholder {
      color: var(--mt);
    }

    .search-input:focus {
      border-color: var(--gl);
    }

    .btn-filter {
      background: transparent;
      border: 1px solid var(--bd);
      color: var(--sv);
      padding: 10px 16px;
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 3px;
    }

    .btn-filter:hover {
      border-color: var(--or);
      color: var(--or);
    }

    .result-count {
      font-size: 0.68rem;
      color: var(--mt);
      margin-left: auto;
    }

    /* MAIN LAYOUT */
    .container {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 0;
      min-height: 80vh;
      padding: 0;
    }

    /* SIDEBAR FILTERS */
    .sidebar {
      background: var(--ink2);
      border-right: 1px solid var(--bd);
      padding: 32px 24px;
      height: fit-content;
      position: sticky;
      top: 62px;
      overflow-y: auto;
      max-height: calc(100vh - 62px);
    }

    .filter-group {
      margin-bottom: 28px;
    }

    .filter-group h3 {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--or);
      margin-bottom: 12px;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 0.75rem;
    }

    .filter-option input[type="checkbox"],
    .filter-option input[type="radio"] {
      cursor: pointer;
      width: 16px;
      height: 16px;
      accent-color: var(--or);
    }

    .filter-option label {
      cursor: pointer;
      color: var(--sv);
      transition: color 0.2s;
    }

    .filter-option input:checked + label {
      color: var(--or);
      font-weight: 600;
    }

    .filter-option label:hover {
      color: var(--or);
    }

    .price-range {
      margin-bottom: 16px;
    }

    .price-range input[type="range"] {
      width: 100%;
      margin-bottom: 8px;
    }

    .price-display {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--sv);
    }

    .btn-clear {
      width: 100%;
      background: transparent;
      border: 1px solid var(--bd);
      color: var(--sv);
      padding: 10px;
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
      margin-top: 16px;
      transition: all 0.2s;
    }

    .btn-clear:hover {
      border-color: var(--or);
      color: var(--or);
    }

    /* GRID */
    .grid-container {
      padding: 32px;
    }

    .prop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .prop-card {
      position: relative;
      overflow: hidden;
      aspect-ratio: 4/5;
      display: block;
      cursor: pointer;
      background: var(--ink2);
      border: 1px solid var(--bd);
      border-radius: 2px;
      transition: all 0.3s;
    }

    .prop-card:hover {
      border-color: var(--or);
      transform: translateY(-4px);
    }

    .prop-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.72) saturate(0.85);
      transition: all 0.4s;
    }

    .prop-card:hover img {
      filter: brightness(0.85) saturate(1);
      transform: scale(1.05);
    }

    .pc-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(13, 27, 62, 0.95) 0%, transparent 60%);
    }

    .pc-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: var(--or);
      color: var(--ink);
      font-size: 0.54rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 2px;
    }

    .pc-info {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
    }

    .pc-tipo {
      font-size: 0.57rem;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--or);
      margin-bottom: 6px;
    }

    .pc-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      font-weight: 400;
      line-height: 1.2;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .pc-meta {
      display: flex;
      gap: 8px;
      font-size: 0.62rem;
      color: var(--sv);
      margin-bottom: 8px;
    }

    .pc-price {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--or);
      letter-spacing: 0.1em;
    }

    /* PAGINATION */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
    }

    .page-btn {
      background: var(--ink2);
      border: 1px solid var(--bd);
      color: var(--sv);
      padding: 8px 12px;
      font-size: 0.75rem;
      cursor: pointer;
      border-radius: 2px;
      transition: all 0.2s;
    }

    .page-btn:hover,
    .page-btn.active {
      background: var(--or);
      color: var(--ink);
      border-color: var(--or);
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .container {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: relative;
        top: 0;
        border-right: none;
        border-bottom: 1px solid var(--bd);
        padding: 20px;
        max-height: none;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
      }

      .prop-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        grid-template-columns: repeat(2, 1fr);
        padding: 16px;
        gap: 16px;
      }

      .prop-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 16px;
      }

      .grid-container {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .sidebar {
        grid-template-columns: 1fr;
      }

      .prop-grid {
        grid-template-columns: 1fr;
      }

      .search-bar {
        flex-direction: column;
        padding: 12px 4%;
      }

      .search-input {
        width: 100%;
      }

      .result-count {
        margin-left: 0;
      }
    }
  </style>
</head>
<body>

<!-- HEADER -->
<nav>
  <div class="nav-inner">
    <a href="/" class="logo"><em>ZONA</em>&nbsp;INNMUEBLE<sub>Real Estate</sub></a>
    <a href="https://wa.me/50245542088" target="_blank" rel="noopener" class="nav-cta">Asesoría</a>
  </div>
</nav>

<!-- SEARCH BAR -->
<div class="search-bar">
  <input type="text" id="searchInput" class="search-input" placeholder="Busca por zona, tipo, precio...">
  <button class="btn-filter" onclick="toggleFilters()">Filtros Avanzados</button>
  <span class="result-count" id="resultCount">Mostrando 31 propiedades</span>
</div>

<div class="container">
  <!-- SIDEBAR FILTERS -->
  <div class="sidebar" id="sidebar">
    <div class="filter-group">
      <h3>Tipo</h3>
      <div class="filter-option">
        <input type="checkbox" id="casa" data-filter="tipo" value="Casa">
        <label for="casa">Casa</label>
      </div>
      <div class="filter-option">
        <input type="checkbox" id="apartamento" data-filter="tipo" value="Apartamento">
        <label for="apartamento">Apartamento</label>
      </div>
      <div class="filter-option">
        <input type="checkbox" id="finca" data-filter="tipo" value="Finca">
        <label for="finca">Finca/Terreno</label>
      </div>
    </div>

    <div class="filter-group">
      <h3>Zona</h3>
      <div class="filter-option">
        <input type="checkbox" id="zona10" data-filter="zona" value="Zona 10">
        <label for="zona10">Zona 10</label>
      </div>
      <div class="filter-option">
        <input type="checkbox" id="zona14" data-filter="zona" value="Cayalá">
        <label for="zona14">Zona 14 - Cayalá</label>
      </div>
      <div class="filter-option">
        <input type="checkbox" id="zona15" data-filter="zona" value="Zona 15">
        <label for="zona15">Zona 15</label>
      </div>
      <div class="filter-option">
        <input type="checkbox" id="zona16" data-filter="zona" value="Zona 16">
        <label for="zona16">Zona 16</label>
      </div>
    </div>

    <div class="filter-group">
      <h3>Precio</h3>
      <div class="price-range">
        <input type="range" id="minPrice" data-filter="minPrice" min="0" max="5000000" value="0" step="100000">
        <input type="range" id="maxPrice" data-filter="maxPrice" min="0" max="5000000" value="5000000" step="100000">
        <div class="price-display">
          <span>Q <span id="minPriceDisplay">0</span></span>
          <span>Q <span id="maxPriceDisplay">5,000,000</span></span>
        </div>
      </div>
    </div>

    <button class="btn-clear" onclick="clearFilters()">Limpiar Filtros</button>
  </div>

  <!-- GRID -->
  <div class="grid-container">
    <div class="prop-grid" id="propGrid">
      <!-- Las propiedades se cargarán aquí con JavaScript -->
    </div>

    <div class="pagination" id="pagination">
      <!-- Pagination buttons se generarán aquí -->
    </div>
  </div>
</div>

<script>
// Datos de ejemplo (en producción, estos vendrían del CSV)
const properties = [
  {
    id: "sancristobal2",
    titulo: "El Manzanillo | Granja | Mixco",
    tipo: "Casa",
    zona: "Mixco",
    precio: 1440000,
    moneda: "Q",
    estado: "Venta",
    habitaciones: 2,
    baños: 2,
    m2: 2451,
    imagen: "https://wsrv.nl/?url=https%3A%2F%2Fstatic.wixstatic.com%2Fmedia%2F71b3d1_cbfbac3ce3084040941b5c8abef11fa7~mv2.jpeg&w=600&q=85&output=webp"
  },
  // ... Agregar todas las propiedades aquí
];

let filteredProperties = [...properties];
let currentPage = 1;
const propertiesPerPage = 24;

// Renderizar grid
function renderGrid(props) {
  const grid = document.getElementById("propGrid");
  grid.innerHTML = props.slice((currentPage - 1) * propertiesPerPage, currentPage * propertiesPerPage)
    .map(prop => `
      <a href="/propiedades/${prop.id}.html" class="prop-card">
        <img src="${prop.imagen}" alt="${prop.titulo}" loading="lazy">
        <div class="pc-overlay"></div>
        <span class="pc-badge">${prop.estado}</span>
        <div class="pc-info">
          <div class="pc-tipo">${prop.tipo} · ${prop.zona}</div>
          <div class="pc-title">${prop.titulo}</div>
          <div class="pc-meta">
            <span>${prop.habitaciones} Hab.</span>
            <span>${prop.baños} Baños</span>
            <span>${prop.m2} m²</span>
          </div>
          <div class="pc-price">${prop.moneda}. ${prop.precio.toLocaleString()}</div>
        </div>
      </a>
    `).join("");

  // Actualizar contador
  document.getElementById("resultCount").textContent = `Mostrando ${props.length} propiedades`;

  // Renderizar pagination
  renderPagination(props.length);
}

// Aplicar filtros
function applyFilters() {
  const typeChecks = document.querySelectorAll('[data-filter="tipo"]:checked');
  const zoneChecks = document.querySelectorAll('[data-filter="zona"]:checked');
  const minPrice = parseFloat(document.getElementById("minPrice").value);
  const maxPrice = parseFloat(document.getElementById("maxPrice").value);

  const types = Array.from(typeChecks).map(c => c.value);
  const zones = Array.from(zoneChecks).map(c => c.value);

  filteredProperties = properties.filter(prop => {
    const typeMatch = types.length === 0 || types.includes(prop.tipo);
    const zoneMatch = zones.length === 0 || zones.includes(prop.zona);
    const priceMatch = prop.precio >= minPrice && prop.precio <= maxPrice;
    return typeMatch && zoneMatch && priceMatch;
  });

  currentPage = 1;
  renderGrid(filteredProperties);
}

// Actualizar precios
document.getElementById("minPrice")?.addEventListener("input", (e) => {
  document.getElementById("minPriceDisplay").textContent = parseInt(e.target.value).toLocaleString();
  applyFilters();
});

document.getElementById("maxPrice")?.addEventListener("input", (e) => {
  document.getElementById("maxPriceDisplay").textContent = parseInt(e.target.value).toLocaleString();
  applyFilters();
});

// Event listeners para checkboxes
document.querySelectorAll('[data-filter]').forEach(el => {
  if (el.type === "checkbox") {
    el.addEventListener("change", applyFilters);
  }
});

// Buscar
document.getElementById("searchInput")?.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  filteredProperties = properties.filter(prop => 
    prop.titulo.toLowerCase().includes(query) ||
    prop.zona.toLowerCase().includes(query) ||
    prop.tipo.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderGrid(filteredProperties);
});

// Limpiar filtros
function clearFilters() {
  document.querySelectorAll('[type="checkbox"]:checked').forEach(cb => cb.checked = false);
  document.getElementById("minPrice").value = 0;
  document.getElementById("maxPrice").value = 5000000;
  document.getElementById("minPriceDisplay").textContent = "0";
  document.getElementById("maxPriceDisplay").textContent = "5,000,000";
  filteredProperties = [...properties];
  currentPage = 1;
  renderGrid(filteredProperties);
}

// Pagination
function renderPagination(total) {
  const totalPages = Math.ceil(total / propertiesPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderGrid(filteredProperties);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    pagination.appendChild(btn);
  }
}

// Inicializar
renderGrid(filteredProperties);
</script>

</body>
</html>
```

---

## 4. Crear `exclusivas.html` - Propiedades Premium Exclusivas

```html
<!-- Similar a propiedades.html pero con:
  - Solo propiedades con exclusiva: true
  - Título: "Propiedades Exclusivas"
  - Subtítulo: "Acceso privado a oportunidades selectas"
  - CTA diferenciado: "Solicitar detalles"
  - Filtros limitados (sin mostrar todas las opciones)
-->
```

---

## 5. Crear `zonas-premium.html` - Neighborhood Guides

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Guía de Zonas Premium | Zona INNmueble</title>
  <style>
    .zones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
      padding: 60px 6%;
    }

    .zone-card {
      position: relative;
      overflow: hidden;
      aspect-ratio: 4/5;
      cursor: pointer;
      border-radius: 4px;
    }

    .zone-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }

    .zone-card:hover img {
      transform: scale(1.08);
    }

    .zone-info {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(13,27,62,0.95) 0%, transparent 40%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 32px;
      color: white;
    }

    .zone-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      font-weight: 400;
      margin-bottom: 12px;
    }

    .zone-desc {
      font-size: 0.8rem;
      color: #8A9BB0;
      margin-bottom: 16px;
    }

    .zone-stats {
      display: flex;
      gap: 20px;
      font-size: 0.75rem;
    }

    .zone-stat {
      display: flex;
      flex-direction: column;
    }

    .zone-stat-label {
      color: #8A9BB0;
      text-transform: uppercase;
      font-size: 0.65rem;
      margin-bottom: 4px;
    }

    .zone-stat-value {
      color: #F5820D;
      font-weight: 600;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>

<!-- Agregar a HTML igual que propiedades.html, luego: -->

<div class="zones-grid" id="zonesGrid">
  <!-- Las zonas se generarán aquí con JS -->
</div>

<script>
const zones = [
  {
    id: "zona10",
    nombre: "Zona 10",
    descripcion: "Capital, vida urbana, negocios",
    precioPromedio: "3,500,000",
    propiedades: 45,
    rentabilidad: "8.5%",
    imagen: "https://via.placeholder.com/400x500"
  },
  // ... Agregar todas las zonas
];

document.getElementById("zonesGrid").innerHTML = zones.map(z => `
  <a href="/zona/${z.id}.html" class="zone-card">
    <img src="${z.imagen}" alt="${z.nombre}">
    <div class="zone-info">
      <div class="zone-name">${z.nombre}</div>
      <div class="zone-desc">${z.descripcion}</div>
      <div class="zone-stats">
        <div class="zone-stat">
          <span class="zone-stat-label">Promedio</span>
          <span class="zone-stat-value">Q. ${z.precioPromedio}</span>
        </div>
        <div class="zone-stat">
          <span class="zone-stat-label">Propiedades</span>
          <span class="zone-stat-value">${z.propiedades}</span>
        </div>
        <div class="zone-stat">
          <span class="zone-stat-label">Rentabilidad</span>
          <span class="zone-stat-value">${z.rentabilidad}</span>
        </div>
      </div>
    </div>
  </a>
`).join("");
</script>

</body>
</html>
```

---

## 6. Crear `mercado.html` - Market Insights

```html
<!-- Sección con datos actuales del mercado:
  - Gráficos de tendencias (Charts.js)
  - Precios promedio por zona
  - Análisis de inversión
  - Reporte descargable
-->
```

---

## 📝 PRÓXIMOS PASOS

1. **Copiar** el código anterior a tus archivos
2. **Importar** datos reales de propiedades desde CSV
3. **Ajustar** imágenes y URLs
4. **Testear** responsiveness
5. **Optimizar** performance
6. **Deploy** a Cloudflare Pages

---

## 🔗 REFERENCIAS Y RECURSOS

- **Compass Navigation**: Inspiración en mega-menús
- **Google Fonts**: Cormorant Garamond + Montserrat
- **Charts.js**: Para gráficos de market insights
- **Google Maps API**: Para mapas interactivos

---

**Actualizado:** Junio 4, 2026

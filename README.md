# Real Estate Sites — Dual Static Generator

Generates **two production-ready websites** from one Wix CSV export.

| Site | Domain | Purpose |
|------|--------|---------|
| Vinculo Inmobiliario | vinculoinmobiliario.com | SEO portal · no contact info |
| Zona INNmueble       | zona-innmueble.com      | Lead-gen · WhatsApp CTAs    |

---

## Quick Start

```bash
git clone YOUR_REPO && cd real-estate-sites
npm install
npm run build          # builds both sites
# outputs: dist/vinculo/  and  dist/zona/
```

---

## Update Properties

1. Export CSV from Wix CMS
2. Replace `data/propiedades.csv`
3. `git add data/propiedades.csv && git commit -m "Update properties" && git push`
4. Both Netlify sites rebuild automatically in ~60 seconds ✅

---

## Netlify Deployment (Two Sites, One Repo)

### Site 1 — vinculoinmobiliario.com
| Setting | Value |
|---------|-------|
| Build command | `npm install && npm run build:vinculo` |
| Publish dir   | `dist/vinculo` |

### Site 2 — zona-innmueble.com
| Setting | Value |
|---------|-------|
| Build command | `npm install && npm run build:zona` |
| Publish dir   | `dist/zona` |

---

## Tracking IDs (Zona INNmueble)

Edit `src/zona/templates/layout.js` and replace:
- `TU_META_PIXEL_ID` → your Meta Pixel ID
- `G-XXXXXXXXXX` → your GA4 Measurement ID

Or use Netlify Environment Variables and pass them in `build.js`.

---

## CSV Column Mapping (Wix Format)

| Wix Column | Used As |
|-----------|---------|
| `Titulo` | Property title |
| `Propiedades (Item)` | URL slug |
| `Imagen` | Main photo (wix:image URI → CDN) |
| `Gallery` | Photo gallery JSON |
| `Description` | Rich text → plain text |
| `Tipo de propiedad` | Casa / Apartamento / Fincas / Terreno |
| `Cinta` | Badge: Venta / Renta / Nueva / Usada |
| `Estado` | Condition: Usada / Nueva / Para habitar |
| `Precio` | Price string (Q. / $) |
| `Municipio` | City |
| `Departamento` | Department |
| `Numero de Dormitorios` | Bedrooms |
| `Numero de Baños` | Bathrooms |
| `Garaje` | Parking (Si/No/number) |
| `Area de Construccion` | Construction m² |
| `Codigo Inmueble` | Reference code |
| `Status` (last column) | `PUBLISHED` = show on site |

**Only `PUBLISHED` rows are included in the build.**

---

## Wix URL Redirects

Old Wix URLs (`/propiedades-1/slug`) are automatically redirected to new URLs via `_redirects`. No broken links after migration.

---

## Build Commands

| Command | Action |
|---------|--------|
| `npm run build` | Build both sites |
| `npm run build:vinculo` | Vinculo only |
| `npm run build:zona` | Zona only |
| `npm run dev:vinculo` | Build + serve on :3001 |
| `npm run dev:zona` | Build + serve on :3002 |

---

## Project Structure

```
real-estate-sites/
├── data/
│   └── propiedades.csv       ← Wix CSV export (source of truth)
├── src/
│   ├── shared/
│   │   ├── parse-csv.js      ← Wix CSV parser + image URL converter
│   │   └── utils.js          ← Sitemap, robots, redirects, helpers
│   ├── vinculo/
│   │   ├── templates/
│   │   │   ├── layout.js     ← White editorial HTML shell
│   │   │   ├── card.js       ← Property card component
│   │   │   └── pages.js      ← index + catalog + detail pages
│   │   └── build.js
│   └── zona/
│       ├── templates/
│       │   ├── layout.js     ← Dark navy HTML shell + tracking
│       │   └── pages.js      ← index + catalog + detail + WA CTAs
│       └── build.js
├── dist/
│   ├── vinculo/              ← vinculoinmobiliario.com output
│   └── zona/                 ← zona-innmueble.com output
├── netlify.toml
├── package.json
└── README.md
```
# WEBS
# realestate
# realestate

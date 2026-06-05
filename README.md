# Real Estate Sites â Dual Static Generator

Generates **two production-ready websites** from one Wix CSV export.

| Site | Domain | Purpose |
|------|--------|---------|
| Vinculo Inmobiliario | vinculoinmobiliario.com | SEO portal Â· no contact info |
| Zona INNmueble       | zona-innmueble.com      | Lead-gen Â· WhatsApp CTAs    |

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
4. Both Netlify sites rebuild automatically in ~60 seconds â

---

## Netlify Deployment (Two Sites, One Repo)

### Site 1 â vinculoinmobiliario.com
| Setting | Value |
|---------|-------|
| Build command | `npm install && npm run build:vinculo` |
| Publish dir   | `dist/vinculo` |

### Site 2 â zona-innmueble.com
| Setting | Value |
|---------|-------|
| Build command | `npm install && npm run build:zona` |
| Publish dir   | `dist/zona` |

---

## Tracking IDs (Zona INNmueble)

Edit `src/zona/templates/layout.js` and replace:
- `TU_META_PIXEL_ID` â your Meta Pixel ID
- `G-XXXXXXXXXX` â your GA4 Measurement ID

Or use Netlify Environment Variables and pass them in `build.js`.

---

## CSV Column Mapping (Wix Format)

| Wix Column | Used As |
|-----------|---------|
| `Titulo` | Property title |
| `Propiedades (Item)` | URL slug |
| `Imagen` | Main photo (wix:image URI â CDN) |
| `Gallery` | Photo gallery JSON |
| `Description` | Rich text â plain text |
| `Tipo de propiedad` | Casa / Apartamento / Fincas / Terreno |
| `Cinta` | Badge: Venta / Renta / Nueva / Usada |
| `Estado` | Condition: Usada / Nueva / Para habitar |
| `Precio` | Price string (Q. / $) |
| `Municipio` | City |
| `Departamento` | Department |
| `Numero de Dormitorios` | Bedrooms |
| `Numero de BaÃ±os` | Bathrooms |
| `Garaje` | Parking (Si/No/number) |
| `Area de Construccion` | Construction mÂ² |
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
âââ data/
â   âââ propiedades.csv       â Wix CSV export (source of truth)
âââ src/
â   âââ shared/
â   â   âââ parse-csv.js      â Wix CSV parser + image URL converter
â   â   âââ utils.js          â Sitemap, robots, redirects, helpers
â   âââ vinculo/
â   â   âââ templates/
â   â   â   âââ layout.js     â White editorial HTML shell
â   â   â   âââ card.js       â Property card component
â   â   â   âââ pages.js      â index + catalog + detail pages
â   â   âââ build.js
â   âââ zona/
â       âââ templates/
â       â   âââ layout.js     â Dark navy HTML shell + tracking
â       â   âââ pages.js      â index + catalog + detail + WA CTAs
â       âââ build.js
âââ dist/
â   âââ vinculo/              â vinculoinmobiliario.com output
â   âââ zona/                 â zona-innmueble.com output
âââ netlify.toml
âââ package.json
âââ README.md
```

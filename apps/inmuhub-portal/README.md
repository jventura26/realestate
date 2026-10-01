# inmuhub — portal inmobiliario curado

Worker de Cloudflare independiente (no toca `zona-inmu` ni el sitio estático actual).
Renderiza las páginas en el servidor (buenas vistas previas en Meta y WhatsApp) y usa D1 como base de datos.

## Qué incluye

| Ruta | Qué hace |
|---|---|
| `/` | Home: buscador, herramienta "¿Cuánto vale su zona?", propiedades destacadas |
| `/propiedades` | Listado con filtros por zona, tipo y operación |
| `/propiedad/:slug` | Ficha con lectura de valor, formulario corto y botón fijo de WhatsApp en móvil |
| `/valor?zona=&tipo=` | Rango de valor por m² (casas, apartamentos) o vara² (terrenos) |
| `/planes` | Planes para inmobiliarias + formulario de contacto |
| `/publicar` | Propietarios envían su propiedad a revisión |
| `/admin` | Aprobar, rechazar, verificar, destacar y ver consultas |
| `/api/propiedades`, `/api/valor` | JSON público (sin datos de contacto) |

**Lectura de valor:** se calcula con las propiedades publicadas de la misma zona y tipo.
El rango es P25–P75 del precio por m² y solo se muestra con al menos `MIN_COMPARABLES` (5) comparables.

**Consultas:** cada formulario guarda el lead en D1 (con UTM de la campaña), lo reenvía a Zona-CRM si
`CRM_WEBHOOK_URL` está configurado, y lleva a la persona a WhatsApp con un mensaje ya escrito.

**Privacidad:** el importador descarta `precioReal`, `contactoVendedor`, `notasInternas` y `estadoLegal`.
Los datos del propietario que publica nunca aparecen en páginas ni en el API.

## Desarrollo local

```bash
cd apps/inmuhub-portal
npm install
cp .dev.vars.example .dev.vars   # y ajuste ADMIN_TOKEN
npm run db:local                 # crea tablas, zonas e inventario inicial
npm run dev                      # http://localhost:8787
npm test
```

## Publicar en inmuhub.com

La base de datos D1 `inmuhub` ya existe en la cuenta y su `database_id` está en `wrangler.toml`.
En Windows basta con doble clic en **`publicar-portal.bat`**, que:

1. instala dependencias,
2. crea las tablas y carga el inventario en D1 (`wrangler d1 migrations apply inmuhub --remote`),
3. publica el Worker con las rutas `inmuhub.com/*` y `www.inmuhub.com/*`,
4. ofrece crear la clave de `/admin` (`wrangler secret put ADMIN_TOKEN`).

**Cómo convive con el sitio actual:** el Worker funciona como ruta delante del proyecto Pages
`realestateinmuhub`. El portal atiende sus rutas; todo lo demás (blog, herramientas, asesores, zonas)
se sirve desde el sitio actual (`LEGACY_ORIGIN`) sin cambios. Las URLs viejas `/propiedades/<slug>(.html)`
redirigen con 301 a `/propiedad/<slug>`, y `www.inmuhub.com` redirige a `inmuhub.com`.
El `sitemap.xml` combina las páginas del portal y las del sitio anterior.

**Revertir:** `revertir-portal.bat` borra el Worker y sus rutas; inmuhub.com vuelve al sitio anterior
en un par de minutos. No toca DNS, Pages ni la base de datos.

Opcionales: `npx wrangler secret put CRM_WEBHOOK_URL` para reenviar leads a Zona-CRM y
`META_PIXEL_ID` en `[vars]` para el Pixel (PageView y Lead al enviar formularios).

## Inventario y consultas

El inventario vive en Cloudflare D1. La carga inicial salió de `data/propiedades.json` con
`scripts/import-wix-json.mjs` (migración 0003); desde ahora las propiedades se administran en `/admin`.

Todas las consultas por WhatsApp llegan a Zona-INNmueble (`agencies.whatsapp`, migración 0004).
Una propiedad solo se envía a otro número si se le asigna un asesor propio en la tabla `agents`.

Cambios de datos: siempre con una migración nueva (0005, 0006…), nunca editando las anteriores.

## Proyectos nuevos y desarrolladoras

- `/proyectos` y `/proyecto/:slug`: proyectos en preventa, construcción o entrega inmediata, con tipologías,
  enganche, avance y lectura de precio por m² frente a la oferta publicada de su zona.
- `/comparar?p=a,b,c`: comparador de hasta 3 proyectos (la selección se guarda en el navegador, `public/compare.js`).
- `/zona/:slug`: guía de zona con rangos de valor, proyectos y propiedades.
- `/desarrolladoras`: planes por proyecto, oferta de lanzamiento y guía gratuita
  (`public/recursos/guia-desarrolladoras-inmuhub.pdf`). Precios y oferta en `DEVELOPER_PLANS` y `LAUNCH_OFFER`
  (`src/views-projects.js`).
- Panel: `/admin/proyectos` (proyectos, desarrolladoras, imágenes) y `/admin/proyecto/:id/reporte`
  (reporte mensual imprimible de visitas y consultas para la desarrolladora).
- Las consultas de un proyecto van al WhatsApp de la sala de ventas de su desarrolladora (o al de inmuhub si no tiene).

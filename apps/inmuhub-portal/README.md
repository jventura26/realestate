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

## Publicar en Cloudflare

```bash
npx wrangler login
npx wrangler d1 create inmuhub          # copie el database_id en wrangler.toml
npm run db:remote
npx wrangler secret put ADMIN_TOKEN     # clave larga para /admin
npx wrangler secret put CRM_WEBHOOK_URL # opcional
# En wrangler.toml: WHATSAPP_DEFAULT con el número del portal
npm run deploy                          # queda en inmuhub-portal.<cuenta>.workers.dev
```

Para servirlo en `inmuhub.com`, agregue la ruta o el dominio personalizado al Worker en Cloudflare.
Ese paso reemplaza el sitio actual de inmuhub.com: hágalo cuando el portal esté aprobado.

Opcional: `META_PIXEL_ID` en `[vars]` activa el Pixel (PageView y Lead al enviar formularios).

## Actualizar el inventario desde Wix

```bash
npm run seed:build   # regenera migrations/0003_seed_inventario.sql desde data/propiedades.json
```

Para cargas posteriores conviene una migración nueva (0004, 0005…) en lugar de editar la 0003.

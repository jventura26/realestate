-- inmuhub portal — esquema inicial (Cloudflare D1 / SQLite)

CREATE TABLE zones (
  slug        TEXT PRIMARY KEY,           -- 'zona-15', 'carretera-el-salvador'
  name        TEXT NOT NULL,              -- 'Zona 15'
  featured    INTEGER NOT NULL DEFAULT 0, -- aparece en los chips de la home
  sort_order  INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE agencies (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  whatsapp    TEXT,                       -- número por defecto para consultas
  plan        TEXT NOT NULL DEFAULT 'asesor' CHECK (plan IN ('asesor','agencia','agencia_pro','propietario')),
  verified    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE agents (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_id   INTEGER REFERENCES agencies(id),
  name        TEXT NOT NULL,
  whatsapp    TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE properties (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'revision' CHECK (status IN ('revision','publicada','rechazada','pausada','vendida')),
  verified        INTEGER NOT NULL DEFAULT 0,  -- sello "Verificada" (revisión documental)
  operation       TEXT NOT NULL DEFAULT 'venta' CHECK (operation IN ('venta','renta','venta_renta')),
  type            TEXT NOT NULL CHECK (type IN ('casa','apartamento','terreno','finca','local','oficina','otro')),
  zone_slug       TEXT REFERENCES zones(slug),
  location_label  TEXT,                        -- 'Vista Hermosa 3', 'Km 16.5'
  municipality    TEXT,
  price_amount    REAL,                        -- precio en su moneda original
  currency        TEXT NOT NULL DEFAULT 'GTQ' CHECK (currency IN ('GTQ','USD')),
  price_gtq       REAL,                        -- normalizado para comparar
  area_built_m2   REAL,
  area_land_v2    REAL,                        -- varas cuadradas
  bedrooms        INTEGER,
  bathrooms       REAL,
  parking         INTEGER,
  levels          INTEGER,
  description     TEXT,
  features        TEXT,                        -- JSON array de strings
  images          TEXT,                        -- JSON array de URLs
  tour_url        TEXT,
  video_url       TEXT,
  lat             REAL,
  lng             REAL,
  agency_id       INTEGER REFERENCES agencies(id),
  agent_id        INTEGER REFERENCES agents(id),
  -- datos de contacto del propietario que publica (nunca se muestran en público)
  owner_name      TEXT,
  owner_whatsapp  TEXT,
  owner_email     TEXT,
  review_notes    TEXT,                        -- motivo de rechazo o correcciones pedidas
  featured_until  TEXT,                        -- destacada hasta (ISO)
  source          TEXT NOT NULL DEFAULT 'portal', -- 'import-wix', 'portal', 'admin'
  source_ref      TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  published_at    TEXT,
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_properties_public ON properties (status, zone_slug, type);
CREATE INDEX idx_properties_featured ON properties (status, featured_until);

CREATE TABLE leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id   INTEGER REFERENCES properties(id),
  zone_slug     TEXT,                       -- leads del buscador de valor por zona
  kind          TEXT NOT NULL CHECK (kind IN ('propiedad','valor_zona','publicar','plan')),
  name          TEXT,
  whatsapp      TEXT NOT NULL,
  intent        TEXT,                       -- 'vivir' | 'invertir' | plan elegido
  message       TEXT,
  utm_source    TEXT,
  utm_campaign  TEXT,
  utm_content   TEXT,
  crm_synced    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_leads_created ON leads (created_at);

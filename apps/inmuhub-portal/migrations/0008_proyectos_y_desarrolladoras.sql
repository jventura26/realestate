-- Proyectos nuevos (preventa, construcción, entrega inmediata) y las desarrolladoras que los publican.

CREATE TABLE developers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  contact_name  TEXT,                        -- persona de contacto (no se publica)
  whatsapp      TEXT,                        -- sala de ventas: recibe las consultas de sus proyectos
  email         TEXT,
  website       TEXT,
  plan          TEXT NOT NULL DEFAULT 'prueba' CHECK (plan IN ('prueba','proyecto','destacado','pausado')),
  trial_until   TEXT,                        -- fin del periodo sin costo (ISO)
  notes         TEXT,                        -- notas internas
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE projects (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador','publicado','pausado','vendido')),
  developer_id     INTEGER REFERENCES developers(id),
  kind             TEXT NOT NULL DEFAULT 'apartamentos' CHECK (kind IN ('apartamentos','casas','lotes','oficinas','mixto')),
  stage            TEXT NOT NULL DEFAULT 'preventa' CHECK (stage IN ('preventa','construccion','entrega')),
  delivery         TEXT,                     -- texto libre: 'Segundo semestre 2028'
  zone_slug        TEXT REFERENCES zones(slug),
  location_label   TEXT,
  currency         TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('GTQ','USD')),
  price_from       REAL,                     -- en la moneda del proyecto
  price_from_gtq   REAL,                     -- normalizado para ordenar y comparar
  m2_from          REAL,
  m2_to            REAL,
  bedrooms_min     INTEGER,
  bedrooms_max     INTEGER,
  units_total      INTEGER,
  units_available  INTEGER,
  down_payment     TEXT,                     -- 'Enganche desde 10 %, en 24 cuotas'
  typologies       TEXT NOT NULL DEFAULT '[]', -- JSON [{name, bedrooms, bathrooms, m2, price}]
  amenities        TEXT NOT NULL DEFAULT '[]', -- JSON de textos
  description      TEXT,
  images           TEXT NOT NULL DEFAULT '[]',
  tour_url         TEXT,
  video_url        TEXT,
  brochure_url     TEXT,
  contact_mode     TEXT NOT NULL DEFAULT 'whatsapp' CHECK (contact_mode IN ('whatsapp','formulario','ninguno')),
  featured_until   TEXT,
  published_at     TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_projects_public ON projects (status, zone_slug, kind);

-- Visitas diarias por ficha de proyecto (para el reporte mensual a la desarrolladora).
CREATE TABLE project_views (
  project_id  INTEGER NOT NULL REFERENCES projects(id),
  day         TEXT NOT NULL,                 -- 'YYYY-MM-DD'
  views       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, day)
);

-- Consultas: se agregan los tipos 'proyecto' y 'desarrolladora' y el vínculo al proyecto.
-- SQLite no permite cambiar un CHECK, así que la tabla se reconstruye conservando los datos.
CREATE TABLE leads_v2 (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id   INTEGER REFERENCES properties(id),
  project_id    INTEGER REFERENCES projects(id),
  zone_slug     TEXT,
  kind          TEXT NOT NULL CHECK (kind IN ('propiedad','valor_zona','publicar','plan','proyecto','desarrolladora')),
  name          TEXT,
  whatsapp      TEXT NOT NULL,
  intent        TEXT,
  message       TEXT,
  utm_source    TEXT,
  utm_campaign  TEXT,
  utm_content   TEXT,
  crm_synced    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO leads_v2 (id, property_id, zone_slug, kind, name, whatsapp, intent, message, utm_source, utm_campaign, utm_content, crm_synced, created_at)
  SELECT id, property_id, zone_slug, kind, name, whatsapp, intent, message, utm_source, utm_campaign, utm_content, crm_synced, created_at FROM leads;

DROP TABLE leads;
ALTER TABLE leads_v2 RENAME TO leads;
CREATE INDEX idx_leads_created ON leads (created_at);
CREATE INDEX idx_leads_project ON leads (project_id, created_at);

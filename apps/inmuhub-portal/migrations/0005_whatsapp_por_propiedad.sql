-- WhatsApp por propiedad: las 25 propiedades de la carga inicial no muestran WhatsApp;
-- sus consultas se guardan en /admin y un asesor contacta a la persona.
ALTER TABLE properties ADD COLUMN whatsapp_enabled INTEGER NOT NULL DEFAULT 1;
UPDATE properties SET whatsapp_enabled = 0 WHERE source = 'import-wix';

-- Ajustes del sitio editables desde /admin (por ejemplo, la foto de portada de la home).
CREATE TABLE settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

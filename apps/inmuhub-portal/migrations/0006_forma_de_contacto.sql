-- Forma de contacto por propiedad: 'whatsapp' (formulario que abre WhatsApp), 'formulario'
-- (la consulta solo se guarda en /admin) o 'ninguno' (ficha informativa, sin contacto).
-- Las 25 propiedades de la carga inicial quedan como 'ninguno'.
ALTER TABLE properties ADD COLUMN contact_mode TEXT NOT NULL DEFAULT 'whatsapp'
  CHECK (contact_mode IN ('whatsapp', 'formulario', 'ninguno'));
UPDATE properties SET contact_mode = CASE WHEN whatsapp_enabled = 0 THEN 'ninguno' ELSE 'whatsapp' END;

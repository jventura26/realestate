-- Traslado a Zona 10 medido por inmuhub (minutos). Si no hay medición, la ficha muestra un estimado.
ALTER TABLE properties ADD COLUMN commute_valle_min INTEGER;
ALTER TABLE properties ADD COLUMN commute_pico_min INTEGER;
ALTER TABLE properties ADD COLUMN commute_measured_at TEXT;

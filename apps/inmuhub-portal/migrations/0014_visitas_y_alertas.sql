-- Visitas diarias por ficha (para el panel del propietario o asesor).
CREATE TABLE property_views (
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  day         TEXT NOT NULL,
  views       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (property_id, day)
);

-- Búsquedas guardadas por compradores y propiedades que coinciden con ellas.
CREATE TABLE saved_searches (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id  INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  zone_slug   TEXT,
  type        TEXT,
  operation   TEXT,
  budget_usd  INTEGER,
  max_price_gtq INTEGER,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_saved_searches_account ON saved_searches(account_id);

CREATE TABLE search_matches (
  search_id   INTEGER NOT NULL REFERENCES saved_searches(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  emailed_at  TEXT,
  sent_wa_at  TEXT,
  seen_at     TEXT,
  PRIMARY KEY (search_id, property_id)
);

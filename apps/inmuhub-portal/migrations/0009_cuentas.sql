-- Cuentas de propietarios y asesores, sesiones e intentos de ingreso.

CREATE TABLE accounts (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  role           TEXT NOT NULL CHECK (role IN ('propietario','asesor')),
  status         TEXT NOT NULL DEFAULT 'activa' CHECK (status IN ('activa','pendiente','suspendida')),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE COLLATE NOCASE,
  whatsapp       TEXT,
  company        TEXT,                      -- inmobiliaria o marca del asesor
  password_hash  TEXT NOT NULL,             -- pbkdf2$<iteraciones>$<sal hex>$<hash hex>
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at  TEXT
);

CREATE TABLE sessions (
  token_hash   TEXT PRIMARY KEY,            -- sha256 del token de la cookie; el token nunca se guarda
  account_id   INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  expires_at   TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_sessions_account ON sessions (account_id);

CREATE TABLE login_attempts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL COLLATE NOCASE,
  ip          TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_login_attempts ON login_attempts (email, created_at);

ALTER TABLE properties ADD COLUMN account_id INTEGER REFERENCES accounts(id);
CREATE INDEX idx_properties_account ON properties (account_id);

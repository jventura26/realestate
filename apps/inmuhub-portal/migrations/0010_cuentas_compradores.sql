-- Cuentas de comprador: amplía el CHECK de accounts.role.
-- SQLite no permite modificar un CHECK, así que se recrea la tabla conservando los datos.
PRAGMA defer_foreign_keys = true;

CREATE TABLE accounts_v2 (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  role           TEXT NOT NULL CHECK (role IN ('comprador','propietario','asesor')),
  status         TEXT NOT NULL DEFAULT 'activa' CHECK (status IN ('activa','pendiente','suspendida')),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE COLLATE NOCASE,
  whatsapp       TEXT,
  company        TEXT,
  password_hash  TEXT NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at  TEXT
);

INSERT INTO accounts_v2 (id, role, status, name, email, whatsapp, company, password_hash, created_at, last_login_at)
  SELECT id, role, status, name, email, whatsapp, company, password_hash, created_at, last_login_at FROM accounts;

DROP TABLE accounts;
ALTER TABLE accounts_v2 RENAME TO accounts;

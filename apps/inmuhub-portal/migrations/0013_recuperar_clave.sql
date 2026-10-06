-- Enlaces de un solo uso para crear una nueva contraseña (vigencia de 1 hora). Solo se guarda el sha256 del token.
CREATE TABLE password_resets (
  token_hash  TEXT PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at  TEXT NOT NULL,
  used_at     TEXT,
  via         TEXT NOT NULL DEFAULT 'correo'   -- correo | admin | solicitud
);
CREATE INDEX idx_password_resets_account ON password_resets(account_id, created_at);

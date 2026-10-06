-- Personas registradas que vieron los precios de un proyecto, y propiedades favoritas.

CREATE TABLE project_unlocks (
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  account_id  INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (project_id, account_id)
);

CREATE TABLE favorites (
  account_id   INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  property_id  INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (account_id, property_id)
);

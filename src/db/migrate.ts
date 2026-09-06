// src/db/migrate.ts
import { db } from './db';

function getColumns(table: string): string[] {
  const rows = db.getAllSync<{ name: string }>(`PRAGMA table_info(${table});`);
  return rows.map((r) => r.name);
}

function addColumnIfMissing(table: string, column: string, sql: string) {
  const cols = getColumns(table);
  if (cols.includes(column)) return;
  db.execSync(sql);
}

export function migrate() {
  db.execSync(`CREATE TABLE IF NOT EXISTS project_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL,

  started_at TEXT NOT NULL,
  ended_at TEXT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,

  note TEXT NULL,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_sessions_project_id_started_at
ON project_sessions(project_id, started_at);

CREATE INDEX IF NOT EXISTS idx_project_sessions_project_id_deleted_at
ON project_sessions(project_id, deleted_at);
`);
  db.execSync(`
  CREATE TABLE IF NOT EXISTS project_progress_pics (
    id TEXT PRIMARY KEY NOT NULL,
    project_id TEXT NOT NULL,
    photo_json TEXT NOT NULL,
    note TEXT NULL,
    taken_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT NULL
  );
`);

  db.execSync(`
  CREATE INDEX IF NOT EXISTS idx_progress_pics_project_id_taken_at
  ON project_progress_pics(project_id, taken_at);
`);

  db.execSync(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY NOT NULL,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    due_date TEXT,
    project_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
  );
`);
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY NOT NULL,
      craft TEXT NOT NULL,
      name TEXT NOT NULL,
      tags_json TEXT NOT NULL,
      pattern_link TEXT,

      -- (newer fields will be added via ALTER below)
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    );
  `);

  // Add columns safely (works even if table already existed)
  addColumnIfMissing(
    'projects',
    'tools',
    `ALTER TABLE projects ADD COLUMN tools TEXT;`
  );
  addColumnIfMissing(
    'projects',
    'yarn_id',
    `ALTER TABLE projects ADD COLUMN yarn_id TEXT;`
  );

  // skeins should be numeric in DB (better than TEXT)
  addColumnIfMissing(
    'projects',
    'skeins',
    `ALTER TABLE projects ADD COLUMN skeins INTEGER;`
  );

  addColumnIfMissing(
    'projects',
    'start_date',
    `ALTER TABLE projects ADD COLUMN start_date TEXT;`
  );
  addColumnIfMissing(
    'projects',
    'end_date',
    `ALTER TABLE projects ADD COLUMN end_date TEXT;`
  );
  addColumnIfMissing(
    'projects',
    'target_measurement',
    `ALTER TABLE projects ADD COLUMN target_measurement TEXT;`
  );

  // Photos (NOT NULL needs a DEFAULT for existing rows)
  addColumnIfMissing(
    'projects',
    'photos_json',
    `ALTER TABLE projects ADD COLUMN photos_json TEXT NOT NULL DEFAULT '[]';`
  );

  // Pattern PDF ref stored as JSON (can be null)
  addColumnIfMissing(
    'projects',
    'pattern_file_json',
    `ALTER TABLE projects ADD COLUMN pattern_file_json TEXT;`
  );
}

// src/db/projectsRepo.ts
import { db } from './db';

export type Craft = 'knitting' | 'crochet';

export type PhotoRef = {
  id: string; // uuid for list keys
  uri: string; // file://... or https://...
  mimeType?: string;
  width?: number;
  height?: number;
};

// Store files as simple refs too (same shape works for pdf + photos)
export type FileRef = {
  uri: string; // file://... or https://...
  name?: string; // "pattern.pdf"
  mimeType?: string; // "application/pdf"
  size?: number; // bytes
};

export type Project = {
  id: string;
  craft: Craft;

  name: string;
  tags: string[];

  // pattern
  patternFile?: FileRef | null; // PDF
  patternLink?: string | null;

  // materials
  yarnId?: string | null; // or yarn name if you prefer; keep as id for now
  tools?: string | null;
  skeins?: number | null;

  // plan
  startDate?: string | null; // ISO string
  endDate?: string | null; // ISO string
  targetMeasurement?: string | null;

  // photos
  photos: PhotoRef[];

  createdAt: string;
  updatedAt: string;
};

const now = () => new Date().toISOString();

export function createProject(p: {
  id: string;
  craft: Craft;

  name: string;
  tags: string[];

  patternFile?: FileRef | null;
  patternLink?: string | null;

  yarnId?: string | null;
  tools?: string | null;
  skeins?: number | null;

  startDate?: Date | null;
  endDate?: Date | null;
  targetMeasurement?: string | null;

  photos?: PhotoRef[];
}) {
  const t = now();

  db.runSync(
    `INSERT INTO projects (
      id, craft, name, tags_json,
      pattern_file_json, pattern_link,
      yarn_id, tools, skeins,
      start_date, end_date, target_measurement,
      photos_json,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.id,
      p.craft,
      p.name,
      JSON.stringify(p.tags ?? []),

      JSON.stringify(p.patternFile ?? null),
      p.patternLink ?? null,

      p.yarnId ?? null,
      p.tools ?? null,
      p.skeins ?? null,

      p.startDate ? p.startDate.toISOString() : null,
      p.endDate ? p.endDate.toISOString() : null,
      p.targetMeasurement ?? null,

      JSON.stringify(p.photos ?? []),

      t,
      t,
    ]
  );
}

export function listProjects(): Project[] {
  const rows = db.getAllSync<any>(
    `SELECT * FROM projects
     WHERE deleted_at IS NULL
     ORDER BY updated_at DESC`
  );
  return rows.map(mapProject);
}

export function getProject(id: string): Project | null {
  const row = db.getFirstSync<any>(
    `SELECT * FROM projects WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );
  return row ? mapProject(row) : null;
}

export function updateProject(
  id: string,
  patch: Partial<{
    craft: Craft;
    name: string;
    tags: string[];

    patternFile: FileRef | null;
    patternLink: string | null;

    yarnId: string | null;
    tools: string | null;
    skeins: number | null;

    startDate: Date | null;
    endDate: Date | null;
    targetMeasurement: string | null;

    photos: PhotoRef[];
  }>
) {
  const existing = getProject(id);
  if (!existing) return;

  const merged: Project = {
    ...existing,
    ...patch,
    tags: patch.tags ?? existing.tags,
    photos: patch.photos ?? existing.photos,
    patternFile: patch.patternFile ?? existing.patternFile ?? null,
    patternLink: patch.patternLink ?? existing.patternLink ?? null,
    yarnId: patch.yarnId ?? existing.yarnId ?? null,
    tools: patch.tools ?? existing.tools ?? null,
    skeins: patch.skeins ?? existing.skeins ?? null,
    startDate: patch.startDate
      ? patch.startDate.toISOString()
      : existing.startDate ?? null,
    endDate: patch.endDate
      ? patch.endDate.toISOString()
      : existing.endDate ?? null,
    targetMeasurement:
      patch.targetMeasurement ?? existing.targetMeasurement ?? null,
    updatedAt: now(),
  };

  db.runSync(
    `UPDATE projects SET
      craft = ?,
      name = ?,
      tags_json = ?,
      pattern_file_json = ?,
      pattern_link = ?,
      yarn_id = ?,
      tools = ?,
      skeins = ?,
      start_date = ?,
      end_date = ?,
      target_measurement = ?,
      photos_json = ?,
      updated_at = ?
     WHERE id = ?`,
    [
      merged.craft,
      merged.name,
      JSON.stringify(merged.tags ?? []),
      JSON.stringify(merged.patternFile ?? null),
      merged.patternLink ?? null,
      merged.yarnId ?? null,
      merged.tools ?? null,
      merged.skeins ?? null,
      merged.startDate ?? null,
      merged.endDate ?? null,
      merged.targetMeasurement ?? null,
      JSON.stringify(merged.photos ?? []),
      merged.updatedAt,
      id,
    ]
  );
}

export function deleteProject(id: string) {
  const t = now();
  db.runSync(
    `UPDATE projects SET deleted_at = ?, updated_at = ? WHERE id = ?`,
    [t, t, id]
  );
}

function mapProject(r: any): Project {
  return {
    id: r.id,
    craft: r.craft,

    name: r.name,
    tags: safeJson(r.tags_json, []),

    patternFile: safeJson(r.pattern_file_json ?? 'null', null),
    patternLink: r.pattern_link ?? null,

    yarnId: r.yarn_id ?? null,
    tools: r.tools ?? null,
    skeins: r.skeins ?? null,

    startDate: r.start_date ?? null,
    endDate: r.end_date ?? null,
    targetMeasurement: r.target_measurement ?? null,

    photos: safeJson(r.photos_json ?? '[]', []),

    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function safeJson<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

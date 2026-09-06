import { db } from './db';
import type { PhotoRef } from './projectsRepo';

const now = () => new Date().toISOString();

export type ProgressPic = {
  id: string;
  projectId: string;
  photo: PhotoRef;
  note: string | null;
  takenAt: string; // ISO
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type ProgressPicRow = {
  id: string;
  project_id: string;
  photo_json: string;
  note: string | null;
  taken_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function safeJson<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function mapRow(r: ProgressPicRow): ProgressPic {
  return {
    id: r.id,
    projectId: r.project_id,
    photo: safeJson<PhotoRef>(r.photo_json, { id: r.id, uri: '' }),
    note: r.note ?? null,
    takenAt: r.taken_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    deletedAt: r.deleted_at,
  };
}

export function listProgressPicsByProject(
  projectId: string,
  limit = 50
): ProgressPic[] {
  const rows = db.getAllSync<ProgressPicRow>(
    `SELECT * FROM project_progress_pics
     WHERE project_id = ? AND deleted_at IS NULL
     ORDER BY taken_at DESC
     LIMIT ?`,
    [projectId, limit]
  );
  return rows.map(mapRow);
}

export function addProgressPic(input: {
  id: string;
  projectId: string;
  photo: PhotoRef;
  note?: string | null;
  takenAt?: string; // default now
}) {
  const t = now();
  db.runSync(
    `INSERT INTO project_progress_pics (
      id, project_id, photo_json, note, taken_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.id,
      input.projectId,
      JSON.stringify(input.photo),
      input.note ?? null,
      input.takenAt ?? t,
      t,
      t,
    ]
  );
}

export function updateProgressPic(
  id: string,
  patch: Partial<{ note: string | null; takenAt: string }>
) {
  const t = now();
  // minimal patching; keep it simple
  if (patch.note === undefined && patch.takenAt === undefined) return;

  db.runSync(
    `UPDATE project_progress_pics SET
      note = COALESCE(?, note),
      taken_at = COALESCE(?, taken_at),
      updated_at = ?
     WHERE id = ?`,
    [patch.note ?? null, patch.takenAt ?? null, t, id]
  );
}

export function deleteProgressPic(id: string) {
  const t = now();
  db.runSync(
    `UPDATE project_progress_pics SET deleted_at = ?, updated_at = ? WHERE id = ?`,
    [t, t, id]
  );
}

import { db } from './db';

export type TaskRow = {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string | null; // "YYYY-MM-DD"
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
};

const now = () => new Date().toISOString();

export function createTask(p: {
  id: string;
  text: string;
  dueDate?: string | null;
  projectId?: string | null;
}) {
  const t = now();
  db.runSync(
    `INSERT INTO tasks (id, text, done, due_date, project_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [p.id, p.text, 0, p.dueDate ?? null, p.projectId ?? null, t, t]
  );
}

export function listTasks(): TaskRow[] {
  const rows = db.getAllSync<any>(
    `SELECT * FROM tasks WHERE deleted_at IS NULL ORDER BY updated_at DESC`
  );
  return rows.map(mapTask);
}

export function updateTask(
  id: string,
  patch: Partial<{
    text: string;
    done: boolean;
    dueDate: string | null;
    projectId: string | null;
  }>
) {
  const existing = db.getFirstSync<any>(
    `SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );
  if (!existing) return;

  const merged = {
    ...existing,
    text: patch.text ?? existing.text,
    done:
      typeof patch.done === 'boolean' ? (patch.done ? 1 : 0) : existing.done,
    due_date: patch.dueDate ?? existing.due_date,
    project_id: patch.projectId ?? existing.project_id,
    updated_at: now(),
  };

  db.runSync(
    `UPDATE tasks SET text = ?, done = ?, due_date = ?, project_id = ?, updated_at = ? WHERE id = ?`,
    [
      merged.text,
      merged.done,
      merged.due_date,
      merged.project_id,
      merged.updated_at,
      id,
    ]
  );
}

export function deleteTask(id: string) {
  const t = now();
  db.runSync(`UPDATE tasks SET deleted_at = ?, updated_at = ? WHERE id = ?`, [
    t,
    t,
    id,
  ]);
}

function mapTask(r: any): TaskRow {
  return {
    id: r.id,
    text: r.text,
    done: !!r.done,
    dueDate: r.due_date ?? null,
    projectId: r.project_id ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

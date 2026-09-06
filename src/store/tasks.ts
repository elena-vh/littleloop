import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
} from '@src/db/tasksRepo';

export type Task = {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string | null;
  projectId?: string | null;
};

type TasksState = {
  tasks: Task[];
  load: () => void;

  add: (
    text: string,
    dueDate?: string | null,
    projectId?: string | null
  ) => void;
  update: (id: string, patch: Partial<Omit<Task, 'id'>>) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};
export type TaskRow = {
  id: string;
  text: string;
  done: boolean; // DB stores 0/1, repo converts to boolean
  dueDate?: string | null; // "YYYY-MM-DD" or null
  projectId?: string | null; // links to a project or null
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

export const useTasks = create<TasksState>((set, get) => ({
  tasks: [],

  load: () => {
    const rows = listTasks(); // from SQLite
    // TaskRow already matches Task shape if you designed it that way
    set({ tasks: rows.map(mapRowToTask) });
  },

  add: (text, dueDate = null, projectId = null) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    createTask({
      id: Crypto.randomUUID(),
      text: trimmed,
      dueDate,
      projectId,
    });

    get().load();
  },

  update: (id, patch) => {
    updateTask(id, {
      text: patch.text,
      done: patch.done,
      dueDate: patch.dueDate ?? null,
      projectId: patch.projectId ?? null,
    });

    get().load();
  },

  toggle: (id) => {
    const t = get().tasks.find((x) => x.id === id);
    if (!t) return;

    updateTask(id, { done: !t.done });
    get().load();
  },

  remove: (id) => {
    deleteTask(id);
    get().load();
  },
}));

function mapRowToTask(r: TaskRow): Task {
  return {
    id: r.id,
    text: r.text,
    done: r.done,
    dueDate: r.dueDate ?? null,
    projectId: r.projectId ?? null,
  };
}

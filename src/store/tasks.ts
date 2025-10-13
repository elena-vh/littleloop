import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string; // "YYYY-MM-DD" optional
  projectId?: string; // link to a project if needed
  createdAt: number;
};

type State = {
  tasks: Task[];
  add: (text: string, dueDate?: string, projectId?: string) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clearDone: () => void;
};

export const useTasks = create<State>()(
  persist(
    (set, get) => ({
      tasks: [],
      add: (text, dueDate, projectId) =>
        set({
          tasks: [
            ...get().tasks,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              text: text.trim(),
              done: false,
              dueDate,
              projectId,
              createdAt: Date.now(),
            },
          ],
        }),
      toggle: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t
          ),
        }),
      remove: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),
      clearDone: () => set({ tasks: get().tasks.filter((t) => !t.done) }),
    }),
    {
      name: 'littleloop:tasks', // storage key
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

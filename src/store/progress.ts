import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Shared source of truth for row counters. The round-counter screen writes here;
// the project-detail slider and the Home ring read from here — one value, never
// duplicated. Repeat position / percent / ring offset are derived, never stored.

export type Counter = { current: number; total: number };

// The counter that represents overall project progress (drives % everywhere).
export const PRIMARY_COUNTER = 'body';

type CounterMap = Record<string, Record<string, Counter>>;

type ProgressState = {
  counters: CounterMap;
  getCounter: (projectId: string, name: string) => Counter;
  setCounter: (projectId: string, name: string, next: Partial<Counter>) => void;
  bump: (projectId: string, name: string, delta: number) => void;
  reset: (projectId: string, name: string) => void;
};

const DEFAULT: Counter = { current: 0, total: 0 };
const clamp = (n: number, total: number) =>
  Math.max(0, total > 0 ? Math.min(total, n) : Math.max(0, n));

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      counters: {},

      getCounter: (projectId, name) =>
        get().counters[projectId]?.[name] ?? DEFAULT,

      setCounter: (projectId, name, next) =>
        set((s) => {
          const prev = s.counters[projectId]?.[name] ?? DEFAULT;
          const total = next.total ?? prev.total;
          const current = clamp(next.current ?? prev.current, total);
          return {
            counters: {
              ...s.counters,
              [projectId]: {
                ...s.counters[projectId],
                [name]: { current, total },
              },
            },
          };
        }),

      bump: (projectId, name, delta) => {
        const prev = get().getCounter(projectId, name);
        get().setCounter(projectId, name, { current: prev.current + delta });
      },

      reset: (projectId, name) =>
        get().setCounter(projectId, name, { current: 0 }),
    }),
    {
      name: 'littleloop:progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/** Overall project completion, 0..1, from the primary counter. */
export function projectPercent(
  counters: CounterMap,
  projectId: string
): number {
  const c = counters[projectId]?.[PRIMARY_COUNTER];
  if (!c || c.total <= 0) return 0;
  return Math.max(0, Math.min(1, c.current / c.total));
}

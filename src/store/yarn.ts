import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { color } from '@src/theme/theme';

export type Yarn = {
  id: string;
  brand: string;
  colorway: string;
  swatch: string; // hex
  weight: string; // "aran", "DK", ...
  skeins: number;
  dyeLot?: string;
  boughtAt?: string; // free label, e.g. "Mar 2026"
  fiber?: string;
  yardage?: string;
  needle?: string;
};

export const LOW_STOCK = 2;
export const isLow = (y: Yarn) => y.skeins <= LOW_STOCK;

type YarnState = {
  yarns: Yarn[];
  get: (id: string) => Yarn | undefined;
  add: (y: Omit<Yarn, 'id'>) => string;
  update: (id: string, patch: Partial<Yarn>) => void;
  remove: (id: string) => void;
  adjustSkeins: (id: string, delta: number) => void;
};

// Invented starter stash (matches the design prototype) — seeded once.
const SEED: Yarn[] = [
  {
    id: 'seed-pin',
    brand: 'Schachenmayr Pin',
    colorway: 'Bark',
    swatch: color.neutral[800],
    weight: 'aran',
    skeins: 4,
    dyeLot: '4412',
    boughtAt: 'Mar 2026',
    fiber: '80% wool 20% nylon',
    yardage: '180 m / 50 g',
    needle: '4 – 5 mm',
  },
  {
    id: 'seed-nord',
    brand: 'Drops Nord',
    colorway: 'Oat',
    swatch: color.neutral[300],
    weight: 'fingering',
    skeins: 6,
  },
  {
    id: 'seed-merino',
    brand: 'Wool & Co Merino',
    colorway: 'Rust',
    swatch: color.acc[600],
    weight: 'DK',
    skeins: 2,
  },
  {
    id: 'seed-cotton',
    brand: 'Cotton Fields',
    colorway: 'Sage',
    swatch: color.acc2[500],
    weight: 'sport',
    skeins: 3,
  },
  {
    id: 'seed-rios',
    brand: 'Malabrigo Rios',
    colorway: 'Moss',
    swatch: color.acc2[800],
    weight: 'worsted',
    skeins: 3,
  },
];

export const useYarn = create<YarnState>()(
  persist(
    (set, get) => ({
      yarns: SEED,

      get: (id) => get().yarns.find((y) => y.id === id),

      add: (y) => {
        const id = Crypto.randomUUID();
        set((s) => ({ yarns: [{ ...y, id }, ...s.yarns] }));
        return id;
      },

      update: (id, patch) =>
        set((s) => ({
          yarns: s.yarns.map((y) => (y.id === id ? { ...y, ...patch } : y)),
        })),

      remove: (id) =>
        set((s) => ({ yarns: s.yarns.filter((y) => y.id !== id) })),

      adjustSkeins: (id, delta) =>
        set((s) => ({
          yarns: s.yarns.map((y) =>
            y.id === id
              ? { ...y, skeins: Math.max(0, y.skeins + delta) }
              : y
          ),
        })),
    }),
    {
      name: 'littleloop:yarn',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

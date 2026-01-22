// src/store/projectDraft.ts
import { create } from 'zustand';

export type Craft = 'crochet' | 'knitting';

export type ProjectDraft = {
  craft?: Craft;
  name: string;
  tags: string[];
  patternLink: string;

  // step 2
  yarnId?: string;
  tools: string;
  skeins?: number;

  // step 3
  startDate?: string; // ISO date
  targetEndDate?: string; // ISO date
  targetMeasurement: string;
};

const emptyDraft: ProjectDraft = {
  name: '',
  tags: [],
  patternLink: '',
  tools: '',
  targetMeasurement: '',
};

type DraftStore = {
  draft: ProjectDraft;
  setBasics: (p: Partial<ProjectDraft>) => void;
  setMaterials: (p: Partial<ProjectDraft>) => void;
  setPlan: (p: Partial<ProjectDraft>) => void;
  reset: () => void;
};

export const useProjectDraft = create<DraftStore>((set) => ({
  draft: emptyDraft,

  setBasics: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
  setMaterials: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
  setPlan: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),

  reset: () => set({ draft: emptyDraft }),
}));

import { create } from 'zustand';

type PrefsState = {
  showLogTime: boolean;
  setShowLogTime: (v: boolean) => void;
};

const usePrefs = create<PrefsState>((set) => ({
  showLogTime: true, // default can be set by onboarding later
  setShowLogTime: (v) => set({ showLogTime: v }),
}));

export default usePrefs;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Prefs = {
  name: string;
  showLogTime: boolean;
  setName: (v: string) => void;
  setShowLogTime: (v: boolean) => void;
};

export const usePrefs = create<Prefs>()(
  persist(
    (set) => ({
      name: 'Elena',
      showLogTime: true,
      setName: (v) => set({ name: v }),
      setShowLogTime: (v) => set({ showLogTime: v }),
    }),
    { name: 'littleloop:prefs', storage: createJSONStorage(() => AsyncStorage) }
  )
);

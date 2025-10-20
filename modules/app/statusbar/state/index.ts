import { create } from "zustand";

export type ToggleStoreState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};


const createToggleStore = () =>
  create<ToggleStoreState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  }));

export const useActivityCenterStore = createToggleStore();
export const useMobileNavStore = createToggleStore();

import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;
  allowLoading: () => void;
  disableLoading: () => void;
}

const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  allowLoading: () => set({ isLoading: true }),
  disableLoading: () => set({ isLoading: false }),
}));

export default useLoadingStore;

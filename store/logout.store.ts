import { create } from "zustand";

type LogoutState = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useLogoutStore = create<LogoutState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
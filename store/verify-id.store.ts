import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string;
  setUserId: (id: string) => void;
  clearUserId: () => void;
}

export const useUserIdStore = create<UserState>()(
  persist(
    (set) => ({
      userId: "",
      setUserId: (id) => set({ userId: id }),
      clearUserId: () => set({ userId: "" }),
    }),
    {
      name: "xbanka-user", // localStorage key
    }
  )
);
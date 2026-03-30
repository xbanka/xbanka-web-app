import { UserProfileTypes } from "@/lib/types/profile-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  user: UserProfileTypes | null;

  setUser: (user: UserProfileTypes) => void;
  updateUser: (data: Partial<UserProfileTypes>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set({
          user,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      clearUser: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "xbanka-user", // localStorage key
    }
  )
);
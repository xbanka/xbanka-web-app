import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  country: string;
};

type UserStore = {
  user: User | null;

  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
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
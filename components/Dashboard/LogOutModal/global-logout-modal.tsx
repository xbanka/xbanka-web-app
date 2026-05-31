// components/GlobalLogout.tsx
"use client";

import { useLogoutStore } from "@/store/logout.store";
import { Logout } from "./log-out-modal";

export const GlobalLogout = () => {
  const { open, closeModal } = useLogoutStore();

  if (!open) return null;

  return <Logout onClose={closeModal} />;
};

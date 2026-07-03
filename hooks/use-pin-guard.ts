"use client";

import { UseProfileUser } from "@/lib/services/profile.service";

export const usePinGuard = () => {
  const { data } = UseProfileUser();

  const profile = data?.data;

  const canCreatePin = profile?.isEmailVerified;

  return {
    canCreatePin,
    profile,
  };
};
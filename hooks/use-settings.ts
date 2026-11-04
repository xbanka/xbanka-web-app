"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/settings.store";

/** Restores the saved Settings after mount, then returns them. */
export const useSettings = () => {
  const settings = useSettingsStore();
  useEffect(() => {
    void useSettingsStore.persist.rehydrate();
  }, []);
  return settings;
};

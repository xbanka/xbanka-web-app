"use client";

import { useEffect, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { step3FormValues } from "@/lib/schema/onboarding-schema";

/**
 * At the ID step, a NIN that is already saved on the profile is reused instead
 * of being asked for again. The user can still choose to enter a different one.
 * Keeps the form's `useSavedNin` flag in step so validation knows whether the
 * number field is needed.
 */
export function useSavedNinChoice(
  idType: string | undefined,
  hasNin: boolean,
  setValue: UseFormSetValue<step3FormValues>,
) {
  const [changing, setChanging] = useState(false);
  const usingSavedNin = hasNin && idType === "nin" && !changing;

  useEffect(() => {
    setValue("useSavedNin", usingSavedNin, { shouldValidate: true });
  }, [usingSavedNin, setValue]);

  return { usingSavedNin, changeNin: () => setChanging(true) };
}

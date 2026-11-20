"use client";

import { useEffect, useState } from "react";

/** The current time, re-read every `intervalMs`, for "waiting 18 minutes"
 *  style copy and the approval-hours notices. */
export const useNow = (intervalMs = 30_000) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
};

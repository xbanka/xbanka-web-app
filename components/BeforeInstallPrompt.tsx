"use client";

import { useEffect } from "react";

export default function InstallDebugger() {
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("INSTALL AVAILABLE", e);
    });
  }, []);

  return null;
}
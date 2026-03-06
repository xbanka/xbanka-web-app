"use client";

import { ThemeInitializer } from "@/components/Theme/ThemeInitializer";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeInitializer />
      {children}
    </>
  );
}
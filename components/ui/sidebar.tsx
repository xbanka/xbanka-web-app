"use client";

import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  open: boolean;
}

export function SidebarWrapper({
  onClose,
  children,
  className,
  open,
}: SidebarProps) {
  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // <div
    //   onClick={handleBackdropClick}
    //   className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
    // >
    //   <div
    //     onClick={(e) => e.stopPropagation()}
    //     className={cn(
    //       "absolute right-0 top-0 h-full w-full max-w-[520px] bg-card-background border-l border-border shadow-2xl overflow-y-auto",
    //       "animate-in slide-in-from-right duration-300",
    //       className,
    //     )}
    //   >
    //     {children}
    //   </div>
    // </div>
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-full md:max-w-150 bg-card-background border-8 border-border rounded-bl-[20px] rounded-tl-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-sm:border-0 max-sm:rounded-none max-sm:px-0 max-sm:pb-0 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
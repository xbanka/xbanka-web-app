import { cn } from "@/lib/utils";
import { MouseEvent } from "react";

export function Modal({
  onClose,
  children,
  className,
}: {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // useEffect(() => {
  //   const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
  //   document.addEventListener("keydown", h);
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.removeEventListener("keydown", h);
  //     document.body.style.overflow = "";
  //   };
  // }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-150 "
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative z-10 w-full max-w-150 bg-card-background px-10 pb-10 border-8 border-border rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 ",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

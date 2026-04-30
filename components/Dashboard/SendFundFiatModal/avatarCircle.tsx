import { cn } from "@/lib/utils";

export function AvatarCircle({
  name,
  color = "bg-orange-500",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" };
  return (
    <div className={cn("rounded-full flex items-center justify-center text-white font-semibold shrink-0", color, sizes[size])}>
      {initials}
    </div>
  );
}
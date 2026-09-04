import { LucideIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * Full-page branded loader for routes that resolve into a redirect or a status
 * card rather than a laid-out page — the auth and payment callbacks. Styled to
 * match the modal panel those pages settle into, so the swap isn't jarring.
 */
export function PageLoader({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-dvh items-center justify-center p-4",
        className,
      )}
    >
      <div className="w-full max-w-150 rounded-[20px] border-8 border-border bg-card-background px-10 py-12 text-center shadow-2xl max-sm:rounded-2xl max-sm:border-4 max-sm:px-6 max-sm:py-10">
        <div className="mb-6 flex items-center justify-center">
          <Spinner icon={icon} size={52} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-xl">
            {title}
          </h3>
          {description && (
            <p className="text-base font-normal leading-6 text-text max-sm:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { IdCard } from "lucide-react";

/** Shown instead of the ID number box when the user's NIN is already saved. */
export function SavedNinNotice({
  ninMasked,
  onChange,
}: {
  ninMasked?: string | null;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <IdCard className="h-4 w-4 shrink-0 text-placeholder" />
        <div className="min-w-0">
          <p className="text-xs text-text">Using your saved NIN</p>
          <p className="truncate text-sm font-semibold text-card-text">
            {ninMasked || "NIN saved"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="shrink-0 text-sm font-medium text-Green"
      >
        Use a different NIN
      </button>
    </div>
  );
}

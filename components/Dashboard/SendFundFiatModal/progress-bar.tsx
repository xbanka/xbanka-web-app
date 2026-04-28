export function ProgressBar({
  step,
  stepMap,
  totalSteps,
  labels,
}: {
  step: string;
  stepMap: Record<string, number>;
  totalSteps: number;
  labels: Record<string, string>;
}) {
  const current = stepMap[step] ?? 0;
  if (!current) return null;

  return (
    <div className="space-y-1.5 pt-3 pb-1">
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-Green rounded-full transition-all duration-400"
          style={{ width: `${(current / totalSteps) * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-text">
        <span>{labels[step]}</span>
        <span>
          {current} of {totalSteps}
        </span>
      </div>
    </div>
  );
}
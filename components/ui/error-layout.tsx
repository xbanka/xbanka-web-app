import { AlertTriangle } from "lucide-react";

export const ErrorLayout = ({ message }: { message?: string }) =>
  message ? (
    <div className="w-full text-sm text-error-text flex items-center gap-4 py-3 px-4 rounded-lg border border-error-border-button bg-error-bg-layout">
      <AlertTriangle className="w-4 h-4 text-error-text" />
      {message}
    </div>
  ) : null;

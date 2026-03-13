import { Settings } from "lucide-react";

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-text">
      <div className="w-12 h-12 rounded-full bg-Green/10 flex items-center justify-center">
        <Settings className="w-6 h-6 text-Green" />
      </div>
      <p className="text-sm font-medium text-card-text">{label}</p>
      <p className="text-xs">This page is coming soon</p>
    </div>
  );
}
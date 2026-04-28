import { Button } from "@/components/ui/button";
import { Building2, Search } from "lucide-react";
import { RECENT_RECIPIENTS } from "./mockData";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Recipient, Tab } from "./types";
import { AvatarCircle } from "./avatarCircle";

export function SelectRecipientStep({
  onSelectXbanka,
  onSelectBank,
}: {
  onSelectXbanka: (r: Recipient) => void;
  onSelectBank: () => void;
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="px-8 pb-8 pt-4 space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
          <Input
            placeholder="Search by name or UID"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs text-text font-medium mb-2">
            Recent Recipients
          </p>
          <div>
            {RECENT_RECIPIENTS.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectXbanka(r)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <AvatarCircle name={r.name} color={r.color} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-card-text">{r.name}</p>
                    <p className="text-xs text-text">{r.uid}</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-text group-hover:border-Green group-hover:text-Green transition-colors">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M4.5 2.5L8 6L4.5 9.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" disabled>
          Back
        </Button>
        <Button className="flex-1" onClick={onSelectBank}>
          Continue
        </Button>
      </div>
    </div>
  );
}

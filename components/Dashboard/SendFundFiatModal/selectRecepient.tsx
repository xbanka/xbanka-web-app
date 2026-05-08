import { Button } from "@/components/ui/button";
import { Building2, Search } from "lucide-react";
import { RECENT_RECIPIENTS } from "./mockData";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { XbankaTransferRecipient, XbankaUser } from "./types";
import { UseGetActiveXbankaUsers } from "@/lib/services/send-fiat.service";
import { AvatarCircle } from "./avatarCircle";

export function SelectRecipientStep({
  onSelectXbanka,
  onSelectBank,
}: {
  onSelectXbanka: (r: XbankaTransferRecipient) => void;
  onSelectBank: () => void;
}) {
  const { data, isPending } = UseGetActiveXbankaUsers();

  const users = data?.data || [];
  console.log("Active Xbanka Users:", users);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user: XbankaUser) => {
    const value = search.toLowerCase();

    return (
      user.id?.toLowerCase().includes(value) ||
      user.profile?.firstName?.toLowerCase().includes(value) ||
      user.profile?.lastName?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value)
    );
  });
  console.log("Filtered Users:", filteredUsers);

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
        <div className="space-y-2">
          {search &&
            filteredUsers.map((user: XbankaUser) => (
              <button
                key={user.id}
                onClick={() =>
                  onSelectXbanka({
                    id: user.id,
                    name: `${user.profile?.firstName} ${user.profile?.lastName}`,
                    uid: user.id,
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {/* <AvatarCircle name={user.name} color="bg-Green" /> */}

                  <div className="text-left">
                    <p className="text-sm font-medium text-card-text">
                      {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.id}
                    </p>

                    <p className="text-xs text-text">{user.id}</p>
                  </div>
                </div>
              </button>
            ))}
        </div>
        <div className="space-y-4">
          <p className="text-xs text-text font-medium mb-2">
            Recent Recipients
          </p>
          <div>
            {/* {RECENT_RECIPIENTS.map((r) => (
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
            ))} */}
            No recent recipients
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-2">
        <Button variant="outline" className="flex-1" disabled>
          Back
        </Button>
        <Button className="flex-3" onClick={onSelectBank}>
          Continue
        </Button>
      </div>
    </div>
  );
}

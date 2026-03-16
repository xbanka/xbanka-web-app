"use client"

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, HelpCircle, Plus } from "lucide-react";
import { useState } from "react";

export function AssetValueCard() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="rounded-xl border border-[#0F766E] bg-[#042F2E] p-5 text-white">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-text text-sm">
            <span className="leading-6">Total Asset Value</span>
            <button onClick={() => setHidden(h => !h)} className="opacity-70 hover:opacity-100 transition-opacity">
              {hidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl text-card-text font-bold leading-11">
              {hidden ? "₦•••••" : "₦0.00"}
            </span>
            <span className="text-sm opacity-70 flex items-center gap-1">
              NGN
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L2 4h8z"/></svg>
            </span>
          </div>
          <p className="text-text text-xs font-normal leading-4.5">≈ $0.00 USD</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size={"sm"}>
            <Plus className="w-4 h-4" />
            Add funds
          </Button>
          <Button variant={"outline"} size={"sm"} className="border border-input">
            <HelpCircle className="w-4 h-4" />
            How it works
          </Button>
        </div>
      </div>
    </div>
  );
}
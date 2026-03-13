"use client"

import { Eye, EyeOff, HelpCircle, Plus } from "lucide-react";
import { useState } from "react";

export function AssetValueCard() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0C9A8E] via-[#0a8078] to-[#065f59] p-5 sm:p-6 text-white">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <span>Total Asset Value</span>
            <button onClick={() => setHidden(h => !h)} className="opacity-70 hover:opacity-100 transition-opacity">
              {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold">
              {hidden ? "₦•••••" : "₦0.00"}
            </span>
            <span className="text-sm opacity-70 flex items-center gap-1">
              NGN
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L2 4h8z"/></svg>
            </span>
          </div>
          <p className="text-white/50 text-xs mt-1">≈ $0.00 USD</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" />
            Add funds
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg">
            <HelpCircle className="w-4 h-4" />
            How it works
          </button>
        </div>
      </div>
    </div>
  );
}
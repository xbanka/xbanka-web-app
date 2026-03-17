import React, { useState } from "react";
import { Download, Eye, EyeOff, RefreshCcw, Send } from "lucide-react";

export const CryptoBalance = () => {
  const [hidden, setHidden] = useState(false);
  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-[#0C9A8E] via-[#0a8078] to-[#065f59] p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
              <span>Total Crypto Value</span>
              <button
                onClick={() => setHidden((h) => !h)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {hidden ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-bold">
                {hidden ? "₦•••••••" : "₦2,000,000.45"}
              </p>
              <span className="text-white/60 text-xs">≈ $1,103 USDT</span>
            </div>
            <p className="text-white/50 text-xs mt-1">+₦240,000 (0.85) today</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" />
              Deposit
            </button>
            <button className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
            <button className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <RefreshCcw className="w-3.5 h-3.5" />
              Convert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

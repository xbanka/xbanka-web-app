"use client"

import { ChevronDown, Info, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

function SellTab() {
  const [category, setCategory] = useState<"ecode" | "physical">("ecode");
  const [cardValue, setCardValue] = useState("100.00");
  const [agreed, setAgreed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
 
  const exchangeRate = 850;
  const serviceRate = 0.02;
  const faceValue = parseFloat(cardValue) || 0;
  const nairaValue = faceValue * exchangeRate;
  const serviceFee = nairaValue * serviceRate;
  const youReceive = nairaValue - serviceFee;
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Form */}
      <div className="lg:col-span-2 bg-card-background border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-card-text text-base">Sell Gift Card</h3>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">Select card type</label>
            <div className="relative">
              <select className="w-full h-10 pl-3 pr-8 text-sm border border-input rounded-lg bg-transparent text-card-text appearance-none outline-none focus:border-border-active transition-colors">
                <option>Amazon Gift Card</option>
                <option>Apple Gift Card</option>
                <option>Google Play</option>
                <option>Netflix</option>
                <option>Spotify</option>
                <option>Xbox</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder pointer-events-none" />
            </div>
          </div>
          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">Region</label>
            <div className="relative">
              <select className="w-full h-10 pl-3 pr-8 text-sm border border-input rounded-lg bg-transparent text-card-text appearance-none outline-none focus:border-border-active transition-colors">
                <option value="">Select Card region</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder pointer-events-none" />
            </div>
          </div>
        </div>
 
        {/* Card category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-card-text">Card Category (Select any below)</label>
          <div className="flex gap-2">
            {(["ecode", "physical"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors
                  ${category === c
                    ? "border-Green bg-Green/10 text-Green font-medium"
                    : "border-border text-text hover:border-border-active"
                  }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${category === c ? "border-Green" : "border-text"}`}>
                  {category === c && <span className="w-2 h-2 rounded-full bg-Green" />}
                </span>
                {c === "ecode" ? "E-Code" : "Physical Card"}
              </button>
            ))}
          </div>
        </div>
 
        {/* Card face value */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-card-text">Card Face Value (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-placeholder text-sm">$</span>
            <input
              type="number"
              value={cardValue}
              onChange={(e) => setCardValue(e.target.value)}
              className="w-full h-10 pl-8 pr-4 text-sm border border-input rounded-lg bg-transparent text-card-text outline-none focus:border-border-active [&:not(:placeholder-shown)]:border-border-active transition-colors"
            />
          </div>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Enter card manually */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">Enter Card manually</label>
            <textarea
              placeholder="Enter gift card code here..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-transparent text-card-text placeholder:text-placeholder outline-none focus:border-border-active resize-none transition-colors"
            />
          </div>
 
          {/* Upload card image */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-card-text">Upload Card Image</label>
            {file ? (
              <div className="flex items-center gap-2 border border-border rounded-lg p-3">
                <div className="w-8 h-8 rounded bg-Green/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-Green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-card-text truncate">{file.name}</p>
                  <p className="text-[10px] text-text">{(file.size / (1024 * 1024)).toFixed(1)}MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-text hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-1.5 cursor-pointer hover:border-border-active transition-colors h-[88px] justify-center"
              >
                <Upload className="w-5 h-5 text-Green" />
                <p className="text-xs text-card-text font-medium text-center">Upload screenshot, receipt, or proof document</p>
                <p className="text-[10px] text-text">JPG, PNG OR PDF • Max 5MB</p>
                <input ref={fileRef} type="file" hidden accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
            )}
          </div>
        </div>
 
        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-Green shrink-0"
          />
          <p className="text-xs text-text leading-relaxed">
            I confirm that I have read and agreed to the <span className="text-Green cursor-pointer hover:underline">Terms & Conditions</span> and understand that gift card must be valid and unused and that rates are subjected to fluctuations, also Xbanka reserves the right to verify all submissions.
          </p>
        </label>
 
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-text">Typical processing time: 10 - 15 minutes</p>
          <button
            disabled={!agreed}
            className="bg-Green hover:bg-Green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Sell Gift Card
          </button>
        </div>
      </div>
 
      {/* Payout summary */}
      <div className="bg-card-background border border-border rounded-2xl p-5 space-y-4 h-fit">
        <h3 className="font-semibold text-card-text text-sm">Payout Summary</h3>
 
        {/* Estimated payout */}
        <div className="rounded-xl bg-Green/10 border border-Green/20 p-4">
          <p className="text-xs text-text mb-1">Estimated Payout</p>
          <p className="text-xs text-text mb-2">Enter card details to calculate</p>
          <p className="text-2xl font-bold text-Green">
            ₦{faceValue ? youReceive.toLocaleString("en-NG", { maximumFractionDigits: 2 }) : "0.00"}
          </p>
        </div>
 
        {/* Breakdown */}
        <div className="space-y-2.5">
          {[
            { label: "Card Value", value: `$${faceValue.toFixed(2)}` },
            {
              label: "Exchange Rate",
              value: `₦${exchangeRate}/$$`,
              icon: <Info className="w-3 h-3" />,
            },
            {
              label: "Service Fee",
              value: `₦${serviceFee.toLocaleString()}`,
              icon: <Info className="w-3 h-3" />,
            },
            {
              label: "You'll Receive",
              value: `₦${faceValue ? youReceive.toLocaleString("en-NG", { maximumFractionDigits: 2 }) : "0.00"}`,
              bold: true,
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-text">
                {row.label}
                {row.icon && <span className="text-placeholder">{row.icon}</span>}
              </div>
              <span className={`${row.bold ? "font-bold text-card-text" : "text-card-text"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}